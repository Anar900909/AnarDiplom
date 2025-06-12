const dotenv = require("dotenv").config({ path: "./.env" });
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");


const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const biddingRoute = require("./routes/biddingRoute");
const categoryRoute = require("./routes/categoryRoute");
const errorHandler = require("./middleWare/errorMiddleWare");

const app = express();


const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"], // Your frontend
    methods: ["GET", "POST"],
    credentials: true
  }
});


app.set("io", io);


io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`✅ User ${userId} joined their room`);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({
  origin: ["http://localhost:3000"],
  credentials: true
}));


console.log("Environment Variables:");
console.log("PORT:", process.env.PORT);
console.log("DATABASE_CLOUD:", process.env.DATABASE_CLOUD);


app.use("/api/users", userRoute);
app.use("/api/product", productRoute);
app.use("/api/bidding", biddingRoute);
app.use("/api/category", categoryRoute);


app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use(errorHandler);


app.get("/", (req, res) => {
  res.send("Home Page");
});


const connectDB = async () => {
  try {
    if (!process.env.DATABASE_CLOUD) {
      throw new Error("DATABASE_CLOUD environment variable not set");
    }

    await mongoose.connect(process.env.DATABASE_CLOUD, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ MongoDB Connected");

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  }
};

connectDB();
