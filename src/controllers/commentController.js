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
    const id = req.params.id;
    const getComment = await Comments.findAll({
      where: { postId: id },
      include: {
        model: User,
        require: true,
      },
    });

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

const addComment = async (req, res) => {
  try {
    const data = req.body;
    const decodedUserId = req.credentials.id; // Get userId from decoded token

    // Cek apakah userId di dalam body request sama dengan decoded userId
    if (data.userId != decodedUserId) {
      return res.status(403).json({ message: "Unauthorized: userId does not match token" });
    }

    const post = await Post.findOne({ where: { id: data.postId } });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = {
      postId: data.postId,
      userId: data.userId,
      comment: data.comment,
    };

    const addNewComment = await Comments.create(newComment);

    return res.status(201).json({
      message: "Comment has been added successfully",
      data: addNewComment,
    });
  } catch (error) {
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
