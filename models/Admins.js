const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const adminSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
});

const adminModel = mongoose.model("admins", adminSchema);

module.exports = adminModel;
