const express = require("express");
const multer = require("multer");
const { register, login, getAllUser, getUserById, editUser, getPostById } = require("../controllers/userController");
const auth = require("../middleware/auth");

const route = express.Router();
const upload = multer(); // Configure multer for handling form-data

// Rute untuk melihat konten pengguna terbuka (tidak memerlukan autentikasi)
route.get("/", getAllUser); // Semua orang bisa melihat daftar pengguna
route.get("/:id", getUserById); // Semua orang bisa melihat profil pengguna tertentu
route.get("/:id/posts", getPostById); // Semua orang bisa melihat postingan pengguna tertentu

// Rute untuk register dan login pengguna
route.post("/register", upload.none(), register);
route.post("/login", login);

// Hanya pengguna itu sendiri atau super admin yang dapat mengedit data pengguna
route.put("/:id", auth, (req, res, next) => {
  if (req.credentials.role === "super admin" || req.credentials.id == req.params.id) {
    next();
  } else {
    res.status(403).json({ message: "You are not authorized to edit this user's data" });
  }
}, upload.single("image"), editUser);

module.exports = route;
