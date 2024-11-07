const path = require("path");
const fs = require("fs");

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
      return reject(new Error(`File size is ${file.size / 1024}KB, exceeding the 500KB limit.`));
    }

    // Generate a unique filename
    const filename = `${Date.now()}_${file.originalname}`;
    const uploadDir = path.join(__dirname, "../../public/uploads");

    // Buat folder 'uploads' jika belum ada
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Tulis file ke direktori 'public/uploads'
    const uploadPath = path.join(uploadDir, filename);
    fs.writeFile(uploadPath, file.buffer, (err) => {
      if (err) {
        reject(new Error("Failed to upload file. Please try again."));
      } else {
        resolve(`/uploads/${filename}`); // Return relative path to save in database
      }
    });
  });
};

module.exports = { uploadImage };
