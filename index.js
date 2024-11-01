const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const adminRouter = require("./routes/adminRouter");
const classroomRouter = require("./routes/classroomRouter");

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["https://classsroom-tracker.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

mongoose.connect(process.env.dbUrl);

app.use("/admins", adminRouter);
app.use("/classrooms", classroomRouter);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
