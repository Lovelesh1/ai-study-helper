const fs = require("fs");
const Note = require("../models/Note");

exports.uploadNote = async (req, res) => {
  try {
    console.log("HEADERS:", req.headers['content-type']);
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    if (!req.body.title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const note = await Note.create({
      user: req.user.id,
      title: req.body.title,
      fileUrl: req.file.path,
    });

    res.status(201).json({
      message: "Note uploaded successfully",
      note,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });

    const updatedNotes = notes.map((note) => ({
      _id: note._id,
      user: note.user,
      title: note.title,
      fileUrl: `http://localhost:5000/uploads/${note.fileUrl.split("uploads\\")[1].replace(/\\/g, "/")}`,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    }));

    res.json(updatedNotes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.fileUrl && fs.existsSync(note.fileUrl)) {
      fs.unlinkSync(note.fileUrl);
    }

    await Note.findByIdAndDelete(note._id);

    res.json({ message: "Note and file deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.updateNoteTitle = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    const note = await Note.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      {
        title: title.trim(),
      },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Note title updated successfully", note });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getSingleNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({
      _id: note._id,
      user: note.user,
      title: note.title,
      fileUrl: `http://localhost:5000/uploads/${note.fileUrl.split("uploads\\")[1].replace(/\\/g, "/")}`,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};