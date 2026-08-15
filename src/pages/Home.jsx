import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../Services/supabase";

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
  FiMail,
  FiPhone,
  FiMapPin,
  FiMenu,
} from "react-icons/fi";

export default function Home() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [user, setUser] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");

    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        darkMode ? "bg-[#17110D] text-[#F5EEE8]" : "bg-[#F8F3EC] text-[#2F2A27]"
      }`}
    >
      {/* ================= HEADER ================= */}

      <header
        className="
          sticky
          top-0
          z-50
          w-full
          backdrop-blur-md
          border-b
          border-[#4A3021]
          bg-[#4A3021]
          text-white
          transition-all
          duration-300
          dark:bg-[#2D211A]
        "
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center">
          {/* Logo */}

          <div className="flex items-center gap-4 flex-1">
            <div
              className="
                w-10
                h-10
                md:w-14
                md:h-14
                rounded-2xl
                bg-[#3f2b20]
                dark:bg-[#4A3021]
                text-white
                flex
                items-center
                justify-center
                shadow-lg
                border
                border-white/10
              "
            >
              <FiCpu size={28} />
            </div>

            <div>
              <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-white">
                DataNest AI
              </h1>

              <p className="text-sm text-white/70">
                Intelligent Enterprise Knowledge Base
              </p>
            </div>
          </div>

          {/* Navigation */}

          <nav
            className="
              hidden
              lg:flex
              items-center
              gap-10
              text-[15px]
              text-white
              flex-1
              justify-center
            "
          >
            <a
              href="#features"
              className="hover:text-[#D8B9A3] transition font-medium"
            >
              Features
            </a>

            <a
              href="#workflow"
              className="hover:text-[#D8B9A3] transition font-medium"
            >
              Workflow
            </a>

            <a
              href="#about"
              className="hover:text-[#D8B9A3] transition font-medium"
            >
              About
            </a>

            <a
              href="#contact"
              className="hover:text-[#D8B9A3] transition font-medium"
            >
              Contact
            </a>
          </nav>

          {/* Buttons */}

          <div className="flex items-center gap-2 sm:gap-5 ml-auto">
            {/* Mobile Menu */}

            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="
                lg:hidden
                w-11
                h-11
                rounded-xl
                flex
                items-center
                justify-center
                transition
                bg-white/10
                hover:bg-white/20
                border
                border-white/10
              "
            >
              <FiMenu size={24} className="text-white" />
            </button>

            {/* Dark Mode */}

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="
                w-12
                h-12
                rounded-xl
                flex
                items-center
                justify-center
                transition
                bg-white/10
                hover:bg-white/20
                border
                border-white/10
              "
            >
              {darkMode ? (
                <FiSun size={20} className="text-[#D8B9A3]" />
              ) : (
                <FiMoon size={20} className="text-white" />
              )}
            </button>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="
                    hidden
                    sm:flex
                    w-[140px]
                    h-12
                    rounded-xl
                    bg-[#F5EEE8]
                    text-[#4A3021]
                    items-center
                    justify-center
                    font-semibold
                    hover:bg-white
                    transition
                  "
                >
                  Dashboard
                </Link>

                <Link
                  to="/upload"
                  className="
                    hidden
                    sm:flex
                    w-[120px]
                    h-12
                    rounded-xl
                    border
                    border-white/30
                    bg-white/10
                    text-white
                    items-center
                    justify-center
                    font-medium
                    hover:bg-white/20
                    transition
                  "
                >
                  Upload
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/Login"
                  className="
                    hidden
                    sm:flex
                    w-[120px]
                    h-12
                    rounded-xl
                    bg-[#F5EEE8]
                    text-[#4A3021]
                    items-center
                    justify-center
                    font-semibold
                    hover:bg-white
                    transition
                  "
                >
                  Login
                </Link>

                <Link
                  to="/Register"
                  className="
                    hidden
                    sm:flex
                    w-[120px]
                    h-12
                    rounded-xl
                    border
                    border-white/30
                    bg-white/10
                    text-white
                    items-center
                    justify-center
                    font-medium
                    hover:bg-white/20
                    transition
                  "
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ================= MOBILE MENU ================= */}

      {mobileMenu && (
        <div
          className="
            lg:hidden
            border-b
            border-[#4A3021]
            bg-[#241A15]
            text-[#F5EEE8]
          "
        >
          <div className="px-4 py-4 flex flex-col gap-3">
            <a
              href="#features"
              onClick={() => setMobileMenu(false)}
              className="py-2 hover:text-[#D8B9A3] transition"
            >
              Features
            </a>

            <a
              href="#workflow"
              onClick={() => setMobileMenu(false)}
              className="py-2 hover:text-[#D8B9A3] transition"
            >
              Workflow
            </a>

            <a
              href="#about"
              onClick={() => setMobileMenu(false)}
              className="py-2 hover:text-[#D8B9A3] transition"
            >
              About
            </a>

            <a
              href="#contact"
              onClick={() => setMobileMenu(false)}
              className="py-2 hover:text-[#D8B9A3] transition"
            >
              Contact
            </a>

            <hr className="border-[#4A3021]" />

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenu(false)}
                  className="
                    bg-[#4A3021]
                    hover:bg-[#3B251A]
                    text-white
                    py-3
                    rounded-xl
                    text-center
                    transition
                  "
                >
                  Dashboard
                </Link>

                <Link
                  to="/upload"
                  onClick={() => setMobileMenu(false)}
                  className="
                    py-3
                    rounded-xl
                    border
                    border-[#4A3021]
                    text-white
                    text-center
                    hover:bg-[#36271E]
                    transition
                  "
                >
                  Upload
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenu(false)}
                  className="
                    bg-[#4A3021]
                    hover:bg-[#3B251A]
                    text-white
                    py-3
                    rounded-xl
                    text-center
                    transition
                  "
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setMobileMenu(false)}
                  className="
                    py-3
                    rounded-xl
                    border
                    border-[#4A3021]
                    text-white
                    text-center
                    hover:bg-[#36271E]
                    transition
                  "
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* ================= HERO ================= */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left Side */}

          <div>
            <span
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-full font-medium ${
                darkMode
                  ? "bg-[#36271E] text-[#D8B9A3]"
                  : "bg-[#EFE7DE] text-[#4A3021]"
              }`}
            >
              <FiCpu />
              AI Powered Knowledge Base
            </span>

            <h2 className="mt-8 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Turn Your
              <br />
              <span className="text-[#4A3021] dark:text-[#D8B9A3]">
                Documents
              </span>
              <br />
              Into Intelligent Answers
            </h2>

            <p
              className={`mt-8 text-lg leading-9 max-w-xl ${
                darkMode ? "text-[#C7B8AC]" : "text-[#6E655D]"
              }`}
            >
              DataNest AI transforms your PDFs, DOCX, and TXT files into an
              intelligent knowledge base powered by Retrieval-Augmented
              Generation (RAG), enabling employees to search, discover, and
              receive accurate AI-generated answers within seconds.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 mt-12">
              <Link
                to={user ? "/dashboard" : "/login"}
                className="
                  flex
                  items-center
                  gap-2
                  bg-[#4A3021]
                  hover:bg-[#3B251A]
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
                to={user ? "/upload" : "/login"}
                className={`
                  flex
                  items-center
                  gap-2
                  border
                  px-8
                  py-4
                  rounded-2xl
                  transition
                  ${
                    darkMode
                      ? "bg-[#2D211A] border-[#4A3021] text-[#F5EEE8] hover:bg-[#36271E]"
                      : "bg-white border-[#D9CEC1] text-[#2F2A27] hover:bg-[#F5F1EB]"
                  }
                `}
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
              className={`
                w-full
                max-w-md
                lg:max-w-xl
                rounded-[32px]
                shadow-2xl
                border-8
                ${darkMode ? "border-[#36271E]" : "border-white"}
              `}
            />

            {/* Floating Card */}

            <div
              className={`
                absolute
                top-4
                left-4
                sm:top-6
                sm:left-6
                lg:top-8
                lg:-left-20
                w-[180px]
                sm:w-[210px]
                lg:w-auto
                rounded-2xl
                border
                shadow-xl
                px-4
                py-3
                lg:px-6
                lg:py-5
                flex
                items-center
                gap-3
                lg:gap-4
                z-20
                ${
                  darkMode
                    ? "bg-[#2D211A] border-[#4A3021]"
                    : "bg-white border-[#ECE6DE]"
                }
              `}
            >
              <div
                className={`
                  w-14
                  h-14
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  ${darkMode ? "bg-[#17110D]" : "bg-[#EFE7DE]"}
                `}
              >
                <FiDatabase
                  className="text-[#4A3021] dark:text-[#D8B9A3]"
                  size={24}
                />
              </div>

              <div>
                <h4
                  className={`font-bold ${
                    darkMode ? "text-[#F5EEE8]" : "text-[#2F2A27]"
                  }`}
                >
                  Smart Indexing
                </h4>

                <p
                  className={`text-sm ${
                    darkMode ? "text-[#BDAEA2]" : "text-[#7A726B]"
                  }`}
                >
                  Automatic AI Embeddings
                </p>
              </div>
            </div>

            {/* Floating Card */}

            <div
              className={`
                absolute
                bottom-3
                right-3
                sm:bottom-5
                sm:right-5
                lg:bottom-8
                lg:-right-14
                scale-75
                sm:scale-90
                lg:scale-100
                origin-bottom-right
                rounded-2xl
                border
                shadow-xl
                px-4
                py-4
                lg:px-6
                lg:py-5
                flex
                items-center
                gap-4
                ${
                  darkMode
                    ? "bg-[#2D211A] border-[#4A3021]"
                    : "bg-white border-[#ECE6DE]"
                }
              `}
            >
              <div
                className={`
                  w-14
                  h-14
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  ${darkMode ? "bg-[#17110D]" : "bg-[#EFE7DE]"}
                `}
              >
                <FiSearch
                  className="text-[#4A3021] dark:text-[#D8B9A3]"
                  size={24}
                />
              </div>

              <div>
                <h4
                  className={`font-bold ${
                    darkMode ? "text-[#F5EEE8]" : "text-[#2F2A27]"
                  }`}
                >
                  Semantic Search
                </h4>

                <p
                  className={`text-sm ${
                    darkMode ? "text-[#BDAEA2]" : "text-[#7A726B]"
                  }`}
                >
                  Instant AI Retrieval
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= Statistics ================= */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Documents */}

          <div
            className={`
              rounded-3xl
              p-8
              border
              shadow-lg
              hover:-translate-y-2
              hover:shadow-2xl
              transition-all
              duration-300
              ${
                darkMode
                  ? "bg-[#2D211A] border-[#4A3021]"
                  : "bg-white border-[#ECE6DE]"
              }
            `}
          >
            <div
              className={`
                w-16
                h-16
                rounded-2xl
                flex
                items-center
                justify-center
                ${darkMode ? "bg-[#36271E]" : "bg-[#EFE7DE]"}
              `}
            >
              <FiDatabase
                className="text-[#4A3021] dark:text-[#D8B9A3]"
                size={30}
              />
            </div>

            <h3
              className={`
                mt-6
                text-xl
                font-semibold
                ${darkMode ? "text-[#F5EEE8]" : "text-[#2F2A27]"}
              `}
            >
              Documents
            </h3>

            <p
              className={`
                mt-4
                text-5xl
                font-bold
                ${darkMode ? "text-[#F5EEE8]" : "text-[#2F2A27]"}
              `}
            >
              1,000+
            </p>

            <p
              className={`
                mt-4
                leading-7
                ${darkMode ? "text-[#BDAEA2]" : "text-[#7A726B]"}
              `}
            >
              Company policies, HR manuals, SOPs, technical documentation and
              internal knowledge stored securely.
            </p>
          </div>

          {/* Indexed Chunks */}

          <div
            className={`
              rounded-3xl
              p-8
              border
              shadow-lg
              hover:-translate-y-2
              hover:shadow-2xl
              transition-all
              duration-300
              ${
                darkMode
                  ? "bg-[#2D211A] border-[#4A3021]"
                  : "bg-white border-[#ECE6DE]"
              }
            `}
          >
            <div
              className={`
                w-16
                h-16
                rounded-2xl
                flex
                items-center
                justify-center
                ${darkMode ? "bg-[#36271E]" : "bg-[#EFE7DE]"}
              `}
            >
              <FiSearch
                className="text-[#4A3021] dark:text-[#D8B9A3]"
                size={30}
              />
            </div>

            <h3
              className={`
                mt-6
                text-xl
                font-semibold
                ${darkMode ? "text-[#F5EEE8]" : "text-[#2F2A27]"}
              `}
            >
              Indexed Chunks
            </h3>

            <p
              className={`
                mt-4
                text-5xl
                font-bold
                ${darkMode ? "text-[#F5EEE8]" : "text-[#2F2A27]"}
              `}
            >
              50K+
            </p>

            <p
              className={`
                mt-4
                leading-7
                ${darkMode ? "text-[#BDAEA2]" : "text-[#7A726B]"}
              `}
            >
              Every document is automatically divided into optimized semantic
              chunks for lightning-fast retrieval.
            </p>
          </div>

          {/* AI Accuracy */}

          <div
            className={`
              rounded-3xl
              p-8
              border
              shadow-lg
              hover:-translate-y-2
              hover:shadow-2xl
              transition-all
              duration-300
              ${
                darkMode
                  ? "bg-[#2D211A] border-[#4A3021]"
                  : "bg-white border-[#ECE6DE]"
              }
            `}
          >
            <div
              className={`
                w-16
                h-16
                rounded-2xl
                flex
                items-center
                justify-center
                ${darkMode ? "bg-[#36271E]" : "bg-[#EFE7DE]"}
              `}
            >
              <FiCpu className="text-[#4A3021] dark:text-[#D8B9A3]" size={30} />
            </div>

            <h3
              className={`
                mt-6
                text-xl
                font-semibold
                ${darkMode ? "text-[#F5EEE8]" : "text-[#2F2A27]"}
              `}
            >
              AI Accuracy
            </h3>

            <p
              className={`
                mt-4
                text-5xl
                font-bold
                ${darkMode ? "text-[#F5EEE8]" : "text-[#2F2A27]"}
              `}
            >
              99%
            </p>

            <p
              className={`
                mt-4
                leading-7
                ${darkMode ? "text-[#BDAEA2]" : "text-[#7A726B]"}
              `}
            >
              Context-aware responses generated using Retrieval-Augmented
              Generation with enterprise-grade document intelligence.
            </p>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}

      <section
        id="workflow"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className="text-center">
          <span
            className={`
              px-5
              py-2
              rounded-full
              font-medium
              ${
                darkMode
                  ? "bg-[#36271E] text-[#D8B9A3]"
                  : "bg-[#EFE7DE] text-[#4A3021]"
              }
            `}
          >
            Simple Workflow
          </span>

          <h2
            className={`
              mt-6
              text-3xl
              sm:text-4xl
              lg:text-5xl
              font-bold
              ${darkMode ? "text-[#F5EEE8]" : "text-[#2F2A27]"}
            `}
          >
            Build Your AI Knowledge Base
          </h2>

          <p
            className={`
              mt-5
              text-xl
              max-w-3xl
              mx-auto
              ${darkMode ? "text-[#BDAEA2]" : "text-[#7A726B]"}
            `}
          >
            From uploading files to intelligent AI answers, DataNest automates
            the entire knowledge management process.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8 mt-20">
          {/* Step 1 */}

          <div
            className={`
              rounded-3xl
              p-8
              shadow-lg
              border
              hover:-translate-y-3
              transition
              ${
                darkMode
                  ? "bg-[#2D211A] border-[#4A3021]"
                  : "bg-white border-[#ECE6DE]"
              }
            `}
          >
            <div
              className={`
                w-16
                h-16
                rounded-2xl
                flex
                items-center
                justify-center
                text-[#4A3021]
                dark:text-[#D8B9A3]
                ${darkMode ? "bg-[#36271E]" : "bg-[#EFE7DE]"}
              `}
            >
              <FiUploadCloud size={28} />
            </div>

            <h3
              className={`
                mt-8
                text-2xl
                font-bold
                ${darkMode ? "text-[#F5EEE8]" : "text-[#2F2A27]"}
              `}
            >
              Upload
            </h3>

            <p
              className={`
                mt-4
                leading-8
                ${darkMode ? "text-[#BDAEA2]" : "text-[#7A726B]"}
              `}
            >
              Upload PDF, DOCX or TXT files into your secure enterprise
              knowledge base.
            </p>
          </div>

          {/* Step 2 */}

          <div
            className={`
              rounded-3xl
              p-8
              shadow-lg
              border
              hover:-translate-y-3
              transition
              ${
                darkMode
                  ? "bg-[#2D211A] border-[#4A3021]"
                  : "bg-white border-[#ECE6DE]"
              }
            `}
          >
            <div
              className={`
                w-16
                h-16
                rounded-2xl
                flex
                items-center
                justify-center
                text-[#4A3021]
                dark:text-[#D8B9A3]
                ${darkMode ? "bg-[#36271E]" : "bg-[#EFE7DE]"}
              `}
            >
              <FiDatabase size={28} />
            </div>

            <h3
              className={`
                mt-8
                text-2xl
                font-bold
                ${darkMode ? "text-[#F5EEE8]" : "text-[#2F2A27]"}
              `}
            >
              Index
            </h3>

            <p
              className={`
                mt-4
                leading-8
                ${darkMode ? "text-[#BDAEA2]" : "text-[#7A726B]"}
              `}
            >
              Documents are split into semantic chunks and transformed into AI
              embeddings.
            </p>
          </div>

          {/* Step 3 */}

          <div
            className={`
              rounded-3xl
              p-8
              shadow-lg
              border
              hover:-translate-y-3
              transition
              ${
                darkMode
                  ? "bg-[#2D211A] border-[#4A3021]"
                  : "bg-white border-[#ECE6DE]"
              }
            `}
          >
            <div
              className={`
                w-16
                h-16
                rounded-2xl
                flex
                items-center
                justify-center
                text-[#4A3021]
                dark:text-[#D8B9A3]
                ${darkMode ? "bg-[#36271E]" : "bg-[#EFE7DE]"}
              `}
            >
              <FiSearch size={28} />
            </div>

            <h3
              className={`
                mt-8
                text-2xl
                font-bold
                ${darkMode ? "text-[#F5EEE8]" : "text-[#2F2A27]"}
              `}
            >
              Search
            </h3>

            <p
              className={`
                mt-4
                leading-8
                ${darkMode ? "text-[#BDAEA2]" : "text-[#7A726B]"}
              `}
            >
              Ask questions naturally. AI retrieves the most relevant document
              chunks instantly.
            </p>
          </div>

          {/* Step 4 */}

          <div
            className={`
              rounded-3xl
              p-8
              shadow-lg
              border
              hover:-translate-y-3
              transition
              ${
                darkMode
                  ? "bg-[#2D211A] border-[#4A3021]"
                  : "bg-white border-[#ECE6DE]"
              }
            `}
          >
            <div
              className={`
                w-16
                h-16
                rounded-2xl
                flex
                items-center
                justify-center
                text-[#4A3021]
                dark:text-[#D8B9A3]
                ${darkMode ? "bg-[#36271E]" : "bg-[#EFE7DE]"}
              `}
            >
              <FiShield size={28} />
            </div>

            <h3
              className={`
                mt-8
                text-2xl
                font-bold
                ${darkMode ? "text-[#F5EEE8]" : "text-[#2F2A27]"}
              `}
            >
              Answer
            </h3>

            <p
              className={`
                mt-4
                leading-8
                ${darkMode ? "text-[#BDAEA2]" : "text-[#7A726B]"}
              `}
            >
              AI generates accurate answers based only on your own documents.
            </p>
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE DATANEST ================= */}

      <section
        id="features"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24"
      >
        <div className="text-center">
          <span
            className={`
              inline-block
              px-5
              py-2
              rounded-full
              font-medium
              ${
                darkMode
                  ? "bg-[#36271E] text-[#D8B9A3]"
                  : "bg-[#EFE7DE] text-[#4A3021]"
              }
            `}
          >
            Enterprise Features
          </span>

          <h2
            className={`
              mt-6
              text-4xl
              lg:text-5xl
              font-bold
              ${darkMode ? "text-[#F5EEE8]" : "text-[#2F2A27]"}
            `}
          >
            Why Organizations Choose DataNest AI
          </h2>

          <p
            className={`
              mt-6
              max-w-3xl
              mx-auto
              text-lg
              leading-8
              ${darkMode ? "text-[#BDAEA2]" : "text-[#72685F]"}
            `}
          >
            DataNest combines intelligent search, enterprise security and
            Retrieval-Augmented Generation (RAG) to help organizations find
            answers from thousands of documents within seconds.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mt-20">
          {/* Feature 1 */}

          <div
            className={`
              rounded-3xl
              border
              p-10
              shadow-lg
              hover:-translate-y-2
              hover:shadow-2xl
              transition
              ${
                darkMode
                  ? "bg-[#2D211A] border-[#4A3021]"
                  : "bg-white border-[#ECE6DE]"
              }
            `}
          >
            <div
              className={`
                w-16
                h-16
                rounded-2xl
                flex
                items-center
                justify-center
                ${darkMode ? "bg-[#36271E]" : "bg-[#EFE7DE]"}
              `}
            >
              <FiSearch
                className="text-[#4A3021] dark:text-[#D8B9A3]"
                size={30}
              />
            </div>

            <h3
              className={`
                mt-8
                text-3xl
                font-bold
                ${darkMode ? "text-[#F5EEE8]" : "text-[#2F2A27]"}
              `}
            >
              Semantic Search
            </h3>

            <p
              className={`
                mt-6
                leading-8
                ${darkMode ? "text-[#BDAEA2]" : "text-[#72685F]"}
              `}
            >
              Search by meaning instead of keywords. DataNest understands user
              intent and retrieves the most relevant document passages
              instantly.
            </p>
          </div>

          {/* Feature 2 */}

          <div
            className={`
              rounded-3xl
              border
              p-10
              shadow-lg
              hover:-translate-y-2
              hover:shadow-2xl
              transition
              ${
                darkMode
                  ? "bg-[#2D211A] border-[#4A3021]"
                  : "bg-white border-[#ECE6DE]"
              }
            `}
          >
            <div
              className={`
                w-16
                h-16
                rounded-2xl
                flex
                items-center
                justify-center
                ${darkMode ? "bg-[#36271E]" : "bg-[#EFE7DE]"}
              `}
            >
              <FiCpu className="text-[#4A3021] dark:text-[#D8B9A3]" size={30} />
            </div>

            <h3
              className={`
                mt-8
                text-3xl
                font-bold
                ${darkMode ? "text-[#F5EEE8]" : "text-[#2F2A27]"}
              `}
            >
              AI-Powered Answers
            </h3>

            <p
              className={`
                mt-6
                leading-8
                ${darkMode ? "text-[#BDAEA2]" : "text-[#72685F]"}
              `}
            >
              Using RAG, every answer is generated directly from your company's
              documents, reducing hallucinations and improving reliability.
            </p>
          </div>

          {/* Feature 3 */}

          <div
            className={`
              rounded-3xl
              border
              p-10
              shadow-lg
              hover:-translate-y-2
              hover:shadow-2xl
              transition
              ${
                darkMode
                  ? "bg-[#2D211A] border-[#4A3021]"
                  : "bg-white border-[#ECE6DE]"
              }
            `}
          >
            <div
              className={`
                w-16
                h-16
                rounded-2xl
                flex
                items-center
                justify-center
                ${darkMode ? "bg-[#36271E]" : "bg-[#EFE7DE]"}
              `}
            >
              <FiDatabase
                className="text-[#4A3021] dark:text-[#D8B9A3]"
                size={30}
              />
            </div>

            <h3
              className={`
                mt-8
                text-3xl
                font-bold
                ${darkMode ? "text-[#F5EEE8]" : "text-[#2F2A27]"}
              `}
            >
              Smart Knowledge Base
            </h3>

            <p
              className={`
                mt-6
                leading-8
                ${darkMode ? "text-[#BDAEA2]" : "text-[#72685F]"}
              `}
            >
              Automatically organize, index and manage thousands of documents in
              one searchable AI knowledge platform.
            </p>
          </div>

          {/* Feature 4 */}

          <div
            className={`
              rounded-3xl
              border
              p-10
              shadow-lg
              hover:-translate-y-2
              hover:shadow-2xl
              transition
              ${
                darkMode
                  ? "bg-[#2D211A] border-[#4A3021]"
                  : "bg-white border-[#ECE6DE]"
              }
            `}
          >
            <div
              className={`
                w-16
                h-16
                rounded-2xl
                flex
                items-center
                justify-center
                ${darkMode ? "bg-[#36271E]" : "bg-[#EFE7DE]"}
              `}
            >
              <FiShield
                className="text-[#4A3021] dark:text-[#D8B9A3]"
                size={30}
              />
            </div>

            <h3
              className={`
                mt-8
                text-3xl
                font-bold
                ${darkMode ? "text-[#F5EEE8]" : "text-[#2F2A27]"}
              `}
            >
              Enterprise Security
            </h3>

            <p
              className={`
                mt-6
                leading-8
                ${darkMode ? "text-[#BDAEA2]" : "text-[#72685F]"}
              `}
            >
              Your documents remain protected with secure authentication,
              encrypted storage and role-based access through Supabase.
            </p>
          </div>
        </div>
      </section>

      {/* ================= ABOUT ================= */}

      <section
        id="about"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24"
      >
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}

          <div>
            <span
              className={`
                inline-block
                px-5
                py-2
                rounded-full
                font-medium
                ${
                  darkMode
                    ? "bg-[#36271E] text-[#D8B9A3]"
                    : "bg-[#EFE7DE] text-[#4A3021]"
                }
              `}
            >
              About DataNest AI
            </span>

            <h2
              className={`
                mt-6
                text-4xl
                lg:text-5xl
                font-bold
                leading-tight
                ${darkMode ? "text-[#F5EEE8]" : "text-[#2F2A27]"}
              `}
            >
              Smarter Knowledge
              <br />
              For Modern Organizations
            </h2>

            <p
              className={`
                mt-8
                text-lg
                leading-9
                ${darkMode ? "text-[#BDAEA2]" : "text-[#72685F]"}
              `}
            >
              DataNest AI is an intelligent enterprise knowledge management
              platform that helps organizations securely store, organize and
              search their internal documents using Artificial Intelligence.
            </p>

            <p
              className={`
                mt-6
                text-lg
                leading-9
                ${darkMode ? "text-[#BDAEA2]" : "text-[#72685F]"}
              `}
            >
              Instead of manually searching through hundreds of PDFs, policies,
              reports and manuals, employees simply ask a question and receive
              accurate answers powered by Retrieval-Augmented Generation (RAG).
            </p>
          </div>

          {/* Right */}

          <div className="relative">
            <img
              src={AboutImage}
              alt="About DataNest AI"
              className={`
                rounded-[32px]
                shadow-2xl
                border-8
                w-full
                ${darkMode ? "border-[#36271E]" : "border-white"}
              `}
            />
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div
          className={`
            relative
            overflow-hidden
            rounded-[36px]
            px-8
            sm:px-12
            lg:px-16
            py-16
            lg:py-20
            shadow-2xl
            ${
              darkMode
                ? "bg-[#2D211A] text-white border border-[#4A3021]"
                : "bg-[#4A3021] text-white"
            }
          `}
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

              <h2 className="mt-8 text-4xl sm:text-5xl font-bold leading-tight">
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
                to="/register"
                className="
                  rounded-2xl
                  py-5
                  text-center
                  text-lg
                  font-semibold
                  transition
                  shadow-lg
                  bg-[#F5EEE8]
                  text-[#4A3021]
                  hover:bg-white
                "
              >
                Create Free Account
              </Link>

              <Link
                to="/login"
                className="
                  rounded-2xl
                  py-5
                  text-center
                  text-lg
                  border
                  border-white/40
                  text-white
                  hover:bg-white/10
                  transition
                "
              >
                Login to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CONTACT ================= */}

      <section
        id="contact"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24"
      >
        <div
          className={`
            rounded-[32px]
            shadow-lg
            border
            p-8
            sm:p-12
            lg:p-16
            text-center
            transition-all
            duration-300
            ${
              darkMode
                ? "bg-[#2D211A] border-[#4A3021]"
                : "bg-white border-[#ECE6DE]"
            }
          `}
        >
          <span
            className={`
              px-5
              py-2
              rounded-full
              font-medium
              ${
                darkMode
                  ? "bg-[#36271E] text-[#D8B9A3]"
                  : "bg-[#EFE7DE] text-[#4A3021]"
              }
            `}
          >
            Contact
          </span>

          <h2
            className={`
              mt-8
              text-4xl
              sm:text-5xl
              font-bold
              ${darkMode ? "text-[#F5EEE8]" : "text-[#2F2A27]"}
            `}
          >
            Contact Us
          </h2>

          <p
            className={`
              mt-6
              text-lg
              ${darkMode ? "text-[#BDAEA2]" : "text-[#72685F]"}
            `}
          >
            Have questions about DataNest AI? We'd love to hear from you.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-14">
            {/* Email */}

            <div
              className={`
                rounded-2xl
                p-6
                transition
                ${darkMode ? "bg-[#36271E]" : "bg-[#F8F6F2]"}
              `}
            >
              <div className="flex justify-center mb-3">
                <FiMail
                  size={30}
                  className="text-[#4A3021] dark:text-[#D8B9A3]"
                />
              </div>

              <h4 className="font-semibold text-lg">Email</h4>

              <p
                className={`
                  mt-2
                  ${darkMode ? "text-[#BDAEA2]" : "text-[#72685F]"}
                `}
              >
                datanest24@gmail.com
              </p>
            </div>

            {/* Phone */}

            <div
              className={`
                rounded-2xl
                p-6
                transition
                ${darkMode ? "bg-[#36271E]" : "bg-[#F8F6F2]"}
              `}
            >
              <div className="flex justify-center mb-3">
                <FiPhone
                  size={30}
                  className="text-[#4A3021] dark:text-[#D8B9A3]"
                />
              </div>

              <h4 className="font-semibold text-lg">Phone</h4>

              <p
                className={`
                  mt-2
                  ${darkMode ? "text-[#BDAEA2]" : "text-[#72685F]"}
                `}
              >
                +93 79 2126 795
              </p>
            </div>

            {/* Location */}

            <div
              className={`
                rounded-2xl
                p-6
                transition
                ${darkMode ? "bg-[#36271E]" : "bg-[#F8F6F2]"}
              `}
            >
              <div className="flex justify-center mb-3">
                <FiMapPin
                  size={30}
                  className="text-[#4A3021] dark:text-[#D8B9A3]"
                />
              </div>

              <h4 className="font-semibold text-lg">Location</h4>

              <p
                className={`
                  mt-2
                  ${darkMode ? "text-[#BDAEA2]" : "text-[#72685F]"}
                `}
              >
                Kabul, Afghanistan
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}

      <footer
        className={`
          border-t
          transition-all
          duration-300
          ${
            darkMode
              ? "bg-[#1E1510] border-[#4A3021]"
              : "bg-[#F2EEE8] border-[#E2D8CB]"
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid md:grid-cols-3 gap-10">
          {/* Logo */}

          <div>
            <div className="flex items-center gap-3">
              <div
                className="
                  w-12
                  h-12
                  rounded-xl
                  bg-[#4A3021]
                  text-white
                  flex
                  items-center
                  justify-center
                "
              >
                <FiCpu size={24} />
              </div>

              <div>
                <h2
                  className={`
                    text-2xl
                    font-bold
                    ${darkMode ? "text-[#D8B9A3]" : "text-[#4A3021]"}
                  `}
                >
                  DataNest AI
                </h2>

                <p
                  className={`
                    text-sm
                    ${darkMode ? "text-[#BDAEA2]" : "text-[#857B72]"}
                  `}
                >
                  Enterprise Knowledge Base
                </p>
              </div>
            </div>

            <p
              className={`
                mt-6
                leading-8
                ${darkMode ? "text-[#BDAEA2]" : "text-[#6F665E]"}
              `}
            >
              AI-powered enterprise knowledge base built with
              Retrieval-Augmented Generation for fast, accurate, and secure
              document intelligence.
            </p>
          </div>

          {/* Navigation */}

          <div>
            <h3
              className={`
                font-bold
                text-xl
                mb-6
                ${darkMode ? "text-[#F5EEE8]" : "text-[#2F2A27]"}
              `}
            >
              Navigation
            </h3>

            <div
              className={`
                space-y-4
                ${darkMode ? "text-[#BDAEA2]" : "text-[#6F665E]"}
              `}
            >
              <Link
                to="/dashboard"
                className="block hover:text-[#4A3021] dark:hover:text-[#D8B9A3] transition"
              >
                Dashboard
              </Link>

              <Link
                to="/upload"
                className="block hover:text-[#4A3021] dark:hover:text-[#D8B9A3] transition"
              >
                Upload
              </Link>

              <Link
                to="/documents"
                className="block hover:text-[#4A3021] dark:hover:text-[#D8B9A3] transition"
              >
                Documents
              </Link>

              <Link
                to="/search"
                className="block hover:text-[#4A3021] dark:hover:text-[#D8B9A3] transition"
              >
                Search
              </Link>

              <Link
                to="/analytics"
                className="block hover:text-[#4A3021] dark:hover:text-[#D8B9A3] transition"
              >
                Analytics
              </Link>
            </div>
          </div>

          {/* Platform */}

          <div>
            <h3
              className={`
                font-bold
                text-xl
                mb-6
                ${darkMode ? "text-[#F5EEE8]" : "text-[#2F2A27]"}
              `}
            >
              Platform
            </h3>

            <div
              className={`
                space-y-4
                ${darkMode ? "text-[#BDAEA2]" : "text-[#6F665E]"}
              `}
            >
              <p>Semantic Search</p>
              <p>AI Question Answering</p>
              <p>Enterprise Security</p>
              <p>Knowledge Management</p>
              <p>Supabase Storage</p>
              <p>OpenRouter AI</p>
            </div>
          </div>
        </div>

        {/* Bottom */}

        <div
          className={`
            border-t
            ${darkMode ? "border-[#4A3021]" : "border-[#DDD2C5]"}
          `}
        >
          <div
            className={`
              max-w-7xl
              mx-auto
              py-8
              flex
              flex-col
              md:flex-row
              items-center
              justify-between
              gap-4
              px-4
              ${darkMode ? "text-[#8F8177]" : "text-[#857B72]"}
            `}
          >
            <p>
              ©️ 2026 <span className="font-semibold">DataNest AI</span>. All
              rights reserved.
            </p>

            <p>Built with ❤️ React • Tailwind CSS • Supabase • OpenRouter</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
