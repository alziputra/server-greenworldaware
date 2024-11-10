const express = require("express");
const auth = require("../middleware/auth");
const multer = require("multer");
const { getAllPetition, getPetitionById, addPetition, editPetition, deletePetition } = require("../controllers/petitionsController");

const route = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

route.get("/", getAllPetition);
route.get("/:id", getPetitionById);
route.post("/", auth, upload.single("image"), addPetition);
route.put("/:id", auth, upload.single("image"), editPetition);
route.delete("/:id", auth, deletePetition);

module.exports = route;
