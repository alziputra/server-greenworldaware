require("dotenv/config");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan"); // Import morgan
const { sequelize } = require("./models");
const router = require("./router");

const app = express();
app.use(cors());
app.use(express.json());

// Use morgan with a custom format to log only the HTTP method
app.use(morgan("dev"));

const connectToDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

connectToDB();

const PORT = process.env.PORT || 3000;

app.use(router);

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
