const express = require("express");

const { getAllPost, getPostById, deletePost, addPost, editPost } = require("../controllers/postController");
const auth = require("../middleware/auth");
const route = express.Router();

route.get("/", getAllPost);
route.get("/:id", getPostById);
route.post("/", auth, addPost);
route.put("/:id", auth, editPost);
route.delete("/:id", auth, deletePost);

module.exports = route;
