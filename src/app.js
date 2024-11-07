require("dotenv/config");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const { sequelize } = require("./models");
const router = require("./routers"); // Sesuaikan path router jika diperlukan

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Melayani file statis di folder `public/uploads`
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));
console.log(path.join(__dirname, "../public/uploads"));

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
