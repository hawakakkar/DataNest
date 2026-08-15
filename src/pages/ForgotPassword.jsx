import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMail, FiCpu } from "react-icons/fi";
import { supabase } from "../Services/supabase";
import { useTheme } from "../context/ThemeContext";

export default function ForgotPassword() {
  const { darkMode } = useTheme();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReset(e) {
    e.preventDefault();

    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:5173/login",
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Password reset email sent successfully.");
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-6 transition ${
        darkMode ? "bg-[#121212]" : "bg-[#F8F6F2]"
      }`}
    >
      <div
        className={`w-full max-w-md rounded-[32px] shadow-2xl p-10 ${
          darkMode ? "bg-[#1E1E1E]" : "bg-white"
        }`}
      >
        <div className="text-center">
          <div className="mx-auto w-20 h-20 rounded-3xl bg-[#4A3021] flex items-center justify-center text-white">
            <FiCpu size={36} />
          </div>

          <h1
            className={`mt-6 text-4xl font-bold ${
              darkMode ? "text-white" : "text-[#2F2A27]"
            }`}
          >
            Forgot Password
          </h1>

          <p
            className={`mt-4 ${darkMode ? "text-gray-400" : "text-[#72685F]"}`}
          >
            Enter your email and we will send you a password reset link.
          </p>
        </div>

        <form onSubmit={handleReset} className="mt-10 space-y-6">
          <div>
            <label className="font-medium">Email</label>

            <div className="relative mt-2">
              <FiMail className="absolute left-4 top-4 text-[#8B5E3C]" />

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="
                  w-full
                  rounded-2xl
                  border
                  border-[#D9CEC1]
                  pl-12
                  pr-4
                  py-4
                  bg-transparent
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#8B5E3C]
                "
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              rounded-2xl
              bg-[#4A3021]
              py-4
              text-white
              font-semibold
              hover:bg-[#573923]
              transition
            "
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/login" className="text-[#4A3021] hover:underline">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
