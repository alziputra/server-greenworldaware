const express = require("express");
const auth = require("../middleware/auth");
const { getAllSignature, addSignature, deleteSignature, getSignatureById } = require("../controllers/signatureController");

const route = express.Router();

route.get("/", getAllSignature);
route.get("/:id", getSignatureById);
route.post("/", auth, addSignature);
route.delete("/:id", auth, deleteSignature);

module.exports = route;
