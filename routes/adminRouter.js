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
    res.status(500).json({ message: err.message });
  }
});

adminRouter.post("/find", async (req, res) => {
  const createAdmin = async () => {
    const master = await adminModel.findOne({ email: process.env.email });
    if (!master) {
      const hashedPassword = await bcrypt.hash(process.env.password, 10);
      await adminModel.create({
        name: process.env.name,
        email: process.env.email,
        password: hashedPassword,
      });
    }
  };

  await createAdmin();

  const { email, password } = req.body;
  try {
    const admin = await adminModel.findOne({ email });
    if (admin) {
      const passwordMatch = await bcrypt.compare(password, admin.password);
      if (passwordMatch) {
        const token = jwt.sign({ email: admin.email }, secretKey, {
          expiresIn: "3d",
        });
        return res.json({ token, status: true, message: "User exists" });
      } else {
        return res.json({ status: false, message: "Password is incorrect" });
      }
    } else {
      return res.json({ status: false, message: "Admin doesn't exist" });
    }
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
});

adminRouter.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const master = await adminModel.findOne({ name: process.env.name });
    if (master && master._id.toString() === id) {
      res.json({
        message:
          "You can't delete super admin it may deleted instantly but it will be restored once if the browser get refresh",
      });
    } else {
      await adminModel.findByIdAndDelete(id);
      res.json({ message: "Admin deleted successfully" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

adminRouter.post("/add", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const adminExists = await adminModel.findOne({ email });
    if (adminExists) {
      return res.json({ message: "Admin already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await adminModel.create({
      name,
      email,
      password: hashedPassword,
    });
    res.json({ message: "Admin added successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = adminRouter;
