const fs = require("fs");
const pdf = require("pdf-parse");
const Groq = require("groq-sdk");
const Note = require("../models/Note");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

function extractJsonArray(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\[[\s\S]*\]/);
    if (!match) return null;
    return JSON.parse(match[0]);
  }
}

exports.generateSummary = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.summary && note.summary.trim()) {
      return res.json({ summary: note.summary });
    }

    if (!fs.existsSync(note.fileUrl)) {
      return res.status(404).json({ message: "Uploaded file not found on server" });
    }

    const dataBuffer = fs.readFileSync(note.fileUrl);
    const pdfData = await pdf(dataBuffer);

    const extractedText = (pdfData.text || "").trim();

    if (!extractedText) {
      return res.status(400).json({ message: "No readable text found in PDF" });
    }

    const limitedText = extractedText.slice(0, 12000);

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content:
            "You are a helpful study assistant. Summarize notes in simple English using short bullet points.",
        },
        {
          role: "user",
          content: `Create a short study summary from these notes.
Rules:
- simple language
- max 10 bullet points
- short output
- plain text only

Notes:
${limitedText}`,
        },
      ],
    });

    const summary =
      completion.choices?.[0]?.message?.content || "Summary not generated.";

    note.summary = summary;
    await note.save();

    res.json({ summary: note.summary });
  } catch (error) {
    console.error("Summary error:", error);
    res.status(500).json({
      message: error.message || "Failed to generate summary",
    });
  }
};

exports.generateQuiz = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.quiz && note.quiz.length > 0) {
      return res.json({ quiz: note.quiz });
    }

    if (!fs.existsSync(note.fileUrl)) {
      return res.status(404).json({ message: "Uploaded file not found on server" });
    }

    const dataBuffer = fs.readFileSync(note.fileUrl);
    const pdfData = await pdf(dataBuffer);

    const extractedText = (pdfData.text || "").trim();

    if (!extractedText) {
      return res.status(400).json({ message: "No readable text found in PDF" });
    }

    const limitedText = extractedText.slice(0, 12000);

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: "You generate quiz questions in valid JSON only.",
        },
        {
          role: "user",
          content: `Create exactly 10 MCQ questions from these notes.

Return valid JSON only in this format:
[
  {
    "question": "Question here",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "answer": "Correct option"
  }
]

Rules:
- exactly 10 questions
- exactly 4 options each
- simple student-friendly language
- no markdown
- no extra text

Notes:
${limitedText}`,
        },
      ],
    });

    const rawQuiz = completion.choices?.[0]?.message?.content || "[]";
    const parsedQuiz = extractJsonArray(rawQuiz);

    if (!parsedQuiz) {
      return res.status(500).json({ message: "AI returned invalid quiz format" });
    }

    note.quiz = parsedQuiz;
    await note.save();

    res.json({ quiz: note.quiz });
  } catch (error) {
    console.error("Quiz error:", error);
    res.status(500).json({
      message: error.message || "Failed to generate quiz",
    });
  }
};