const express = require("express");
const router = express.Router();
const { clerkWebhook } = require("../controllers/webhookController");

// POST /api/webhooks/clerk  (raw body is applied when mounting this router)
router.post("/clerk", clerkWebhook);

module.exports = router;
