const router = require("express").Router();
const passport = require("passport");

const {
  register,
  login,
  updateAvatar,
  profile,
  logout,
  googleLogin,
  deleteAccount,
  forgotPassword,
  resetPassword,
  setPassword,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Local Auth
router.post("/register", register);
router.post("/login", login);
router.post("/logout", protect, logout);

// Profile
router.get("/profile", protect, profile);
router.put("/update-avatar", protect, upload.single("avatar"), updateAvatar);

// Google Auth
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleLogin,
);
router.delete("/delete-account", protect, deleteAccount);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);
router.post("/set-password", protect, setPassword);

module.exports = router;
