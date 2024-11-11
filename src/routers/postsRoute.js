const express = require("express");
const multer = require("multer");
const { getAllPost, getPostById, deletePost, addPost, editPost } = require("../controllers/postController");
const auth = require("../middleware/auth");

const router = express.Router();
const upload = multer();

router.get("/", getAllPost);
router.get("/:id", getPostById);

// Otentikasi semua user dapat menambahkan, mengedit, dan menghapus post
router.post("/", auth, upload.single("image"), addPost); 
router.put("/:id", auth, editPost);
router.delete("/:id", auth, deletePost);

module.exports = router;
