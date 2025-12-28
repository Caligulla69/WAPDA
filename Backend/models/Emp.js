const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const departmentalUserSchema = new mongoose.Schema(
  {
    employeeId:  {
      type:  String,
      required: true,
      trim: true,
      uppercase: true,
    },
    name:  {
      type:  String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      enum: [
        "EME (P)",
        "EME (SY)",
        "P&IE",
        "MME (P)",
        "OE",
        "MME (A)",
        "XEN (EW)",
        "XEN (BARAL)",
        "SOS",
        "ITRE",
        "Admin",
      ],
    },
    role: {
      type: String,
      required: true,
      enum:  ["department", "admin", "Department"],
      default: "department",
    },
    status: {
      type: String,
      enum: ["active", "disabled", "pending"],
      default: "pending",
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index - allows same employeeId in different departments
departmentalUserSchema.index({ employeeId:  1, department:  1 }, { unique: true });

// IMPORTANT: usernameUnique:  false disables passport's built-in uniqueness check
departmentalUserSchema.plugin(passportLocalMongoose, {
  usernameField: "employeeId",
  usernameUnique: false, // ✅ CRITICAL - we handle uniqueness with compound index
});

module.exports = mongoose.model("DepartmentalUser", departmentalUserSchema);