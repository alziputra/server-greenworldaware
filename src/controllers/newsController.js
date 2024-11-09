const { News, Categories, User } = require("../models");
const { uploadImage } = require("../utils/cloudinaryUploadHelper");

const getAllNews = async (req, res) => {
  try {
    const allNews = await News.findAll({
      include: [
        { model: User, required: false },
        { model: Categories, required: false },
      ],
    });
    res.status(200).json({ message: "Succeed", data: allNews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getNewsById = async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(id)) return res.status(400).json({ message: "Invalid news ID" });

    const news = await News.findOne({
      where: { id },
      include: [
        { model: User, required: false },
        { model: Categories, required: false },
      ],
    });

    if (!news) return res.status(404).json({ message: "News not found" });
    res.status(200).json({ message: "Succeed", data: news });
  } catch (error) {
    res.status(500).json({ message: `Error fetching news: ${error.message}` });
  }
};

const addNews = async (req, res) => {
  try {
    const data = req.body;
    const user = await User.findByPk(data.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const imagePath = req.file ? await uploadImage(req.file) : null;
    const newNews = {
      title: data.title,
      description: data.description,
      image: imagePath,
      userId: data.userId,
      categoryId: data.categoryId,
    };
    const addedNews = await News.create(newNews);

    res.status(201).json({ message: "News has been added successfully", data: addedNews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const editNews = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const news = await News.findByPk(id);

    if (!news) return res.status(404).json({ message: `News with ID ${id} not found` });

    const imagePath = req.file ? await uploadImage(req.file) : news.image;
    const updatedNews = {
      title: data.title,
      description: data.description,
      image: imagePath,
      userId: data.userId,
      categoryId: data.categoryId,
    };
    const editedNews = await news.update(updatedNews);

    res.status(200).json({ message: "News successfully updated", data: editedNews });
  } catch (error) {
    res.status(500).json({ message: "Internal error" });
  }
};

const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await News.findByPk(id);

    if (!news) return res.status(404).json({ message: `News with ID ${id} not found` });

    await news.destroy();
    res.status(200).json({ message: "News successfully deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting news" });
  }
};

module.exports = {
  getAllNews,
  getNewsById,
  addNews,
  editNews,
  deleteNews,
};
