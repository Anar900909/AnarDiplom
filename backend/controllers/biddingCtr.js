const asyncHandler = require("express-async-handler");
const Product = require("../model/productModel");
const BiddingProduct = require("../model/biddingProductModel");
const sendEmail = require("../utils/sendEmail");
const User = require("../model/userModel");
const mongoose = require("mongoose");

const placeBid = asyncHandler(async (req, res) => {
  const { productId, price } = req.body;
  const userId = req.user.id;

  // ✅ Validate bid amount
  if (!price || typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ message: "Invalid bid amount" });
  }

  // ✅ Get user
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // ✅ Get and validate product
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (!product.isverify) {
    res.status(400);
    throw new Error("Bidding is not verified for this product");
  }

  if (product.isSoldout) {
    res.status(400);
    throw new Error("Bidding is closed for this product");
  }

  // ✅ Check balance
  if (user.balance < price) {
    res.status(400);
    throw new Error("Insufficient balance for this bid");
  }

  // ✅ Find current highest bidder
  const currentHighestBid = await BiddingProduct.findOne({ product: productId })
    .sort({ price: -1 })
    .populate("user"); // To access user info for refund

  let refundMessage = null;

  // ✅ Refund previous highest bidder (if not same as current user)
  if (
    currentHighestBid &&
    currentHighestBid.user &&
    currentHighestBid.user._id.toString() !== userId
  ) {
    const previousBidder = await User.findById(currentHighestBid.user._id);
    previousBidder.balance += currentHighestBid.price;
    await previousBidder.save();

    refundMessage = `User ${previousBidder.name} got outbid and refunded $${currentHighestBid.price}`;
    // You may want to notify them via socket or frontend polling
  }

  // ✅ Deduct current user's balance
  user.balance -= price;
  await user.save();

  // ✅ Save or update bid
  const existingUserBid = await BiddingProduct.findOne({ user: userId, product: productId });

  let newBid;
  if (existingUserBid) {
    existingUserBid.price = price;
    await existingUserBid.save();
    newBid = existingUserBid;
  } else {
    newBid = await BiddingProduct.create({
      user: userId,
      product: productId,
      price,
    });
  }

  res.status(200).json({
    biddingProduct: newBid,
    newBalance: user.balance,
    refundMessage,
    message: "Your bid has been placed successfully.",
  });
});

const validateBid = asyncHandler(async (req, res) => {
  const { productId, price } = req.body;
  if (!price || typeof price !== 'number' || price <= 0) {
  return res.status(400).json({ message: "Invalid bid amount" });
}

  const userId = req.user.id;

  if (!productId || !price) {
    return res.status(400).json({ valid: false, message: "Missing required fields" });
  }

  const [user, product] = await Promise.all([
    User.findById(userId),
    Product.findById(productId)
  ]);

  if (!user) return res.status(404).json({ valid: false, message: "User not found" });
  if (!product) return res.status(404).json({ valid: false, message: "Product not found" });

  // Check product status
  if (product.isSoldout) {
    return res.status(400).json({ valid: false, message: "Bidding is closed for this product" });
  }

  if (!product.isverify) {
    return res.status(400).json({ valid: false, message: "Product not verified for bidding" });
  }

  // Check balance
  if (user.balance < price) {
    return res.status(200).json({ 
      valid: false, 
      message: `Insufficient balance: $${user.balance.toFixed(2)}` 
    });
  }

  // Check minimum bid
  const currentHighest = await BiddingProduct.findOne({ product: productId })
    .sort({ price: -1 })
    .limit(1);
  
  const minBid = currentHighest 
    ? currentHighest.price * 1.1 
    : product.price * 1.1;

  return res.status(200).json({ 
    valid: true,
    message: "Valid bid",
    minBid: minBid,
    currentBalance: user.balance
  });
});
const getBiddingHistory = asyncHandler(async (req, res) => {
  const productId = req.params.productId;

  // Validate product ID
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  try {
    const history = await BiddingProduct.find({ product: productId })
      .sort({ createdAt: -1 }) // Newest first
      .populate('user', 'name email') // Only include name and email
      .lean(); // Convert to plain JS object
    if (!history || history.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching bidding history:', error);
    res.status(500).json({ error: "Server error" });
  }
});
const sellProduct = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;

  // Find the product
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (!product.isverify) {
    res.status(400);
    throw new Error("Bidding is not verified for these products.");
  }


  //   /* const currentTime = new Date();
  //   const tenMinutesAgo = new Date(currentTime - 2 * 60 * 1000); // 10 minutes ago

  //     if (!product.isSoldout || product.updatedAt < tenMinutesAgo || product.createdAt < tenMinutesAgo) {
  //     return res.status(400).json({ error: "Product cannot be sold at this time" });
  //   } */

  // Check if the user is authorized to sell the product
  if (product.user.toString() !== userId) {
    return res.status(403).json({ error: "You do not have permission to sell this product" });
  }

  // Find the highest bid
  const highestBid = await BiddingProduct.findOne({ product: productId }).sort({ price: -1 }).populate("user");
  if (highestBid && highestBid.user._id.toString() !== userId) {
  // Refund previous highest bidder
  const prevHighestUser = await User.findById(highestBid.user._id);
  if (prevHighestUser) {
    prevHighestUser.balance += highestBid.price;
    await prevHighestUser.save();
  }
}


  // Calculate commission and final price
  const commissionRate = product.commission;
  const commissionAmount = (commissionRate / 100) * highestBid.price;
  const finalPrice = highestBid.price - commissionAmount;

  // Update product details
  product.isSoldout = true;
  product.soldTo = highestBid.user;
  product.soldPrice = finalPrice;

  // Update admin's commission balance
  const admin = await User.findOne({ role: "admin" });
  if (admin) {
    admin.commissionBalance += commissionAmount;
    await admin.save();
  }

  // Update seller's balance
  const seller = await User.findById(product.user);
  if (seller) {
    seller.balance += finalPrice; // Add the remaining amount to the seller's balance
    await seller.save();
  } else {
    return res.status(404).json({ error: "Seller not found" });
  }

  // Save product
  await product.save();

  // Send email notification to the highest bidder
  await sendEmail({
    email: highestBid.user.email,
    subject: "Congratulations! You won the auction!",
    text: `You have won the auction for "${product.title}" with a bid of $${highestBid.price}.`,
  });

  res.status(200).json({ message: "Product has been successfully sold!" });
});

module.exports = {
  placeBid,
  validateBid,
  getBiddingHistory,
  sellProduct,
  
};
