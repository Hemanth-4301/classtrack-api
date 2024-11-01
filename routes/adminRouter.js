const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const adminRouter = express.Router();
const adminModel = require("../models/Admins");
const jwt = require("jsonwebtoken");
dotenv.config();
const secretKey = process.env.secret_Key;
const bcrypt = require("bcrypt");

adminRouter.get("/get", async (req, res) => {
  try {
    const admins = await adminModel.find();
    res.json(admins);
  } catch (err) {
    res.json({ message: err.message });
  }
});

adminRouter.post("/find", async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await adminModel.findOne({ email: email });
    if (admin) {
      if (bcrypt.compare(password, admin.password)) {
        const token = jwt.sign({ email: admin.email }, secretKey, {
          expiresIn: "3d",
        });
        res.json({ token, status: true, message: "User exists" });
      } else {
        res.json({ status: false, message: "Password is incorrect" });
      }
    } else {
      res.json({ status: false, message: "Admin doesn't exist" });
    }
  } catch (err) {
    res.json({ status: false, message: err.message });
  }
});

adminRouter.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await adminModel.findByIdAndDelete(id);
    res.json({ message: "Admin deleted successfully" });
  } catch (err) {
    res.json({ message: err.message });
  }
});

adminRouter.post("/add", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const admin = await adminModel.findOne({ email: email });
    if (admin) {
      return res.json({ message: "Admin already exist" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await adminModel.create({
      name: name,
      email: email,
      password: hashedPassword,
    });
    res.json({ message: "Admin added successfully" });
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = adminRouter;
