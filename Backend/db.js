// db.js
const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    console.log("✅ MongoDB Atlas connected successfully");
  } catch (error) {
    console.error(" Error connecting MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
