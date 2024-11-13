const { Likes, User, Post, Comments } = require("../models");
const { uploadImage } = require("../utils/cloudinaryUploadHelper");

// Get all posts
const getAllPost = async (req, res) => {
  try {
    const allPosts = await Post.findAll({
      include: [
        { model: Likes, required: false },
        { model: Comments, required: false },
        { model: User, required: true },
      ],
    });
    return res.status(200).json({
      message: "succeed",
      data: allPosts,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get post by ID
const getPostById = async (req, res) => {
  try {
    const id = req.params.id;
    const getPost = await Post.findOne({
      where: { id },
      include: [
        { model: Likes, required: false },
        { model: Comments, required: false },
        { model: User, required: true },
      ],
    });

    if (!getPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json({
      message: "succeed",
      data: getPost,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get posts by user ID
const getPostsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const userPosts = await Post.findAll({
      where: { userId },
      include: [
        { model: Likes, required: false },
        { model: Comments, required: false },
        { model: User, required: true },
      ],
    });

    if (!userPosts.length) {
      return res.status(404).json({ message: "No posts found for this user" });
    }

    return res.status(200).json({
      message: "succeed",
      data: userPosts,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Add new post
const addPost = async (req, res) => {
  try {
    const decodedUserId = req.credentials.id;
    const { post } = req.body;
    let imageUrl = null;

    if (req.file) {
      const imageUploadResult = await uploadImage(req.file);
      imageUrl = imageUploadResult.url;
    }

    const newPost = await Post.create({
      post,
      image: imageUrl,
      userId: decodedUserId,
    });

    const user = await User.findByPk(decodedUserId);
    const updatedUserPoints = (user.points || 0) + 10;
    await user.update({ points: updatedUserPoints });

    return res.status(201).json({
      message: "Post and points have been added successfully",
      data: newPost,
      points_updated: updatedUserPoints,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Edit post
const editPost = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const post = await Post.findOne({ where: { id } });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const editedPost = {
      post: data.post,
      image: data.image,
      likeId: data.likeId,
      userId: data.userId,
      commentId: data.commentId,
    };
    const edited = await post.update(editedPost);

    return res.status(200).json({
      message: "Post has been successfully updated",
      data: edited,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Error" });
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userIdFromToken = req.credentials.id; // Get the userId from the decoded token

    const post = await Post.findOne({ where: { id: postId } });

    if (!post) {
      return res.status(404).json({ message: `Post with id ${postId} not found` });
    }

    // Check if the post belongs to the authenticated user
    if (post.userId !== userIdFromToken) {
      return res.status(403).json({ message: "You do not have permission to delete this post" });
    }

    await post.destroy();
    return res.status(200).json({ message: "Post has been successfully deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllPost, getPostById, getPostsByUserId, addPost, deletePost, editPost };
