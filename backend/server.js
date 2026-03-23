const dns = require("node:dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://ai-study-helper-chl.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/protected", require("./src/routes/protectedRoutes"));
app.use("/api/notes", require("./src/routes/noteRoutes"));
app.use("/api/ai", require("./src/routes/aiRoutes"));

app.get("/", (req, res) => {
  res.json({ message: "AI Study Helper API is running" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});