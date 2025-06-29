const mongoose = require("mongoose");

const BiddingProductSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "User",
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "Product",
    },
    price: {
      type: Number,
      require: [true, "Үнийн дүн байршуулна уу"],
    },
  },
  { timestamps: true }
);
const biddingproduct = mongoose.model("BiddingProduct", BiddingProductSchema);
module.exports = biddingproduct;
