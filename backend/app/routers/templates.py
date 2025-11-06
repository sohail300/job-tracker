from fastapi import APIRouter, Depends, HTTPException, status, Body
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

from ..database import get_database
from ..models import EmailTemplateCreate
from ..auth import get_current_user

router = APIRouter(prefix="/templates", tags=["templates"])


def serialize_template(document: dict) -> dict:
    if not document:
        return document
    data = {**document}
    if "_id" in data:
        data["_id"] = str(data["_id"]) 
    if "user_id" in data:
        data["user_id"] = str(data["user_id"]) 
    return data


@router.post("/")
async def create_template(
    payload: EmailTemplateCreate,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database),
):
    try:
        now = datetime.utcnow()
        doc = {
            "user_id": ObjectId(current_user["user_id"]),
            "name": payload.name,
            "subject": payload.subject,
            "body": payload.body,
            "created_at": now,
            "updated_at": now,
        }
        result = await db.templates.insert_one(doc)
        doc["_id"] = result.inserted_id
        return serialize_template(doc)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/")
async def list_templates(
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database),
):
    try:
        cursor = db.templates.find({"user_id": ObjectId(current_user["user_id"])}) \
            .sort("created_at", -1)
        items = [serialize_template(doc) async for doc in cursor]
        return items
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{template_id}")
async def get_template(
    template_id: str,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database),
):
    if not ObjectId.is_valid(template_id):
        raise HTTPException(status_code=400, detail="Invalid template ID")
    doc = await db.templates.find_one({
        "_id": ObjectId(template_id),
        "user_id": ObjectId(current_user["user_id"]),
    })
    if not doc:
        raise HTTPException(status_code=404, detail="Template not found")
    return serialize_template(doc)


@router.put("/{template_id}")
async def update_template(
    template_id: str,
    payload: dict = Body(...),
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database),
):
    if not ObjectId.is_valid(template_id):
        raise HTTPException(status_code=400, detail="Invalid template ID")
    update_data = {k: v for k, v in payload.items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()

    result = await db.templates.update_one(
        {"_id": ObjectId(template_id), "user_id": ObjectId(current_user["user_id"])},
        {"$set": update_data},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Template not found")
    doc = await db.templates.find_one({
        "_id": ObjectId(template_id),
        "user_id": ObjectId(current_user["user_id"]),
    })
    return serialize_template(doc)


@router.delete("/{template_id}")
async def delete_template(
    template_id: str,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database),
):
    if not ObjectId.is_valid(template_id):
        raise HTTPException(status_code=400, detail="Invalid template ID")
    result = await db.templates.delete_one({
        "_id": ObjectId(template_id),
        "user_id": ObjectId(current_user["user_id"]),
    })
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Template not found")
    return {"message": "Template deleted"}


