# Job Application Tracker

A full-stack web application for tracking job applications with a modern React frontend and FastAPI backend.

## Features

- ✅ Add new job applications with company details, application date, and optional photos
- ✅ View all applications in a responsive card/table layout
- ✅ Edit and delete existing applications
- ✅ Search applications by company name, email, or notes
- ✅ Filter applications by date range
- ✅ **Cloudinary integration** for optimized image storage and delivery
- ✅ Clean, modern UI with TailwindCSS
- ✅ Responsive design for mobile and desktop

## Tech Stack

- **Frontend**: React 18 + Vite + TailwindCSS
- **Backend**: FastAPI (Python)
- **Database**: MongoDB Atlas
- **Image Storage**: Cloudinary (cloud-based image management)

## Project Structure

```
job-tracker/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── models.py          # Pydantic models
│   │   ├── database.py        # MongoDB connection
│   │   └── routers/
│   │       ├── __init__.py
│   │       └── applications.py # API endpoints
│   ├── main.py                # FastAPI app
│   ├── requirements.txt       # Python dependencies
│   └── env.example           # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API service
│   │   └── ...
│   ├── package.json          # Node dependencies
│   └── ...
└── README.md
```

## 🚀 Quick Start

**For detailed setup instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)**

### Prerequisites
- Python 3.8+
- Node.js 16+
- MongoDB Atlas account (free)
- Cloudinary account (free)

### Quick Setup

1. **Clone and setup backend:**
   ```bash
   cd backend
   python -m venv venv
   venv\Scripts\activate  # Windows
   pip install -r requirements.txt
   cp env.example .env
   # Edit .env with your MongoDB Atlas and Cloudinary credentials
   python main.py
   ```

2. **Setup frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Access the app:**
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:8000](http://localhost:8000)
   - API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/applications/` | Get all applications |
| GET | `/api/applications/{id}` | Get single application |
| POST | `/api/applications/` | Create new application |
| PUT | `/api/applications/{id}` | Update application |
| DELETE | `/api/applications/{id}` | Delete application |
| GET | `/api/applications/photo/{filename}` | Serve uploaded photos |

## Database Schema

### Job Application Document
```json
{
  "_id": "ObjectId",
  "company_name": "string (required)",
  "email_or_portal": "string (optional)",
  "date_of_applying": "datetime (required)",
  "photo_public_id": "string (optional)",
  "photo_url": "string (optional)",
  "notes": "string (optional)"
}
```

## Image Storage with Cloudinary

- **Cloud-based storage**: Images are stored on Cloudinary's CDN
- **Automatic optimization**: Images are automatically resized and optimized
- **Multiple formats**: Supports all image formats (JPEG, PNG, WebP, etc.)
- **Direct URLs**: Images are served directly from Cloudinary URLs
- **Secure**: Images are protected and only accessible via the application

## Development

### Backend Development
```bash
cd backend
python main.py
```

### Frontend Development
```bash
cd frontend
npm run dev
```

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
```

**Backend:**
```bash
cd backend
pip install -r requirements.txt
python main.py
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/job_tracker
DATABASE_NAME=job_tracker

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
```

**Get your credentials from:**
- **MongoDB Atlas**: [https://cloud.mongodb.com/](https://cloud.mongodb.com/)
- **Cloudinary**: [https://cloudinary.com/console](https://cloudinary.com/console)

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error:**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network access for MongoDB Atlas

2. **CORS Issues:**
   - Backend is configured to allow `localhost:5173` and `localhost:3000`
   - Update CORS settings in `main.py` if using different ports

3. **File Upload Issues:**
   - Ensure `uploads/` directory exists in backend
   - Check file permissions
   - Verify file size limits

4. **Frontend Build Issues:**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility

### Port Configuration

- **Backend**: Port 8000 (configurable in `main.py`)
- **Frontend**: Port 5173 (configurable in `vite.config.js`)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.
