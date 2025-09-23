import cloudinary
import cloudinary.uploader
import cloudinary.api
from dotenv import load_dotenv
import os

load_dotenv()

# Configure Cloudinary
# Use CLOUDINARY_URL if available, otherwise use individual credentials
cloudinary_url = os.getenv("CLOUDINARY_URL")
if cloudinary_url:
    cloudinary.config(cloudinary_url=cloudinary_url, secure=True)
else:
    cloudinary.config(
        cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
        api_key=os.getenv("CLOUDINARY_API_KEY"),
        api_secret=os.getenv("CLOUDINARY_API_SECRET"),
        secure=True
    )

def upload_image(file, folder="job_tracker"):
    """
    Upload an image to Cloudinary
    
    Args:
        file: The uploaded file object
        folder: The folder to store the image in Cloudinary
    
    Returns:
        dict: Cloudinary upload result with public_id and secure_url
    """
    try:
        result = cloudinary.uploader.upload(
            file,
            folder=folder,
            resource_type="image",
            transformation=[
                {"width": 500, "height": 500, "crop": "limit"},
                {"quality": "auto"},
                {"fetch_format": "auto"}
            ]
        )
        return {
            "public_id": result["public_id"],
            "secure_url": result["secure_url"],
            "width": result["width"],
            "height": result["height"]
        }
    except Exception as e:
        raise Exception(f"Failed to upload image to Cloudinary: {str(e)}")

def delete_image(public_id):
    """
    Delete an image from Cloudinary
    
    Args:
        public_id: The public_id of the image to delete
    
    Returns:
        dict: Cloudinary deletion result
    """
    try:
        result = cloudinary.uploader.destroy(public_id)
        return result
    except Exception as e:
        raise Exception(f"Failed to delete image from Cloudinary: {str(e)}")

def get_image_url(public_id, transformation=None):
    """
    Get the URL for an image with optional transformations
    
    Args:
        public_id: The public_id of the image
        transformation: Optional transformation parameters
    
    Returns:
        str: The image URL
    """
    try:
        if transformation:
            return cloudinary.CloudinaryImage(public_id).build_url(transformation=transformation)
        else:
            return cloudinary.CloudinaryImage(public_id).build_url()
    except Exception as e:
        raise Exception(f"Failed to generate image URL: {str(e)}")
