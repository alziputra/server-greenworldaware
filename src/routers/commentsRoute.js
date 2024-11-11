const express = require("express");
const multer = require("multer");
const auth = require("../middleware/auth");
const { getAllComments, getCommentById, addComment, deleteComment, editComment, getCommentByPostId } = require("../controllers/commentController");

const router = express.Router();
const upload = multer();

router.get("/", getAllComments);
router.get("/:id", getCommentById); 
router.get("/posts/:postId", getCommentByPostId); 

// otentikasi semua user dapat menambahkan, mengedit, dan menghapus komentar
router.post("/", auth, upload.none(), addComment); 
router.put("/:id", auth, editComment);
router.delete("/:id", auth, deleteComment);

module.exports = router;
