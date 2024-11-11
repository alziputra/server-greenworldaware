const { Likes, User, Post, Comments } = require("../models");
const { uploadImage } = require("../utils/cloudinaryUploadHelper");

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
    const decodedUserId = req.credentials.id; // Ambil userId dari decoded token jwt
    const { post } = req.body; // Dapatkan text fields dari req.body
    let imageUrl = null;

    // Cek apakah ada file yang diupload
    if (req.file) {
      // Upload gambar ke Cloudinary yang sudah kita siapkan
      const imageUploadResult = await uploadImage(req.file);
      imageUrl = imageUploadResult.url; // Store the image URL
    }

    // Buat post baru
    const newPost = await Post.create({
      post,
      image: imageUrl,
      userId: decodedUserId,
    });

    // Update user points
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
