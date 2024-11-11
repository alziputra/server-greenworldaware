const { Post, Likes } = require("../models");

const getAllLikes = async (req, res) => {
  try {
    const allLikes = await Likes.findAll();
    res.status(200).json({
      message: "succeed",
      data: allLikes,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const addLikes = async (req, res) => {
  try {
    const decodedUserId = req.credentials.id; // Get userId from decoded token
    const { postId } = req.body; // Extract postId from the request body

    // Debug logs to confirm values
    console.log("Decoded userId:", decodedUserId);
    console.log("Request Body postId:", postId);

    // Validate postId and decodedUserId
    if (!postId) {
      return res.status(400).json({ message: "postId is required" });
    }
    if (!decodedUserId) {
      return res.status(400).json({ message: "User ID is not available from token" });
    }

    // Check if the post exists
    const post = await Post.findOne({ where: { id: postId } });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user has already liked the post to avoid duplicate likes
    const existingLike = await Likes.findOne({ where: { postId, userId: decodedUserId } });
    if (existingLike) {
      return res.status(400).json({ message: "You already liked this post" });
    }

    // Create the new like entry
    const newLike = await Likes.create({ postId, userId: decodedUserId });

    return res.status(201).json({
      message: "Like has been added successfully",
      data: newLike,
    });
  } catch (error) {
    console.error("Error in addLikes:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

const deleteLike = async (req, res) => {
  try {
    const id = req.params.id;
    const findLike = await Likes.findOne({ where: { id } });

    if (!findLike) {
      return res.status(404).json({ message: `Like with id ${id} not found` });
    }

    await findLike.destroy();
    res.status(200).json({ message: "Like has been successfully deleted" });
  } catch (error) {
    res.status(500).json({ message: "ID not found" });
  }
};

module.exports = { getAllLikes, addLikes, deleteLike };
