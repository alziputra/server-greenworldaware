const express = require("express");
const auth = require("../middleware/auth");
const { getAllLikes, addLikes, deleteLike } = require("../controllers/likeController");

const route = express.Router();

route.get("/", getAllLikes);
route.post("/", auth, addLikes);
route.delete("/:id", auth, deleteLike);

module.exports = route;
