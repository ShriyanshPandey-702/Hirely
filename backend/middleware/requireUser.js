const { getAuth } = require("@clerk/express");

// API-friendly auth guard: returns 401 JSON instead of redirecting.
// Relies on clerkMiddleware() (mounted in server.js) having populated req.auth.
const requireUser = (req, res, next) => {
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
};

module.exports = requireUser;
