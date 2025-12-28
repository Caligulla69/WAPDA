const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const connectDB = require("./db");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");
const LocalStrategy = require("passport-local").Strategy; // ✅ ADD THIS

// Routers & Models
const indexRouter = require("./routes/index");
const Engineer = require("./models/Users"); // ✅ Renamed for clarity
const DepartmentalUser = require("./models/Emp"); // ✅ ADD THIS

dotenv.config();

const app = express();
app.set("trust proxy", 1);

// Connect to Database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ ADD THIS
app.use(cookieParser());

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://trouble-reporting-frontend.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log("❌ Blocked origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
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
      touchAfter: 24 * 3600, // Lazy session update
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// Initialize Passport (MUST be after session middleware)
app.use(passport.initialize());
app.use(passport.session());

// ========================================
// ✅ FIX: Configure DUAL Passport Strategies
// ========================================

// Engineer Strategy (uses email)
passport.use(
  "engineer-local",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    Engineer.authenticate()
  )
);

passport.use(
  "departmental-local",
  new LocalStrategy(
    {
      usernameField: "employeeId",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, employeeId, password, done) => {
      try {
        const { department } = req.body;

        console.log("🔐 Passport authenticating:", { employeeId, department });

        if (!department) {
          console.log("❌ Department not provided");
          return done(null, false, { message: "Department is required" });
        }

        // Find user by BOTH employeeId AND department
        const user = await DepartmentalUser.findOne({
          employeeId: employeeId.toUpperCase().trim(),
          department: department,
        });

        if (!user) {
          console.log("❌ No user found:", employeeId, "in", department);
          return done(null, false, {
            message: "Invalid Employee ID or Department",
          });
        }

        console.log("✅ User found:", {
          id: user._id,
          name: user.name,
          employeeId: user.employeeId,
          department: user.department,
        });

        if (user.status === "pending") {
          return done(null, false, {
            message: "Your account is pending approval.",
          });
        }

        if (user.status === "disabled") {
          return done(null, false, {
            message: "Your account has been disabled.",
          });
        }

        // Verify password
        user.authenticate(password, (err, result, passwordError) => {
          if (err) {
            console.error("❌ Authentication error:", err);
            return done(err);
          }

          // If password is wrong, result will be false
          if (passwordError || !result) {
            console.log(
              "❌ Invalid password for:",
              user.employeeId,
              "in",
              user.department
            );
            return done(null, false, { message: "Invalid password" });
          }

          // ✅ IMPORTANT:  Return `user` (our found user), NOT `result`
          // The `result` from authenticate() might be a different user!
          console.log(
            "✅ Password verified for:",
            user.employeeId,
            "in",
            user.department
          );
          return done(null, user);
        });
      } catch (error) {
        console.error("❌ Passport strategy error:", error);
        return done(error);
      }
    }
  )
);
// ========================================
// Serialize/Deserialize Users
// ========================================
passport.serializeUser((user, done) => {
  const userType = user.employeeId ? "departmental" : "engineer";
  console.log("🔐 Serializing user:", {
    id: user._id,
    type: userType,
    name: user.name,
    department: user.department,
    employeeId: user.employeeId,
  });
  done(null, { id: user._id, type: userType });
});

passport.deserializeUser(async (data, done) => {
  try {
    console.log("🔓 Attempting to deserialize:", data);

    let user;
    if (data.type === "engineer") {
      user = await Engineer.findById(data.id);
    } else if (data.type === "departmental") {
      user = await DepartmentalUser.findById(data.id);
    } else {
      console.error("❌ Unknown user type:", data.type);
      return done(null, false);
    }

    if (!user) {
      console.error("❌ User not found in database for ID:", data.id);
      return done(null, false);
    }

    console.log("✅ User deserialized successfully:", {
      id: user._id,
      name: user.name,
      role: user.role,
      department: user.department,
      type: data.type,
    });

    done(null, user);
  } catch (err) {
    console.error("❌ Deserialization error:", err);
    done(err, null);
  }
});

module.exports = passport;
// Health Check Route
app.get("/", (req, res) => {
  res.json({
    message: "Server is running 🚀",
    timestamp: new Date().toISOString(),
  });
});

// CORS Test Route
app.get("/test-cors", (req, res) => {
  res.json({
    message: "CORS is working!",
    origin: req.headers.origin,
    cookies: req.cookies,
    sessionID: req.sessionID,
  });
});

// ========================================
// ✅ Enhanced Debug Middleware
// ========================================
app.use((req, res, next) => {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🌐 Request:", req.method, req.path);
  console.log("📝 Session ID:", req.sessionID);
  console.log("✅ Authenticated:", req.isAuthenticated?.());
  console.log(
    "👤 User:",
    req.user
      ? {
          id: req.user._id,
          name: req.user.name,
          role: req.user.role,
          email: req.user.email,
          employeeId: req.user.employeeId,
        }
      : "None"
  );
  console.log("🔍 Cookie Header:", req.headers.cookie);
  console.log("🍪 Parsed Cookies:", req.cookies);
  console.log("📦 Session Data:", {
    passport: req.session.passport,
    cookie: req.session.cookie,
  });
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
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
  console.error("❌ Error:", err);
  res.status(500).json({
    error: "Something went wrong! ",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Start Server (only for local development)
const PORT = process.env.PORT || 8000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(
      `🔐 Session Secret: ${
        process.env.SESSION_SECRET ? "Set ✅" : "NOT SET ❌"
      }`
    );
    console.log(
      `💾 MongoDB: ${
        process.env.MONGO_URL ? "Configured ✅" : "NOT CONFIGURED ❌"
      }`
    );
  });
}

// Export for Vercel
module.exports = app;
