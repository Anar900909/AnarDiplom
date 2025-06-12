const asyncHandler = require("express-async-handler");
const Product = require("../model/productModel");
const BiddingProduct = require("../model/biddingProductModel");
const sendEmail = require("../utils/sendEmail");
const User = require("../model/userModel");
const mongoose = require("mongoose");

const placeBid = asyncHandler(async (req, res) => {
  const { productId, price } = req.body;
  const userId = req.user.id;

  if (!price || typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ message: "Үдэгдэл хүрэлцэхгүй байна" });
  }

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("Хэрэглэгч олдсонгүй");
  }

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Бараа олдсонгүй");
  }

  if (!product.isverify) {
    res.status(400);
    throw new Error("Тухайн бараанд бооцоо тавих боломжгүй!");
  }

  if (product.isSoldout) {
    res.status(400);
    throw new Error("Тухайн бараанд бооцоо тавих боломжгүй!");
  }

  if (user.balance < price) {
    res.status(400);
    throw new Error("Үдэгдэл хүрэлцэхгүй байна!");
  }

  const currentHighestBid = await BiddingProduct.findOne({ product: productId })
    .sort({ price: -1 })
    .populate("user"); 

  let refundMessage = null;

    if (
      currentHighestBid &&
      currentHighestBid.user &&
      currentHighestBid.user._id.toString() !== userId
    ) {
      const previousBidder = await User.findById(currentHighestBid.user._id);
      previousBidder.balance += currentHighestBid.price;
      await previousBidder.save();

      refundMessage = `User ${previousBidder.name} got outbid and refunded $${currentHighestBid.price}`;

      const io = req.app.get("io");
      io.to(previousBidder._id.toString()).emit("outbid", {
        message: "Таны бооцооноос илүү бооцоо өөр оролцогч тависан тул таны мөнгийг буцаан олголоо.",
      });
    }

  user.balance -= price;
  await user.save();

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
    message: "Амжилттай.",
  });
});

const validateBid = asyncHandler(async (req, res) => {
  const { productId, price } = req.body;
  if (!price || typeof price !== 'number' || price <= 0) {
  return res.status(400).json({ message: "Буруу бооцоо" });
}

  const userId = req.user.id;

  if (!productId || !price) {
    return res.status(400).json({ valid: false, message: "Алдаа!" });
  }

  const [user, product] = await Promise.all([
    User.findById(userId),
    Product.findById(productId)
  ]);

  if (!user) return res.status(404).json({ valid: false, message: "Хэрэглэгч олдсонгүй" });
  if (!product) return res.status(404).json({ valid: false, message: "Бараа олдсонгүй" });

  if (product.isSoldout) {
    return res.status(400).json({ valid: false, message: "Бараа олдсонгүй" });
  }

  if (!product.isverify) {
    return res.status(400).json({ valid: false, message: "Тухайн бараанд бооцоо тавих боломжгүй" });
  }

  // Check balance
  if (user.balance < price) {
    return res.status(200).json({ 
      valid: false, 
      message: `Үлдэгдэл хүрэлцэхгүй байна!: $${user.balance.toFixed(2)}` 
    });
  }

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

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  try {
    const history = await BiddingProduct.find({ product: productId })
      .sort({ createdAt: -1 }) 
      .populate('user', 'name email') 
      .lean(); 
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

 
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Тухайн бараанд бооцоо тавих боломжгүй");
  }

  if (!product.isverify) {
    res.status(400);
    throw new Error("Тухайн бараанд бооцоо тавих боломжгүй.");
  }

  if (product.user.toString() !== userId) {
    return res.status(403).json({ error: "Тухайн бараанд бооцоо тавих боломжгүй" });
  }

  const highestBid = await BiddingProduct.findOne({ product: productId }).sort({ price: -1 }).populate("user");
  if (highestBid && highestBid.user._id.toString() !== userId) {
  
  const prevHighestUser = await User.findById(highestBid.user._id);
  if (prevHighestUser) {
    prevHighestUser.balance += highestBid.price;
    await prevHighestUser.save();
  }
}


  const commissionRate = product.commission;
  const commissionAmount = (commissionRate / 100) * highestBid.price;
  const finalPrice = highestBid.price - commissionAmount;

  product.isSoldout = true;
  product.soldTo = highestBid.user;
  product.soldPrice = finalPrice;

  const admin = await User.findOne({ role: "admin" });
  if (admin) {
    admin.commissionBalance += commissionAmount;
    await admin.save();
  }

  const seller = await User.findById(product.user);
  if (seller) {
    seller.balance += finalPrice; 
    await seller.save();
  } else {
    return res.status(404).json({ error: "" });
  }

  await product.save();

  await sendEmail({
    email: highestBid.user.email,
    subject: "Баяр хүргэе!",
    text: `Та "${product.title}" Бараанд $${highestBid.price} үнээр хожлоо`,
  });

  res.status(200).json({ message: "Бараа амжилттай зарагдсан!" });
});

module.exports = {
  placeBid,
  validateBid,
  getBiddingHistory,
  sellProduct,
  
};
