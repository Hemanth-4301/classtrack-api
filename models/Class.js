const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  day: { type: String, required: true },
  duration: { type: String, required: true },
  roomNumber: { type: String, required: true },
  vacant: { type: Boolean, required: true, default: true },
  location: { type: String },
});

const classModel = mongoose.model("classes", classSchema);

module.exports = classModel;
