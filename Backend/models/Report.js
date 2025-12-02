// ============================================
// FILE: models/Reports.js
// ============================================

const mongoose = require("mongoose");

// ==========================
// Subschema: Remarks
// ==========================
const remarkSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true, // Name or ID of the user adding the remark
  },
  text: {
    type: String,
    required: true, // The actual remark text
  },
  timestamp: {
    type: String,
    required: true, // When the remark was added
  },
});

// ==========================
// Main Schema: Reports
// ==========================
const reportSchema = new mongoose.Schema(
  {
    serialNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    apparatus: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    recommendation: {
      type: String,
      trim: true,
      default: "",
    },
    operationAction: {
      type: String,
      trim: true,
      default: "",
    },
    departmentAction: {
      type: String,
      trim: true,
      default: "",
    },
    notifiedBy: {
      type: String,
      required: true,
      trim: true,
    },
    referTo: {
      type: String,
      required: true,
      enum: [
        "EME (P)",
        "EME (SY)",
        " P&IE",
        "MME (P)",
        "OE",
        "MME (A)",
        "XEN (EW)",
        "XEN (BARAL)",
        "SOS",
        "ITRE",
        "Admin",
      ],
      default: "EME (P)",
    },
    means: {
      type: String,
      required: true,
      enum: ["Telephone", "Email", "Radio", "In Person"],
      default: "Telephone",
    },
    status: {
      type: String,
      required: true,
      enum: ["Pending", "Under Review", "Needs Revision", "Closed", "Rejected"],
      default: "Pending",
    },
    currentStage: {
      type: String,
      required: true,
      enum: ["Department", "OE Department", "Resident Engineer", "Completed"],
      default: "Department",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // ==============================
    // Embedded Remarks Array
    // ==============================
    remarks: [remarkSchema],

    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },
    estimatedCompletionDate: {
      type: String,
    },
    actualCompletionDate: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// ==========================
// Export Model
// ==========================
module.exports = mongoose.model("Report", reportSchema);
