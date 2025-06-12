const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

const protect = expressAsyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401);
      throw new Error("Нэвтрэнэ үү!");
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(verified.id).select("-password");
    if (!user) {
      res.status(401);
      throw new Error("Хэрэглэгч олдсонгүй");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Хэрэглэгч олдсонгүй");
  }
});

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403);
    throw new Error("Зөвхөн админ.");
  }
};

const isSeller = (req, res, next) => {
  if (req.user && (req.user.role === "seller" || req.user.role === "admin")) {
    next();
  } else {
    res.status(403);
    throw new Error("Зөвхөн Борлуулагч.");
  }
};

module.exports = { protect, isAdmin, isSeller };
