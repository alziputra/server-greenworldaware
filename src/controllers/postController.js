const { Likes, User, Post, Comments } = require("../models");

const getAllPost = async (req, res) => {
  try {
    const allPosts = await Post.findAll({
      include: [
        { model: Likes, required: true },
        { model: Comments, required: true },
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

const getPostById = async (req, res) => {
  try {
    const id = req.params.id;
    const getPost = await Post.findOne({
      where: { id: id },
      include: [
        { model: Likes, required: true },
        { model: Comments, required: true },
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

const addPost = async (req, res) => {
  try {
    const data = req.body;
    const decodedUserId = req.credentials.id; // Ambil userId dari decoded token

    // Cek apakah userId di dalam body request sama dengan decoded userId
    if (data.userId != decodedUserId) {
      return res.status(403).json({ message: "Unauthorized: userId does not match token" });
    }

    const user = await User.findOne({ where: { id: data.userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newPost = {
      post: data.post,
      image: data.image,
      userId: data.userId,
    };

    const addNewPost = await Post.create(newPost);

    // Update user points
    const updatedUserPoints = user.points + 10;
    await User.update({ points: updatedUserPoints }, { where: { id: data.userId } });

    return res.status(201).json({
      message: "Post and points have been added successfully",
      data: addNewPost,
      points_updated: updatedUserPoints,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const id = req.params.id;
    const findPost = await Post.findOne({ where: { id: id } });

    if (!findPost) {
      return res.status(404).json({ message: `Post with id ${id} not found` });
    }

    await findPost.destroy();

    return res.status(200).json({ message: "Post has been successfully deleted" });
  } catch (error) {
    return res.status(500).json({ message: "ID not found" });
  }
};

const editPost = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const post = await Post.findOne({ where: { id: id } });

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

module.exports = { getAllPost, getPostById, addPost, deletePost, editPost };
