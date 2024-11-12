const { News, Categories, User } = require("../models");
const { uploadImage } = require("../utils/cloudinaryUploadHelper");
const cloudinary = require("cloudinary").v2;

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
    const decodedUserId = req.credentials.id; // Get userId from decoded JWT
    const decodedRole = req.credentials.role; // Get user role from decoded JWT

    // Check if the user has a "user" role, deny access if so
    if (decodedRole === "user") {
      return res.status(403).json({
        message: "Unauthorized: Users with 'user' role cannot add news",
      });
    }

    const { title, description, categoryId } = req.body; // Get other fields from the body
    let imageUrl = null;
    let imagePublicId = null;

    // Check if an image file was uploaded
    if (req.file) {
      const imageUploadResult = await uploadImage(req.file);
      imageUrl = imageUploadResult.url;
      imagePublicId = imageUploadResult.public_id;
    }

    // Create a new news entry
    const newNews = await News.create({
      title,
      description,
      image: imageUrl,
      imagePublicId,
      userId: decodedUserId, // Use the userId from the decoded token
      categoryId,
    });

    res.status(201).json({
      message: "News has been added successfully",
      data: newNews,
    });
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

    // Upload new image if provided
    let imageUploadResult;
    if (req.file) {
      // Delete the old image from Cloudinary if it exists
      if (news.imagePublicId) {
        await cloudinary.uploader.destroy(news.imagePublicId);
      }
      imageUploadResult = await uploadImage(req.file);
    }

    const updatedNews = {
      title: data.title,
      description: data.description,
      image: imageUploadResult ? imageUploadResult.url : news.image,
      imagePublicId: imageUploadResult ? imageUploadResult.public_id : news.imagePublicId,
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

    if (!news) {
      return res.status(404).json({ message: `News with ID ${id} not found` });
    }

    // Ensure `imagePublicId` exists and attempt to delete the image
    if (news.imagePublicId) {
      const publicId = news.imagePublicId;

      // Attempt to delete the image on Cloudinary
      const cloudinaryResponse = await cloudinary.uploader.destroy(publicId);

      // Check Cloudinary response to confirm deletion
      if (cloudinaryResponse.result !== "ok") {
        console.error("Failed to delete image from Cloudinary:", cloudinaryResponse);
        return res.status(500).json({ message: "Failed to delete image from Cloudinary." });
      }

      console.log("Image successfully deleted from Cloudinary:", cloudinaryResponse);
    } else {
      console.log("No imagePublicId found; skipping Cloudinary deletion.");
    }

    // Delete the news item from the database
    await news.destroy();
    res.status(200).json({ message: "News successfully deleted, including associated image from Cloudinary" });
  } catch (error) {
    console.error("Error deleting news:", error);
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
