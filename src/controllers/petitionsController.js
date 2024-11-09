const { Petitions, Signatures, User } = require("../models");
const cloudinary = require("cloudinary").v2;
const { uploadImage } = require("../utils/cloudinaryUploadHelper");

const getAllPetition = async (req, res) => {
  try {
    const allPetitions = await Petitions.findAll({
      include: [
        { model: Signatures, required: false },
        { model: User, required: false },
      ],
    });

    res.status(200).json({ message: "succeed", data: allPetitions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPetitionById = async (req, res) => {
  try {
    const id = req.params.id;
    const petition = await Petitions.findOne({
      where: { id },
      include: [
        { model: Signatures, required: false },
        { model: User, required: false },
      ],
    });

    if (!petition) {
      return res.status(404).json({ message: `Petition with ID ${id} not found` });
    }

    res.status(200).json({ message: "succeed", data: petition });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addPetition = async (req, res) => {
  try {
    const data = req.body;
    const user = await User.findOne({ where: { id: data.userId } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Upload image if provided
    const imageUploadResult = req.file ? await uploadImage(req.file) : null;

    const newPetition = {
      userId: data.userId,
      title: data.title,
      description: data.description,
      image: imageUploadResult ? imageUploadResult.url : null,
      imagePublicId: imageUploadResult ? imageUploadResult.public_id : null,
    };
    const addNewPetition = await Petitions.create(newPetition);

    res.status(201).json({ message: "Petition has been added successfully", data: addNewPetition });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const editPetition = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const petition = await Petitions.findOne({ where: { id } });

    if (!petition) {
      return res.status(404).json({ message: "Petition not found" });
    }

    // Upload new image if provided, and delete old image if exists
    let imageUploadResult;
    if (req.file) {
      if (petition.imagePublicId) {
        await cloudinary.uploader.destroy(petition.imagePublicId);
      }
      imageUploadResult = await uploadImage(req.file);
    }

    const updatedPetition = {
      userId: data.userId,
      title: data.title,
      description: data.description,
      image: imageUploadResult ? imageUploadResult.url : petition.image,
      imagePublicId: imageUploadResult ? imageUploadResult.public_id : petition.imagePublicId,
    };
    const editedPetition = await petition.update(updatedPetition);

    res.status(200).json({ message: "Petition has been updated successfully", data: editedPetition });
  } catch (error) {
    res.status(500).json({ message: "Internal Error" });
  }
};

const deletePetition = async (req, res) => {
  try {
    const id = req.params.id;
    const petition = await Petitions.findOne({ where: { id } });

    if (!petition) {
      return res.status(404).json({ message: `Petition with ID ${id} not found` });
    }

    // Delete image from Cloudinary if exists
    if (petition.imagePublicId) {
      const cloudinaryResponse = await cloudinary.uploader.destroy(petition.imagePublicId);
      if (cloudinaryResponse.result !== "ok") {
        console.error("Failed to delete image from Cloudinary:", cloudinaryResponse);
        return res.status(500).json({ message: "Failed to delete image from Cloudinary." });
      }
    }

    await petition.destroy();
    res.status(200).json({ message: "Petition has been successfully deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting petition" });
  }
};

module.exports = {
  getAllPetition,
  getPetitionById,
  addPetition,
  editPetition,
  deletePetition,
};
