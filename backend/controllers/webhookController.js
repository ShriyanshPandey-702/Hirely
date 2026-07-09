const { Webhook } = require("svix");
const User = require("../models/User");
const Analysis = require("../models/Analysis");

// Handles Clerk webhook events (user.created / user.updated / user.deleted)
// and keeps the MongoDB `users` collection in sync with Clerk.
const clerkWebhook = async (req, res) => {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    console.error("CLERK_WEBHOOK_SECRET is not set");
    return res.status(500).json({ message: "Webhook not configured" });
  }

  // Verify the payload came from Clerk (req.body must be the RAW buffer)
  let evt;
  try {
    const wh = new Webhook(secret);
    evt = wh.verify(req.body, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });
  } catch (err) {
    console.error("Clerk webhook signature verification failed:", err.message);
    return res.status(400).json({ message: "Invalid signature" });
  }

  const { type, data } = evt;

  try {
    if (type === "user.created" || type === "user.updated") {
      const primary =
        data.email_addresses?.find((e) => e.id === data.primary_email_address_id) ||
        data.email_addresses?.[0];

      await User.findOneAndUpdate(
        { clerkId: data.id },
        {
          clerkId: data.id,
          email: primary?.email_address || "",
          name: [data.first_name, data.last_name].filter(Boolean).join(" ").trim(),
          imageUrl: data.image_url || "",
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log(`Clerk webhook: synced user ${data.id} (${type})`);
    } else if (type === "user.deleted") {
      await User.deleteOne({ clerkId: data.id });
      await Analysis.deleteMany({ user: data.id });
      console.log(`Clerk webhook: removed user ${data.id} and their analyses`);
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("Clerk webhook handling error:", err.message);
    return res.status(500).json({ message: "Webhook handling failed" });
  }
};

module.exports = { clerkWebhook };
