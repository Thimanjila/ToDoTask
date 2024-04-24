require("dotenv").config();
const mongoose = require("mongoose");

const mongoURI = process.env.DB_URL;

const options = {};

mongoose
  .connect(mongoURI, options)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

module.exports = mongoose;
