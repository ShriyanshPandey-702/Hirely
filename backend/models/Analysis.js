const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema(
  {
    // Clerk user id (e.g. "user_2ab...")
    user: {
      type: String,
      required: true,
      index: true,
    },

    jobTitle: {
      type: String,
      default: "Custom Job Description",
    },

    jobDescription: {
      type: String,
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    matchScore: {
      type: Number,
      required: true,
    },

    recommendation: {
      type: String,
      required: true,
    },

    analysis: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Analysis", analysisSchema);