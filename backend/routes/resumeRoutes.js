const express = require("express");
const router = express.Router();

const { getResume } = require("../controllers/resumeController");
const upload = require("../middleware/uploadMiddleware");

// Test Route
router.post(
  "/upload",
  upload.single("resume"),
  getResume
);

module.exports = router;