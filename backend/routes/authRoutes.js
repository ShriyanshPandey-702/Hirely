const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const avatarUpload = require("../middleware/avatarUpload");

const router = express.Router();

const {
  register,
  login,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile,
  changePassword,
  uploadAvatar,
  deleteAccount,
} = require("../controllers/authController");

router.post("/register", register);

router.post("/login", login);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

router.get("/me", authMiddleware, getMe);

router.put("/profile", authMiddleware, updateProfile);

router.put("/change-password", authMiddleware, changePassword);

// Wrap multer so file-size / file-type errors return a clear JSON message
const handleAvatarUpload = (req, res, next) => {
  avatarUpload.single("avatar")(req, res, (err) => {
    if (err) {
      const message =
        err.code === "LIMIT_FILE_SIZE"
          ? "Image is too large. Please use an image under 8 MB."
          : err.message || "Could not read the uploaded image.";
      return res.status(400).json({ message });
    }
    next();
  });
};

router.post("/avatar", authMiddleware, handleAvatarUpload, uploadAvatar);

router.delete("/delete-account", authMiddleware, deleteAccount);

module.exports = router;