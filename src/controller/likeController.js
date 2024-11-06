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
    const data = req.body;
    const post = await Post.findOne({ where: { id: data.postId } });

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const newLike = {
      postId: data.postId,
      userId: data.userId,
    };
    const addNewLike = await Likes.create(newLike);

    res.status(201).json({
      message: "Like has been added succesfully",
      data: addNewLike,
    });
  } catch (error) {
    res.send(error.message);
  }
};

const deleteLike = async (req, res) => {
  try {
    const id = req.params.id;
    const findLike = await Likes.findOne({ where: { id: id } });
    const deleteLikeById = await findLike.destroy({ where: { id: id } });

    if (!findLike) {
      return res.status(404).json({
        message: "Like with " + id + " not found",
      });
    }

    res.status(200).json({
      message: "Like has been succesfully deleted",
      data: deleteLikeById,
    });
  } catch (error) {
    res.send("ID not found");
  }
};

module.exports = { getAllLikes, addLikes, deleteLike };
