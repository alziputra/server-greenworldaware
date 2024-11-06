const express = require("express");

const auth = require("../middleware/auth");
const { getAllPetition, getPetitionById, addPetition, editPetition, deletePetition } = require("../controller/petitionsController");

const route = express.Router();

route.get("/", getAllPetition);
route.get("/:id", getPetitionById);
route.post("/", auth, addPetition);
route.put("/:id", auth, editPetition);
route.delete("/:id", auth, deletePetition);

module.exports = route;
