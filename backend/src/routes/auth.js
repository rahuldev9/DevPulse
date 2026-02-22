const express = require("express");
const passport = require("passport");
const authController = require("../controllers/authController");

const router = express.Router();

/* STEP 1: Redirect to Google */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

/* STEP 2: Google Callback */
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  authController.googleLogin,
);

module.exports = router;
