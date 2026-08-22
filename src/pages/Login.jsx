import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff, FiCpu } from "react-icons/fi";

import { supabase } from "../Services/supabase";
import { useTheme } from "../context/ThemeContext";

export default function Login() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    navigate("/dashboard");
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-6 transition-colors duration-300 ${
        darkMode ? "bg-[#121212]" : "bg-[#F8F6F2]"
      }`}
    >
      <div
        className={`w-full max-w-md rounded-[32px] shadow-2xl p-10 transition-colors duration-300 ${
          darkMode ? "bg-[#1E1E1E]" : "bg-white"
        }`}
      >
        {/* Logo */}
        <div className="text-center">
          <div className="mx-auto w-20 h-20 rounded-3xl bg-[#4A3021] flex items-center justify-center text-white">
            <FiCpu size={36} />
          </div>

          <h1
            className={`mt-6 text-4xl font-bold ${
              darkMode ? "text-white" : "text-[#2F2A27]"
            }`}
          >
            DataNest AI
          </h1>

          <p
            className={`mt-3 ${darkMode ? "text-gray-400" : "text-[#72685F]"}`}
          >
            Sign in to your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="mt-10 space-y-6">
          {/* Email */}
          <div>
            <label
              className={`font-medium ${
                darkMode ? "text-white" : "text-[#2F2A27]"
              }`}
            >
              Email
            </label>

            <div className="relative mt-2">
              <FiMail
                className={`absolute left-4 top-4 ${
                  darkMode ? "text-[#D8A778]" : "text-[#4A3021]"
                }`}
              />

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={`w-full rounded-2xl border pl-12 pr-4 py-4 outline-none transition-colors duration-300 focus:ring-2 focus:ring-[#8B5E3C] ${
                  darkMode
                    ? "border-[#493326] bg-[#30241C] text-white placeholder-gray-500"
                    : "border-[#D9CEC1] bg-white text-[#2F2A27] placeholder-[#A99D92]"
                }`}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              className={`font-medium ${
                darkMode ? "text-white" : "text-[#2F2A27]"
              }`}
            >
              Password
            </label>

            <div className="relative mt-2">
              <FiLock
                className={`absolute left-4 top-4 ${
                  darkMode ? "text-[#D8A778]" : "text-[#4A3021]"
                }`}
              />

              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={`w-full rounded-2xl border pl-12 pr-12 py-4 outline-none transition-colors duration-300 focus:ring-2 focus:ring-[#8B5E3C] ${
                  darkMode
                    ? "border-[#493326] bg-[#30241C] text-white placeholder-gray-500"
                    : "border-[#D9CEC1] bg-white text-[#2F2A27] placeholder-[#A99D92]"
                }`}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-4 top-4 ${
                  darkMode ? "text-[#D8A778]" : "text-[#8B5E3C]"
                }`}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#4A3021] py-4 text-white font-semibold hover:bg-[#70492C] transition"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Links */}
        <div className="mt-8 text-center">
          <Link
            to="/forgot-password"
            className={`hover:underline ${
              darkMode ? "text-[#D8A778]" : "text-[#4A3021]"
            }`}
          >
            Forgot Password?
          </Link>

          <p
            className={`mt-6 ${darkMode ? "text-gray-300" : "text-[#2F2A27]"}`}
          >
            Don't have an account?
            <Link
              to="/register"
              className={`ml-2 font-semibold hover:underline ${
                darkMode ? "text-[#D8A778]" : "text-[#4A3021]"
              }`}
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
