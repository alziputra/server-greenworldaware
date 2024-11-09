const path = require("path");
const cloudinary = require("cloudinary").v2;

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return resolve(null);
    }

    // Validasi ekstensi file
    const allowedExtensions = [".png", ".jpg", ".jpeg"];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      return reject(new Error("Invalid file type. Only .png, .jpg, and .jpeg are allowed."));
    }

    // Validasi ukuran file (maksimal 500KB)
    const maxSize = 500 * 1024; // 500KB in bytes
    if (file.size > maxSize) {
      return reject(new Error(`File size is ${(file.size / 1024).toFixed(2)}KB, exceeding the 500KB limit.`));
    }

    // Upload file to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "uploads", // Specify the folder on Cloudinary
        public_id: `${Date.now()}_${file.originalname}`,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          return reject(new Error("Failed to upload file to Cloudinary. Please try again."));
        }
        resolve(result.secure_url); // Secure URL for storage in the database
      }
    );

    // Stream the file buffer to Cloudinary
    uploadStream.end(file.buffer);
  });
};

module.exports = { uploadImage };
