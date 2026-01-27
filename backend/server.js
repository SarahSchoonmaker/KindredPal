require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const messageRoutes = require("./routes/messages");
const meetupRoutes = require("./routes/meetups");

const app = express();

// ⭐ CRITICAL: CORS and express.json MUST come FIRST
app.use(cors());
app.use(express.json());

// THEN create server and socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// Socket.io connection handling
const userSockets = new Map();

io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);

  socket.on("user-online", (userId) => {
    userSockets.set(userId, socket.id);
    console.log(`👤 User ${userId} is now online (socket: ${socket.id})`);
  });

  socket.on("disconnect", () => {
    console.log("🔌 Socket disconnected:", socket.id);
    for (const [userId, socketId] of userSockets.entries()) {
      if (socketId === socket.id) {
        userSockets.delete(userId);
        console.log(`👤 User ${userId} went offline`);
        break;
      }
    }
  });
});

// Make io and userSockets available to routes
app.set("io", io);
app.set("userSockets", userSockets);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/meetups", meetupRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "KindredPal API is running" });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔌 Socket.IO server ready`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
});
