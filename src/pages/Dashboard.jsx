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

      const bestSource = results.reduce((best, current) =>
        current.similarity > best.similarity ? current : best,
      );

      setSources([bestSource]);

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
    <div className="space-y-8 px-4 lg:px-6">
      {/* Welcome */}
      <section className="rounded-[32px] bg-gradient-to-r from-[#8B5E3C] via-[#5a3f2a] to-[#8B5E3C] p-10 text-white shadow-2xl">
        <h1 className="text-3xl font-bold">Welcome to DataNest AI 🚀</h1>

        <p className="mt-3 text-white-90 max-w-2xl leading-8 text-lg">
          Centralize your organization's documents and ask AI-powered questions
          to instantly find accurate information.
        </p>

        <button
          onClick={() => navigate("/upload")}
          className="mt-8 flex items-center gap-2 bg-white text-[#8B5E3C] px-7 py-4 rounded-2xl font-semibold shadow-lg hover:scale-105 transition"
        >
          <FiUploadCloud size={20} />
          Upload Document
        </button>
      </section>

      {/* Statistics */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Documents */}
        <div
          className="
      bg-white
      rounded-3xl
      border
      border-[#ECE6DE]
      shadow-lg
      p-8
      flex
      gap-5
      items-center
      cursor-pointer
      transition-all
      duration-300
      hover:-translate-y-2
      hover:shadow-2xl
      hover:border-[#8B5E3C]
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
            <FiFileText size={28} />
          </div>

          <div>
            <p className="text-gray-500">Documents</p>
            <h2 className="text-3xl font-bold text-[#5A3F2A]">
              {documentsCount}
            </h2>
          </div>
        </div>

        {/* Indexed Chunks */}
        <div
          className="
      bg-white
      rounded-3xl
      border
      border-[#ECE6DE]
      shadow-lg
      p-8
      flex
      gap-5
      items-center
      cursor-pointer
      transition-all
      duration-300
      hover:-translate-y-2
      hover:shadow-2xl
      hover:border-[#8B5E3C]
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

          <div>
            <p className="text-gray-500">Indexed Chunks</p>
            <h2 className="text-3xl font-bold text-[#5A3F2A]">{chunksCount}</h2>
          </div>
        </div>

        {/* AI Questions */}
        <div
          className="
    bg-white
    rounded-3xl
    border
    border-[#ECE6DE]
    shadow-lg
    p-8
    flex
    gap-5
    items-center
    cursor-pointer
    transition-all
    duration-300
    hover:-translate-y-2
    hover:shadow-2xl
    hover:border-[#8B5E3C]
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
            <FiMessageSquare size={28} />
          </div>

          <div>
            <p className="text-[#7A746E]">AI Questions</p>
            <h2 className="text-3xl font-bold text-[#5A3F2A]">
              {questionsCount}
            </h2>
          </div>
        </div>
      </section>

      {/* Ask AI */}
      <section
        className="
    bg-white
    rounded-3xl
    border
    border-[#ECE6DE]
    shadow-lg
    p-8
  "
      >
        <h2 className="text-3xl font-bold text-[#5A3F2A]">
          Ask your documents
        </h2>

        <p className="text-[#7A746E] mt-2">
          Ask questions and get answers from your knowledge base.
        </p>

        <div className="flex gap-3 mt-5">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Example: What is the leave policy?"
            className="
        flex-1
        bg-[#F8F6F2]
        border
        border-[#ECE6DE]
        rounded-3xl
        px-6
        py-5
        outline-none
        text-lg
        focus:border-[#8B5E3C]
      "
          />

          <button
            onClick={handleSearch}
            disabled={loadingAnswer}
            className="
        bg-[#8B5E3C]
        hover:bg-[#70492C]
        text-white
        px-8
        rounded-2xl
        transition
        disabled:opacity-60
      "
          >
            {loadingAnswer ? "Thinking..." : "Ask AI"}
          </button>
        </div>

        {loadingAnswer && (
          <div className="mt-6 rounded-2xl bg-[#F8F6F2] p-5 border border-[#ECE6DE]">
            <p className="text-[#5A3F2A]">AI is analyzing your documents...</p>
          </div>
        )}

        {answer && (
          <div
            className="
        mt-8
        bg-white
        rounded-[30px]
        border
        border-[#ECE6DE]
        shadow-xl
      "
          >
            {/* Header */}
            <div className="border-b border-[#ECE6DE] px-6 py-5 flex justify-between items-start">
              <div>
                <h3 className="flex items-center gap-3 text-2xl font-bold text-[#5A3F2A]">
                  <div className="bg-[#EFE7DE] p-2 rounded-xl text-[#8B5E3C]">
                    <FiCpu size={22} />
                  </div>
                  AI Assistant
                </h3>

                <div className="flex gap-6 mt-3 text-sm text-[#7A746E]">
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
                  className="bg-[#F8F6F2] hover:bg-[#EFE7DE] text-[#8B5E3C] p-3 rounded-lg transition"
                >
                  <FiCopy />
                </button>

                <button
                  onClick={regenerateAnswer}
                  className="bg-[#F8F6F2] hover:bg-[#EFE7DE] text-[#8B5E3C] p-3 rounded-lg transition"
                >
                  <FiRefreshCw />
                </button>

                <button
                  onClick={downloadAnswer}
                  className="bg-[#F8F6F2] hover:bg-[#EFE7DE] text-[#8B5E3C] p-3 rounded-lg transition"
                >
                  <FiDownload />
                </button>
              </div>
            </div>

            {/* Answer */}
            <div className="px-6 py-6">
              <h4 className="font-semibold mb-4 text-lg text-[#5A3F2A]">
                AI Answer
              </h4>

              <p className="leading-8 whitespace-pre-wrap text-[#444444]">
                {answer}
              </p>
            </div>

            {/* Sources */}
            {sources.length > 0 && (
              <div className="border-t border-[#ECE6DE] px-6 py-6">
                <h4 className="font-bold text-lg mb-4 text-[#5A3F2A]">
                  📄 Sources
                </h4>

                <div className="space-y-3">
                  {sources.map((source, index) => (
                    <div
                      key={index}
                      className="
                  border
                  border-[#ECE6DE]
                  rounded-xl
                  p-4
                  bg-[#F8F6F2]
                  hover:bg-[#EFE7DE]
                  transition
                  flex
                  justify-between
                  items-center
                "
                    >
                      <div>
                        <p className="font-semibold text-[#5A3F2A]">
                          📄 {source.file_name}
                        </p>

                        <p className="text-xs text-[#7A746E] mt-1">
                          Similarity: {(source.similarity * 100).toFixed(1)}%
                        </p>
                      </div>

                      <span
                        className="
                    bg-[#8B5E3C]
                    text-white
                    text-xs
                    px-3
                    py-1
                    rounded-full
                  "
                      >
                        Match {(source.similarity * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
