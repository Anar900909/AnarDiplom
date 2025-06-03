const express = require("express");
const { placeBid, getBiddingHistory, sellProduct, validateBid } = require("../controllers/biddingCtr");
const { protect, isSeller } = require("../middleWare/authMiddleWare");
const router = express.Router();

router.get("/history/:productId", getBiddingHistory);// More specific endpoint
router.post("/sell", protect, isSeller, sellProduct);
router.post("/validate", protect, validateBid); // New validation route
router.post("/", protect, placeBid);

module.exports = router;
