import mongoose from "mongoose";

const ThreatSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  source: {
    type: String,
    enum: ["PhishTank", "OpenPhish", "URLhaus", "Manual"],
    required: true,
  },
  riskLevel: {
    type: String,
    default: "High",
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "7d", // Auto-delete old entries after 7 days to keep DB light
  },
});

export const Threat = mongoose.model("Threat", ThreatSchema);
