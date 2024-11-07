const express = require("express");

const auth = require("../middleware/auth");
const { getAllCategories, getCategoryById, addCategory, deleteCategory, editCategory } = require("../controllers/categoryController");
const route = express.Router();

route.get("/", getAllCategories);
route.get("/:id", getCategoryById);
route.post("/", auth, addCategory);
route.put("/:id", auth, editCategory);
route.delete("/:id", auth, deleteCategory);

module.exports = route;
