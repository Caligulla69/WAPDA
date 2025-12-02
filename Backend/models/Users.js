// ============================================
// FILE: models/Users.js
// ============================================
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      enum: ["EME (P)", "EME (SY)", " P&IE", "MME (P)", "OE", "MME (A)", "XEN (EW)", "XEN (BARAL)", "SOS", "ITRE", "Admin"],
      default: "EME (P)",
    },
    role: {
      type: String,
      required: true,
      enum: ["shift_engineer", "oe", "resident_engineer", "admin"],
      default: "shift_engineer",
    },
    status: {
      type: String,
      enum: ["active", "disabled"],
      default: "active",
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    designation: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add passport-local-mongoose plugin
// This adds username, hash, and salt fields
// username will be set to email by default
userSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
});

module.exports = mongoose.model("User", userSchema);
