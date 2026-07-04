const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema(
  {
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