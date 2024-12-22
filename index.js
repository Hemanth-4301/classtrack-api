const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const adminRouter = require("./routes/adminRouter");
const classroomRouter = require("./routes/classroomRouter");
const adminModel = require("./models/Admins.js");

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["https://nie-classtrack.vercel.app", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

const connect = async () => {
  await mongoose
    .connect(process.env.URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));
};
connect();

app.get("/", (req, res) => {
  res.send("Welcome to API");
});

app.use("/admins", adminRouter);
app.use("/classrooms", classroomRouter);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
