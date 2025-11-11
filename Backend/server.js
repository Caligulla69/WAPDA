const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const connectDB = require("./db");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");

const indexRouter = require("./routes/index");
const User = require("./models/Users");

dotenv.config();

const app = express();
app.set("trust proxy", 1);

// ✅ FIX: Normalize URLs - remove double slashes
app.use((req, res, next) => {
  if (req.url.match(/\/\//)) {
    req.url = req.url.replace(/\/+/g, '/');
  }
  next();
});

connectDB();

app.use(express.json());
app.use(cookieParser());

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://trouble-reporting-frontend.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["set-cookie"],
};

app.use(cors(corsOptions));

// ✅ FIX: Explicit preflight handling
app.options('*', cors(corsOptions));

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
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) => {
  res.json({
    message: "Server is running 🚀",
    timestamp: new Date().toISOString(),
  });
});

app.use((req, res, next) => {
  console.log("🔍 Headers:", req.headers.cookie);
  console.log("🍪 Parsed Cookies:", req.cookies);
  console.log("📝 Session ID:", req.sessionID);
  console.log("✅ Authenticated:", req.isAuthenticated?.());
  next();
});

app.use("/", indexRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = process.env.PORT || 8000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
