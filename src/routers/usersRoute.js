const express = require("express");
const multer = require("multer");
const { register, login, getAllUser, getUserById, editUser, getPostById } = require("../controllers/userController");
const auth = require("../middleware/auth");

const route = express.Router();
const upload = multer(); // Configure multer for handling form-data

route.get("/", getAllUser);
route.get("/:id", getUserById);
route.get("/:id/posts", getPostById);

// Use `upload.none()` to parse form-data fields only (without files) for registration
route.post("/register", upload.none(), register);
route.post("/login", login);
route.put("/:id", auth, editUser);

module.exports = route;
