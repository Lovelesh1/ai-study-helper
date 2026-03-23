const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { generateSummary, generateQuiz } = require("../controllers/aiController");

router.get("/summary/:id", auth, generateSummary);
router.get("/quiz/:id", auth, generateQuiz);

module.exports = router;