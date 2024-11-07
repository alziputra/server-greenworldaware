const { Petitions, Signatures, User } = require("../models");

const getAllPetition = async (req, res) => {
  try {
    const allPetitions = await Petitions.findAll({
      include: [
        {
          model: Signatures,
          require: true,
        },
      ],
    });
    res.status(200).json({
      message: "succeed",
      data: allPetitions,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getPetitionById = async (req, res) => {
  try {
    const id = req.params.id;
    const getPetition = await Petitions.findOne({
      where: { id: id },
      include: [
        {
          model: Signatures,
          require: true,
        },
        {
          model: User,
          require: true,
        },
      ],
    });

    if (!getPetition) {
      res.status(404).json({
        message: "Petition not found",
      });
    }

    res.status(200).json({
      message: "succeed",
      data: getPetition,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const addPetition = async (req, res) => {
  try {
    const data = req.body;
    const user = await User.findOne({ where: { id: data.userId } });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const newPetition = {
      userId: data.userId,
      title: data.title,
      description: data.description,
      image: data.image,
    };
    const addNewPetition = await Petitions.create(newPetition);

    res.status(201).json({
      message: "Post has been added succesfully",
      data: addNewPetition,
    });
  } catch (error) {
    res.send(error.message);
  }
};

const deletePetition = async (req, res) => {
  try {
    const id = req.params.id;
    const findPetition = await Petitions.findOne({ where: { id: id } });
    const deletePetitionById = await findPetition.destroy({ where: { id: id } });

    if (!deletePetitionById) {
      return res.status(404).json({
        message: "Petition with " + id + " not found",
      });
    }

    res.status(200).json({
      message: "Petition has been succesfully deleted",
      data: deletePetitionById,
    });
  } catch (error) {
    res.send("ID not found");
  }
};

const editPetition = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const petition = await Petitions.findOne({ where: { id: id } });

    const editedPetition = {
      userId: data.userId,
      title: data.title,
      description: data.description,
      image: data.image,
    };
    const edited = await petition.update(editedPetition, { where: { id: id } });

    res.status(201).json({
      message: "Petition has succesfully made a change",
      data: edited,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Error",
    });
  }
};

module.exports = { getAllPetition, getPetitionById, addPetition, editPetition, deletePetition };
