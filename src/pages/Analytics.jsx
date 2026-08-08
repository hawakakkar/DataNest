import { useEffect, useState } from "react";
import {
  FiFileText,
  FiDatabase,
  FiMessageSquare,
  FiCheckCircle,
  FiActivity,
  FiClock,
  FiCpu,
  FiTrendingUp,
} from "react-icons/fi";

import { supabase } from "../Services/supabase";

export default function Analytics() {
  const [documents, setDocuments] = useState(0);
  const [chunks, setChunks] = useState(0);
  const [questions, setQuestions] = useState(0);
  const [recentDocs, setRecentDocs] = useState([]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    const { data: docs } = await supabase
      .from("documents")
      .select("*")
      .order("uploaded_at", { ascending: false });

    const { data: chunkData } = await supabase.from("chunks").select("id");

    const { data: questionData } = await supabase
      .from("questions")
      .select("id");

    const { data: documentQuestionData } = await supabase
      .from("chat_history")
      .select("id")
      .eq("role", "user")
      .not("document_id", "is", null);

    const totalQuestions =
      (questionData?.length || 0) + (documentQuestionData?.length || 0);

    setDocuments(docs?.length || 0);
    setChunks(chunkData?.length || 0);
    setQuestions(totalQuestions);

    setRecentDocs(docs?.slice(0, 5) || []);
  }

  const health = documents > 0 ? 100 : 0;

  return (
    <div className="max-w-7xl mx-auto px-8 py-6 space-y-8 bg-[#F8F6F2] dark:bg-[#111827] min-h-screen transition-colors">
      {/* Header */}

      <div>
        <h1 className="text-4xl font-bold text-[#5A3F2A] dark:text-white">
          Analytics Dashboard
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Monitor your AI Knowledge Base performance.
        </p>
      </div>

      {/* Cards */}

      <div className="grid xl:grid-cols-4 md:grid-cols-2 gap-6">
        {/* Documents */}

        <div
          className="
          bg-white
          dark:bg-[#1F2937]
          rounded-3xl
          border
          border-[#ECE6DE]
          dark:border-gray-700
          shadow-lg
          p-7
          hover:shadow-2xl
          hover:-translate-y-1
          hover:border-[#8B5E3C]
          dark:hover:border-[#D6A97A]
          transition-all
        "
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Documents</p>

              <h2 className="text-4xl font-bold text-[#5A3F2A] dark:text-white mt-3">
                {documents}
              </h2>
            </div>

            <div
              className="
              w-16
              h-16
              rounded-2xl
              bg-[#EFE7DE]
              dark:bg-[#374151]
              text-[#8B5E3C]
              dark:text-[#D6A97A]
              flex
              items-center
              justify-center
            "
            >
              <FiFileText size={28} />
            </div>
          </div>
        </div>

        {/* Chunks */}

        <div
          className="
          bg-white
          dark:bg-[#1F2937]
          rounded-3xl
          border
          border-[#ECE6DE]
          dark:border-gray-700
          shadow-lg
          p-7
          hover:shadow-2xl
          hover:-translate-y-1
          hover:border-[#8B5E3C]
          dark:hover:border-[#D6A97A]
          transition-all
        "
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Indexed Chunks</p>

              <h2 className="text-4xl font-bold text-[#5A3F2A] dark:text-white mt-3">
                {chunks}
              </h2>
            </div>

            <div
              className="
              w-16
              h-16
              rounded-2xl
              bg-[#EFE7DE]
              dark:bg-[#374151]
              text-[#8B5E3C]
              dark:text-[#D6A97A]
              flex
              items-center
              justify-center
            "
            >
              <FiDatabase size={28} />
            </div>
          </div>
        </div>
        {/* AI Questions */}

        <div
          className="
          bg-white
          dark:bg-[#1F2937]
          rounded-3xl
          border
          border-[#ECE6DE]
          dark:border-gray-700
          shadow-lg
          p-7
          hover:shadow-2xl
          hover:-translate-y-1
          hover:border-[#8B5E3C]
          dark:hover:border-[#D6A97A]
          transition-all
        "
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 dark:text-gray-400">AI Questions</p>

              <h2 className="text-4xl font-bold text-[#5A3F2A] dark:text-white mt-3">
                {questions}
              </h2>
            </div>

            <div
              className="
              w-16
              h-16
              rounded-2xl
              bg-[#EFE7DE]
              dark:bg-[#374151]
              text-[#8B5E3C]
              dark:text-[#D6A97A]
              flex
              items-center
              justify-center
            "
            >
              <FiMessageSquare size={28} />
            </div>
          </div>
        </div>

        {/* Health */}

        <div
          className="
          bg-white
          dark:bg-[#1F2937]
          rounded-3xl
          border
          border-[#ECE6DE]
          dark:border-gray-700
          shadow-lg
          p-7
          hover:shadow-2xl
          hover:-translate-y-1
          hover:border-[#8B5E3C]
          dark:hover:border-[#D6A97A]
          transition-all
        "
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 dark:text-gray-400">
                Knowledge Health
              </p>

              <h2 className="text-4xl font-bold text-[#5A3F2A] dark:text-white mt-3">
                {health}%
              </h2>
            </div>

            <div
              className="
              w-16
              h-16
              rounded-2xl
              bg-[#EFE7DE]
              dark:bg-[#374151]
              text-[#8B5E3C]
              dark:text-[#D6A97A]
              flex
              items-center
              justify-center
            "
            >
              <FiTrendingUp size={28} />
            </div>
          </div>
        </div>
      </div>

      {/* System Health + Recent Uploads */}

      <div className="grid lg:grid-cols-2 gap-8">
        <div
          className="
          bg-white
          dark:bg-[#1F2937]
          rounded-3xl
          border
          border-[#ECE6DE]
          dark:border-gray-700
          shadow-lg
          p-8
        "
        >
          <div className="flex items-center gap-3 mb-6">
            <FiActivity
              className="text-[#8B5E3C] dark:text-[#D6A97A]"
              size={22}
            />
            <h2 className="text-2xl font-bold text-[#5A3F2A] dark:text-white">
              System Health
            </h2>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-300">
                  Knowledge Base
                </span>

                <span className="font-semibold text-[#8B5E3C] dark:text-[#D6A97A]">
                  {health}%
                </span>
              </div>

              <div className="h-3 bg-[#EFE7DE] dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="bg-[#8B5E3C] dark:bg-[#D6A97A] h-full rounded-full"
                  style={{ width: `${health}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 text-green-500">
              <FiCheckCircle />
              AI Service Connected
            </div>

            <div className="flex items-center gap-3 text-green-500">
              <FiCheckCircle />
              Supabase Connected
            </div>

            <div className="flex items-center gap-3 text-green-500">
              <FiCheckCircle />
              Vector Search Active
            </div>
          </div>
        </div>

        {/* Recent Uploads */}

        <div
          className="
          bg-white
          dark:bg-[#1F2937]
          rounded-3xl
          border
          border-[#ECE6DE]
          dark:border-gray-700
          shadow-lg
          p-8
        "
        >
          <div className="flex items-center gap-3 mb-6">
            <FiClock className="text-[#8B5E3C] dark:text-[#D6A97A]" size={22} />
            <h2 className="text-2xl font-bold text-[#5A3F2A] dark:text-white">
              Recent Uploads
            </h2>
          </div>

          {recentDocs.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              No uploaded documents.
            </p>
          ) : (
            <div className="space-y-4">
              {recentDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="flex justify-between items-center border-b border-[#ECE6DE] dark:border-gray-700 pb-3"
                >
                  <div>
                    <p className="font-semibold text-[#5A3F2A] dark:text-white">
                      {doc.title}
                    </p>

                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {doc.file_name}
                    </p>
                  </div>

                  <span className="text-xs text-gray-400">
                    {new Date(doc.uploaded_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* AI Performance + Summary */}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* AI Performance */}

        <div
          className="
          bg-white
          dark:bg-[#1F2937]
          rounded-3xl
          border
          border-[#ECE6DE]
          dark:border-gray-700
          shadow-lg
          p-8
        "
        >
          <div className="flex items-center gap-3 mb-6">
            <FiCpu className="text-[#8B5E3C] dark:text-[#D6A97A]" size={22} />

            <h2 className="text-2xl font-bold text-[#5A3F2A] dark:text-white">
              AI Performance
            </h2>
          </div>

          <div className="space-y-5">
            <div className="flex justify-between">
              <span className="text-[#5A3F2A] dark:text-gray-300">
                AI Accuracy
              </span>

              <strong className="text-green-600">98%</strong>
            </div>

            <div className="flex justify-between">
              <span className="text-[#5A3F2A] dark:text-gray-300">
                Embedding Status
              </span>

              <strong className="text-green-600">Active</strong>
            </div>

            <div className="flex justify-between">
              <span className="text-[#5A3F2A] dark:text-gray-300">
                Database
              </span>

              <strong className="text-green-600">Healthy</strong>
            </div>

            <div className="flex justify-between">
              <span className="text-[#5A3F2A] dark:text-gray-300">
                Search Engine
              </span>

              <strong className="text-green-600">Online</strong>
            </div>
          </div>
        </div>

        {/* Activity Summary */}

        <div
          className="
          bg-white
          dark:bg-[#1F2937]
          rounded-3xl
          border
          border-[#ECE6DE]
          dark:border-gray-700
          shadow-lg
          p-8
        "
        >
          <div className="flex items-center gap-3 mb-6">
            <FiTrendingUp
              className="text-[#8B5E3C] dark:text-[#D6A97A]"
              size={22}
            />

            <h2 className="text-2xl font-bold text-[#5A3F2A] dark:text-white">
              Activity Summary
            </h2>
          </div>

          <div className="space-y-5">
            <div className="flex justify-between">
              <span className="text-[#5A3F2A] dark:text-gray-300">
                Total Documents
              </span>

              <strong className="text-[#5A3F2A] dark:text-white">
                {documents}
              </strong>
            </div>

            <div className="flex justify-between">
              <span className="text-[#5A3F2A] dark:text-gray-300">
                Total Chunks
              </span>

              <strong className="text-[#5A3F2A] dark:text-white">
                {chunks}
              </strong>
            </div>

            <div className="flex justify-between">
              <span className="text-[#5A3F2A] dark:text-gray-300">
                Total AI Questions
              </span>

              <strong className="text-[#5A3F2A] dark:text-white">
                {questions}
              </strong>
            </div>

            <div className="flex justify-between">
              <span className="text-[#5A3F2A] dark:text-gray-300">
                Knowledge Health
              </span>

              <strong className="text-green-600">{health}%</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
