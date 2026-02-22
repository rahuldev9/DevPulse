const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        let user = await User.findOne({ email });

        done(null, {
          email,
          name: profile.displayName,
          avatar: profile.photos?.[0]?.value,
          existingUser: user,
        });
      } catch (error) {
        done(error, null);
      }
    },
  ),
);

module.exports = passport;
