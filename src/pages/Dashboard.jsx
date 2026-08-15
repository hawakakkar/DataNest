import { useEffect, useState, useRef } from "react";

import {
  FiFileText,
  FiDatabase,
  FiMessageSquare,
  FiUploadCloud,
  FiCopy,
  FiClock,
  FiBookOpen,
  FiRefreshCw,
  FiDownload,
  FiCpu,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

import { supabase } from "../Services/supabase";
import { searchChunks } from "../utils/searchChunks";
import { askAI } from "../utils/askAI";
import { saveGeneralChat } from "../Services/chatService";

import backgroundImage from "../assets/images/background.jpg";

export default function Dashboard() {
  const navigate = useNavigate();

  const [documentsCount, setDocumentsCount] = useState(0);
  const [chunksCount, setChunksCount] = useState(0);
  const [questionsCount, setQuestionsCount] = useState(0);

  const [question, setQuestion] = useState(
    localStorage.getItem("question") || "",
  );

  const [answer, setAnswer] = useState("");
  const [loadingAnswer, setLoadingAnswer] = useState(false);

  const [sources, setSources] = useState([]);
  const [responseTime, setResponseTime] = useState(null);

  const answerRef = useRef(null);

  // =====================================================
  // SAVE QUESTION
  // =====================================================

  useEffect(() => {
    localStorage.setItem("question", question);
  }, [question]);

  // =====================================================
  // LOAD DASHBOARD STATS
  // =====================================================

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const { count: docs } = await supabase.from("documents").select("*", {
        count: "exact",
        head: true,
      });

      const { count: chunks } = await supabase.from("chunks").select("*", {
        count: "exact",
        head: true,
      });

      const { count: generalQuestions } = await supabase
        .from("questions")
        .select("*", {
          count: "exact",
          head: true,
        });

      const { count: documentQuestions } = await supabase
        .from("chat_history")
        .select("*", {
          count: "exact",
          head: true,
        })
        .not("document_id", "is", null)
        .eq("role", "user");

      const totalQuestions = (generalQuestions || 0) + (documentQuestions || 0);

      setDocumentsCount(docs || 0);
      setChunksCount(chunks || 0);
      setQuestionsCount(totalQuestions);
    } catch (error) {
      console.error("Failed to load dashboard stats:", error);
    }
  }

  // =====================================================
  // ASK AI
  // =====================================================

  async function handleSearch() {
    if (!question.trim()) {
      alert("Please enter a question.");
      return;
    }

    try {
      const startTime = performance.now();

      setLoadingAnswer(true);
      setAnswer("");
      setSources([]);
      setResponseTime(null);

      const results = await searchChunks(question);

      if (!results || results.length === 0) {
        setAnswer("No matching information found.");
        return;
      }

      const aiAnswer = await askAI(question, results);

      await saveGeneralChat(question, aiAnswer);

      const fileNames = [
        ...new Set(
          results.map((r) => r.file_name?.replace(/^\d+-/, "")).filter(Boolean),
        ),
      ].join("\n• ");

      setAnswer(
        `${aiAnswer}

--------------------

This information was found in the following documents:

• ${fileNames}`,
      );

      setSources(results);

      const endTime = performance.now();

      setResponseTime(((endTime - startTime) / 1000).toFixed(2));

      setTimeout(() => {
        answerRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 200);

      await supabase.from("questions").insert([
        {
          query: question,
          answer: aiAnswer,
        },
      ]);

      await loadStats();

      setQuestion("");
      localStorage.removeItem("question");
    } catch (error) {
      console.error(error);
      setAnswer("Something went wrong while asking AI.");
    } finally {
      setLoadingAnswer(false);
    }
  }

  // =====================================================
  // COPY ANSWER
  // =====================================================

  function copyAnswer() {
    navigator.clipboard.writeText(answer);
    alert("Answer copied!");
  }

  // =====================================================
  // REGENERATE
  // =====================================================

  function regenerateAnswer() {
    if (!question.trim() && answer) {
      return;
    }

    handleSearch();
  }

  // =====================================================
  // DOWNLOAD ANSWER
  // =====================================================

  function downloadAnswer() {
    const blob = new Blob([answer], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "AI_Answer.txt";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div
      className="
        min-h-screen
        bg-[#F7F3EE]
        text-[#3E2A1E]
        transition-colors
        duration-500
        dark:bg-[#0F0B08]
        dark:text-white
      "
    >
      <main
        className="
          space-y-6
          px-4
          pb-10
          pt-4
          sm:px-6
          sm:pt-6
          lg:px-8
          lg:pt-8
        "
      >
        {/* =====================================================
            HERO
        ===================================================== */}

        <section
          className="
            group
            relative
            min-h-[310px]
            overflow-hidden
            rounded-[30px]
            shadow-[0_25px_70px_rgba(91,56,34,0.20)]
            sm:min-h-[340px]
            lg:min-h-[360px]
          "
        >
          <img
            src={backgroundImage}
            alt=""
            className="
              absolute
              inset-0
              h-full
              w-full
              object-cover
              object-center
              transition
              duration-1000
              group-hover:scale-[1.015]
            "
          />

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-r
              from-[#321B0E]/95
              via-[#4B2815]/75
              to-[#4B2815]/20
            "
          />

          <div
            className="
              absolute
              -right-20
              -top-20
              h-64
              w-64
              rounded-full
              bg-[#E3A467]/20
              blur-3xl
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-32
              left-[42%]
              h-72
              w-72
              rounded-full
              bg-[#C87835]/10
              blur-3xl
            "
          />

          <div
            className="
              relative
              z-10
              flex
              h-full
              min-h-[310px]
              items-center
              p-6
              sm:min-h-[340px]
              sm:p-10
              lg:min-h-[360px]
              lg:p-12
            "
          >
            <div className="max-w-2xl text-white">
              <div
                className="
                  mb-5
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-[#E5B27D]/40
                  bg-[#E5B27D]/15
                  px-4
                  py-2
                  text-xs
                  font-medium
                  text-[#F6D5B3]
                  backdrop-blur-md
                "
              >
                <span
                  className="
                    h-2
                    w-2
                    rounded-full
                    bg-[#E9A15B]
                    shadow-[0_0_12px_#E9A15B]
                  "
                />
                AI Knowledge Platform
              </div>

              <h2
                className="
                  text-3xl
                  font-bold
                  leading-tight
                  tracking-tight
                  sm:text-3xl
                  lg:text-4xl
                "
              >
                Welcome to DataNest AI
              </h2>

              <p
                className="
                  mt-4
                  max-w-xl
                  text-sm
                  leading-7
                  text-[#F4E6D9]
                  sm:text-base
                  sm:leading-8
                "
              >
                Centralize your organization's documents and ask AI-powered
                questions to instantly find accurate information.
              </p>

              <div
                className="
                  mt-7
                  flex
                  flex-col
                  gap-3
                  sm:flex-row
                "
              >
                <button
                  onClick={() => navigate("/upload")}
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    bg-[#FFF9F3]
                    px-6
                    py-3.5
                    font-semibold
                    text-[#70472D]
                    shadow-xl
                    shadow-black/10
                    transition
                    duration-300
                    hover:-translate-y-1
                    hover:bg-white
                    hover:shadow-2xl
                  "
                >
                  <FiUploadCloud size={19} />
                  Upload Document
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            STATISTICS
        ===================================================== */}

        <section
          className="
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
            xl:grid-cols-4
          "
        >
          {/* DOCUMENTS */}

          <div className="dashboard-stat-card group">
            <div className="dashboard-card-content">
              {/* ICON + DOCUMENTS */}
              <div className="flex items-center gap-3">
                <div
                  className="
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-[16px]
          bg-[#F1E7DD]
          text-[#8B5E3C]
          dark:bg-[#30241C]
          dark:text-[#D8A778]
        "
                >
                  <FiFileText size={22} strokeWidth={1.8} />
                </div>

                <p
                  className="
          text-[13px]
          font-medium
          text-[#806A59]
          dark:text-gray-400
        "
                >
                  Documents
                </p>
              </div>

              <h2
                className="
    ml-2
    mt-5
    text-left
    text-[30px]
    font-bold
    leading-none
    tracking-tight
    text-[#3E2A1E]
    dark:text-white
  "
              >
                {documentsCount}
              </h2>

              <p
                className="
    ml-2
    mt-4
    text-left
    text-[11px]
    font-medium
    text-[#4A3021]
  "
              >
                Documents available
              </p>
            </div>

            <DashboardWave type="one" />
          </div>

          {/* INDEXED CHUNKS */}

          <div className="dashboard-stat-card group">
            <div className="dashboard-card-content">
              {/* ICON + TITLE */}
              <div className="flex items-center gap-3">
                <div
                  className="
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-[16px]
          bg-[#F1E7DD]
          text-[#8B5E3C]
          dark:bg-[#30241C]
          dark:text-[#D8A778]
        "
                >
                  <FiDatabase size={22} strokeWidth={1.8} />
                </div>

                <p
                  className="
          text-[13px]
          font-medium
          text-[#806A59]
          dark:text-gray-400
        "
                >
                  Indexed Chunks
                </p>
              </div>

              {/* NUMBER */}
              <h2
                className="
        ml-2
        mt-5
        text-left
        text-[30px]
        font-bold
        leading-none
        tracking-tight
        text-[#3E2A1E]
        dark:text-white
      "
              >
                {chunksCount}
              </h2>

              {/* DESCRIPTION */}
              <p
                className="
        ml-2
        mt-4
        text-left
        text-[11px]
        font-medium
        text-[#4A3021]
      "
              >
                Knowledge chunks ready
              </p>
            </div>

            <DashboardWave type="two" />
          </div>

          {/* AI QUESTIONS */}

          <div className="dashboard-stat-card group">
            <div className="dashboard-card-content">
              {/* ICON + TITLE */}
              <div className="flex items-center gap-3">
                <div
                  className="
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-[16px]
          bg-[#F1E7DD]
          text-[#8B5E3C]
          dark:bg-[#30241C]
          dark:text-[#D8A778]
        "
                >
                  <FiMessageSquare size={22} strokeWidth={1.8} />
                </div>

                <p
                  className="
          text-[13px]
          font-medium
          text-[#806A59]
          dark:text-gray-400
        "
                >
                  AI Questions
                </p>
              </div>

              {/* NUMBER */}
              <h2
                className="
        ml-2
        mt-5
        text-left
        text-[30px]
        font-bold
        leading-none
        tracking-tight
        text-[#3E2A1E]
        dark:text-white
      "
              >
                {questionsCount}
              </h2>

              {/* DESCRIPTION */}
              <p
                className="
        ml-2
        mt-4
        text-left
        text-[11px]
        font-medium
        text-[#4A3021]
      "
              >
                Questions answered
              </p>
            </div>

            <DashboardWave type="three" />
          </div>
          {/* KNOWLEDGE BASE */}

          <div className="dashboard-stat-card relative">
            <div className="dashboard-card-content">
              <div className="flex items-start justify-between">
                <p
                  className="
                    text-[13px]
                    font-semibold
                    text-[#4A3021]
                    dark:text-white
                  "
                >
                  Knowledge Base
                </p>

                <span
                  className="
                    rounded-full
                    bg-[#D8B9A3]
                    px-2.5
                    py-1
                    text-[10px]
                    font-semibold
                    text-[#4A3021]
                  "
                >
                  Healthy
                </span>
              </div>

              <div className="mt-5 flex items-center gap-5">
                <div
                  className="
                    relative
                    flex
                    h-[88px]
                    w-[88px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-[conic-gradient(#70472D_0deg,#70472D_306deg,#D18B50_306deg,#D18B50_342deg,#D9C7B7_342deg)]
                  "
                >
                  <div
                    className="
                      flex
                      h-[60px]
                      w-[60px]
                      items-center
                      justify-center
                      rounded-full
                      bg-white
                      text-center
                      text-sm
                      font-bold
                      text-[#4A3021]
                      dark:bg-[#1A1410]
                      dark:text-white
                    "
                  >
                    85%
                  </div>
                </div>

                <div
                  className="
                    space-y-2
                    text-[11px]
                    leading-none
                    text-[#806A59]
                    dark:text-gray-400
                  "
                >
                  <p>
                    <span className="mr-1 text-[#70472D]">●</span>
                    Indexed&nbsp;&nbsp;85%
                  </p>

                  <p>
                    <span className="mr-1 text-[#D18B50]">●</span>
                    Processing&nbsp;&nbsp;10%
                  </p>

                  <p>
                    <span className="mr-1 text-[#D9C7B7]">●</span>
                    Pending&nbsp;&nbsp;5%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            RECENT DOCUMENTS + QUICK ACTIONS
        ===================================================== */}

        <section
          className="
            grid
            grid-cols-1
            gap-6
            xl:grid-cols-[1.25fr_0.75fr]
          "
        >
          {/* RECENT DOCUMENTS */}

          <div
            className="
              rounded-[28px]
              border
              border-[#E9DED2]
              bg-white
              p-5
              shadow-[0_12px_35px_rgba(91,56,34,0.07)]
              sm:p-6
              dark:border-white/10
              dark:bg-[#1A1410]
            "
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="
                    rounded-xl
                    bg-[#F1E7DD]
                    p-2.5
                    text-[#8B5E3C]
                    dark:bg-[#30241C]
                  "
                >
                  <FiFileText size={19} />
                </div>

                <h2
                  className="
                    text-xl
                    font-bold
                    text-[#4A3021]
                    dark:text-white
                  "
                >
                  Recent Documents
                </h2>
              </div>

              <button
                onClick={() => navigate("/documents")}
                className="
                  text-sm
                  font-semibold
                  text-[#8B5E3C]
                  hover:underline
                "
              >
                View all →
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {[
                "Discussion Forum Unit 7 CS 1105.docx",
                "WA U7 OS 2301.docx",
                "Discussion Forum Unit 6 CS 3305.docx",
              ].map((name, index) => (
                <div
                  key={name}
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-2xl
                    border
                    border-[#EEE5DC]
                    bg-[#FCFAF7]
                    px-3
                    py-3
                    transition
                    hover:border-[#D4B59A]
                    hover:bg-[#F7EFE7]
                    dark:border-white/10
                    dark:bg-white/5
                  "
                >
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-[#F0E5DA]
                      text-[#8B5E3C]
                      dark:bg-[#30241C]
                    "
                  >
                    <FiFileText />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className="
                        truncate
                        text-sm
                        font-medium
                        text-[#4A3021]
                        dark:text-white
                      "
                    >
                      {name}
                    </p>

                    <p className="mt-1 text-xs text-[#9A8675]">
                      {index === 0
                        ? "2 min ago"
                        : index === 1
                          ? "18 min ago"
                          : "1 hour ago"}
                    </p>
                  </div>

                  <span
                    className="
                      hidden
                      rounded-lg
                      bg-[#F0E5DA]
                      px-2
                      py-1
                      text-[10px]
                      font-semibold
                      text-[#8B5E3C]
                      sm:block
                    "
                  >
                    DOCX
                  </span>

                  <span className="text-[#9B8979]">⋮</span>
                </div>
              ))}
            </div>

            <div
              className="
                mt-4
                rounded-2xl
                bg-[#F3E9DE]
                px-4
                py-3
                text-sm
                text-[#76553D]
                dark:bg-[#30241C]
                dark:text-[#C9A88F]
              "
            >
              Total {documentsCount} documents in your knowledge base
            </div>
          </div>

          {/* QUICK ACTIONS */}

          <div
            className="
              rounded-[28px]
              border
              border-[#E9DED2]
              bg-white
              p-5
              shadow-[0_12px_35px_rgba(91,56,34,0.07)]
              sm:p-6
              dark:border-white/10
              dark:bg-[#1A1410]
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  rounded-xl
                  bg-[#F1E7DD]
                  p-2.5
                  text-[#8B5E3C]
                "
              >
                ⚡
              </div>

              <h2
                className="
                  text-xl
                  font-bold
                  text-[#4A3021]
                  dark:text-white
                "
              >
                Quick Actions
              </h2>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                onClick={() => navigate("/upload")}
                className="
                  group
                  rounded-2xl
                  border
                  border-[#E9DED2]
                  bg-[#FCF8F3]
                  p-4
                  text-left
                  transition
                  hover:-translate-y-1
                  hover:border-[#C8956B]
                  hover:shadow-lg
                  dark:border-white/10
                  dark:bg-white/5
                "
              >
                <FiUploadCloud className="mb-3 text-[#9B5E35]" size={22} />

                <p className="font-semibold text-[#4A3021] dark:text-white">
                  Upload Document
                </p>

                <p className="mt-1 text-xs text-[#927B69] dark:text-gray-400">
                  Add new documents
                </p>
              </button>

              <button
                onClick={() => {
                  document.querySelector("#dashboard-question-input")?.focus();
                }}
                className="
                  rounded-2xl
                  border
                  border-[#E9DED2]
                  bg-[#FCF8F3]
                  p-4
                  text-left
                  transition
                  hover:-translate-y-1
                  hover:border-[#C8956B]
                  hover:shadow-lg
                  dark:border-white/10
                  dark:bg-white/5
                "
              >
                <FiMessageSquare className="mb-3 text-[#8B5E3C]" size={22} />

                <p className="font-semibold text-[#4A3021] dark:text-white">
                  Ask AI
                </p>

                <p className="mt-1 text-xs text-[#927B69] dark:text-gray-400">
                  Get instant answers
                </p>
              </button>

              <button
                onClick={() => navigate("/documents")}
                className="
                  rounded-2xl
                  border
                  border-[#E9DED2]
                  bg-[#FCF8F3]
                  p-4
                  text-left
                  transition
                  hover:-translate-y-1
                  hover:border-[#C8956B]
                  hover:shadow-lg
                  dark:border-white/10
                  dark:bg-white/5
                "
              >
                <FiBookOpen className="mb-3 text-[#8B5E3C]" size={22} />

                <p className="font-semibold text-[#4A3021] dark:text-white">
                  View Documents
                </p>

                <p className="mt-1 text-xs text-[#927B69] dark:text-gray-400">
                  Browse your documents
                </p>
              </button>

              <button
                onClick={() => navigate("/analytics")}
                className="
                  rounded-2xl
                  border
                  border-[#E9DED2]
                  bg-[#FCF8F3]
                  p-4
                  text-left
                  transition
                  hover:-translate-y-1
                  hover:border-[#C8956B]
                  hover:shadow-lg
                  dark:border-white/10
                  dark:bg-white/5
                "
              >
                <FiRefreshCw className="mb-3 text-[#8B5E3C]" size={22} />

                <p className="font-semibold text-[#4A3021] dark:text-white">
                  Analytics
                </p>

                <p className="mt-1 text-xs text-[#927B69] dark:text-gray-400">
                  Explore your insights
                </p>
              </button>
            </div>
          </div>
        </section>

        {/* =====================================================
            ASK YOUR DOCUMENTS
        ===================================================== */}

        <section
          className="
            relative
            overflow-hidden
            rounded-[28px]
            border
            border-[#E7D7C7]
            bg-gradient-to-br
            from-[#FFF9F2]
            via-[#FBF4EC]
            to-[#F1E4D6]
            p-5
            shadow-[0_15px_45px_rgba(91,56,34,0.08)]
            sm:p-7
            lg:p-8
            dark:border-white/10
            dark:from-[#211811]
            dark:via-[#19130F]
            dark:to-[#120E0B]
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              -right-20
              -top-20
              h-60
              w-60
              rounded-full
              bg-[#C47D43]/10
              blur-3xl
            "
          />

          <div className="relative z-10">
            <div
              className="
                flex
                flex-col
                gap-4
                sm:flex-row
                sm:items-center
              "
            >
              <div
                className="
                  flex
                  h-14
                  w-14
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  bg-gradient-to-br
                  from-[#9B633D]
                  to-[#59351F]
                  text-white
                  shadow-lg
                "
              >
                <FiCpu size={25} />
              </div>

              <div>
                <h2
                  className="
                    text-2xl
                    font-bold
                    text-[#4A3021]
                    dark:text-white
                  "
                >
                  Ask your documents
                </h2>

                <p
                  className="
                    mt-1
                    text-sm
                    text-[#8B7767]
                    dark:text-gray-400
                  "
                >
                  Ask questions and get answers from your knowledge base.
                </p>
              </div>
            </div>

            <div
              className="
                mt-6
                flex
                flex-col
                gap-3
                lg:flex-row
              "
            >
              <input
                id="dashboard-question-input"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
                placeholder="Example: What is the leave policy?"
                className="
                  min-w-0
                  flex-1
                  rounded-2xl
                  border
                  border-[#E4D5C6]
                  bg-white/90
                  px-5
                  py-4
                  text-sm
                  text-[#4A3021]
                  outline-none
                  transition
                  placeholder:text-[#B1A092]
                  focus:border-[#A66B43]
                  focus:ring-4
                  focus:ring-[#A66B43]/10
                  dark:border-white/10
                  dark:bg-white/5
                  dark:text-white
                  dark:placeholder:text-gray-500
                "
              />

              <button
                onClick={handleSearch}
                disabled={loadingAnswer}
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-2xl
                  bg-gradient-to-r
                  from-[#9A5F37]
                  to-[#6E4026]
                  px-7
                  py-4
                  font-semibold
                  text-white
                  shadow-lg
                  shadow-[#6E4026]/20
                  transition
                  duration-300
                  hover:-translate-y-0.5
                  hover:shadow-xl
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                <FiCpu size={18} />
                {loadingAnswer ? "Thinking..." : "Ask AI"}
              </button>
            </div>

            {loadingAnswer && (
              <div
                className="
                  mt-5
                  rounded-2xl
                  border
                  border-[#E8D8C9]
                  bg-white/70
                  p-4
                  text-sm
                  text-[#76553D]
                  backdrop-blur
                  dark:border-white/10
                  dark:bg-white/5
                  dark:text-gray-300
                "
              >
                <span className="inline-flex items-center gap-2">
                  <span
                    className="
                      h-2
                      w-2
                      animate-pulse
                      rounded-full
                      bg-[#A7653A]
                    "
                  />
                  AI is analyzing your documents...
                </span>
              </div>
            )}
          </div>
        </section>

        {/* =====================================================
            AI ANSWER
        ===================================================== */}

        {answer && (
          <section
            ref={answerRef}
            className="
              overflow-hidden
              rounded-[28px]
              border
              border-[#E5D8CC]
              bg-white
              shadow-[0_20px_55px_rgba(91,56,34,0.10)]
              dark:border-white/10
              dark:bg-[#17110D]
            "
          >
            <div
              className="
                flex
                flex-col
                gap-4
                border-b
                border-[#EEE5DC]
                px-5
                py-5
                sm:flex-row
                sm:items-center
                sm:justify-between
                sm:px-7
                dark:border-white/10
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    rounded-xl
                    bg-[#F1E7DD]
                    p-2.5
                    text-[#8B5E3C]
                    dark:bg-[#30241C]
                  "
                >
                  <FiCpu size={21} />
                </div>

                <div>
                  <h3
                    className="
                      text-xl
                      font-bold
                      text-[#4A3021]
                      dark:text-white
                    "
                  >
                    AI Assistant
                  </h3>

                  <div
                    className="
                      mt-1
                      flex
                      items-center
                      gap-3
                      text-xs
                      text-[#978575]
                    "
                  >
                    {responseTime && (
                      <span className="flex items-center gap-1">
                        <FiClock />
                        {responseTime}s
                      </span>
                    )}

                    <span className="flex items-center gap-1">
                      <FiBookOpen />
                      Knowledge Base
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={copyAnswer}
                  title="Copy answer"
                  className="
                    rounded-xl
                    border
                    border-[#E8DED3]
                    bg-[#FBF8F4]
                    p-3
                    text-[#8B5E3C]
                    transition
                    hover:bg-[#F1E7DD]
                    dark:border-white/10
                    dark:bg-white/5
                    dark:text-white
                  "
                >
                  <FiCopy />
                </button>

                <button
                  onClick={regenerateAnswer}
                  title="Regenerate"
                  className="
                    rounded-xl
                    border
                    border-[#E8DED3]
                    bg-[#FBF8F4]
                    p-3
                    text-[#8B5E3C]
                    transition
                    hover:bg-[#F1E7DD]
                    dark:border-white/10
                    dark:bg-white/5
                    dark:text-white
                  "
                >
                  <FiRefreshCw />
                </button>

                <button
                  onClick={downloadAnswer}
                  title="Download"
                  className="
                    rounded-xl
                    border
                    border-[#E8DED3]
                    bg-[#FBF8F4]
                    p-3
                    text-[#8B5E3C]
                    transition
                    hover:bg-[#F1E7DD]
                    dark:border-white/10
                    dark:bg-white/5
                    dark:text-white
                  "
                >
                  <FiDownload />
                </button>
              </div>
            </div>

            <div className="px-5 py-6 sm:px-7">
              <h4
                className="
                  mb-4
                  text-sm
                  font-bold
                  uppercase
                  tracking-wider
                  text-[#9A6C4A]
                "
              >
                AI Answer
              </h4>

              <p
                className="
                  whitespace-pre-wrap
                  text-sm
                  leading-7
                  text-[#51463F]
                  sm:text-base
                  sm:leading-8
                  dark:text-gray-300
                "
              >
                {answer}
              </p>
            </div>
          </section>
        )}
      </main>

      {/* =====================================================
          CARD WAVE STYLES
      ===================================================== */}

      <style>{`
        .dashboard-stat-card {
          position: relative;
          min-height: 185px;
          overflow: hidden;
          border-radius: 22px;
          border: 1px solid #E9DED2;
          background: #FFFFFF;

          box-shadow:
            0 8px 28px rgba(91, 56, 34, 0.06);

          transition:
            transform 300ms ease,
            box-shadow 300ms ease,
            border-color 300ms ease;
        }

        .dashboard-stat-card:hover {
          transform: translateY(-4px);

          box-shadow:
            0 15px 35px rgba(91, 56, 34, 0.11);
        }

        .dark .dashboard-stat-card {
          border-color: rgba(255, 255, 255, 0.10);
          background: #1A1410;
        }

        .dashboard-card-content {
          position: relative;
          z-index: 10;
          height: 100%;

          padding:
            20px
            24px
            58px
            24px;
        }

        /*
        ========================================================
        WAVE
        ========================================================
        
        */

        .dashboard-wave-container {
          position: absolute;

          left: 0;
          right: 0;

          bottom: 5px;

          height: 62px;

          overflow: visible;

          pointer-events: none;

          z-index: 2;
        }

        .dashboard-wave-svg {
          position: absolute;

          left: 0;
          bottom: 0;

          width: 100%;
          height: 62px;

          overflow: visible;
        }

        .dashboard-wave-svg path.wave-main {
          fill: none;

          stroke: #B8794A;

          stroke-width: 1.5;

          stroke-linecap: round;
          stroke-linejoin: round;

          vector-effect: non-scaling-stroke;

          opacity: 0.72;
        }

        .dashboard-wave-svg path.wave-secondary {
          fill: none;

          stroke: #D4A77D;

          stroke-width: 1;

          stroke-linecap: round;
          stroke-linejoin: round;

          vector-effect: non-scaling-stroke;

          opacity: 0.28;
        }

        /*
        ========================================================
        DIFFERENT CARD COLORS
        ========================================================
        */

        .dashboard-wave-one path.wave-main {
          stroke: #B8794A;
        }

        .dashboard-wave-two path.wave-main {
          stroke: #C58A5B;
          opacity: 0.70;
        }

        .dashboard-wave-three path.wave-main {
          stroke: #9B806D;
          opacity: 0.65;
        }

        /*
        ========================================================
        MOBILE
        ========================================================
        */

        @media (max-width: 640px) {
          .dashboard-card-content {
            padding:
              18px
              18px
              54px
              18px;
          }

          .dashboard-wave-container {
            height: 54px;
          }

          .dashboard-wave-svg {
            height: 54px;
          }
        }
      `}</style>
    </div>
  );
}

/*
================================================================
REUSABLE DASHBOARD WAVE
================================================================

*/

function DashboardWave({ type = "one" }) {
  const wavePaths = {
    one: `
  M0 51
  C80 52 105 30 180 40
  C250 50 260 20 340 30
  C420 40 450 15 530 25
  C620 32 650 14 730 16
  C820 28 890 13 1000 -25
`,

    two: `
      M0 51
  C80 52 105 30 180 40
  C250 50 260 20 340 30
  C420 40 450 15 530 25
  C620 32 650 14 730 16
  C820 28 890 13 1000 -25
    `,

    three: `
      M0 51
  C80 52 105 30 180 40
  C250 50 260 20 340 30
  C420 40 450 15 530 25
  C620 32 650 14 730 16
  C820 28 890 13 1000 -25
    `,
  };

  const selectedPath = wavePaths[type] || wavePaths.one;

  const pathId = `dashboard-wave-path-${type}`;

  return (
    <div className="dashboard-wave-container">
      <svg
        className="dashboard-wave-svg"
        viewBox="0 0 1000 39"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id={`waveGradient-${type}`}
            x1="0"
            y1="0"
            x2="1"
            y2="0"
          >
            <stop offset="0%" stopColor="#B8794A" stopOpacity="0" />

            <stop offset="100%" stopColor="#B8794A" stopOpacity="0.20" />
          </linearGradient>
        </defs>

        <path
          d={`${selectedPath} L1000 62 L0 62 Z`}
          fill={`url(#waveGradient-${type})`}
        />

        <path id={pathId} d={selectedPath} className="wave-main" />

        <path
          d={`
            M0 57
            C90 58 130 43 210 48
            C290 53 330 34 410 40
            C490 46 530 28 610 34
            C690 40 740 26 820 28
            C900 30 950 18 1000 18
          `}
          className="wave-secondary"
        />

        {/* =====================================================
            MOVING DOT 1
        ===================================================== */}

        <circle r="4" fill="#B8794A" opacity="0.95">
          <animateMotion dur="5s" repeatCount="indefinite" rotate="auto">
            <mpath href={`#${pathId}`} />
          </animateMotion>
        </circle>

        {/* =====================================================
            MOVING DOT 2
        ===================================================== */}

        <circle r="2.8" fill="#D18B50" opacity="0.75">
          <animateMotion
            dur="7s"
            begin="1.8s"
            repeatCount="indefinite"
            rotate="auto"
          >
            <mpath href={`#${pathId}`} />
          </animateMotion>
        </circle>
      </svg>
    </div>
  );
}
