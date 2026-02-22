const mongoose = require("mongoose");

const savedCodeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    code: {
      type: String,
      required: true,
    },

    language: {
      type: String,
      required: true,
      enum: ["python", "javascript", "cpp", "java"],
    },
  },
  {
    timestamps: true,
  },
);

// 🔥 Prevent duplicate title per user
savedCodeSchema.index({ user: 1, title: 1 }, { unique: true });

module.exports = mongoose.model("SavedCode", savedCodeSchema);
