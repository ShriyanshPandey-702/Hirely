const express = require("express");
const router = express.Router();

const { getResume } = require("../controllers/resumeController");

// Test Route
router.get("/", getResume);

module.exports = router;