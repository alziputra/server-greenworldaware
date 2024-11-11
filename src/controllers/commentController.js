const { Post, Comments, User } = require("../models");

const getAllComments = async (req, res) => {
  try {
    const allComments = await Comments.findAll({
      include: {
        model: User,
        require: true,
      },
    });
    res.status(200).json({
      message: "succeed",
      data: allComments,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getCommentById = async (req, res) => {
  try {
    const id = req.params.id;
    const getComment = await Comments.findOne({ where: { id: id } });

    if (!getComment) {
      res.status(404).json({
        message: "comment not found",
      });
    }

    res.status(200).json({
      message: "succeed",
      data: getComment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getCommentByPostId = async (req, res) => {
  try {
    const postId = req.params.postId; // Get postId from URL parameters
    const comments = await Comments.findAll({
      where: { postId },
      include: {
        model: User,
        required: true,
      },
    });

    if (!comments.length) {
      return res.status(404).json({
        message: "No comments found for this post",
      });
    }

    res.status(200).json({
      message: "succeed",
      data: comments,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const addComment = async (req, res) => {
  try {
    const decodedUserId = req.credentials.id; // Get userId from decoded JWT
    const { postId, comment } = req.body; // Extract postId and comment from the request body

    // Debug logs to confirm values
    console.log("Decoded userId:", decodedUserId);
    console.log("Request Body postId:", postId);
    console.log("Request Body comment:", comment);

    // Validate postId and comment
    if (!postId) {
      return res.status(400).json({ message: "postId is required" });
    }
    if (!comment) {
      return res.status(400).json({ message: "comment is required" });
    }

    // Check if the post exists
    const post = await Post.findOne({ where: { id: postId } });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Create the new comment entry
    const newComment = await Comments.create({
      postId,
      userId: decodedUserId,
      comment,
    });

    return res.status(201).json({
      message: "Comment has been added successfully",
      data: newComment,
    });
  } catch (error) {
    console.error("Error in addComment:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const id = req.params.id;
    const findComment = await Comments.findOne({ where: { id: id } });
    const deleteCommentById = await findComment.destroy({ where: { id: id } });

    if (!findComment) {
      return res.status(404).json({
        message: "Comment with " + id + " not found",
      });
    }

    res.status(200).json({
      message: "Comment has been succesfully deleted",
      data: deleteCommentById,
    });
  } catch (error) {
    res.send("ID not found");
  }
};

const editComment = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const comment = await Comments.findOne({ where: { id: id } });

    const editedComment = {
      postId: data.postId,
      userId: data.userId,
      comment: data.comment,
    };
    const edited = await comment.update(editedComment, { where: { id: id } });

    res.status(201).json({
      message: "Comment has succesfully made a change",
      data: edited,
    });
  } catch (error) {
    res.status(404).json({
      message: "Internal Error",
    });
  }
};

module.exports = { getAllComments, getCommentById, getCommentByPostId, addComment, deleteComment, editComment };
