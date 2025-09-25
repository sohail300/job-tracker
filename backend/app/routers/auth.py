from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.responses import RedirectResponse
from typing import Optional
import httpx
from bson import ObjectId
from datetime import timedelta

from ..database import get_database
from ..models import User, UserCreate
from ..auth import (
    create_access_token, 
    get_github_auth_url, 
    get_current_user,
    GITHUB_CLIENT_ID, 
    GITHUB_CLIENT_SECRET,
    GITHUB_REDIRECT_URI,
    ACCESS_TOKEN_EXPIRE_MINUTES
)
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.get("/github")
async def github_login():
    """Initiate GitHub OAuth login"""
    auth_url = get_github_auth_url()
    return {"auth_url": auth_url}

@router.get("/github/callback")
async def github_callback(
    code: str,
    state: Optional[str] = None,
    db=Depends(get_database)
):
    """Handle GitHub OAuth callback"""
    try:
        # Exchange code for access token
        async with httpx.AsyncClient() as client:
            token_response = await client.post(
                "https://github.com/login/oauth/access_token",
                data={
                    "client_id": GITHUB_CLIENT_ID,
                    "client_secret": GITHUB_CLIENT_SECRET,
                    "code": code,
                    "redirect_uri": GITHUB_REDIRECT_URI,
                },
                headers={"Accept": "application/json"}
            )
            
            if token_response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Failed to exchange code for token"
                )
            
            token_data = token_response.json()
            access_token = token_data.get("access_token")
            
            if not access_token:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="No access token received"
                )
            
            # Get user info from GitHub
            user_response = await client.get(
                "https://api.github.com/user",
                headers={"Authorization": f"Bearer {access_token}"}
            )
            
            if user_response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Failed to get user info from GitHub"
                )
            
            github_user = user_response.json()
            
            # Get user email (might be private)
            email = github_user.get("email")
            if not email:
                # Try to get email from GitHub API
                email_response = await client.get(
                    "https://api.github.com/user/emails",
                    headers={"Authorization": f"Bearer {access_token}"}
                )
                if email_response.status_code == 200:
                    emails = email_response.json()
                    primary_email = next((e for e in emails if e.get("primary")), None)
                    if primary_email:
                        email = primary_email.get("email")
            
            # Create or update user
            user_data = {
                "github_id": github_user["id"],
                "username": github_user["login"],
                "email": email,
                "avatar_url": github_user.get("avatar_url"),
                "name": github_user.get("name"),
            }
            
            # Check if user exists
            existing_user = await db.users.find_one({"github_id": github_user["id"]})
            
            if existing_user:
                # Update existing user
                await db.users.update_one(
                    {"github_id": github_user["id"]},
                    {"$set": {**user_data, "updated_at": user_data.get("updated_at")}}
                )
                user_id = existing_user["_id"]
            else:
                # Create new user
                user_create = UserCreate(**user_data)
                result = await db.users.insert_one(user_create.model_dump())
                user_id = result.inserted_id
            
            # Create JWT token
            access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            jwt_token = create_access_token(
                data={"sub": str(user_id)}, expires_delta=access_token_expires
            )
            
            # Redirect to frontend with token
            frontend_url = os.getenv("FRONTEND_URL")
            return RedirectResponse(
                url=f"{frontend_url}/auth/success?token={jwt_token}",
                status_code=status.HTTP_302_FOUND
            )
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Authentication failed: {str(e)}"
        )

@router.get("/me")
async def get_current_user_info(
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """Get current user information"""
    try:
        user_id = ObjectId(current_user["user_id"])
        user = await db.users.find_one({"_id": user_id})

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        # Serialize ObjectId to string for client compatibility
        user_response = {**user, "_id": str(user["_id"]) }
        return user_response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get user info: {str(e)}"
        )

@router.post("/logout")
async def logout():
    """Logout user (client-side token removal)"""
    return {"message": "Logged out successfully"}

