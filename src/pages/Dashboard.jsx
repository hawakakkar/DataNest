import { useEffect, useState } from "react";
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

export default function Dashboard() {
  const navigate = useNavigate();

  const [documentsCount, setDocumentsCount] = useState(0);
  const [chunksCount, setChunksCount] = useState(0);
  const [questionsCount, setQuestionsCount] = useState(0);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loadingAnswer, setLoadingAnswer] = useState(false);

  const [sources, setSources] = useState([]);
  const [responseTime, setResponseTime] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const { count: docs } = await supabase
      .from("documents")
      .select("*", { count: "exact", head: true });

    const { count: chunks } = await supabase
      .from("chunks")
      .select("*", { count: "exact", head: true });

    const { count: questions } = await supabase
      .from("questions")
      .select("*", { count: "exact", head: true });

    setDocumentsCount(docs || 0);
    setChunksCount(chunks || 0);
    setQuestionsCount(questions || 0);
  }

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

      const endTime = performance.now();

      setResponseTime(((endTime - startTime) / 1000).toFixed(2));

      setAnswer(aiAnswer);

      await supabase.from("questions").insert([
        {
          query: question,
          answer: aiAnswer,
        },
      ]);

      loadStats();
    } catch (error) {
      console.error(error);

      setAnswer("Something went wrong while asking AI.");
    } finally {
      setLoadingAnswer(false);
    }
  }

  function copyAnswer() {
    navigator.clipboard.writeText(answer);
    alert("Answer copied!");
  }

  function regenerateAnswer() {
    handleSearch();
  }

  function downloadAnswer() {
    const blob = new Blob([answer], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "AI_Answer.txt";
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-8 px-4 lg:px-6 bg-transparent">
      {/* Welcome */}
      <section
        className="
        rounded-[32px]
        bg-gradient-to-r
        from-[#8B5E3C]
        via-[#5A3F2A]
        to-[#8B5E3C]
        p-10
        text-white
        shadow-2xl 
      "
      >
        <h1 className="flex items-center gap-3 text-4xl font-bold">
          Welcome to DataNest AI
          <FiCpu className="text-[#f1efec]" size={34} />
        </h1>

        <p className="mt-3 max-w-2xl text-lg leading-8 text-gray-100">
          Centralize your organization's documents and ask AI-powered questions
          to instantly find accurate information.
        </p>

        <button
          onClick={() => navigate("/upload")}
          className="
            mt-8
            flex
            items-center
            gap-2
            rounded-2xl
            bg-white
            px-7
            py-4
            font-semibold
            text-[#8B5E3C]
            shadow-lg
            transition
            hover:scale-105
            dark:bg-[#2B2B2B]
            dark:text-white
          "
        >
          <FiUploadCloud size={20} />
          Upload Document
        </button>
      </section>

      {/* Statistics */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Documents */}
        <div
          className="
          flex
          items-center
          gap-5
          rounded-3xl
          border
          border-[#ECE6DE]
          bg-white
          p-8
          shadow-lg
          transition-all
          duration-300
          hover:-translate-y-2
          hover:border-[#8B5E3C]
          hover:shadow-2xl

          dark:border-gray-700
          dark:bg-[#1F2937]
        "
        >
          <div
            className="
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-2xl
            bg-[#EFE7DE]
            text-[#8B5E3C]

            dark:bg-[#374151]
            dark:text-[#D6A97A]
          "
          >
            <FiFileText size={28} />
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400">Documents</p>

            <h2 className="text-3xl font-bold text-[#5A3F2A] dark:text-white">
              {documentsCount}
            </h2>
          </div>
        </div>

        {/* Indexed Chunks */}
        <div
          className="
          flex
          items-center
          gap-5
          rounded-3xl
          border
          border-[#ECE6DE]
          bg-white
          p-8
          shadow-lg
          transition-all
          duration-300
          hover:-translate-y-2
          hover:border-[#8B5E3C]
          hover:shadow-2xl

          dark:border-gray-700
          dark:bg-[#1F2937]
        "
        >
          <div
            className="
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-2xl
            bg-[#EFE7DE]
            text-[#8B5E3C]

            dark:bg-[#374151]
            dark:text-[#D6A97A]
          "
          >
            <FiDatabase size={28} />
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400">Indexed Chunks</p>

            <h2 className="text-3xl font-bold text-[#5A3F2A] dark:text-white">
              {chunksCount}
            </h2>
          </div>
        </div>

        {/* AI Questions */}
        <div
          className="
          flex
          items-center
          gap-5
          rounded-3xl
          border
          border-[#ECE6DE]
          bg-white
          p-8
          shadow-lg
          transition-all
          duration-300
          hover:-translate-y-2
          hover:border-[#8B5E3C]
          hover:shadow-2xl

          dark:border-gray-700
          dark:bg-[#1F2937]
        "
        >
          <div
            className="
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-2xl
            bg-[#EFE7DE]
            text-[#8B5E3C]

            dark:bg-[#374151]
            dark:text-[#D6A97A]
          "
          >
            <FiMessageSquare size={28} />
          </div>

          <div>
            <p className="text-[#7A746E] dark:text-gray-400">AI Questions</p>

            <h2 className="text-3xl font-bold text-[#5A3F2A] dark:text-white">
              {questionsCount}
            </h2>
          </div>
        </div>
      </section>
      {/* Ask AI */}
      <section
        className="
        bg-white
        dark:bg-[#1F2937]
        border
        border-[#ECE6DE]
        dark:border-gray-700
        rounded-3xl
        shadow-lg
        p-8
      "
      >
        <h2 className="text-3xl font-bold text-[#5A3F2A] dark:text-white">
          Ask your documents
        </h2>

        <p className="mt-2 text-[#7A746E] dark:text-gray-400">
          Ask questions and get answers from your knowledge base.
        </p>

        <div className="flex gap-3 mt-5">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Example: What is the leave policy?"
            className="
              flex-1
              rounded-3xl
              border
              border-[#ECE6DE]
              dark:border-gray-600
              bg-[#F8F6F2]
              dark:bg-[#111827]
              dark:text-white
              dark:placeholder:text-gray-400
              px-6
              py-5
              text-lg
              outline-none
              focus:border-[#8B5E3C]
            "
          />

          <button
            onClick={handleSearch}
            disabled={loadingAnswer}
            className="
              rounded-2xl
              bg-[#8B5E3C]
              px-8
              text-white
              transition
              hover:bg-[#70492C]
              disabled:opacity-60
            "
          >
            {loadingAnswer ? "Thinking..." : "Ask AI"}
          </button>
        </div>

        {loadingAnswer && (
          <div
            className="
              mt-6
              rounded-2xl
              border
              border-[#ECE6DE]
              dark:border-gray-600
              bg-[#F8F6F2]
              dark:bg-[#111827]
              p-5
            "
          >
            <p className="text-[#5A3F2A] dark:text-white">
              AI is analyzing your documents...
            </p>
          </div>
        )}

        {answer && (
          <div
            className="
              mt-8
              rounded-[30px]
              border
              border-[#ECE6DE]
              dark:border-gray-700
              bg-white
              dark:bg-[#111827]
              shadow-xl
            "
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[#ECE6DE] dark:border-gray-700 px-6 py-5">
              <div>
                <h3 className="flex items-center gap-3 text-2xl font-bold text-[#5A3F2A] dark:text-white">
                  <div
                    className="
                      rounded-xl
                      bg-[#EFE7DE]
                      dark:bg-[#374151]
                      p-2
                      text-[#8B5E3C]
                    "
                  >
                    <FiCpu size={22} />
                  </div>
                  AI Assistant
                </h3>

                <div className="mt-3 flex gap-6 text-sm text-[#7A746E] dark:text-gray-400">
                  {responseTime && (
                    <span className="flex items-center gap-2">
                      <FiClock />
                      {responseTime}s
                    </span>
                  )}

                  <span className="flex items-center gap-2">
                    <FiBookOpen />
                    {sources.length} Sources
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={copyAnswer}
                  className="
                    rounded-lg
                    bg-[#F8F6F2]
                    dark:bg-[#374151]
                    p-3
                    text-[#8B5E3C]
                    dark:text-white
                    transition
                    hover:bg-[#EFE7DE]
                    dark:hover:bg-[#4B5563]
                  "
                >
                  <FiCopy />
                </button>

                <button
                  onClick={regenerateAnswer}
                  className="
                    rounded-lg
                    bg-[#F8F6F2]
                    dark:bg-[#374151]
                    p-3
                    text-[#8B5E3C]
                    dark:text-white
                    transition
                    hover:bg-[#EFE7DE]
                    dark:hover:bg-[#4B5563]
                  "
                >
                  <FiRefreshCw />
                </button>
              </div>
            </div>
            {/* Answer */}
            <div className="px-4 sm:px-6 py-4 sm:py-6">
              <h4 className="mb-4 text-base sm:text-lg font-semibold text-[#5A3F2A] dark:text-white">
                AI Answer
              </h4>

              <p
                className="
                  whitespace-pre-wrap
                  leading-7 sm:leading-8
                  text-sm sm:text-base
                  text-[#444444]
                  dark:text-gray-300
                "
              >
                {answer}
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
