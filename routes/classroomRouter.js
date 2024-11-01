const express = require("express");
const app = express();
const router = express.Router();
const classModel = require("../models/Class");

router.get("/vacant/:day", async (req, res) => {
  const { day } = req.params;
  try {
    const vacantClassrooms = await classModel.find({ day, vacant: true });
    res.json(vacantClassrooms);
  } catch (error) {
    res.status(500).json({ error: "Error fetching classrooms" });
  }
});

router.get("/get", async (req, res) => {
  try {
    const classrooms = await classModel.find();
    res.status(200).json(classrooms);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to retrieve classrooms", error: err });
  }
});

router.post("/add", async (req, res) => {
  const { day, duration, roomNumber, location, vacant } = req.body;

  const newClassroom = new classModel({
    day,
    duration,
    roomNumber,
    location,
    vacant,
  });

  try {
    const savedClassroom = await newClassroom.save();
    res.status(201).json({ message: "data saved" });
  } catch (err) {
    res.status(500).json({ message: "Failed to add classroom", error: err });
  }
});

router.put("/update/:id", async (req, res) => {
  const { day, duration, roomNumber, location, vacant } = req.body;

  try {
    const updatedClassroom = await classModel.findByIdAndUpdate(
      req.params.id,
      { day, duration, roomNumber, location, vacant },
      { new: true }
    );

    if (!updatedClassroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    res.status(200).json({ message: "data updated" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update classroom", error: err });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedClassroom = await classModel.findByIdAndDelete(req.params.id);

    if (!deletedClassroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    res.status(200).json({ message: "Classroom deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete classroom", error: err });
  }
});

module.exports = router;
