const express = require("express");
const auth = require("../middleware/auth");
const { getAllLikes, addLikes, deleteLike } = require("../controllers/likeController");

const router = express.Router();

router.get("/", getAllLikes); // otentikasi semua user dapat melihat semua like
router.post("/", auth, addLikes); // otentiaksi semua user dapat menambahkan like
router.delete("/:id", auth, deleteLike); // otentikasi semua user dapat menghapus like

module.exports = router;
