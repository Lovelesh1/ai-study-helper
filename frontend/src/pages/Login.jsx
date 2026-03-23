import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (err) {
  toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      
      {/* Glass Card */}
      <form
        onSubmit={handleSubmit}
        className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl p-8 rounded-2xl w-full max-w-md text-white"
      >
        <h1 className="text-3xl font-bold text-center mb-6">
          AI Study Helper
        </h1>

        <p className="text-center text-gray-300 mb-6">
          Login to your account
        </p>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded-lg bg-white/20 border border-white/30 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded-lg bg-white/20 border border-white/30 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
          onChange={handleChange}
        />

        <button className="w-full bg-purple-500 hover:bg-purple-600 transition p-3 rounded-lg font-semibold">
          Login
        </button>

        <p className="text-center mt-4 text-gray-300">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-purple-400 font-semibold">
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;