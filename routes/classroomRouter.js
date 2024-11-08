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
  try {
    const updatedClassroom = await classModel.findOneAndUpdate(
      { day, duration, roomNumber },
      { $set: { vacant } }, 
      { new: true, upsert: false } 
    );
    if (!updatedClassroom) {
      const newClassroom = new classModel({
        day,
        duration,
        roomNumber,
        location,
        vacant,
      });
      await newClassroom.save();
      return res.status(201).json({ message: "Classroom added" });
    }
    res.status(200).json({ message: "Classroom updated" });
  } catch (err) {
    res.status(500).json({ message: "Failed to add or update classroom", error: err });
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

const rooms = [
  { roomNumber: "107", location: "Ground floor" },
  { roomNumber: "108", location: "Ground floor" },
  { roomNumber: "109", location: "Ground floor" },
  { roomNumber: "101", location: "Ground floor" },
  { roomNumber: "201", location: "1st floor" },
  { roomNumber: "202", location: "1st floor" },
  { roomNumber: "203", location: "1st floor" },
  { roomNumber: "204", location: "1st floor" },
  { roomNumber: "205", location: "1st floor" },
  { roomNumber: "208", location: "1st floor" },
  { roomNumber: "209", location: "1st floor" },
  { roomNumber: "301", location: "2nd floor" },
  { roomNumber: "302", location: "2nd floor" },
  { roomNumber: "303", location: "2nd floor" },
  { roomNumber: "304", location: "2nd floor" },
  { roomNumber: "305", location: "2nd floor" },
  { roomNumber: "306", location: "2nd floor" },
  { roomNumber: "307", location: "2nd floor" },
  { roomNumber: "308", location: "2nd floor" },
  { roomNumber: "309", location: "2nd floor" },
  { roomNumber: "310", location: "2nd floor" },
  { roomNumber: "401", location: "3rd floor" },
  { roomNumber: "402", location: "3rd floor" },
  { roomNumber: "403", location: "3rd floor" },
  { roomNumber: "404", location: "3rd floor" },
  { roomNumber: "405", location: "3rd floor" },
  { roomNumber: "406", location: "3rd floor" },
  { roomNumber: "407", location: "3rd floor" },
  { roomNumber: "408", location: "3rd floor" },
  { roomNumber: "409", location: "3rd floor" },
  { roomNumber: "410", location: "3rd floor" },
  { roomNumber: "AIML-lab 1", location: "1st floor" },
  { roomNumber: "AIML-lab 2", location: "1st floor" },
  { roomNumber: "AIML-lab 3", location: "1st floor" },
  { roomNumber: "AIML-lab 4", location: "1st floor" },
  { roomNumber: "MCA-lab 1", location: "1st floor" },
  { roomNumber: "MCA-lab 2", location: "1st floor" },
  { roomNumber: "MCA-lab 3", location: "1st floor" },
  { roomNumber: "CS-lab 1", location: "2nd floor" },
  { roomNumber: "CS-lab 2", location: "2nd floor" },
  { roomNumber: "CS-lab 3", location: "2nd floor" },
  { roomNumber: "CS-lab 4", location: "2nd floor" },
  { roomNumber: "CS-lab 5", location: "2nd floor" },
  { roomNumber: "CS-lab 6", location: "2nd floor" },
  { roomNumber: "CS-lab 7", location: "2nd floor" },
  { roomNumber: "CS-lab 8", location: "2nd floor" },
  { roomNumber: "IS-lab 1", location: "3rd floor" },
  { roomNumber: "IS-lab 2", location: "3rd floor" },
  { roomNumber: "IS-lab 3", location: "3rd floor" },
  { roomNumber: "IS-lab 4", location: "3rd floor" },
  { roomNumber: "IS-lab 5", location: "3rd floor" },
  { roomNumber: "IS-lab 6", location: "3rd floor" },
  { roomNumber: "IS-lab 7", location: "3rd floor" },
  { roomNumber: "IS-lab 8", location: "3rd floor" },
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const timings = [
  "9-10",
  "10-11",
  "11:30-12:30",
  "12:30-1:30",
  "2:30-3:30",
  "3:30-4:30",
];

const documents = [];

rooms.forEach((room) => {
  days.forEach((day) => {
    timings.forEach((duration) => {
      documents.push({
        day: day,
        duration: duration,
        roomNumber: room.roomNumber,
        vacant: true,
        location: room.location,
      });
    });
  });
});

const BATCH_SIZE = 1000; 

router.post("/insertAll", async (req, res) => {
  try {
    const promises = [];
    for (let i = 0; i < documents.length; i += BATCH_SIZE) {
      const batch = documents.slice(i, i + BATCH_SIZE);
      promises.push(classModel.insertMany(batch, { ordered: false }));
    }

    await Promise.all(promises);

    res.json({ message: "All classrooms inserted as vacant where necessary." });
  } catch (error) {
    console.error("Error while inserting classrooms:", error);
    res.status(500).json({ message: "Failed to insert classrooms", error });
  }
});

router.post("/deleteAll", async (req, res) => {
  try {
    await classModel.deleteMany();
    res.json({ message: "All classrooms got deleted" });
  } catch (error) {
    console.error("Error while deleteting classrooms:", error);
    res.status(500).json({ message: "Failed to insert classrooms", error });
  }
});

module.exports = router;
