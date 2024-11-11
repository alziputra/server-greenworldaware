const express = require("express");
const multer = require("multer");
const auth = require("../middleware/auth");
const { getAllLikes, addLikes, deleteLike } = require("../controllers/likeController");

const router = express.Router();
const upload = multer();

// otentiaksi semua user dapat melihat semua like, menambahkan like, dan menghapus like
router.get("/", getAllLikes);
router.post("/", auth, upload.none(), addLikes);
router.delete("/:id", auth, deleteLike);

module.exports = router;
