import os
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

class Database:
    client: Optional[AsyncIOMotorClient] = None
    database = None

database = Database()

async def get_database() -> AsyncIOMotorClient:
    return database.database

async def connect_to_mongo():
    """Create database connection"""
    database.client = AsyncIOMotorClient(os.getenv("MONGODB_URL"))
    database.database = database.client[os.getenv("DATABASE_NAME")]
    print("Connected to MongoDB")

async def close_mongo_connection():
    """Close database connection"""
    if database.client:
        database.client.close()
        print("Disconnected from MongoDB")
