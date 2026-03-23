const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    summary: {
  type: String,
  default: "",
},
quiz: {
  type: Array,
  default: [],
},

  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);