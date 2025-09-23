#!/usr/bin/env python3
"""
Simple test script to verify the backend setup
Run this from the project root directory
"""

import requests
import json
from datetime import datetime

API_BASE = "http://localhost:8000/api"

def test_health():
    """Test if the backend is running"""
    try:
        response = requests.get("http://localhost:8000/health")
        if response.status_code == 200:
            print("✅ Backend health check passed")
            return True
        else:
            print(f"❌ Backend health check failed: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend. Make sure it's running on http://localhost:8000")
        return False

def test_get_applications():
    """Test getting all applications"""
    try:
        response = requests.get(f"{API_BASE}/applications/")
        if response.status_code == 200:
            applications = response.json()
            print(f"✅ GET /applications/ - Found {len(applications)} applications")
            return True
        else:
            print(f"❌ GET /applications/ failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ GET /applications/ error: {e}")
        return False

def test_create_application():
    """Test creating a new application"""
    try:
        test_data = {
            "company_name": "Test Company",
            "email_or_portal": "test@company.com",
            "date_of_applying": datetime.now().isoformat(),
            "notes": "This is a test application"
        }
        
        response = requests.post(f"{API_BASE}/applications/", json=test_data)
        if response.status_code == 200:
            application = response.json()
            print(f"✅ POST /applications/ - Created application with ID: {application.get('_id')}")
            return application.get('_id')
        else:
            print(f"❌ POST /applications/ failed: {response.status_code}")
            print(f"Response: {response.text}")
            return None
    except Exception as e:
        print(f"❌ POST /applications/ error: {e}")
        return None

def test_get_application(app_id):
    """Test getting a single application"""
    try:
        response = requests.get(f"{API_BASE}/applications/{app_id}")
        if response.status_code == 200:
            application = response.json()
            print(f"✅ GET /applications/{app_id} - Retrieved application")
            return True
        else:
            print(f"❌ GET /applications/{app_id} failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ GET /applications/{app_id} error: {e}")
        return False

def test_delete_application(app_id):
    """Test deleting an application"""
    try:
        response = requests.delete(f"{API_BASE}/applications/{app_id}")
        if response.status_code == 200:
            print(f"✅ DELETE /applications/{app_id} - Deleted application")
            return True
        else:
            print(f"❌ DELETE /applications/{app_id} failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ DELETE /applications/{app_id} error: {e}")
        return False

def main():
    """Run all tests"""
    print("🧪 Testing Job Application Tracker Backend")
    print("=" * 50)
    
    # Test health
    if not test_health():
        print("\n❌ Backend is not running. Please start it first:")
        print("   cd backend && python main.py")
        return
    
    print()
    
    # Test CRUD operations
    test_get_applications()
    
    app_id = test_create_application()
    if app_id:
        test_get_application(app_id)
        test_delete_application(app_id)
    
    print("\n" + "=" * 50)
    print("🎉 Backend tests completed!")
    print("\nNext steps:")
    print("1. Start the frontend: cd frontend && npm run dev")
    print("2. Open http://localhost:5173 in your browser")
    print("3. Start adding job applications!")

if __name__ == "__main__":
    main()
