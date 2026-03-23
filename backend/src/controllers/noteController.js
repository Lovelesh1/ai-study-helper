const Note = require("../models/Note");
const fs = require("fs");

exports.uploadNote = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
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

    const updatedNotes = notes.map((note) => {
      let fileUrl = "";

      if (note.fileUrl) {
        const normalizedPath = note.fileUrl.replace(/\\/g, "/");
        const fileName = normalizedPath.split("/uploads/")[1] || normalizedPath.split("uploads/")[1];
        fileUrl = fileName
          ? `${req.protocol}://${req.get("host")}/uploads/${fileName}`
          : "";
      }

      return {
        _id: note._id,
        user: note.user,
        title: note.title,
        fileUrl,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      };
    });

    res.json(updatedNotes);
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

    let fileUrl = "";

    if (note.fileUrl) {
      const normalizedPath = note.fileUrl.replace(/\\/g, "/");
      const fileName = normalizedPath.split("/uploads/")[1] || normalizedPath.split("uploads/")[1];
      fileUrl = fileName
        ? `${req.protocol}://${req.get("host")}/uploads/${fileName}`
        : "";
    }

    res.json({
      _id: note._id,
      user: note.user,
      title: note.title,
      fileUrl,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    });
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
      { _id: req.params.id, user: req.user.id },
      { title: title.trim() },
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