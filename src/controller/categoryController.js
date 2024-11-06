const { Categories } = require("../models");

const getAllCategories = async (req, res) => {
  try {
    const allCategories = await Categories.findAll();
    res.status(200).json({
      message: "succeed",
      data: allCategories,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const id = req.params.id;
    const getCategory = await Categories.findOne({ where: { id: id } });

    if (!getCategory) {
      res.status(404).json({
        message: "Category not found",
      });
    }

    res.status(200).json({
      message: "succeed",
      data: getCategory,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const addCategory = async (req, res) => {
  try {
    const data = req.body;

    const newCategory = {
      category: data.category,
    };
    const addNewCategory = await Categories.create(newCategory);

    res.status(201).json({
      message: "Category has been added succesfully",
      data: addNewCategory,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const findCat = await Categories.findOne({ where: { id: id } });
    const deleteCategoryById = await findCat.destroy({ where: { id: id } });

    if (!findCat) {
      return res.status(404).json({
        message: "Category with " + id + " not found",
      });
    }

    res.status(200).json({
      message: "Category has been succesfully deleted",
      data: deleteCategoryById,
    });
  } catch (error) {
    res.status(500).send("ID not found");
  }
};

const editCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const category = await Categories.findOne({ where: { id: id } });

    const editedCategory = {
      category: data.category,
    };
    const edited = await category.update(editedCategory, { where: { id: id } });

    res.status(201).json({
      message: "Category has succesfully made a change",
      data: edited,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Error",
    });
  }
};

module.exports = { getAllCategories, getCategoryById, addCategory, deleteCategory, editCategory };
