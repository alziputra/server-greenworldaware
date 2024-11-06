const { News, Categories, User } = require("../models");

const getAllNews = async (req, res) => {
  try {
    const allNews = await News.findAll({
      include: [
        {
          model: User,
          require: true,
        },
        {
          model: Categories,
          require: true,
        },
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
      where: { id: id },
      include: [
        {
          model: User,
          require: true,
        },
        {
          model: Categories,
          require: true,
        },
      ],
    });

    if (!getNews) {
      return res.status(404).json({
        message: "News not found",
      });
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
      return res.status(404).json({
        message: "User not found",
      });
    }

    const newNews = {
      title: data.title,
      description: data.description,
      image: data.image,
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
    const news = await News.findOne({ where: { id: id } });

    if (!news) {
      return res.status(404).json({
        message: `News with id ${id} not found`,
      });
    }

    const editedNews = {
      title: data.title,
      description: data.description,
      image: data.image,
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
    const findNews = await News.findOne({ where: { id: id } });

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

module.exports = { getAllNews, getNewsById, addNews, deleteNews, editNews };
