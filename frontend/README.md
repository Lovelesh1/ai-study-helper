🚀 AI Study Helper

A full-stack MERN web application that allows users to upload study notes (PDFs) and instantly generate AI-powered summaries and quizzes for better learning.

---

🌐 Live Demo

- 🔗 Frontend: https://ai-study-helper-chl.vercel.app
- 🔗 Backend: https://ai-study-helper-backend.onrender.com

---

✨ Features

- 📄 Upload PDF study notes
- 🤖 AI-generated summary
- 🧠 AI-generated quiz
- 📝 Rename notes
- 🗑️ Delete notes
- 🔐 Authentication (Login / Signup)
- ⚡ Fast and responsive UI
- 📱 Mobile-friendly design

---

🛠️ Tech Stack

Frontend

- React.js
- Tailwind CSS
- Axios
- React Router
- React Toastify

Backend

- Node.js
- Express.js
- MongoDB (Mongoose)
- Multer (file upload)
- JWT Authentication

Deployment

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

📂 Project Structure

ai-study-helper/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── uploads/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│
└── README.md

---

⚙️ Installation (Local Setup)

1️⃣ Clone repository

git clone https://github.com/your-username/ai-study-helper.git
cd ai-study-helper

---

2️⃣ Backend Setup

cd backend
npm install

Create ".env" file:

PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret

Run backend:

npm run dev

---

3️⃣ Frontend Setup

cd frontend
npm install
npm run dev

---

🔐 Authentication Flow

- User signs up / logs in
- JWT token is generated
- Token is stored in localStorage
- Protected routes use middleware to verify user

---

📄 File Upload Flow

- User uploads PDF
- File stored using Multer
- Path saved in MongoDB
- File served via "/uploads" route

---

🤖 AI Features

- Summary generation from uploaded PDF
- Quiz generation for better revision
- Improves learning efficiency

---

🚧 Challenges Faced

- CORS issues during deployment
- File storage issue on Render (non-persistent storage)
- Handling async errors in AI processing
- UI responsiveness across devices

---

🧠 Learnings

- Full-stack project architecture
- API integration and error handling
- Deployment (Vercel + Render)
- Clean UI/UX design
- Debugging real-world issues

---


👨‍💻 Author

- Lovelesh Mehta

---

⭐ If you like this project, give it a star!