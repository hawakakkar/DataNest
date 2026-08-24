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

  const statCards = [
    {
      title: "Documents",
      value: documents,
      icon: FiFileText,
      description: "Uploaded knowledge files",
    },
    {
      title: "Indexed Chunks",
      value: chunks,
      icon: FiDatabase,
      description: "Searchable content blocks",
    },
    {
      title: "AI Questions",
      value: questions,
      icon: FiMessageSquare,
      description: "Questions processed",
    },
    {
      title: "Knowledge Health",
      value: `${health}%`,
      icon: FiTrendingUp,
      description:
        health === 100 ? "Knowledge base is ready" : "Upload a document",
    },
  ];

  return (
    <div
      className="
        w-full
        max-w-7xl
        mx-auto
        px-3
        sm:px-5
        md:px-6
        lg:px-8
        py-4
        sm:py-6
        lg:py-8
        space-y-6
        sm:space-y-8
        bg-[#F8F3EC]
        text-[#3E2A1E]
        dark:bg-[#0F0B08]
        dark:text-white
        min-h-screen
        transition-colors
        duration-500
      "
    >
      {/* Header */}

      <div
        className="
          relative
          overflow-hidden
          rounded-2xl
          sm:rounded-[2rem]
          bg-white
          dark:bg-[#1A1410]
          border
          border-[#ECE6DE]
          dark:border-white/10
          shadow-sm
          dark:shadow-[0_12px_35px_rgba(0,0,0,0.18)]
          px-4
          sm:px-6
          md:px-8
          py-6
          sm:py-7
          md:py-8
        "
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-[#EFE7DE]
                dark:bg-[#30241C]
                text-[#8B5E3C]
                dark:text-[#D8A778]
                flex
                items-center
                justify-center
                shrink-0
              "
            >
              <FiActivity size={20} />
            </div>

            <span
              className="
                text-xs
                sm:text-sm
                font-semibold
                tracking-wide
                uppercase
                text-[#8B5E3C]
                dark:text-[#D8A778]
              "
            >
              DataNest Analytics
            </span>
          </div>

          <h1
            className="
              text-2xl
              sm:text-3xl
              md:text-4xl
              lg:text-5xl
              font-bold
              tracking-tight
              text-[#5A3F2A]
              dark:text-white
            "
          >
            Analytics Dashboard
          </h1>

          <p
            className="
              text-sm
              sm:text-base
              text-[#8A7A6A]
              dark:text-gray-400
              mt-3
              max-w-2xl
              leading-6
              sm:leading-7
            "
          >
            Monitor your AI Knowledge Base, indexed content, document activity,
            and AI performance from one place.
          </p>
        </div>

        {/* Decorative elements */}

        <div
          className="
            absolute
            -right-12
            -top-12
            w-32
            h-32
            sm:w-40
            sm:h-40
            rounded-full
            bg-[#EFE7DE]
            dark:bg-[#30241C]
            opacity-60
          "
        />

        <div
          className="
            absolute
            -right-4
            -bottom-16
            w-28
            h-28
            sm:w-32
            sm:h-32
            rounded-full
            border
            border-[#D8C3A5]
            dark:border-white/10
            opacity-50
          "
        />
      </div>

      {/* Stat Cards */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-4
          gap-4
          sm:gap-5
        "
      >
        {statCards.map((card, index) => {
          const Icon = card.icon;

          return (
            <div
              key={index}
              className="
                group
                relative
                overflow-hidden
                bg-white
                dark:bg-[#1A1410]
                rounded-2xl
                sm:rounded-[1.75rem]
                border
                border-[#ECE6DE]
                dark:border-white/10
                shadow-sm
                dark:shadow-[0_8px_28px_rgba(0,0,0,0.16)]
                p-4
                sm:p-5
                md:p-6
                hover:shadow-xl
                dark:hover:shadow-[0_15px_35px_rgba(0,0,0,0.25)]
                hover:-translate-y-1
                hover:border-[#D8C3A5]
                dark:hover:border-[#C8956B]
                transition-all
                duration-300
              "
            >
              {/* Top accent */}

              <div
                className="
                  absolute
                  top-0
                  left-0
                  right-0
                  h-1
                  bg-[#8B5E3C]
                  dark:bg-[#8B5E3C]
                  opacity-80
                "
              />

              <div className="flex items-start justify-between gap-3 sm:gap-4">
                <div className="min-w-0">
                  <p
                    className="
                      text-sm
                      font-medium
                      text-[#8A7A6A]
                      dark:text-gray-400
                    "
                  >
                    {card.title}
                  </p>

                  <h2
                    className="
                      text-3xl
                      sm:text-4xl
                      font-bold
                      tracking-tight
                      text-[#5A3F2A]
                      dark:text-white
                      mt-3
                    "
                  >
                    {card.value}
                  </h2>

                  <p
                    className="
                      text-xs
                      text-gray-400
                      dark:text-gray-500
                      mt-2
                      leading-5
                    "
                  >
                    {card.description}
                  </p>
                </div>

                <div
                  className="
                    w-12
                    h-12
                    sm:w-14
                    sm:h-14
                    rounded-2xl
                    bg-[#EFE7DE]
                    dark:bg-[#30241C]
                    text-[#8B5E3C]
                    dark:text-[#D8A778]
                    flex
                    items-center
                    justify-center
                    shrink-0
                    group-hover:scale-110
                    transition-transform
                    duration-300
                  "
                >
                  <Icon size={24} />
                </div>
              </div>

              <div
                className="
                  mt-5
                  h-px
                  bg-[#ECE6DE]
                  dark:bg-white/10
                "
              />

              <div
                className="
                  mt-4
                  flex
                  items-center
                  gap-2
                  text-xs
                  text-[#8A7A6A]
                  dark:text-gray-400
                "
              >
                <span
                  className="
                    w-2
                    h-2
                    rounded-full
                    bg-[#8B5E3C]
                    dark:bg-[#D8A778]
                    shrink-0
                  "
                />

                <span>Knowledge base metric</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* System Health + Recent Uploads */}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* System Health */}

        <div
          className="
            bg-white
            dark:bg-[#1A1410]
            rounded-2xl
            sm:rounded-[2rem]
            border
            border-[#ECE6DE]
            dark:border-white/10
            shadow-sm
            dark:shadow-[0_12px_35px_rgba(0,0,0,0.18)]
            p-4
            sm:p-6
            md:p-8
            overflow-hidden
          "
        >
          <div
            className="
              flex
              flex-col
              sm:flex-row
              sm:items-start
              sm:justify-between
              gap-4
              mb-7
              sm:mb-8
            "
          >
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <div
                  className="
                    w-11
                    h-11
                    rounded-xl
                    bg-[#EFE7DE]
                    dark:bg-[#30241C]
                    text-[#8B5E3C]
                    dark:text-[#D8A778]
                    flex
                    items-center
                    justify-center
                    shrink-0
                  "
                >
                  <FiActivity size={21} />
                </div>

                <div className="min-w-0">
                  <h2
                    className="
                      text-xl
                      sm:text-2xl
                      font-bold
                      text-[#5A3F2A]
                      dark:text-white
                    "
                  >
                    System Health
                  </h2>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-5">
                    Current knowledge infrastructure status
                  </p>
                </div>
              </div>
            </div>

            <div
              className="
                self-start
                px-3
                py-1.5
                rounded-full
                bg-[#EFE7DE]
                dark:bg-[#30241C]
                text-[#8B5E3C]
                dark:text-[#D8A778]
                text-xs
                font-bold
                whitespace-nowrap
              "
            >
              {health === 100 ? "Healthy" : "Waiting"}
            </div>
          </div>

          {/* Health Score */}

          <div
            className="
              rounded-3xl
              bg-[#F8F6F2]
              dark:bg-[#0F0B08]
              border
              border-[#ECE6DE]
              dark:border-white/10
              p-4
              sm:p-6
              mb-6
            "
          >
            <div
              className="
                flex
                flex-col
                sm:flex-row
                items-center
                sm:items-center
                gap-5
                sm:gap-6
              "
            >
              {/* Circular indicator */}

              <div
                className="
                  relative
                  w-24
                  h-24
                  sm:w-28
                  sm:h-28
                  rounded-full
                  flex
                  items-center
                  justify-center
                  shrink-0
                "
                style={{
                  background: `conic-gradient(
                    #8B5E3C ${health * 3.6}deg,
                    #E8DED3 ${health * 3.6}deg
                  )`,
                }}
              >
                <div
                  className="
                    absolute
                    inset-[7px]
                    sm:inset-[8px]
                    rounded-full
                    bg-[#F8F6F2]
                    dark:bg-[#0F0B08]
                    flex
                    items-center
                    justify-center
                  "
                >
                  <div className="text-center">
                    <div
                      className="
                        text-xl
                        sm:text-2xl
                        font-bold
                        text-[#5A3F2A]
                        dark:text-white
                      "
                    >
                      {health}%
                    </div>

                    <div className="text-[10px] text-gray-500 dark:text-gray-400">
                      Health
                    </div>
                  </div>
                </div>
              </div>

              <div className="min-w-0 text-center sm:text-left">
                <h3
                  className="
                    text-lg
                    font-bold
                    text-[#5A3F2A]
                    dark:text-white
                  "
                >
                  Knowledge Base
                </h3>

                <p
                  className="
                    text-sm
                    text-gray-500
                    dark:text-gray-400
                    mt-2
                    leading-6
                  "
                >
                  {health === 100
                    ? "Your knowledge base is ready for AI-powered search and document questions."
                    : "Upload documents to activate your knowledge base."}
                </p>
              </div>
            </div>

            {/* Progress */}

            <div className="mt-6 sm:mt-7">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Knowledge Base
                </span>

                <span
                  className="
                    text-sm
                    font-bold
                    text-[#8B5E3C]
                    dark:text-[#D8A778]
                  "
                >
                  {health}%
                </span>
              </div>

              <div
                className="
                  h-2.5
                  rounded-full
                  bg-[#E8DED3]
                  dark:bg-white/10
                  overflow-hidden
                "
              >
                <div
                  className="
                    h-full
                    rounded-full
                    bg-[#8B5E3C]
                    dark:bg-[#8B5E3C]
                    transition-all
                    duration-700
                  "
                  style={{
                    width: `${health}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Service statuses */}

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              md:grid-cols-3
              gap-3
            "
          >
            <div
              className="
                rounded-2xl
                border
                border-[#ECE6DE]
                dark:border-white/10
                bg-[#FAF8F5]
                dark:bg-white/5
                p-4
              "
            >
              <div className="flex items-center justify-between mb-3">
                <FiCpu
                  className="text-[#8B5E3C] dark:text-[#D8A778]"
                  size={20}
                />

                <span
                  className="
                    w-2.5
                    h-2.5
                    rounded-full
                    bg-[#8B5E3C]
                    dark:bg-[#D8A778]
                  "
                />
              </div>

              <p className="font-semibold text-sm text-[#5A3F2A] dark:text-white">
                AI Service
              </p>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Connected
              </p>
            </div>

            <div
              className="
                rounded-2xl
                border
                border-[#ECE6DE]
                dark:border-white/10
                bg-[#FAF8F5]
                dark:bg-white/5
                p-4
              "
            >
              <div className="flex items-center justify-between mb-3">
                <FiDatabase
                  className="text-[#8B5E3C] dark:text-[#D8A778]"
                  size={20}
                />

                <span
                  className="
                    w-2.5
                    h-2.5
                    rounded-full
                    bg-[#8B5E3C]
                    dark:bg-[#D8A778]
                  "
                />
              </div>

              <p className="font-semibold text-sm text-[#5A3F2A] dark:text-white">
                Supabase
              </p>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Connected
              </p>
            </div>

            <div
              className="
                rounded-2xl
                border
                border-[#ECE6DE]
                dark:border-white/10
                bg-[#FAF8F5]
                dark:bg-white/5
                p-4
              "
            >
              <div className="flex items-center justify-between mb-3">
                <FiTrendingUp
                  className="text-[#8B5E3C] dark:text-[#D8A778]"
                  size={20}
                />

                <span
                  className="
                    w-2.5
                    h-2.5
                    rounded-full
                    bg-[#8B5E3C]
                    dark:bg-[#D8A778]
                  "
                />
              </div>

              <p className="font-semibold text-sm text-[#5A3F2A] dark:text-white">
                Vector Search
              </p>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Active
              </p>
            </div>
          </div>
        </div>

        {/* Recent Uploads */}

        <div
          className="
            bg-white
            dark:bg-[#1A1410]
            rounded-2xl
            sm:rounded-[2rem]
            border
            border-[#ECE6DE]
            dark:border-white/10
            shadow-sm
            dark:shadow-[0_12px_35px_rgba(0,0,0,0.18)]
            p-4
            sm:p-6
            md:p-8
          "
        >
          <div
            className="
              flex
              flex-col
              gap-3
              sm:flex-row
              sm:items-center
              sm:justify-between
              mb-7
            "
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="
                  w-11
                  h-11
                  rounded-xl
                  bg-[#EFE7DE]
                  dark:bg-[#30241C]
                  text-[#8B5E3C]
                  dark:text-[#D8A778]
                  flex
                  items-center
                  justify-center
                  shrink-0
                "
              >
                <FiClock size={21} />
              </div>

              <div className="min-w-0">
                <h2
                  className="
                    text-xl
                    sm:text-2xl
                    font-bold
                    text-[#5A3F2A]
                    dark:text-white
                  "
                >
                  Recent Uploads
                </h2>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Latest knowledge base files
                </p>
              </div>
            </div>

            <span
              className="
                text-xs
                font-semibold
                text-[#8A7A6A]
                dark:text-gray-400
                self-start
                sm:self-auto
              "
            >
              {recentDocs.length} files
            </span>
          </div>

          {recentDocs.length === 0 ? (
            <div
              className="
                min-h-64
                rounded-3xl
                border
                border-dashed
                border-[#D8C3A5]
                dark:border-white/10
                bg-[#FAF8F5]
                dark:bg-white/5
                flex
                flex-col
                items-center
                justify-center
                text-center
                px-4
                sm:px-6
                py-10
              "
            >
              <FiFileText
                size={38}
                className="text-[#8B5E3C] dark:text-[#D8A778] mb-4"
              />

              <p className="font-semibold text-[#5A3F2A] dark:text-white">
                No uploaded documents
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Your recent uploads will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentDocs.map((doc, index) => (
                <div
                  key={doc.id}
                  className="
                    group
                    flex
                    items-center
                    gap-3
                    sm:gap-4
                    rounded-2xl
                    border
                    border-[#ECE6DE]
                    dark:border-white/10
                    bg-[#FAF8F5]
                    dark:bg-white/5
                    p-3
                    sm:p-4
                    hover:bg-[#F4EEE8]
                    dark:hover:bg-[#30241C]
                    transition-all
                    duration-200
                  "
                >
                  <div
                    className="
                      w-10
                      h-10
                      sm:w-11
                      sm:h-11
                      rounded-xl
                      bg-[#EFE7DE]
                      dark:bg-[#30241C]
                      text-[#8B5E3C]
                      dark:text-[#D8A778]
                      flex
                      items-center
                      justify-center
                      shrink-0
                    "
                  >
                    <FiFileText size={19} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className="
                        font-semibold
                        text-[#5A3F2A]
                        dark:text-white
                        truncate
                      "
                    >
                      {doc.title}
                    </p>

                    <p
                      className="
                        text-xs
                        text-gray-500
                        dark:text-gray-400
                        truncate
                        mt-1
                      "
                    >
                      {doc.file_name}
                    </p>
                  </div>

                  <div className="text-right shrink-0 min-w-[58px]">
                    <div
                      className="
                        text-[10px]
                        text-gray-400
                        dark:text-gray-500
                        mb-1
                      "
                    >
                      #{index + 1}
                    </div>

                    <span
                      className="
                        text-[11px]
                        sm:text-xs
                        text-[#8A7A6A]
                        dark:text-gray-400
                        whitespace-nowrap
                      "
                    >
                      {new Date(doc.uploaded_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI Performance + Activity Summary */}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* AI Performance */}

        <div
          className="
            bg-white
            dark:bg-[#1A1410]
            rounded-2xl
            sm:rounded-[2rem]
            border
            border-[#ECE6DE]
            dark:border-white/10
            shadow-sm
            dark:shadow-[0_12px_35px_rgba(0,0,0,0.18)]
            p-4
            sm:p-6
            md:p-8
          "
        >
          <div className="flex items-center gap-3 mb-7">
            <div
              className="
                w-11
                h-11
                rounded-xl
                bg-[#EFE7DE]
                dark:bg-[#30241C]
                text-[#8B5E3C]
                dark:text-[#D8A778]
                flex
                items-center
                justify-center
                shrink-0
              "
            >
              <FiCpu size={21} />
            </div>

            <div className="min-w-0">
              <h2
                className="
                  text-xl
                  sm:text-2xl
                  font-bold
                  text-[#5A3F2A]
                  dark:text-white
                "
              >
                AI Performance
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Current AI infrastructure metrics
              </p>
            </div>
          </div>

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              gap-3
            "
          >
            <div
              className="
                rounded-2xl
                border
                border-[#ECE6DE]
                dark:border-white/10
                p-4
                sm:p-5
                bg-[#FAF8F5]
                dark:bg-white/5
              "
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">
                AI Accuracy
              </p>

              <div className="flex items-end justify-between mt-3">
                <strong className="text-2xl text-[#5A3F2A] dark:text-white">
                  98%
                </strong>

                <FiTrendingUp
                  className="text-[#8B5E3C] dark:text-[#D8A778]"
                  size={20}
                />
              </div>
            </div>

            <div
              className="
                rounded-2xl
                border
                border-[#ECE6DE]
                dark:border-white/10
                p-4
                sm:p-5
                bg-[#FAF8F5]
                dark:bg-white/5
              "
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Embedding Status
              </p>

              <div className="flex items-center gap-2 mt-4">
                <FiCheckCircle className="text-[#8B5E3C] dark:text-[#D8A778]" />

                <strong className="text-[#5A3F2A] dark:text-white">
                  Active
                </strong>
              </div>
            </div>

            <div
              className="
                rounded-2xl
                border
                border-[#ECE6DE]
                dark:border-white/10
                p-4
                sm:p-5
                bg-[#FAF8F5]
                dark:bg-white/5
              "
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Database
              </p>

              <div className="flex items-center gap-2 mt-4">
                <FiCheckCircle className="text-[#8B5E3C] dark:text-[#D8A778]" />

                <strong className="text-[#5A3F2A] dark:text-white">
                  Healthy
                </strong>
              </div>
            </div>

            <div
              className="
                rounded-2xl
                border
                border-[#ECE6DE]
                dark:border-white/10
                p-4
                sm:p-5
                bg-[#FAF8F5]
                dark:bg-white/5
              "
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Search Engine
              </p>

              <div className="flex items-center gap-2 mt-4">
                <FiCheckCircle className="text-[#8B5E3C] dark:text-[#D8A778]" />

                <strong className="text-[#5A3F2A] dark:text-white">
                  Online
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Summary */}

        <div
          className="
            bg-white
            dark:bg-[#1A1410]
            rounded-2xl
            sm:rounded-[2rem]
            border
            border-[#ECE6DE]
            dark:border-white/10
            shadow-sm
            dark:shadow-[0_12px_35px_rgba(0,0,0,0.18)]
            p-4
            sm:p-6
            md:p-8
          "
        >
          <div className="flex items-center gap-3 mb-7">
            <div
              className="
                w-11
                h-11
                rounded-xl
                bg-[#EFE7DE]
                dark:bg-[#30241C]
                text-[#8B5E3C]
                dark:text-[#D8A778]
                flex
                items-center
                justify-center
                shrink-0
              "
            >
              <FiTrendingUp size={21} />
            </div>

            <div className="min-w-0">
              <h2
                className="
                  text-xl
                  sm:text-2xl
                  font-bold
                  text-[#5A3F2A]
                  dark:text-white
                "
              >
                Activity Summary
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Overview of your knowledge base
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <div
              className="
                flex
                items-center
                justify-between
                gap-4
                p-3
                sm:p-4
                rounded-2xl
                hover:bg-[#FAF8F5]
                dark:hover:bg-white/5
                transition
              "
            >
              <span className="text-sm sm:text-base text-[#8A7A6A] dark:text-gray-400">
                Total Documents
              </span>

              <strong className="text-xl text-[#5A3F2A] dark:text-white shrink-0">
                {documents}
              </strong>
            </div>

            <div
              className="
                flex
                items-center
                justify-between
                gap-4
                p-3
                sm:p-4
                rounded-2xl
                hover:bg-[#FAF8F5]
                dark:hover:bg-white/5
                transition
              "
            >
              <span className="text-sm sm:text-base text-[#8A7A6A] dark:text-gray-400">
                Total Chunks
              </span>

              <strong className="text-xl text-[#5A3F2A] dark:text-white shrink-0">
                {chunks}
              </strong>
            </div>

            <div
              className="
                flex
                items-center
                justify-between
                gap-4
                p-3
                sm:p-4
                rounded-2xl
                hover:bg-[#FAF8F5]
                dark:hover:bg-white/5
                transition
              "
            >
              <span className="text-sm sm:text-base text-[#8A7A6A] dark:text-gray-400">
                Total AI Questions
              </span>

              <strong className="text-xl text-[#5A3F2A] dark:text-white shrink-0">
                {questions}
              </strong>
            </div>

            <div
              className="
                flex
                items-center
                justify-between
                gap-4
                p-3
                sm:p-4
                rounded-2xl
                hover:bg-[#FAF8F5]
                dark:hover:bg-white/5
                transition
              "
            >
              <span className="text-sm sm:text-base text-[#8A7A6A] dark:text-gray-400">
                Knowledge Health
              </span>

              <strong className="text-xl text-[#8B5E3C] dark:text-[#D8A778] shrink-0">
                {health}%
              </strong>
            </div>
          </div>

          <div
            className="
              mt-5
              pt-5
              border-t
              border-[#ECE6DE]
              dark:border-white/10
            "
          >
            <div className="flex items-start sm:items-center gap-2 text-sm text-[#8A7A6A] dark:text-gray-400">
              <FiCheckCircle className="text-[#8B5E3C] dark:text-[#D8A778] shrink-0 mt-0.5 sm:mt-0" />

              <span>Your knowledge base is being monitored continuously.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
