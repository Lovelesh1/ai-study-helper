const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
    uploadNote,
    getNotes,
    getSingleNote,
    deleteNote,
    updateNoteTitle,
} = require("../controllers/noteController");
router.post("/upload", auth, upload.single("file"), uploadNote);
router.get("/", auth, getNotes);
router.get("/:id", auth, getSingleNote);
router.delete("/:id", auth, deleteNote);
router.put("/:id", auth, updateNoteTitle);
module.exports = router;
