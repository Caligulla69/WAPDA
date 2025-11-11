const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const connectDB = require("./db");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser"); // ✅ ADD THIS

// Routers & Models
const indexRouter = require("./routes/index");
const User = require("./models/Users");

dotenv.config();

const app = express();
app.set("trust proxy", 1);

// Connect to Database
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser()); // ✅ ADD THIS - Must be BEFORE session middleware

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://trouble-reporting-frontend.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["set-cookie"],
  })
);

// Session Configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    name: "wapda_session",
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      ttl: 24 * 60 * 60,
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production", // ✅ Changed back for local dev
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // ✅ Changed back
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport using the User model
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Health Check Route
app.get("/", (req, res) => {
  res.json({
    message: "Server is running 🚀",
    timestamp: new Date().toISOString(),
  });
});

// Add after your health check route
app.get("/test-cors", (req, res) => {
  res.json({
    message: "CORS is working!",
    origin: req.headers.origin,
    headers: res.getHeaders(),
  });
});

// Debug Middleware
app.use((req, res, next) => {
  console.log("🔍 Headers:", req.headers.cookie);
  console.log("🍪 Parsed Cookies:", req.cookies); // Should now show cookies
  console.log("📝 Session ID:", req.sessionID);
  console.log("✅ Authenticated:", req.isAuthenticated?.());
  next();
});

// API Routes
app.use("/", indexRouter);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start Server (only for local development)
const PORT = process.env.PORT || 8000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export for Vercel
module.exports = app;
