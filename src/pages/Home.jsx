import { Link } from "react-router-dom";
import HeroImage from "../assets/images/ai pic.png";
import AboutImage from "../assets/images/about.jpg";
import {
  FiUploadCloud,
  FiSearch,
  FiDatabase,
  FiShield,
  FiArrowRight,
  FiCpu,
  FiMoon,
  FiSun,
} from "react-icons/fi";
import { useState, useEffect } from "react";

export default function Home() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        darkMode ? "bg-[#121212] text-white" : "bg-[#F8F6F2] text-[#2F2A27]"
      }`}
    >
      {/* ================= HEADER ================= */}

      <header
        className={`sticky top-0 z-50 backdrop-blur-md border-b transition-all duration-300 ${
          darkMode
            ? "bg-[#181818]/90 border-[#333]"
            : "bg-[#FFFDF9]/90 border-[#ECE6DE]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center">
          {/* Logo */}

          <div className="flex items-center gap-4 flex-1">
            <div className="w-14 h-14 rounded-2xl bg-[#8B5E3C] text-white flex items-center justify-center shadow-lg">
              <FiCpu size={28} />
            </div>

            <div>
              <h1
                className={`text-3xl font-bold tracking-tight ${
                  darkMode ? "text-white" : "text-[#2F2A27]"
                }`}
              >
                DataNest AI
              </h1>

              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-[#8A7F75]"
                }`}
              >
                Intelligent Enterprise Knowledge Base
              </p>
            </div>
          </div>

          {/* Navigation */}

          <nav
            className={`hidden lg:flex items-center gap-10 text-[15px] flex-1 justify-center ${
              darkMode ? "text-gray-300" : "text-[#2F2A27]"
            }`}
          >
            <a
              href="#features"
              className="hover:text-[#8B5E3C] transition font-medium"
            >
              Features
            </a>

            <a
              href="#workflow"
              className="hover:text-[#8B5E3C] transition font-medium"
            >
              Workflow
            </a>

            <a
              href="#about"
              className="hover:text-[#8B5E3C] transition font-medium"
            >
              About
            </a>

            <a
              href="#contact"
              className="hover:text-[#8B5E3C] transition font-medium"
            >
              Contact
            </a>
          </nav>

          {/* Buttons */}

          <div className="flex items-center gap-5 ml-auto">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition ${
                darkMode
                  ? "bg-[#2B2B2B] hover:bg-[#3A3A3A]"
                  : "bg-[#F8F6F2] hover:bg-[#E5E1DA]"
              }`}
            >
              {darkMode ? (
                <FiSun size={20} className="text-yellow-400" />
              ) : (
                <FiMoon size={20} className="text-[#141413]" />
              )}
            </button>

            <Link
              to="/dashboard"
              className={`w-[125px] h-12 rounded-xl border flex items-center justify-center font-medium transition ${
                darkMode
                  ? "bg-[#242424] border-[#444] text-white hover:bg-[#333]"
                  : "bg-white border-[#D8D0C6] text-[#2F2A27] hover:bg-[#F5F1EB]"
              }`}
            >
              Dashboard
            </Link>

            <Link
              to="/upload"
              className="px-6 py-3 rounded-xl bg-[#8B5E3C] hover:bg-[#70492C] text-white shadow-lg transition font-medium"
            >
              Upload
            </Link>
          </div>
        </div>
      </header>

      {/* ================= HERO ================= */}

      <section className="max-w-7xl mx-auto px-1 py-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left Side */}

          <div>
            <span
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-full font-medium ${
                darkMode
                  ? "bg-[#2B2B2B] text-[#D8A67D]"
                  : "bg-[#EFE7DE] text-[#8B5E3C]"
              }`}
            >
              <FiCpu />
              AI Powered Knowledge Base
            </span>

            <h2 className="mt-8 text-6xl font-bold leading-tight tracking-tight">
              Search Your
              <br />
              <span className="text-[#8B5E3C]">Documents</span>
              <br />
              With Artificial Intelligence
            </h2>

            <p
              className={`mt-8 text-xl leading-9 max-w-xl ${
                darkMode ? "text-gray-300" : "text-[#6E655D]"
              }`}
            >
              Upload PDFs, DOCX and TXT files, build your intelligent company
              knowledge base and receive instant AI-powered answers using
              Retrieval-Augmented Generation (RAG).
            </p>

            <div className="flex gap-5 mt-12">
              <Link
                to="/dashboard"
                className="
            flex
            items-center
            gap-2
            bg-[#8B5E3C]
            hover:bg-[#70492C]
            text-white
            px-8
            py-4
            rounded-2xl
            shadow-lg
            transition
          "
              >
                Open Dashboard
                <FiArrowRight />
              </Link>

              <Link
                to="/upload"
                className={`flex items-center gap-2 border px-8 py-4 rounded-2xl transition ${
                  darkMode
                    ? "bg-[#242424] border-[#444] text-white hover:bg-[#303030]"
                    : "bg-white border-[#D9CEC1] hover:bg-[#F5F1EB]"
                }`}
              >
                <FiUploadCloud />
                Upload Documents
              </Link>
            </div>
          </div>

          {/* Right Side */}

          <div className="relative flex justify-center">
            <img
              src={HeroImage}
              alt="DataNest AI"
              className={`rounded-[32px] shadow-2xl border-8 ${
                darkMode ? "border-[#2A2A2A]" : "border-white"
              }`}
            />

            {/* Floating Card 1 */}

            <div
              className={`absolute top-8 left-8 z-20 rounded-2xl shadow-[0_18px_40px_rgba(0,0,0,0.12)] border px-5 py-4 hover:scale-105 transition-all duration-300 ${
                darkMode
                  ? "bg-[#1F1F1F] border-[#333]"
                  : "bg-white border-[#ECE6DE]"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-xl ${
                    darkMode ? "bg-[#2B2B2B]" : "bg-[#EFE7DE]"
                  }`}
                >
                  <FiDatabase className="text-[#8B5E3C]" size={22} />
                </div>

                <div>
                  <p
                    className={`font-bold text-xl ${
                      darkMode ? "text-white" : "text-[#2F2A27]"
                    }`}
                  >
                    50K+
                  </p>

                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-[#7A726B]"
                    }`}
                  >
                    Indexed Chunks
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Card 2 */}

            <div
              className={`absolute bottom-8 right-8 z-20 rounded-2xl shadow-[0_18px_40px_rgba(0,0,0,0.12)] border px-5 py-4 hover:scale-105 transition-all duration-300 ${
                darkMode
                  ? "bg-[#1F1F1F] border-[#333]"
                  : "bg-white border-[#ECE6DE]"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-xl ${
                    darkMode ? "bg-[#2B2B2B]" : "bg-[#EFE7DE]"
                  }`}
                >
                  <FiSearch className="text-[#8B5E3C]" size={22} />
                </div>

                <div>
                  <p
                    className={`font-bold ${
                      darkMode ? "text-white" : "text-[#2F2A27]"
                    }`}
                  >
                    AI Search
                  </p>

                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-[#7A726B]"
                    }`}
                  >
                    Semantic Retrieval
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= Statistics ================= */}

      <section className="max-w-7xl mx-auto px-8 py-10">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Documents */}

          <div
            className={`rounded-3xl p-8 shadow-lg border hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 ${
              darkMode
                ? "bg-[#1E1E1E] border-[#333]"
                : "bg-white border-[#ECE6DE]"
            }`}
          >
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                darkMode ? "bg-[#2B2B2B]" : "bg-[#EFE7DE]"
              } text-[#8B5E3C]`}
            >
              <FiDatabase size={30} />
            </div>

            <h3
              className={`mt-6 text-lg font-semibold ${
                darkMode ? "text-white" : "text-[#5F564F]"
              }`}
            >
              Documents
            </h3>

            <p
              className={`mt-3 text-5xl font-bold ${
                darkMode ? "text-white" : "text-[#2F2A27]"
              }`}
            >
              1000+
            </p>

            <p
              className={`mt-4 text-sm ${
                darkMode ? "text-gray-400" : "text-[#8A7F75]"
              }`}
            >
              Company policies, manuals, HR guides and internal documentation.
            </p>
          </div>

          {/* Indexed Chunks */}

          <div
            className={`rounded-3xl p-8 shadow-lg border hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 ${
              darkMode
                ? "bg-[#1E1E1E] border-[#333]"
                : "bg-white border-[#ECE6DE]"
            }`}
          >
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                darkMode ? "bg-[#2B2B2B]" : "bg-[#F4EEE7]"
              } text-[#A3724A]`}
            >
              <FiSearch size={30} />
            </div>

            <h3
              className={`mt-6 text-lg font-semibold ${
                darkMode ? "text-white" : "text-[#5F564F]"
              }`}
            >
              Indexed Chunks
            </h3>

            <p
              className={`mt-3 text-5xl font-bold ${
                darkMode ? "text-white" : "text-[#2F2A27]"
              }`}
            >
              50K+
            </p>

            <p
              className={`mt-4 text-sm ${
                darkMode ? "text-gray-400" : "text-[#8A7F75]"
              }`}
            >
              Optimized semantic chunks for fast AI retrieval.
            </p>
          </div>

          {/* AI Accuracy */}

          <div
            className={`rounded-3xl p-8 shadow-lg border hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 ${
              darkMode
                ? "bg-[#1E1E1E] border-[#333]"
                : "bg-white border-[#ECE6DE]"
            }`}
          >
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                darkMode ? "bg-[#2B2B2B]" : "bg-[#F1EBE4]"
              } text-[#8B5E3C]`}
            >
              <FiCpu size={30} />
            </div>

            <h3
              className={`mt-6 text-lg font-semibold ${
                darkMode ? "text-white" : "text-[#5F564F]"
              }`}
            >
              AI Accuracy
            </h3>

            <p
              className={`mt-3 text-5xl font-bold ${
                darkMode ? "text-white" : "text-[#2F2A27]"
              }`}
            >
              99%
            </p>

            <p
              className={`mt-4 text-sm ${
                darkMode ? "text-gray-400" : "text-[#8A7F75]"
              }`}
            >
              Context-aware responses generated using Retrieval-Augmented
              Generation.
            </p>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}

      <section id="workflow" className="max-w-7xl mx-auto px-8 py-24">
        <div className="text-center">
          <span
            className={`px-5 py-2 rounded-full font-medium ${
              darkMode
                ? "bg-[#2B2B2B] text-[#C69C6D]"
                : "bg-[#EFE7DE] text-[#8B5E3C]"
            }`}
          >
            Simple Workflow
          </span>

          <h2
            className={`mt-6 text-5xl font-bold ${
              darkMode ? "text-white" : "text-[#2F2A27]"
            }`}
          >
            Build Your AI Knowledge Base
          </h2>

          <p
            className={`mt-5 text-xl max-w-3xl mx-auto ${
              darkMode ? "text-gray-400" : "text-[#7A726B]"
            }`}
          >
            From uploading files to intelligent AI answers, DataNest automates
            the entire knowledge management process.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8 mt-20">
          {/* Step 1 */}

          <div
            className={`rounded-3xl p-8 shadow-lg border hover:-translate-y-3 transition ${
              darkMode
                ? "bg-[#1E1E1E] border-[#333]"
                : "bg-white border-[#ECE6DE]"
            }`}
          >
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                darkMode ? "bg-[#2B2B2B]" : "bg-[#EFE7DE]"
              } text-[#8B5E3C]`}
            >
              <FiUploadCloud size={28} />
            </div>

            <h3
              className={`mt-8 text-2xl font-bold ${
                darkMode ? "text-white" : "text-[#2F2A27]"
              }`}
            >
              Upload
            </h3>

            <p
              className={`mt-4 leading-8 ${
                darkMode ? "text-gray-400" : "text-[#7A726B]"
              }`}
            >
              Upload PDF, DOCX or TXT files into your secure enterprise
              knowledge base.
            </p>
          </div>

          {/* Step 2 */}

          <div
            className={`rounded-3xl p-8 shadow-lg border hover:-translate-y-3 transition ${
              darkMode
                ? "bg-[#1E1E1E] border-[#333]"
                : "bg-white border-[#ECE6DE]"
            }`}
          >
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                darkMode ? "bg-[#2B2B2B]" : "bg-[#EFE7DE]"
              } text-[#8B5E3C]`}
            >
              <FiDatabase size={28} />
            </div>

            <h3
              className={`mt-8 text-2xl font-bold ${
                darkMode ? "text-white" : "text-[#2F2A27]"
              }`}
            >
              Index
            </h3>

            <p
              className={`mt-4 leading-8 ${
                darkMode ? "text-gray-400" : "text-[#7A726B]"
              }`}
            >
              Documents are split into semantic chunks and transformed into AI
              embeddings.
            </p>
          </div>

          {/* Step 3 */}

          <div
            className={`rounded-3xl p-8 shadow-lg border hover:-translate-y-3 transition ${
              darkMode
                ? "bg-[#1E1E1E] border-[#333]"
                : "bg-white border-[#ECE6DE]"
            }`}
          >
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                darkMode ? "bg-[#2B2B2B]" : "bg-[#EFE7DE]"
              } text-[#8B5E3C]`}
            >
              <FiSearch size={28} />
            </div>

            <h3
              className={`mt-8 text-2xl font-bold ${
                darkMode ? "text-white" : "text-[#2F2A27]"
              }`}
            >
              Search
            </h3>

            <p
              className={`mt-4 leading-8 ${
                darkMode ? "text-gray-400" : "text-[#7A726B]"
              }`}
            >
              Ask questions naturally. AI retrieves the most relevant document
              chunks instantly.
            </p>
          </div>

          {/* Step 4 */}

          <div
            className={`rounded-3xl p-8 shadow-lg border hover:-translate-y-3 transition ${
              darkMode
                ? "bg-[#1E1E1E] border-[#333]"
                : "bg-white border-[#ECE6DE]"
            }`}
          >
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                darkMode ? "bg-[#2B2B2B]" : "bg-[#EFE7DE]"
              } text-[#8B5E3C]`}
            >
              <FiShield size={28} />
            </div>

            <h3
              className={`mt-8 text-2xl font-bold ${
                darkMode ? "text-white" : "text-[#2F2A27]"
              }`}
            >
              Answer
            </h3>

            <p
              className={`mt-4 leading-8 ${
                darkMode ? "text-gray-400" : "text-[#7A726B]"
              }`}
            >
              AI generates accurate answers based only on your own documents.
            </p>
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE DATANEST ================= */}

      <section id="features" className="max-w-7xl mx-auto px-8 py-24">
        <div className="text-center">
          <span
            className={`px-5 py-2 rounded-full font-medium ${
              darkMode
                ? "bg-[#2B2B2B] text-[#C69C6D]"
                : "bg-[#EFE7DE] text-[#8B5E3C]"
            }`}
          >
            Enterprise Features
          </span>

          <h2
            className={`mt-6 text-5xl font-bold ${
              darkMode ? "text-white" : "text-[#2F2A27]"
            }`}
          >
            Why Organizations Choose DataNest
          </h2>

          <p
            className={`mt-6 text-xl max-w-3xl mx-auto leading-9 ${
              darkMode ? "text-gray-400" : "text-[#7A726B]"
            }`}
          >
            DataNest combines semantic search, Retrieval-Augmented Generation,
            and enterprise security into one intelligent knowledge platform.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 mt-20">
          {/* Card */}

          <div
            className={`rounded-3xl border shadow-lg p-10 hover:-translate-y-2 hover:shadow-2xl transition ${
              darkMode
                ? "bg-[#1E1E1E] border-[#333]"
                : "bg-white border-[#ECE6DE]"
            }`}
          >
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                darkMode ? "bg-[#2B2B2B]" : "bg-[#EFE7DE]"
              } text-[#8B5E3C]`}
            >
              <FiSearch size={30} />
            </div>

            <h3
              className={`mt-8 text-3xl font-bold ${
                darkMode ? "text-white" : "text-[#2F2A27]"
              }`}
            >
              Semantic Search
            </h3>

            <p
              className={`mt-6 leading-9 ${
                darkMode ? "text-gray-400" : "text-[#72685F]"
              }`}
            >
              Instead of relying on keyword matching, DataNest understands the
              meaning behind your questions and retrieves the most relevant
              document sections.
            </p>
          </div>

          {/* Card */}

          <div
            className={`rounded-3xl border shadow-lg p-10 hover:-translate-y-2 hover:shadow-2xl transition ${
              darkMode
                ? "bg-[#1E1E1E] border-[#333]"
                : "bg-white border-[#ECE6DE]"
            }`}
          >
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                darkMode ? "bg-[#2B2B2B]" : "bg-[#EFE7DE]"
              } text-[#8B5E3C]`}
            >
              <FiCpu size={30} />
            </div>

            <h3
              className={`mt-8 text-3xl font-bold ${
                darkMode ? "text-white" : "text-[#2F2A27]"
              }`}
            >
              AI Powered Answers
            </h3>

            <p
              className={`mt-6 leading-9 ${
                darkMode ? "text-gray-400" : "text-[#72685F]"
              }`}
            >
              Using Retrieval-Augmented Generation (RAG), every response is
              generated from your own company documents instead of general
              internet knowledge.
            </p>
          </div>

          {/* Card */}

          <div
            className={`rounded-3xl border shadow-lg p-10 hover:-translate-y-2 hover:shadow-2xl transition ${
              darkMode
                ? "bg-[#1E1E1E] border-[#333]"
                : "bg-white border-[#ECE6DE]"
            }`}
          >
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                darkMode ? "bg-[#2B2B2B]" : "bg-[#EFE7DE]"
              } text-[#8B5E3C]`}
            >
              <FiDatabase size={30} />
            </div>

            <h3
              className={`mt-8 text-3xl font-bold ${
                darkMode ? "text-white" : "text-[#2F2A27]"
              }`}
            >
              Intelligent Knowledge Base
            </h3>

            <p
              className={`mt-6 leading-9 ${
                darkMode ? "text-gray-400" : "text-[#72685F]"
              }`}
            >
              Upload thousands of documents and let DataNest automatically
              organize, chunk and index them for high-speed AI retrieval.
            </p>
          </div>

          {/* Card */}

          <div
            className={`rounded-3xl border shadow-lg p-10 hover:-translate-y-2 hover:shadow-2xl transition ${
              darkMode
                ? "bg-[#1E1E1E] border-[#333]"
                : "bg-white border-[#ECE6DE]"
            }`}
          >
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                darkMode ? "bg-[#2B2B2B]" : "bg-[#EFE7DE]"
              } text-[#8B5E3C]`}
            >
              <FiShield size={30} />
            </div>

            <h3
              className={`mt-8 text-3xl font-bold ${
                darkMode ? "text-white" : "text-[#2F2A27]"
              }`}
            >
              Enterprise Security
            </h3>

            <p
              className={`mt-6 leading-9 ${
                darkMode ? "text-gray-400" : "text-[#72685F]"
              }`}
            >
              Every uploaded document stays inside your own secure database with
              complete control over your organizational knowledge.
            </p>
          </div>
        </div>
      </section>
      {/* ================= ABOUT ================= */}

      <section id="about" className="max-w-7xl mx-auto px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span
              className={`px-5 py-2 rounded-full font-medium ${
                darkMode
                  ? "bg-[#2B2B2B] text-[#C69C6D]"
                  : "bg-[#EFE7DE] text-[#8B5E3C]"
              }`}
            >
              About DataNest
            </span>

            <h2
              className={`mt-6 text-5xl font-bold ${
                darkMode ? "text-white" : "text-[#2F2A27]"
              }`}
            >
              Intelligent Knowledge
              <br />
              For Modern Teams
            </h2>

            <p
              className={`mt-8 text-lg leading-9 ${
                darkMode ? "text-gray-400" : "text-[#72685F]"
              }`}
            >
              DataNest AI helps organizations organize thousands of internal
              documents into one intelligent knowledge base.
            </p>

            <p
              className={`mt-6 text-lg leading-9 ${
                darkMode ? "text-gray-400" : "text-[#72685F]"
              }`}
            >
              Using semantic search and Retrieval-Augmented Generation,
              employees can instantly find accurate answers instead of manually
              searching through PDFs and reports.
            </p>
          </div>

          <div>
            <img
              src={AboutImage}
              alt="About DataNest"
              className={`rounded-[32px] shadow-2xl border-8 ${
                darkMode ? "border-[#2A2A2A]" : "border-white"
              }`}
            />
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}

      <section className="max-w-7xl mx-auto px-8 pb-24">
        <div
          className={`relative overflow-hidden rounded-[36px] px-16 py-20 shadow-2xl ${
            darkMode
              ? "bg-[#1C1C1C] text-white border border-[#333]"
              : "bg-[#8B5E3C] text-white"
          }`}
        >
          {/* Decorative Circle */}

          <div className="absolute -top-32 -right-32 w-72 h-72 rounded-full bg-white/10"></div>

          <div className="absolute -bottom-32 -left-32 w-72 h-72 rounded-full bg-white/5"></div>

          <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}

            <div>
              <span className="inline-block bg-white/20 px-5 py-2 rounded-full text-sm">
                Ready to get started?
              </span>

              <h2 className="mt-8 text-5xl font-bold leading-tight">
                Build Your AI
                <br />
                Knowledge Base
                <br />
                Today
              </h2>

              <p className="mt-8 text-lg leading-9 text-white/90 max-w-xl">
                Upload your documents, organize company knowledge, and let
                Artificial Intelligence answer questions instantly with
                Retrieval-Augmented Generation.
              </p>
            </div>

            {/* Right */}

            <div className="flex flex-col gap-5">
              <Link
                to="/upload"
                className={`rounded-2xl px-8 py-5 font-semibold text-lg text-center transition shadow-lg ${
                  darkMode
                    ? "bg-[#8B5E3C] text-white hover:bg-[#70492C]"
                    : "bg-white text-[#8B5E3C] hover:scale-[1.02]"
                }`}
              >
                📄 Upload Your First Document
              </Link>

              <Link
                to="/dashboard"
                className="border border-white/40 rounded-2xl px-8 py-5 text-lg text-center hover:bg-white/10 transition"
              >
                🚀 Open Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* ================= CONTACT ================= */}

      <section id="contact" className="max-w-7xl mx-auto px-8 py-24">
        <div
          className={`rounded-[32px] shadow-lg border p-16 text-center transition-all duration-300 ${
            darkMode
              ? "bg-[#1E1E1E] border-[#333]"
              : "bg-white border-[#ECE6DE]"
          }`}
        >
          <span
            className={`px-5 py-2 rounded-full font-medium ${
              darkMode
                ? "bg-[#2B2B2B] text-[#C69C6D]"
                : "bg-[#EFE7DE] text-[#8B5E3C]"
            }`}
          >
            Contact
          </span>

          <h2
            className={`mt-8 text-5xl font-bold ${
              darkMode ? "text-white" : "text-[#2F2A27]"
            }`}
          >
            Contact Us
          </h2>

          <p
            className={`mt-6 text-lg ${
              darkMode ? "text-gray-400" : "text-[#72685F]"
            }`}
          >
            Have questions about DataNest AI? We'd love to hear from you.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-14">
            <div
              className={`rounded-2xl p-6 transition ${
                darkMode ? "bg-[#2B2B2B]" : "bg-[#F8F6F2]"
              }`}
            >
              <div className="text-3xl mb-3">📧</div>
              <h4 className="font-semibold text-lg">Email</h4>
              <p
                className={`mt-2 ${
                  darkMode ? "text-gray-400" : "text-[#72685F]"
                }`}
              >
                datanest24@gmail.com
              </p>
            </div>

            <div
              className={`rounded-2xl p-6 transition ${
                darkMode ? "bg-[#2B2B2B]" : "bg-[#F8F6F2]"
              }`}
            >
              <div className="text-3xl mb-3">☎</div>
              <h4 className="font-semibold text-lg">Phone</h4>
              <p
                className={`mt-2 ${
                  darkMode ? "text-gray-400" : "text-[#72685F]"
                }`}
              >
                +93 79 2126 795
              </p>
            </div>

            <div
              className={`rounded-2xl p-6 transition ${
                darkMode ? "bg-[#2B2B2B]" : "bg-[#F8F6F2]"
              }`}
            >
              <div className="text-3xl mb-3">📍</div>
              <h4 className="font-semibold text-lg">Location</h4>
              <p
                className={`mt-2 ${
                  darkMode ? "text-gray-400" : "text-[#72685F]"
                }`}
              >
                Kabul, Afghanistan
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}

      <footer
        className={`border-t transition-all duration-300 ${
          darkMode
            ? "bg-[#161616] border-[#2E2E2E]"
            : "bg-[#F2EEE8] border-[#E2D8CB]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-8 py-14 grid md:grid-cols-3 gap-10">
          {/* Logo */}

          <div>
            <h2 className="text-3xl font-bold text-[#8B5E3C]">DataNest AI</h2>

            <p
              className={`mt-5 leading-8 ${
                darkMode ? "text-gray-400" : "text-[#6F665E]"
              }`}
            >
              AI-powered enterprise knowledge base built with
              Retrieval-Augmented Generation for fast, accurate, and secure
              document intelligence.
            </p>
          </div>

          {/* Navigation */}

          <div>
            <h3
              className={`font-bold text-xl mb-5 ${
                darkMode ? "text-white" : "text-[#2F2A27]"
              }`}
            >
              Navigation
            </h3>

            <div
              className={`space-y-3 ${
                darkMode ? "text-gray-400" : "text-[#6F665E]"
              }`}
            >
              <Link
                to="/dashboard"
                className="block hover:text-[#8B5E3C] transition"
              >
                Dashboard
              </Link>

              <Link
                to="/upload"
                className="block hover:text-[#8B5E3C] transition"
              >
                Upload
              </Link>

              <Link
                to="/documents"
                className="block hover:text-[#8B5E3C] transition"
              >
                Documents
              </Link>
            </div>
          </div>

          {/* Platform */}

          <div>
            <h3
              className={`font-bold text-xl mb-5 ${
                darkMode ? "text-white" : "text-[#2F2A27]"
              }`}
            >
              Platform
            </h3>

            <div
              className={`space-y-3 ${
                darkMode ? "text-gray-400" : "text-[#6F665E]"
              }`}
            >
              <p>Semantic Search</p>
              <p>AI Question Answering</p>
              <p>Enterprise Security</p>
              <p>Knowledge Management</p>
            </div>
          </div>
        </div>

        <div
          className={`border-t ${
            darkMode ? "border-[#2E2E2E]" : "border-[#DDD2C5]"
          }`}
        >
          <div
            className={`max-w-7xl mx-auto py-8 text-center ${
              darkMode ? "text-gray-500" : "text-[#857B72]"
            }`}
          >
            ©️ 2026 DataNest AI • Built with React, Tailwind CSS, Supabase &
            OpenRouter
          </div>
        </div>
      </footer>
    </div>
  );
}
