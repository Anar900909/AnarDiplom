const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  loginStatus,
  logoutUser,
  loginAsSeller,
  estimateIncome,
  getUser,
  getUserBalance,
  getAllUser,
  updateUserBalance,
  getSingleUser
} = require("../controllers/userCtr");
const { protect, isAdmin } = require("../middleWare/authMiddleWare");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/loggedin", loginStatus);
router.get("/logout", logoutUser);
router.post("/seller", loginAsSeller);
router.get("/getuser", protect, getUser);
router.get("/sell-amount", protect, getUserBalance);

router.get("/estimate-income", protect, isAdmin, estimateIncome);
router.get("/users", protect, isAdmin, getAllUser);

// PATCH route to update user balance by user id
router.patch("/:id/update-balance", protect, isAdmin, updateUserBalance);
router.get("/:id", protect, isAdmin, getSingleUser);

module.exports = router;
