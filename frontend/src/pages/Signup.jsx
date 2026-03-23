import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", form);

      toast.success(res.data.message || "Signup successful. Please login.");

      setForm({
        name: "",
        email: "",
        password: "",
      });

      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <form
        className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl p-8 rounded-2xl w-full max-w-md text-white"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl font-bold text-center mb-6">
          Create Account
        </h1>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="w-full p-3 mb-4 rounded-lg bg-white/20 border border-white/30 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={handleChange}
          value={form.name}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded-lg bg-white/20 border border-white/30 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={handleChange}
          value={form.email}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded-lg bg-white/20 border border-white/30 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={handleChange}
          value={form.password}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 p-3 rounded-lg font-semibold"
        >
          Signup
        </button>

        <p className="text-center mt-4 text-gray-300">
          Already have an account?{" "}
          <Link to="/" className="text-blue-400 font-semibold">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;