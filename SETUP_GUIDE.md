# 🚀 Complete Setup Guide for Job Application Tracker

This guide will walk you through setting up the Job Application Tracker with Cloudinary integration for image storage.

## 📋 Prerequisites

Before you begin, you'll need accounts and installations for the following services:

### 1. Required Software
- **Python 3.8+**: [Download Python](https://www.python.org/downloads/)
- **Node.js 16+**: [Download Node.js](https://nodejs.org/)
- **Git**: [Download Git](https://git-scm.com/downloads)

### 2. Required Accounts
- **MongoDB Atlas** (Free): [Sign up for MongoDB Atlas](https://www.mongodb.com/atlas)
- **Cloudinary** (Free): [Sign up for Cloudinary](https://cloudinary.com/)

## 🔧 Step-by-Step Setup

### Step 1: Clone the Repository
```bash
git clone <your-repo-url>
cd job-tracker
```

### Step 2: Set Up MongoDB Atlas

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Click "Try Free" and create an account
   - Choose the **FREE** tier (M0 Sandbox)

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose "FREE" tier
   - Select a cloud provider and region (choose closest to you)
   - Click "Create"

3. **Set Up Database Access**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Create a username and password (save these!)
   - Set privileges to "Read and write to any database"
   - Click "Add User"

4. **Set Up Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0) for development
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (it looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
   - Replace `<password>` with your actual password
   - Replace `<dbname>` with `job_tracker`

### Step 3: Set Up Cloudinary

1. **Create Cloudinary Account**
   - Go to [Cloudinary](https://cloudinary.com/)
   - Click "Sign Up For Free"
   - Fill in your details and create account

2. **Get API Credentials**
   - After logging in, you'll see your **Dashboard**
   - Note down these three values:
     - **Cloud Name** (e.g., `dxy8n8x9k`)
     - **API Key** (e.g., `123456789012345`)
     - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz123456`)

3. **Configure Upload Settings** (Optional)
   - Go to "Settings" → "Upload"
   - Set "Upload presets" if needed
   - The default settings work fine for this project

### Step 4: Backend Setup

1. **Navigate to Backend Directory**
   ```bash
   cd backend
   ```

2. **Create Virtual Environment**
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables**
   ```bash
   # Copy the example file
   cp env.example .env

   # Edit .env file with your credentials
   ```

   **Edit `backend/.env` file:**
   ```env
   MONGODB_URL=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/job_tracker
   DATABASE_NAME=job_tracker

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
   ```

   **Replace the following:**
   - `your-username`: Your MongoDB Atlas username
   - `your-password`: Your MongoDB Atlas password
   - `your-cluster`: Your MongoDB cluster name
   - `your_cloud_name`: Your Cloudinary cloud name
   - `your_api_key`: Your Cloudinary API key
   - `your_api_secret`: Your Cloudinary API secret

5. **Test Backend**
   ```bash
   python main.py
   ```

   You should see:
   ```
   Connected to MongoDB
   INFO:     Started server process
   INFO:     Waiting for application startup.
   INFO:     Application startup complete.
   INFO:     Uvicorn running on http://0.0.0.0:8000
   ```

   **Test the API:**
   - Open [http://localhost:8000/docs](http://localhost:8000/docs) in your browser
   - You should see the FastAPI documentation

### Step 5: Frontend Setup

1. **Navigate to Frontend Directory** (in a new terminal)
   ```bash
   cd frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

   You should see:
   ```
   VITE v5.0.0  ready in 500 ms
   ➜  Local:   http://localhost:5173/
   ➜  Network: use --host to expose
   ```

### Step 6: Test the Application

1. **Open the Application**
   - Go to [http://localhost:5173](http://localhost:5173)
   - You should see the Job Application Tracker interface

2. **Test Image Upload**
   - Click "Add Application"
   - Fill in the form with a company name and date
   - Upload an image file
   - Submit the form
   - The image should appear in the application list

## 🔗 Important Links

### Development URLs
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Health Check**: [http://localhost:8000/health](http://localhost:8000/health)

### Service Dashboards
- **MongoDB Atlas**: [https://cloud.mongodb.com/](https://cloud.mongodb.com/)
- **Cloudinary**: [https://cloudinary.com/console](https://cloudinary.com/console)

### Documentation
- **FastAPI**: [https://fastapi.tiangolo.com/](https://fastapi.tiangolo.com/)
- **React**: [https://react.dev/](https://react.dev/)
- **TailwindCSS**: [https://tailwindcss.com/](https://tailwindcss.com/)
- **MongoDB**: [https://docs.mongodb.com/](https://docs.mongodb.com/)
- **Cloudinary**: [https://cloudinary.com/documentation](https://cloudinary.com/documentation)

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   ```
   Error: Failed to connect to MongoDB
   ```
   **Solution:**
   - Check your MongoDB Atlas connection string
   - Ensure your IP is whitelisted in Network Access
   - Verify username/password are correct

2. **Cloudinary Upload Error**
   ```
   Error: Failed to upload image to Cloudinary
   ```
   **Solution:**
   - Check your Cloudinary credentials in `.env`
   - Ensure your Cloudinary account is active
   - Verify API key and secret are correct

3. **CORS Error in Browser**
   ```
   Access to fetch at 'http://localhost:8000' from origin 'http://localhost:5173' has been blocked by CORS policy
   ```
   **Solution:**
   - Make sure backend is running on port 8000
   - Check that CORS is configured in `backend/main.py`

4. **Frontend Build Error**
   ```
   Error: Cannot resolve dependency
   ```
   **Solution:**
   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

5. **Python Import Error**
   ```
   ModuleNotFoundError: No module named 'cloudinary'
   ```
   **Solution:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

### Environment Variables Checklist

Make sure your `backend/.env` file contains:

- ✅ `MONGODB_URL` - Your MongoDB Atlas connection string
- ✅ `DATABASE_NAME` - Set to `job_tracker`
- ✅ `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
- ✅ `CLOUDINARY_API_KEY` - Your Cloudinary API key
- ✅ `CLOUDINARY_API_SECRET` - Your Cloudinary API secret
- ✅ `CLOUDINARY_URL` - Your complete Cloudinary URL (optional but recommended)

## 🎯 Quick Start Commands

### Start Everything (Recommended)
```bash
# Terminal 1 - Backend
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
python main.py

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

### Using Docker (Alternative)
```bash
docker-compose up --build
```

## 📱 Features Overview

Once set up, your application will have:

- ✅ **Add Job Applications** with company details, dates, and photos
- ✅ **View Applications** in card or list format
- ✅ **Edit/Delete** existing applications
- ✅ **Search** by company name, email, or notes
- ✅ **Filter** by date range
- ✅ **Image Upload** to Cloudinary with automatic optimization
- ✅ **Responsive Design** for mobile and desktop
- ✅ **Real-time Updates** when adding/editing applications

## 🆘 Getting Help

If you encounter issues:

1. **Check the logs** in both terminal windows
2. **Verify environment variables** are set correctly
3. **Test API endpoints** at [http://localhost:8000/docs](http://localhost:8000/docs)
4. **Check service dashboards** (MongoDB Atlas, Cloudinary)
5. **Review this guide** for common solutions

## 🎉 Success!

Once everything is running, you should see:
- Backend running on port 8000
- Frontend running on port 5173
- MongoDB Atlas connected
- Cloudinary configured for image uploads
- Full CRUD functionality working

Your Job Application Tracker is now ready to use! 🚀
