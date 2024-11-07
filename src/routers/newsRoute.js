const express = require("express");
const multer = require("multer");
const auth = require("../middleware/auth");
const { getAllNews, getNewsById, addNews, deleteNews, editNews } = require("../controllers/newsController");

const route = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

route.get("/", getAllNews);
route.get("/:id", getNewsById);
route.post("/", auth, upload.single("image"), addNews);
route.put("/:id", auth, upload.single("image"), editNews);
route.delete("/:id", auth, deleteNews);

module.exports = route;
  