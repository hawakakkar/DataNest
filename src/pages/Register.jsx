import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCpu } from "react-icons/fi";

import { supabase } from "../Services/supabase";
import { useTheme } from "../context/ThemeContext";

export default function Register() {
  const navigate = useNavigate();

  const { darkMode } = useTheme();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Account created successfully. Please login.");

    navigate("/login");
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
        {/* =========================
            LOGO
        ========================== */}
        <div className="text-center">
          <div className="mx-auto w-20 h-20 rounded-3xl bg-[#4A3021] flex items-center justify-center text-white">
            <FiCpu size={36} />
          </div>

          <h1
            className={`mt-6 text-4xl font-bold ${
              darkMode ? "text-white" : "text-[#2F2A27]"
            }`}
          >
            Create Account
          </h1>

          <p
            className={`mt-3 ${darkMode ? "text-gray-400" : "text-[#72685F]"}`}
          >
            Join DataNest AI
          </p>
        </div>

        {/* =========================
            FORM
        ========================== */}
        <form onSubmit={handleRegister} className="mt-10 space-y-6">
          {/* FULL NAME */}
          <div>
            <label
              className={`font-medium ${
                darkMode ? "text-gray-200" : "text-[#2F2A27]"
              }`}
            >
              Full Name
            </label>

            <div className="relative mt-2">
              <FiUser
                className={`absolute left-4 top-4 ${
                  darkMode ? "text-[#D8A778]" : "text-[#4A3021]"
                }`}
              />

              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                className={`w-full rounded-2xl border pl-12 pr-4 py-4 outline-none transition-colors duration-300 ${
                  darkMode
                    ? "border-[#493326] bg-[#30241C] text-white placeholder-[#9E8D80] focus:border-[#A87954] focus:ring-2 focus:ring-[#A87954]/30"
                    : "border-[#D9CEC1] bg-white text-[#2F2A27] placeholder-[#A99D92] focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#8B5E3C]/20"
                }`}
              />
            </div>
          </div>

          {/* EMAIL */}
          <div>
            <label
              className={`font-medium ${
                darkMode ? "text-gray-200" : "text-[#2F2A27]"
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
                placeholder="Email"
                className={`w-full rounded-2xl border pl-12 pr-4 py-4 outline-none transition-colors duration-300 ${
                  darkMode
                    ? "border-[#493326] bg-[#30241C] text-white placeholder-[#9E8D80] focus:border-[#A87954] focus:ring-2 focus:ring-[#A87954]/30"
                    : "border-[#D9CEC1] bg-white text-[#2F2A27] placeholder-[#A99D92] focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#8B5E3C]/20"
                }`}
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label
              className={`font-medium ${
                darkMode ? "text-gray-200" : "text-[#2F2A27]"
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
                placeholder="Password"
                className={`w-full rounded-2xl border pl-12 pr-12 py-4 outline-none transition-colors duration-300 ${
                  darkMode
                    ? "border-[#493326] bg-[#30241C] text-white placeholder-[#9E8D80] focus:border-[#A87954] focus:ring-2 focus:ring-[#A87954]/30"
                    : "border-[#D9CEC1] bg-white text-[#2F2A27] placeholder-[#A99D92] focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#8B5E3C]/20"
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

          {/* REGISTER BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#4A3021] py-4 text-white font-semibold hover:bg-[#70492C] transition"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        {/* =========================
            LOGIN LINK
        ========================== */}
        <div className="mt-8 text-center">
          <p className={darkMode ? "text-gray-300" : "text-[#2F2A27]"}>
            Already have an account?
            <Link
              to="/login"
              className={`ml-2 font-semibold hover:underline ${
                darkMode ? "text-[#D8A778]" : "text-[#4A3021]"
              }`}
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
