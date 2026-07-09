const { v2: cloudinary } = require("cloudinary");

// Trim in case values were pasted with stray whitespace/newlines (common on hosts)
const cloud_name = (process.env.CLOUDINARY_CLOUD_NAME || "").trim();
const api_key = (process.env.CLOUDINARY_API_KEY || "").trim();
const api_secret = (process.env.CLOUDINARY_API_SECRET || "").trim();

if (process.env.CLOUDINARY_URL) {
  // cloudinary reads CLOUDINARY_URL automatically; just enable https
  cloudinary.config({ secure: true });
} else {
  cloudinary.config({ cloud_name, api_key, api_secret, secure: true });
}

// Handy flag + warning so a misconfigured host is obvious in the logs
cloudinary.isConfigured = Boolean(cloudinary.config().api_key && cloudinary.config().cloud_name);

if (!cloudinary.isConfigured) {
  console.warn(
    "⚠️  Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and " +
      "CLOUDINARY_API_SECRET (or CLOUDINARY_URL) in your environment — profile photo uploads will fail until then."
  );
}

module.exports = cloudinary;
