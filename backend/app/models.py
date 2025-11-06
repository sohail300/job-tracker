from pydantic import BaseModel, Field, GetJsonSchemaHandler
from pydantic.json_schema import JsonSchemaValue
from pydantic_core import core_schema
from typing import Optional, Any, Literal
from datetime import datetime
from bson import ObjectId


class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(
        cls, source_type: Any, handler: Any
    ) -> core_schema.CoreSchema:
        return core_schema.no_info_plain_validator_function(cls.validate)

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(
        cls, field_schema: JsonSchemaValue, handler: GetJsonSchemaHandler
    ) -> JsonSchemaValue:
        field_schema.update(type="string")
        return field_schema


class JobApplication(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId = Field(...)
    company_name: str = Field(..., min_length=1, max_length=100)
    link: Optional[str] = Field(None, max_length=500)
    link_type: Optional[str] = Field(None, max_length=50)
    date_of_applying: datetime
    photo_public_id: Optional[str] = None
    photo_url: Optional[str] = None
    notes: Optional[str] = Field(None, max_length=1000)
    status: Literal["Pending", "Not Hiring", "Rejected", "Accepted", "Followed up"] = Field(
        default="Pending"
    )

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_schema_extra": {
            "example": {
                "company_name": "Google",
                "link": "https://careers.google.com/jobs/results/123456",
                "link_type": "job portal",
                "date_of_applying": "2024-01-15T10:30:00",
                "notes": "Applied for Software Engineer position"
            }
        }
    }


class User(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    github_id: int = Field(..., unique=True)
    username: str = Field(..., min_length=1, max_length=100)
    email: Optional[str] = None
    avatar_url: Optional[str] = None
    name: Optional[str] = Field(None, max_length=200)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_schema_extra": {
            "example": {
                "github_id": 12345,
                "username": "johndoe",
                "email": "john@example.com",
                "avatar_url": "https://avatars.githubusercontent.com/u/12345",
                "name": "John Doe"
            }
        }
    }


class UserCreate(BaseModel):
    github_id: int


class EmailTemplate(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId = Field(...)
    name: str = Field(..., min_length=1, max_length=150)
    subject: Optional[str] = Field(None, max_length=200)
    body: Optional[str] = Field(None, max_length=5000)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_schema_extra": {
            "example": {
                "name": "Email Template",
                "subject": "Regarding your application",
                "body": "Hello, ...",
            }
        },
    }


class EmailTemplateCreate(BaseModel):
    name: str
    subject: Optional[str] = None
    body: Optional[str] = None


class EmailTemplateUpdate(BaseModel):
    name: Optional[str] = None
    subject: Optional[str] = None
    body: Optional[str] = None
    username: str = Field(..., min_length=1, max_length=100)
    email: Optional[str] = None
    avatar_url: Optional[str] = None
    name: Optional[str] = Field(None, max_length=200)

    model_config = {
        "json_schema_extra": {
            "example": {
                "github_id": 12345,
                "username": "johndoe",
                "email": "john@example.com",
                "avatar_url": "https://avatars.githubusercontent.com/u/12345",
                "name": "John Doe"
            }
        }
    }


class JobApplicationCreate(BaseModel):
    user_id: PyObjectId = Field(...)
    company_name: str = Field(..., min_length=1, max_length=100)
    link: Optional[str] = Field(None, max_length=500)
    link_type: Optional[str] = Field(None, max_length=50)
    date_of_applying: datetime
    notes: Optional[str] = Field(None, max_length=1000)
    status: Literal["Pending", "Not Hiring", "Rejected", "Accepted", "Followed up"] = Field(
        default="Pending"
    )

    model_config = {
        "json_schema_extra": {
            "example": {
                "company_name": "Google",
                "link": "https://careers.google.com/jobs/results/123456",
                "link_type": "job portal",
                "date_of_applying": "2024-01-15T10:30:00",
                "notes": "Applied for Software Engineer position"
            }
        }
    }


class JobApplicationUpdate(BaseModel):
    company_name: Optional[str] = Field(None, min_length=1, max_length=100)
    link: Optional[str] = Field(None, max_length=500)
    link_type: Optional[str] = Field(None, max_length=50)
    date_of_applying: Optional[datetime] = None
    photo_public_id: Optional[str] = None
    photo_url: Optional[str] = None
    notes: Optional[str] = Field(None, max_length=1000)
    status: Optional[Literal["Pending", "Not Hiring", "Rejected", "Accepted", "Followed up"]] = None

    model_config = {
        "json_schema_extra": {
            "example": {
                "company_name": "Google Inc.",
                "link": "https://careers.google.com/jobs/results/789012",
                "link_type": "email",
                "date_of_applying": "2024-01-16T10:30:00",
                "notes": "Updated application for Senior Software Engineer"
            }
        }
    }
