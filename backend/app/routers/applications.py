from fastapi import APIRouter, HTTPException, UploadFile, File, Depends, Form
from typing import List, Optional
from bson import ObjectId
from datetime import datetime

from ..database import get_database
from ..models import JobApplication, JobApplicationCreate, JobApplicationUpdate
from ..cloudinary_config import upload_image, delete_image
from ..auth import get_current_user

router = APIRouter(prefix="/applications", tags=["applications"])

def serialize_application_document(document: dict) -> dict:
    """Convert MongoDB document fields to JSON-serializable types."""
    if not document:
        return document
    serialized = {**document}
    if "_id" in serialized:
        serialized["_id"] = str(serialized["_id"])
    if "user_id" in serialized and isinstance(serialized["user_id"], ObjectId):
        serialized["user_id"] = str(serialized["user_id"])
    return serialized

@router.post("/")
async def create_application(
    company_name: str = Form(...),
    email_or_portal: Optional[str] = Form(None),
    link: Optional[str] = Form(None),
    link_type: Optional[str] = Form(None),
    date_of_applying: str = Form(...),
    notes: Optional[str] = Form(None),
    photo: Optional[UploadFile] = File(None),
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """Create a new job application"""
    try:
        # Parse date
        date_obj = datetime.fromisoformat(date_of_applying.replace('Z', '+00:00'))
        
        # Handle file upload to Cloudinary
        photo_public_id = None
        photo_url = None
        if photo and photo.filename:
            # Upload to Cloudinary
            upload_result = upload_image(photo.file)
            photo_public_id = upload_result["public_id"]
            photo_url = upload_result["secure_url"]
        
        # Create application data
        application_data = {
            "user_id": ObjectId(current_user["user_id"]),
            "company_name": company_name,
            "email_or_portal": email_or_portal,
            "link": link,
            "link_type": link_type,
            "date_of_applying": date_obj,
            "photo_public_id": photo_public_id,
            "photo_url": photo_url,
            "notes": notes
        }
        
        # Insert into database
        result = await db.applications.insert_one(application_data)
        application_data["_id"] = result.inserted_id
        
        return serialize_application_document(application_data)
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/")
async def get_applications(
    skip: int = 0,
    limit: int = 100,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """Get all job applications for the current user"""
    try:
        user_id = ObjectId(current_user["user_id"])
        cursor = db.applications.find({"user_id": user_id}).skip(skip).limit(limit).sort("date_of_applying", -1)
        applications: List[dict] = []
        async for doc in cursor:
            applications.append(serialize_application_document(doc))
        return applications
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{application_id}")
async def get_application(
    application_id: str,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """Get a single job application by ID"""
    try:
        if not ObjectId.is_valid(application_id):
            raise HTTPException(status_code=400, detail="Invalid application ID")
        
        user_id = ObjectId(current_user["user_id"])
        application = await db.applications.find_one({
            "_id": ObjectId(application_id),
            "user_id": user_id
        })
        if not application:
            raise HTTPException(status_code=404, detail="Application not found")
        
        return serialize_application_document(application)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{application_id}")
async def update_application(
    application_id: str,
    company_name: Optional[str] = Form(None),
    email_or_portal: Optional[str] = Form(None),
    link: Optional[str] = Form(None),
    link_type: Optional[str] = Form(None),
    date_of_applying: Optional[str] = Form(None),
    notes: Optional[str] = Form(None),
    photo: Optional[UploadFile] = File(None),
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """Update a job application"""
    try:
        if not ObjectId.is_valid(application_id):
            raise HTTPException(status_code=400, detail="Invalid application ID")
        
        # Check if application exists and belongs to user
        user_id = ObjectId(current_user["user_id"])
        existing_app = await db.applications.find_one({
            "_id": ObjectId(application_id),
            "user_id": user_id
        })
        if not existing_app:
            raise HTTPException(status_code=404, detail="Application not found")
        
        # Prepare update data
        update_data = {}
        if company_name is not None:
            update_data["company_name"] = company_name
        if email_or_portal is not None:
            update_data["email_or_portal"] = email_or_portal
        if link is not None:
            update_data["link"] = link
        if link_type is not None:
            update_data["link_type"] = link_type
        if date_of_applying is not None:
            update_data["date_of_applying"] = datetime.fromisoformat(date_of_applying.replace('Z', '+00:00'))
        if notes is not None:
            update_data["notes"] = notes
        
        # Handle file upload to Cloudinary
        if photo and photo.filename:
            # Delete old photo from Cloudinary if exists
            if existing_app.get("photo_public_id"):
                try:
                    delete_image(existing_app["photo_public_id"])
                except Exception as e:
                    print(f"Warning: Failed to delete old image: {e}")
            
            # Upload new photo to Cloudinary
            upload_result = upload_image(photo.file)
            update_data["photo_public_id"] = upload_result["public_id"]
            update_data["photo_url"] = upload_result["secure_url"]
        
        # Update in database
        await db.applications.update_one(
            {"_id": ObjectId(application_id), "user_id": user_id},
            {"$set": update_data}
        )
        
        # Return updated application
        updated_app = await db.applications.find_one({
            "_id": ObjectId(application_id),
            "user_id": user_id
        })
        return serialize_application_document(updated_app)
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{application_id}")
async def delete_application(
    application_id: str,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """Delete a job application"""
    try:
        if not ObjectId.is_valid(application_id):
            raise HTTPException(status_code=400, detail="Invalid application ID")
        
        # Get application to delete associated photo
        user_id = ObjectId(current_user["user_id"])
        application = await db.applications.find_one({
            "_id": ObjectId(application_id),
            "user_id": user_id
        })
        if not application:
            raise HTTPException(status_code=404, detail="Application not found")
        
        # Delete associated photo from Cloudinary
        if application.get("photo_public_id"):
            try:
                delete_image(application["photo_public_id"])
            except Exception as e:
                print(f"Warning: Failed to delete image from Cloudinary: {e}")
        
        # Delete from database
        result = await db.applications.delete_one({
            "_id": ObjectId(application_id),
            "user_id": user_id
        })
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Application not found")
        
        return {"message": "Application deleted successfully"}
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Photo serving is now handled by Cloudinary URLs directly
# This endpoint is kept for backward compatibility but redirects to Cloudinary
@router.get("/photo/{public_id}")
async def get_photo(public_id: str):
    """Get photo URL from Cloudinary public_id"""
    try:
        from ..cloudinary_config import get_image_url
        photo_url = get_image_url(public_id)
        return {"photo_url": photo_url}
    except Exception as e:
        raise HTTPException(status_code=404, detail="Photo not found")
