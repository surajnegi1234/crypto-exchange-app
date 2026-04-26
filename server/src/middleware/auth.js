const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { AppError } = require("../utils/apiError");

async function protect(req, _res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next(new AppError("Not authorized, no token", 401));
  }
  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) return next(new AppError("User not found", 401));
    next();
  } catch {
    next(new AppError("Not authorized, invalid token", 401));
  }
}

module.exports = { protect };
