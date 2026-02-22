const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    code: {
      type: String,
      required: true,
      trim: true,
    },

    language: {
      type: String,
      required: true,
      enum: ["python", "javascript", "cpp", "java"],
    },

    status: {
      type: String,
      enum: ["success", "error"],
      default: "success",
    },

    output: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Submission", submissionSchema);
