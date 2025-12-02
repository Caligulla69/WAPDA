const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const departmentalUserSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true, // IDs are usually uppercase
    },
    name: {
      type: String,
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
      enum: ["EME (P)", "EME (SY)", "P&IE", "MME (P)", "OE", "MME (A)", "XEN (EW)", "XEN (BARAL)", "SOS", "ITRE", "Admin"],
    },
    role: {
      type: String,
      required: true,
      enum: ["department", "admin"],
      default: "department",
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

// ✅ Uses EMPLOYEE ID as username
departmentalUserSchema.plugin(passportLocalMongoose, {
  usernameField: "employeeId",
});

module.exports = mongoose. model("DepartmentalUser", departmentalUserSchema);