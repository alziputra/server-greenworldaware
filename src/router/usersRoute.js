const express = require("express");

const { getAllUser, getUserById, register, login, editUser, getPostById } = require("../controller/userController");
const auth = require("../middleware/auth");
const route = express.Router();

route.get("/", getAllUser);
route.get("/:id", getUserById);
route.get("/:id/posts", getPostById);
route.put("/:id", auth, editUser);
route.post("/", register);
route.post("/login", login);

module.exports = route;
