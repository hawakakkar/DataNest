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
} from "react-icons/fi";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8F6F2] text-[#2F2A27]">
      {/* ================= HEADER ================= */}

      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#FFFDF9]/90 border-b border-[#ECE6DE]">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          {/* Logo */}

          <div className="flex items-center gap-4">
            <div
              className="
              w-14
              h-14
              rounded-2xl
              bg-[#8B5E3C]
              text-white
              flex
              items-center
              justify-center
              shadow-lg
              "
            >
              <FiCpu size={28} />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight">DataNest AI</h1>

              <p className="text-sm text-[#8A7F75]">
                Intelligent Enterprise Knowledge Base
              </p>
            </div>
          </div>

          {/* Navigation */}

          <nav className="hidden lg:flex items-center gap-10 text-[15px]">
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

          <div className="flex gap-3">
            <Link
              to="/dashboard"
              className="
              px-6
              py-3
              rounded-xl
              border
              border-[#D8D0C6]
              bg-white
              hover:bg-[#F5F1EB]
              transition
              font-medium
              "
            >
              Dashboard
            </Link>

            <Link
              to="/upload"
              className="
              px-6
              py-3
              rounded-xl
              bg-[#8B5E3C]
              hover:bg-[#70492C]
              text-white
              shadow-lg
              transition
              font-medium
              "
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
              className="
      inline-flex
      items-center
      gap-2
      bg-[#EFE7DE]
      text-[#8B5E3C]
      px-5
      py-2
      rounded-full
      font-medium
    "
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

            <p className="mt-8 text-xl leading-9 text-[#6E655D] max-w-xl">
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
                className="
        flex
        items-center
        gap-2
        border
        border-[#D9CEC1]
        bg-white
        hover:bg-[#F5F1EB]
        px-8
        py-4
        rounded-2xl
        transition
      "
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
              className="
      rounded-[32px]
      shadow-2xl
      border-8
      border-[white]
    "
            />

            {/* Floating Card 1 */}

            <div
              className="
    absolute
    top-8
    left-8
    z-20
    bg-white
    rounded-2xl
    shadow-[0_18px_40px_rgba(0,0,0,0.12)]
    border
    border-[#ECE6DE]
    px-5
    py-4
    hover:scale-105
    transition-all
    duration-300
  "
            >
              <div className="flex items-center gap-4">
                <div className="bg-[#EFE7DE] p-3 rounded-xl">
                  <FiDatabase className="text-[#8B5E3C]" size={22} />
                </div>

                <div>
                  <p className="font-bold text-xl text-[#2F2A27]">50K+</p>

                  <p className="text-sm text-[#7A726B]">Indexed Chunks</p>
                </div>
              </div>
            </div>

            {/* Floating Card 2 */}

            <div
              className="
    absolute
    bottom-8
    right-8
    z-20
    bg-white
    rounded-2xl
    shadow-[0_18px_40px_rgba(0,0,0,0.12)]
    border
    border-[#ECE6DE]
    px-5
    py-4
    hover:scale-105
    transition-all
    duration-300
  "
            >
              <div className="flex items-center gap-4">
                <div className="bg-[#EFE7DE] p-3 rounded-xl">
                  <FiSearch className="text-[#8B5E3C]" size={22} />
                </div>

                <div>
                  <p className="font-bold text-[#2F2A27]">AI Search</p>

                  <p className="text-sm text-[#7A726B]">Semantic Retrieval</p>
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
            className="
              bg-white
              rounded-3xl
              p-8
              shadow-lg
              border
              border-[#ECE6DE]
              hover:-translate-y-2
              hover:shadow-2xl
              transition-all
              duration-300
            "
          >
            <div
              className="
                w-16
                h-16
                rounded-2xl
                bg-[#EFE7DE]
                flex
                items-center
                justify-center
                text-[#8B5E3C]
              "
            >
              <FiDatabase size={30} />
            </div>

            <h3 className="mt-6 text-lg font-semibold text-[#5F564F]">
              Documents
            </h3>

            <p className="mt-3 text-5xl font-bold text-[#2F2A27]">1000+</p>

            <p className="mt-4 text-sm text-[#8A7F75]">
              Company policies, manuals, HR guides and internal documentation.
            </p>
          </div>

          {/* Indexed Chunks */}

          <div
            className="
              bg-white
              rounded-3xl
              p-8
              shadow-lg
              border
              border-[#ECE6DE]
              hover:-translate-y-2
              hover:shadow-2xl
              transition-all
              duration-300
            "
          >
            <div
              className="
                w-16
                h-16
                rounded-2xl
                bg-[#F4EEE7]
                flex
                items-center
                justify-center
                text-[#A3724A]
              "
            >
              <FiSearch size={30} />
            </div>

            <h3 className="mt-6 text-lg font-semibold text-[#5F564F]">
              Indexed Chunks
            </h3>

            <p className="mt-3 text-5xl font-bold text-[#2F2A27]">50K+</p>

            <p className="mt-4 text-sm text-[#8A7F75]">
              Optimized semantic chunks for fast AI retrieval.
            </p>
          </div>

          {/* AI Accuracy */}

          <div
            className="
              bg-white
              rounded-3xl
              p-8
              shadow-lg
              border
              border-[#ECE6DE]
              hover:-translate-y-2
              hover:shadow-2xl
              transition-all
              duration-300
            "
          >
            <div
              className="
                w-16
                h-16
                rounded-2xl
                bg-[#F1EBE4]
                flex
                items-center
                justify-center
                text-[#8B5E3C]
              "
            >
              <FiCpu size={30} />
            </div>

            <h3 className="mt-6 text-lg font-semibold text-[#5F564F]">
              AI Accuracy
            </h3>

            <p className="mt-3 text-5xl font-bold text-[#2F2A27]">99%</p>

            <p className="mt-4 text-sm text-[#8A7F75]">
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
            className="
      bg-[#EFE7DE]
      text-[#8B5E3C]
      px-5
      py-2
      rounded-full
      font-medium
      "
          >
            Simple Workflow
          </span>

          <h2 className="mt-6 text-5xl font-bold text-[#2F2A27]">
            Build Your AI Knowledge Base
          </h2>

          <p className="mt-5 text-xl text-[#7A726B] max-w-3xl mx-auto">
            From uploading files to intelligent AI answers, DataNest automates
            the entire knowledge management process.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8 mt-20">
          {/* Step 1 */}

          <div
            className="
      bg-white
      rounded-3xl
      p-8
      shadow-lg
      border
      border-[#ECE6DE]
      hover:-translate-y-3
      transition
      "
          >
            <div
              className="
        w-16
        h-16
        rounded-2xl
        bg-[#EFE7DE]
        text-[#8B5E3C]
        flex
        items-center
        justify-center
        "
            >
              <FiUploadCloud size={28} />
            </div>

            <h3 className="mt-8 text-2xl font-bold">Upload</h3>

            <p className="mt-4 leading-8 text-[#7A726B]">
              Upload PDF, DOCX or TXT files into your secure enterprise
              knowledge base.
            </p>
          </div>

          {/* Step 2 */}

          <div
            className="
      bg-white
      rounded-3xl
      p-8
      shadow-lg
      border
      border-[#ECE6DE]
      hover:-translate-y-3
      transition
      "
          >
            <div
              className="
        w-16
        h-16
        rounded-2xl
        bg-[#EFE7DE]
        text-[#8B5E3C]
        flex
        items-center
        justify-center
        "
            >
              <FiDatabase size={28} />
            </div>

            <h3 className="mt-8 text-2xl font-bold">Index</h3>

            <p className="mt-4 leading-8 text-[#7A726B]">
              Documents are split into semantic chunks and transformed into AI
              embeddings.
            </p>
          </div>

          {/* Step 3 */}

          <div
            className="
      bg-white
      rounded-3xl
      p-8
      shadow-lg
      border
      border-[#ECE6DE]
      hover:-translate-y-3
      transition
      "
          >
            <div
              className="
        w-16
        h-16
        rounded-2xl
        bg-[#EFE7DE]
        text-[#8B5E3C]
        flex
        items-center
        justify-center
        "
            >
              <FiSearch size={28} />
            </div>

            <h3 className="mt-8 text-2xl font-bold">Search</h3>

            <p className="mt-4 leading-8 text-[#7A726B]">
              Ask questions naturally. AI retrieves the most relevant document
              chunks instantly.
            </p>
          </div>

          {/* Step 4 */}

          <div
            className="
      bg-white
      rounded-3xl
      p-8
      shadow-lg
      border
      border-[#ECE6DE]
      hover:-translate-y-3
      transition
      "
          >
            <div
              className="
        w-16
        h-16
        rounded-2xl
        bg-[#EFE7DE]
        text-[#8B5E3C]
        flex
        items-center
        justify-center
        "
            >
              <FiShield size={28} />
            </div>

            <h3 className="mt-8 text-2xl font-bold">Answer</h3>

            <p className="mt-4 leading-8 text-[#7A726B]">
              AI generates accurate answers based only on your own documents.
            </p>
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE DATANEST ================= */}

      <section id="features" className="max-w-7xl mx-auto px-8 py-24">
        <div className="text-center">
          <span
            className="
      bg-[#EFE7DE]
      text-[#8B5E3C]
      px-5
      py-2
      rounded-full
      font-medium
      "
          >
            Enterprise Features
          </span>

          <h2 className="mt-6 text-5xl font-bold text-[#2F2A27]">
            Why Organizations Choose DataNest
          </h2>

          <p className="mt-6 text-xl text-[#7A726B] max-w-3xl mx-auto leading-9">
            DataNest combines semantic search, Retrieval-Augmented Generation,
            and enterprise security into one intelligent knowledge platform.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 mt-20">
          {/* Card */}

          <div
            className="
      bg-white
      rounded-3xl
      border
      border-[#ECE6DE]
      shadow-lg
      p-10
      hover:-translate-y-2
      hover:shadow-2xl
      transition
      "
          >
            <div
              className="
        w-16
        h-16
        rounded-2xl
        bg-[#EFE7DE]
        text-[#8B5E3C]
        flex
        items-center
        justify-center
        "
            >
              <FiSearch size={30} />
            </div>

            <h3 className="mt-8 text-3xl font-bold">Semantic Search</h3>

            <p className="mt-6 leading-9 text-[#72685F]">
              Instead of relying on keyword matching, DataNest understands the
              meaning behind your questions and retrieves the most relevant
              document sections.
            </p>
          </div>

          {/* Card */}

          <div
            className="
      bg-white
      rounded-3xl
      border
      border-[#ECE6DE]
      shadow-lg
      p-10
      hover:-translate-y-2
      hover:shadow-2xl
      transition
      "
          >
            <div
              className="
        w-16
        h-16
        rounded-2xl
        bg-[#EFE7DE]
        text-[#8B5E3C]
        flex
        items-center
        justify-center
        "
            >
              <FiCpu size={30} />
            </div>

            <h3 className="mt-8 text-3xl font-bold">AI Powered Answers</h3>

            <p className="mt-6 leading-9 text-[#72685F]">
              Using Retrieval-Augmented Generation (RAG), every response is
              generated from your own company documents instead of general
              internet knowledge.
            </p>
          </div>

          {/* Card */}

          <div
            className="
      bg-white
      rounded-3xl
      border
      border-[#ECE6DE]
      shadow-lg
      p-10
      hover:-translate-y-2
      hover:shadow-2xl
      transition
      "
          >
            <div
              className="
        w-16
        h-16
        rounded-2xl
        bg-[#EFE7DE]
        text-[#8B5E3C]
        flex
        items-center
        justify-center
        "
            >
              <FiDatabase size={30} />
            </div>

            <h3 className="mt-8 text-3xl font-bold">
              Intelligent Knowledge Base
            </h3>

            <p className="mt-6 leading-9 text-[#72685F]">
              Upload thousands of documents and let DataNest automatically
              organize, chunk and index them for high-speed AI retrieval.
            </p>
          </div>

          {/* Card */}

          <div
            className="
      bg-white
      rounded-3xl
      border
      border-[#ECE6DE]
      shadow-lg
      p-10
      hover:-translate-y-2
      hover:shadow-2xl
      transition
      "
          >
            <div
              className="
        w-16
        h-16
        rounded-2xl
        bg-[#EFE7DE]
        text-[#8B5E3C]
        flex
        items-center
        justify-center
        "
            >
              <FiShield size={30} />
            </div>

            <h3 className="mt-8 text-3xl font-bold">Enterprise Security</h3>

            <p className="mt-6 leading-9 text-[#72685F]">
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
            <span className="bg-[#EFE7DE] text-[#8B5E3C] px-5 py-2 rounded-full font-medium">
              About DataNest
            </span>

            <h2 className="mt-6 text-5xl font-bold">
              Intelligent Knowledge
              <br />
              For Modern Teams
            </h2>

            <p className="mt-8 text-lg leading-9 text-[#72685F]">
              DataNest AI helps organizations organize thousands of internal
              documents into one intelligent knowledge base.
            </p>

            <p className="mt-6 text-lg leading-9 text-[#72685F]">
              Using semantic search and Retrieval-Augmented Generation,
              employees can instantly find accurate answers instead of manually
              searching through PDFs and reports.
            </p>
          </div>

          <div>
            <img
              src={AboutImage}
              alt="About DataNest"
              className="rounded-[30px] shadow-xl"
            />
          </div>
        </div>
      </section>
      {/* ================= CTA ================= */}

      {/* ================= CTA ================= */}

      <section className="max-w-7xl mx-auto px-8 pb-24">
        <div
          className="
    relative
    overflow-hidden
    rounded-[36px]
    bg-[#8B5E3C]
    text-white
    px-16
    py-20
    shadow-2xl
    "
        >
          {/* Decorative Circle */}

          <div className="absolute -top-32 -right-32 w-72 h-72 rounded-full bg-white/10"></div>

          <div className="absolute -bottom-32 -left-32 w-72 h-72 rounded-full bg-white/5"></div>

          <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}

            <div>
              <span
                className="
          inline-block
          bg-white/20
          px-5
          py-2
          rounded-full
          text-sm
          "
              >
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
                className="
          bg-white
          text-[#8B5E3C]
          rounded-2xl
          px-8
          py-5
          font-semibold
          text-lg
          text-center
          hover:scale-[1.02]
          transition
          shadow-lg
          "
              >
                📄 Upload Your First Document
              </Link>

              <Link
                to="/dashboard"
                className="
          border
          border-white/40
          rounded-2xl
          px-8
          py-5
          text-lg
          text-center
          hover:bg-white/10
          transition
          "
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
          className="
    bg-white
    rounded-[32px]
    shadow-lg
    border
    border-[#ECE6DE]
    p-16
    text-center
    "
        >
          <h2 className="text-5xl font-bold">Contact Us</h2>

          <p className="mt-6 text-lg text-[#72685F]">
            Have questions about DataNest AI? We'd love to hear from you.
          </p>

          <div className="mt-12 space-y-4 text-lg">
            <p>📧 datanest24@gmail.com</p>

            <p>☎ +93 79 2126 795</p>

            <p>📍 Kabul, Afghanistan</p>
          </div>
        </div>
      </section>
      {/* ================= FOOTER ================= */}

      <footer className="bg-[#F2EEE8] border-t border-[#E2D8CB]">
        <div className="max-w-7xl mx-auto px-8 py-14 grid md:grid-cols-3 gap-10">
          {/* Logo */}

          <div>
            <h2 className="text-3xl font-bold text-[#8B5E3C]">DataNest AI</h2>

            <p className="mt-5 leading-8 text-[#6F665E]">
              AI-powered enterprise knowledge base built with
              Retrieval-Augmented Generation for fast, accurate, and secure
              document intelligence.
            </p>
          </div>

          {/* Navigation */}

          <div>
            <h3 className="font-bold text-xl mb-5">Navigation</h3>

            <div className="space-y-3">
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

          {/* About */}

          <div>
            <h3 className="font-bold text-xl mb-5">Platform</h3>

            <div className="space-y-3 text-[#6F665E]">
              <p>Semantic Search</p>

              <p>AI Question Answering</p>

              <p>Enterprise Security</p>

              <p>Knowledge Management</p>
            </div>
          </div>
        </div>

        <div className="border-t border-[#DDD2C5]">
          <div className="max-w-7xl mx-auto py-8 text-center text-[#857B72]">
            © 2026 DataNest AI • Built with React, Tailwind CSS, Supabase &
            OpenRouter
          </div>
        </div>
      </footer>
    </div>
  );
}
