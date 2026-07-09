const express = require("express");
const router = express.Router();

const {
  getResume,
  getHistory,
  deleteHistoryItem,
  clearHistory,
} = require("../controllers/resumeController");
const upload = require("../middleware/uploadMiddleware");
const requireUser = require("../middleware/requireUser");

// requireUser rejects requests without a valid Clerk session (401 JSON)
// Analyze a resume against a job description (saved to the user's history)
router.post(
  "/upload",
  requireUser,
  upload.single("resume"),
  getResume
);

// History
router.get("/history", requireUser, getHistory);
router.delete("/history/:id", requireUser, deleteHistoryItem);
router.delete("/history", requireUser, clearHistory);

module.exports = router;