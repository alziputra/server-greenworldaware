const express = require("express");
const { getAllPost, getPostById, deletePost, addPost, editPost } = require("../controllers/postController");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", getAllPost);
router.get("/:id", getPostById);
router.post("/", auth, addPost); // otentikasi semua user dapat menambahkan post
router.put("/:id", auth, editPost); // otentikasi semua user dapat mengedit post
router.delete("/:id", auth, deletePost); // otentikasi semua user dapat menghapus post

module.exports = router;
