const axios = require("axios");
const Submission = require("../models/Submission");
const User = require("../models/User");
const SavedCode = require("../models/SavedCode");

exports.runCode = async (req, res, next) => {
  try {
    const { code, language_id } = req.body;

    const response = await axios.post(
      process.env.JUDGE0_URL,
      {
        source_code: code,
        language_id,
      },
      {
        headers: {
          "X-RapidAPI-Key": process.env.JUDGE0_KEY,
          "Content-Type": "application/json",
        },
      },
    );

    const output =
      response.data.stdout ||
      response.data.stderr ||
      response.data.compile_output ||
      "No Output";

    // Just send output, do NOT create submission
    res.json({
      output,
      linesOfCode: code.split("\n").length,
    });
  } catch (err) {
    next(err);
  }
};

exports.submitCode = async (req, res) => {
  try {
    const { userId, code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({ message: "Code and language required" });
    }

    // Count non-empty lines
    const linesOfCode = code
      .split("\n")
      .filter((line) => line.trim() !== "").length;

    const submission = new Submission({
      user: userId,
      code,
      language,
      linesOfCode,
    });

    await submission.save();
    // 🔥 GET USER
    const user = await User.findById(userId);

    // 🔥 ADD 5 POINTS
    user.points += 5;

    // 🔥 STREAK LOGIC
    const now = new Date();

    const today = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    );

    const yesterday = new Date(today);
    yesterday.setUTCDate(today.getUTCDate() - 1);

    if (!user.lastActiveDate) {
      user.currentStreak = 1;
    } else {
      const lastDate = new Date(user.lastActiveDate);

      const lastActive = new Date(
        Date.UTC(
          lastDate.getUTCFullYear(),
          lastDate.getUTCMonth(),
          lastDate.getUTCDate(),
        ),
      );

      if (lastActive.getTime() !== today.getTime()) {
        if (lastActive.getTime() === yesterday.getTime()) {
          user.currentStreak += 1;
        } else {
          user.currentStreak = 1;
        }
      }
    }

    if (user.currentStreak > user.longestStreak) {
      user.longestStreak = user.currentStreak;
    }

    user.lastActiveDate = today;

    await user.save();

    res.status(201).json({
      message: "Code submitted successfully",
      submission,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      points: user.points,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Submission failed" });
  }
};

exports.saveCode = async (req, res) => {
  try {
    const { code, language, title } = req.body;

    if (!title || !code) {
      return res.status(400).json({
        message: "Title and code required",
      });
    }
    const existing = await SavedCode.findOne({
      user: req.user._id,
      title,
    });

    if (existing) {
      return res.status(400).json({
        message: "You already have a saved code with this title",
      });
    }

    // 🚀 Prevent duplicate within 5 seconds
    const recentSave = await SavedCode.findOne({
      user: req.user._id,
      title,
      createdAt: { $gte: new Date(Date.now() - 5000) },
    });

    if (recentSave) {
      return res.status(429).json({
        message: "Duplicate save detected",
      });
    }

    const saved = await SavedCode.create({
      user: req.user._id,
      code,
      language,
      title,
    });

    return res.status(201).json(saved);
  } catch (error) {
    return res.status(500).json({
      message: "Save failed",
    });
  }
};

exports.getAllSavedCodes = async (req, res) => {
  try {
    const savedCodes = await SavedCode.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      count: savedCodes.length,
      savedCodes, // 👈 MUST match frontend
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch saved codes",
    });
  }
};

exports.getSavedCode = async (req, res) => {
  try {
    const savedCode = await SavedCode.findOne({
      user: req.user._id, // 🔥 ensures ownership
    });

    if (!savedCode) {
      return res.status(404).json({
        message: "Saved code not found",
      });
    }

    return res.status(200).json(savedCode);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch saved code",
    });
  }
};

exports.updateSavedCode = async (req, res) => {
  try {
    const { code, language, title } = req.body;

    if (!code || !language || !title) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const updated = await SavedCode.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id, // 🔥 prevents editing others' code
      },
      {
        code,
        language,
        title,
      },
      { returnDocument: "after" },
    );

    if (!updated) {
      return res.status(404).json({
        message: "Saved code not found",
      });
    }

    return res.status(200).json({
      message: "Saved code updated successfully",
      updated,
    });
  } catch (error) {
    // 🔥 Handle duplicate title error
    if (error.code === 11000) {
      return res.status(400).json({
        message: "You already have a saved code with this title",
      });
    }

    return res.status(500).json({
      message: "Update failed",
    });
  }
};
exports.getInsights = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const insights = await Submission.aggregate([
      {
        $match: { user: userId },
      },
      {
        $group: {
          _id: "$language",
          totalSubmissions: { $sum: 1 },
          totalLines: { $sum: { $ifNull: ["$linesOfCode", 0] } },
          totalTime: { $sum: { $ifNull: ["$timeTaken", 0] } },
        },
      },
    ]);

    // Default values
    let totalSubmissions = 0;
    let totalLines = 0;
    let totalTime = 0;
    const languageStats = {};

    insights.forEach((item) => {
      totalSubmissions += item.totalSubmissions;
      totalLines += item.totalLines;
      totalTime += item.totalTime;

      if (item._id) {
        languageStats[item._id] = item.totalSubmissions;
      }
    });

    // Compute most used language
    const mostUsedLanguage =
      Object.keys(languageStats).length > 0
        ? Object.entries(languageStats).sort((a, b) => b[1] - a[1])[0][0]
        : null;

    res.json({
      totalSubmissions,
      totalLines,
      totalTime,
      averageTime:
        totalSubmissions > 0 ? Math.round(totalTime / totalSubmissions) : 0,
      mostUsedLanguage,
      languageStats,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllSubmissions = async (req, res, next) => {
  try {
    const submissions = await Submission.find()
      .populate("user", "name email avatar")
      .sort({ createdAt: -1 });

    res.json({
      count: submissions.length,
      submissions,
    });
  } catch (err) {
    next(err);
  }
};
exports.deleteSubmission = async (req, res, next) => {
  try {
    const { id } = req.params;

    const submission = await Submission.findById(id);

    if (!submission) {
      return res.status(404).json({
        message: "Submission not found",
      });
    }

    // Only owner can delete
    if (submission.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await submission.deleteOne();

    res.json({
      message: "Submission deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteSavedCode = async (req, res, next) => {
  try {
    const { id } = req.params;

    const saved = await SavedCode.findById(id);

    if (!saved) {
      return res.status(404).json({
        message: "Saved code not found",
      });
    }

    if (saved.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await saved.deleteOne();

    res.json({
      message: "Saved code deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
