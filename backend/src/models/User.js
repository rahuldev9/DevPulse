const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, unique: true, required: true },

    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    password: {
      type: String,
      required: function () {
        return this.provider === "local";
      },
    },

    avatar: {
      type: String,
      default: "",
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
    currentStreak: { type: Number, default: 0 },

    lastActiveDate: { type: Date },
    points: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
