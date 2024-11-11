const express = require("express");
const auth = require("../middleware/auth");
const { getAllComments, getCommentById, addComment, deleteComment, editComment, getCommentByPostId } = require("../controllers/commentController");

const router = express.Router();

router.get("/", getAllComments); // Public route to get all comments
router.get("/:id", getCommentById); // Public route to get a comment by its ID
router.get("/posts/:postId", getCommentByPostId); // Get comments for a specific post
router.post("/", auth, addComment); // Authenticated users can add comments
router.put("/:id", auth, editComment); // Authenticated users can edit their comments
router.delete("/:id", auth, deleteComment); // Authenticated users can delete their comments

module.exports = router;
