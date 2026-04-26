const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { asyncHandler } = require("../utils/asyncHandler");
const { BadRequestError, AppError } = require("../utils/apiError");

const router = express.Router();

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      throw new BadRequestError("name, email and password are required");
    }
    const exists = await User.findOne({ email });
    if (exists) throw new BadRequestError("Email already registered");

    const user = await User.create({ name, email, password });
    res.status(201).json({
      token: signToken(user._id),
      user: { id: user._id, name: user.name, email: user.email },
    });
  })
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new BadRequestError("email and password are required");
    }
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      throw new AppError("Invalid email or password", 401);
    }
    res.json({
      token: signToken(user._id),
      user: { id: user._id, name: user.name, email: user.email },
    });
  })
);

module.exports = router;
