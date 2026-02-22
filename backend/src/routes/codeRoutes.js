const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");

const {
  runCode,
  getInsights,
  submitCode,
  saveCode,
  getSavedCode,
  updateSavedCode,
  getAllSavedCodes,
  getAllSubmissions,
  deleteSubmission,
  deleteSavedCode,
} = require("../controllers/codeController");

router.post("/run", protect, runCode);
router.get("/insights", protect, getInsights);

router.post("/submit", protect, submitCode);
router.post("/save", protect, saveCode);
router.get("/saved/:id", protect, getSavedCode);
router.get("/saved", protect, getAllSavedCodes);
router.put("/saved/:id", protect, updateSavedCode);
router.get("/submissions", protect, getAllSubmissions);
router.delete("/submission/:id", protect, deleteSubmission);

// Delete saved code
router.delete("/saved/:id", protect, deleteSavedCode);

module.exports = router;
