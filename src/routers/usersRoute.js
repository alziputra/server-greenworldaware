const express = require("express");
const multer = require("multer");
const { register, login, getAllUser, getUserById, editUser, getPostById } = require("../controllers/userController");
const auth = require("../middleware/auth");
const authorizeRole = require("../middleware/authorizeRole");

const route = express.Router();
const upload = multer(); // Configure multer for handling form-data

route.get("/", auth, authorizeRole("super admin"), getAllUser); // Only super admin can access
route.get("/:id", auth, getUserById);
route.get("/:id/posts", auth, getPostById);

// Use `upload.none()` to parse form-data fields only (without files) for registration
route.post("/register", upload.none(), register);
route.post("/login", login);

// Route for editing user
route.put("/:id", auth, authorizeRole("admin", "super admin"), upload.single("image"), editUser);

module.exports = route;
