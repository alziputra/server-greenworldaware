const { News, Categories, User } = require("../models");
const { uploadImage } = require("../utils/imageUploadHelper");

const getAllNews = async (req, res) => {
  try {
    const allNews = await News.findAll({
      include: [
        { model: User, required: true },
        { model: Categories, required: true },
      ],
    });
    res.status(200).json({
      message: "succeed",
      data: allNews,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getNewsById = async (req, res) => {
  try {
    const id = req.params.id;
    const getNews = await News.findOne({
      where: { id },
      include: [
        { model: User, required: true },
        { model: Categories, required: true },
      ],
    });

    if (!getNews) {
      return res.status(404).json({ message: "News not found" });
    }

    res.status(200).json({
      message: "succeed",
      data: getNews,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const addNews = async (req, res) => {
  try {
    const data = req.body;
    const user = await User.findOne({ where: { id: data.userId } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Upload the image if it exists
    const imagePath = req.file ? await uploadImage(req.file) : null;

    const newNews = {
      title: data.title,
      description: data.description,
      image: imagePath,
      userId: data.userId,
      categoryId: data.categoryId,
    };
    const addNewNews = await News.create(newNews);

    res.status(201).json({
      message: "News has been added successfully",
      data: addNewNews,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const editNews = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const news = await News.findOne({ where: { id } });

    if (!news) {
      return res.status(404).json({ message: `News with id ${id} not found` });
    }

    // Upload the image if provided, otherwise keep the existing image
    const imagePath = req.file ? await uploadImage(req.file) : news.image;

    const editedNews = {
      title: data.title,
      description: data.description,
      image: imagePath,
      userId: data.userId,
      categoryId: data.categoryId,
    };
    const edited = await news.update(editedNews);

    res.status(200).json({
      message: "News has successfully been updated",
      data: edited,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Error",
    });
  }
};

const deleteNews = async (req, res) => {
  try {
    const id = req.params.id;
    const findNews = await News.findOne({ where: { id } });

    if (!findNews) {
      return res.status(404).json({
        message: `News with id ${id} not found`,
      });
    }

    await findNews.destroy();

    res.status(200).json({
      message: "News has been successfully deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while deleting the news",
    });
  }
};

module.exports = {
  getAllNews,
  getNewsById,
  addNews,
  editNews,
  deleteNews,
};
