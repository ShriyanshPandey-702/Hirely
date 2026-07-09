const mongoose = require("mongoose");

// A mirror of the Clerk user, kept in sync via Clerk webhooks.
// Clerk remains the source of truth for authentication.
const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
