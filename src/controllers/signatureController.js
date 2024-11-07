const { Signatures, Petitions, User } = require("../models");

const getAllSignature = async (req, res) => {
  try {
    const allSignatures = await Signatures.findAll({
      include: [
        {
          model: User,
          require: true,
        },
      ],
    });
    res.status(200).json({
      message: "succeed",
      data: allSignatures,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const addSignature = async (req, res) => {
  try {
    const data = req.body;
    const petition = await Petitions.findOne({ where: { id: data.petitionId } });

    if (!petition) {
      return res.status(404).json({
        message: "Petition not found",
      });
    }

    const newSignature = {
      petitionId: data.petitionId,
      userId: data.userId,
    };
    const addNewSignature = await Signatures.create(newSignature);

    res.status(201).json({
      message: "Signature has been added succesfully",
      data: addNewSignature,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getSignatureById = async (req, res) => {
  try {
    const id = req.params.id;
    const getSignature = await Signatures.findAll({
      where: { petitionId: id },
      include: [{ model: User, required: true }],
    });

    if (!getSignature) {
      res.status(404).json({
        message: "Signature not found",
      });
      return;
    }

    res.status(200).json({
      message: "succeed",
      data: getSignature,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteSignature = async (req, res) => {
  try {
    const id = req.params.id;
    const findSignature = await Signatures.findOne({ where: { id: id } });
    const deleteSignatureById = await findSignature.destroy({ where: { id: id } });

    if (!findSignature) {
      return res.status(404).json({
        message: "Signature with " + id + " not found",
      });
    }

    res.status(200).json({
      message: "Signature has been succesfully deleted",
      data: deleteSignatureById,
    });
  } catch (error) {
    res.send("ID not found");
  }
};

module.exports = { getAllSignature, addSignature, getSignatureById, deleteSignature };
