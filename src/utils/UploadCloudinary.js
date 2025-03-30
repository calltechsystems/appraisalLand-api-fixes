// uploadImage.js
import { cloudinary } from './Cloudinary';

async function uploadImage(file) {
  try {
    const result = await cloudinary.uploader.upload(file, {
      upload_preset: 'mpbjdclg',
    });
    return result.secure_url; // This URL can be used to access the image
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

export { uploadImage };
