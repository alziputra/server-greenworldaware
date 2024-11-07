const path = require("path");
const fs = require("fs");

const uploadImage = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return resolve(null);
    }

    // Generate a unique filename
    const filename = `${Date.now()}_${file.originalname}`;
    const uploadDir = path.join(__dirname, "../../public/uploads");
    const uploadPath = path.join(uploadDir, filename);

    // Create the uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Write the file to the 'public/uploads' directory
    fs.writeFile(uploadPath, file.buffer, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(`/uploads/${filename}`); // Return relative path to save in database
      }
    });
  });
};

module.exports = { uploadImage };
