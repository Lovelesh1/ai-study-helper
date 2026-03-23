import axios from "axios";

const api = axios.create({
  baseURL: "https://ai-study-helper-backend.onrender.com/api",
});

export default api;