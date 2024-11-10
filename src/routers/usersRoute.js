const express = require("express");
const multer = require("multer");
const { register, login, getAllUser, getUserById, editUser, getPostById } = require("../controllers/userController");
const auth = require("../middleware/auth");
const authorizeRole = require("../middleware/authorizeRole");

const route = express.Router();
const upload = multer(); // Configure multer for handling form-data

// Only super admin can access
route.get("/", auth, authorizeRole("super admin"), getAllUser);
route.get("/:id", auth, getUserById);
route.get("/:id/posts", auth, getPostById);

// Use `upload.none()` to parse form-data fields only (without files) for registration
route.post("/register", upload.none(), register);
route.post("/login", login);

// Route for editing user - allow user to edit their own profile or super admin to edit any profile
route.put(
  "/:id",
  auth,
  (req, res, next) => {
    // Allow user to edit their own data or allow super admin
    if (req.credentials.role === "super admin" || req.credentials.id == req.params.id) {
      next();
    } else {
      res.status(403).json({ message: "You are not authorized to edit this user's data" });
    }
  },
  upload.single("image"),
  editUser
);

module.exports = route;
