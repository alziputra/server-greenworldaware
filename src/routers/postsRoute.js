const express = require("express");
const multer = require("multer");
const { getAllPost, getPostById, getPostsByUserId, deletePost, addPost, editPost } = require("../controllers/postController");
const auth = require("../middleware/auth");

const router = express.Router();
const upload = multer();

router.get("/", getAllPost);
router.get("/:id", getPostById);
router.get("/:userId/posts", getPostsByUserId);

// Otentikasi semua user dapat menambahkan, mengedit, dan menghapus post
router.post("/", auth, upload.single("image"), addPost);
router.put("/:id", auth, editPost);
router.delete("/:id", auth, deletePost);

module.exports = router;
