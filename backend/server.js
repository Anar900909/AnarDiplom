const dotenv = require("dotenv").config({ path: "./.env" }); // Explicit path to .env
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

// Import routes and middleware
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const biddingRoute = require("./routes/biddingRoute");
const categoryRoute = require("./routes/categoryRoute");
const errorHandler = require("./middleWare/errorMiddleWare");

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({
  origin: ["http://localhost:3000"],
  credentials: true
}));

// Verify environment variables
console.log("Environment Variables:");
console.log("PORT:", process.env.PORT);
console.log("DATABASE_CLOUD:", process.env.DATABASE_CLOUD);

// Routes
app.use("/api/users", userRoute);
app.use("/api/product", productRoute);
app.use("/api/bidding", biddingRoute);
app.use("/api/category", categoryRoute);

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Error handling
app.use(errorHandler);

// Basic route
app.get("/", (req, res) => {
  res.send("Home Page");
});

// Database connection
const connectDB = async () => {
  try {
    if (!process.env.DATABASE_CLOUD) {
      throw new Error("DATABASE_CLOUD environment variable not set");
    }
    
    await mongoose.connect(process.env.DATABASE_CLOUD, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("MongoDB Connected");
    
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  } catch (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1); // Exit process with failure
  }
};

connectDB();