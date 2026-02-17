require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const messageRoutes = require("./routes/messages");
const meetupRoutes = require("./routes/meetups");
const logger = require("./utils/logger");

const app = express();

// ===== SECURITY MIDDLEWARE =====

// Helmet for secure HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        connectSrc: [
          "'self'",
          process.env.CLIENT_URL || "http://localhost:3000",
        ],
      },
    },
    crossOriginEmbedderPolicy: false,
  }),
);

const allowedOrigins = [
  "https://kindredpal-production.up.railway.app",
  "https://kindredpal.com",
  "https://www.kindredpal.com",
  "https://kindred-pal.vercel.app",
  "https://kindred-4jp9hvgk9-srschoonmakers-projects.vercel.app",
  "http://localhost:3000",
  "http://localhost:19000",
  "http://localhost:19006",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      logger.info("✅ Allowing request with no origin (mobile/API client)");
      return callback(null, true);
    }

    if (allowedOrigins.indexOf(origin) !== -1) {
      logger.info("✅ Allowing origin:", origin);
      callback(null, true);
    } else {
      logger.error("🚫 Blocked origin:", origin);
      callback(
        new Error(`CORS policy does not allow access from origin: ${origin}`),
      );
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  exposedHeaders: ["Content-Length", "X-Request-Id"],
  preflightContinue: false,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Body parser with size limits
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// MongoDB injection protection
app.use(mongoSanitize());

// General API rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/", limiter);

// Stricter limit for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many login attempts, please try again later.",
  skipSuccessfulRequests: true,
});

app.use("/api/auth/login", authLimiter);
app.use("/api/auth/signup", authLimiter);

// Rate limit for profile updates
const profileLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "Too many profile updates, please try again later.",
});

app.use("/api/users/profile", profileLimiter);

// ===== SERVER & SOCKET.IO SETUP =====

const server = http.createServer(app);
const io = new Server(server, {
  cors: corsOptions,
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Socket.io connection handling
const userSockets = new Map();

io.on("connection", (socket) => {
  logger.info("🔌 Socket connected:", socket.id);

  socket.on("user-online", (userId) => {
    if (!userId || typeof userId !== "string") {
      logger.info("⚠️ Invalid userId in user-online event");
      return;
    }

    userSockets.set(userId, socket.id);
    logger.info(`👤 User ${userId} is now online (socket: ${socket.id})`);

    socket.broadcast.emit("user-status-change", {
      userId,
      status: "online",
    });
  });

  socket.on("disconnect", () => {
    logger.info("🔌 Socket disconnected:", socket.id);

    for (const [userId, socketId] of userSockets.entries()) {
      if (socketId === socket.id) {
        userSockets.delete(userId);
        logger.info(`👤 User ${userId} went offline`);

        socket.broadcast.emit("user-status-change", {
          userId,
          status: "offline",
        });
        break;
      }
    }
  });

  socket.on("error", (error) => {
    logger.error("❌ Socket error:", error);
  });
});

app.set("io", io);
app.set("userSockets", userSockets);

// ===== ROUTES =====

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/meetups", meetupRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "KindredPal API is running",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// API info endpoint
app.get("/api", (req, res) => {
  res.json({
    name: "KindredPal API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      users: "/api/users",
      messages: "/api/messages",
      meetups: "/api/meetups",
    },
  });
});

// ===== ERROR HANDLING =====

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.path,
  });
});

app.use((err, req, res, next) => {
  logger.error("❌ Global error:", err);

  const message =
    process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message;

  res.status(err.status || 500).json({
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// ===== DATABASE CONNECTION =====

mongoose
  .connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => {
    logger.info("✅ MongoDB connected successfully");
    logger.info("📊 Database:", mongoose.connection.db.databaseName);
  })
  .catch((err) => {
    logger.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

mongoose.connection.on("disconnected", () => {
  logger.info("⚠️ MongoDB disconnected");
});

mongoose.connection.on("error", (err) => {
  logger.error("❌ MongoDB error:", err);
});

// ===== SERVER STARTUP =====

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  logger.info("\n========================================");
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`🔌 Socket.IO server ready`);
  logger.info(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
  logger.info(`🔒 Security: Helmet, Rate Limiting, NoSQL Injection Protection`);
  logger.info(`📅 Started: ${new Date().toLocaleString()}`);
  logger.info("========================================\n");
});

// ===== GRACEFUL SHUTDOWN =====

process.on("SIGTERM", () => {
  logger.info("⚠️ SIGTERM received, shutting down gracefully...");

  server.close(() => {
    logger.info("✅ HTTP server closed");

    mongoose.connection.close(false, () => {
      logger.info("✅ MongoDB connection closed");
      process.exit(0);
    });
  });
});

process.on("SIGINT", () => {
  logger.info("\n⚠️ SIGINT received, shutting down gracefully...");

  server.close(() => {
    logger.info("✅ HTTP server closed");

    mongoose.connection.close(false, () => {
      logger.info("✅ MongoDB connection closed");
      process.exit(0);
    });
  });
});

process.on("uncaughtException", (err) => {
  logger.error("❌ UNCAUGHT EXCEPTION:", err);
  logger.error("Stack:", err.stack);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("❌ UNHANDLED REJECTION at:", promise);
  logger.error("Reason:", reason);
  process.exit(1);
});

module.exports = { app, server, io };
