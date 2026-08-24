import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { FiSend, FiFileText } from "react-icons/fi";
import { supabase } from "../Services/supabase";
import { saveDocumentChat } from "../Services/chatService";

export default function DocumentChat() {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [chunks, setChunks] = useState([]);
  const [messages, setMessages] = useState([]);

  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadDocument();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  async function loadDocument() {
    const { data: doc } = await supabase
      .from("documents")
      .select("*")
      .eq("id", id)
      .single();

    const { data: chunkData, error: chunkError } = await supabase
      .from("chunks")
      .select("*")
      .eq("document_id", id);

    if (chunkError) {
      console.log("CHUNK ERROR:", chunkError);
    }

    setDocument(doc);
    setChunks(chunkData || []);

    await loadChatHistory();

    console.log("DOCUMENT:", doc);
    console.log("CHUNKS:", chunkData);
  }

  async function loadChatHistory() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("chat_history")
      .select("*")
      .eq("user_id", user.id)
      .eq("document_id", id)
      .order("created_at", {
        ascending: true,
      });

    if (data) {
      setMessages(
        data.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      );
    }
  }

  async function askAI() {
    const currentQuestion = question.trim();

    if (!currentQuestion) return;

    setQuestion("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first");
      return;
    }

    const userMessage = {
      role: "user",
      content: currentQuestion,
    };

    setMessages((prev) => [...prev, userMessage]);

    setLoading(true);

    const context = chunks
      .map((c) => c.content)
      .join("\n\n")
      .slice(0, 12000);

    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            model: "nvidia/nemotron-3-ultra-550b-a55b:free",

            messages: [
              {
                role: "system",
                content: `
You are DataNest AI.

Answer ONLY using the provided document.

If the answer does not exist inside the document,
say:

"I couldn't find that information inside this document."

Document:

${context}
                `,
              },

              {
                role: "user",
                content: currentQuestion,
              },
            ],
          }),
        },
      );

      const data = await response.json();

      console.log("OpenRouter Response:", data);

      if (!response.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              data?.error?.message || data?.message || JSON.stringify(data),
          },
        ]);

        setLoading(false);
        return;
      }

      const aiAnswer = data.choices[0].message.content;

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: aiAnswer,
        },
      ]);

      console.log("Document Object:", document);

      await saveDocumentChat(
        document?.id,
        document?.file_name,
        currentQuestion,
        aiAnswer,
      );
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Error contacting AI.",
        },
      ]);
    }

    setLoading(false);
  }

  return (
    <div
      className="
        flex-1
        min-h-screen
        px-4
        sm:px-6
        md:px-8
        lg:px-12
        py-6
        md:py-8
        bg-[#F8F3EC]
        dark:bg-[#0F0B08]
        transition-colors
        duration-300
      "
    >
      <div className="max-w-7xl mx-auto">
        {/* ================= PAGE HEADER ================= */}

        <div className="mb-7 md:mb-9">
          <div className="flex items-center gap-4">
            <div
              className="
                w-12
                h-12
                md:w-14
                md:h-14
                rounded-2xl
                bg-[#4A3021]
                dark:bg-[#30241C]
                text-white
                dark:text-[#E4BE99]
                flex
                items-center
                justify-center
                shadow-lg
                border
                border-[#4A3021]
                dark:border-[#60432D]
                shrink-0
              "
            >
              <FiFileText size={26} />
            </div>

            <div className="min-w-0">
              <h1
                className="
                  text-2xl
                  sm:text-3xl
                  md:text-4xl
                  font-bold
                  tracking-tight
                  text-[#4A3021]
                  dark:text-[#F3E5D7]
                "
              >
                Ask AI About This Document
              </h1>

              <p
                className="
                  text-[#8A7A6A]
                  dark:text-[#BCA99A]
                  mt-1
                  truncate
                "
              >
                {document?.title || "Loading document..."}
              </p>
            </div>
          </div>
        </div>

        {/* ================= CHAT CONTAINER ================= */}

        <div
          className="
            bg-[#FFFDF9]
            dark:bg-[#30241C]
            border
            border-[#E7DDD2]
            dark:border-[#60432D]
            rounded-[28px]
            shadow-xl
            h-[76vh]
            min-h-[520px]
            overflow-hidden
            flex
            flex-col
            transition-all
            duration-300
          "
        >
          {/* ================= CHAT HEADER ================= */}

          <div
            className="
              flex
              items-center
              gap-4
              px-5
              sm:px-6
              md:px-7
              py-5
              border-b
              border-[#E7DDD2]
              dark:border-[#60432D]
              bg-[#FFFDF9]
              dark:bg-[#30241C]
              shrink-0
            "
          >
            <div
              className="
                w-12
                h-12
                sm:w-14
                sm:h-14
                rounded-2xl
                bg-[#EFE7DE]
                dark:bg-[#3A2B21]
                text-[#4A3021]
                dark:text-[#E4BE99]
                flex
                items-center
                justify-center
                border
                border-[#E4D8CD]
                dark:border-[#60432D]
                shrink-0
              "
            >
              <FiFileText size={24} />
            </div>

            <div className="min-w-0">
              <h2
                className="
                  text-lg
                  sm:text-xl
                  font-bold
                  text-[#4A3021]
                  dark:text-[#F3E5D7]
                  truncate
                "
              >
                {document?.file_name?.replace(/^\d+[-_]/, "")}
              </h2>

              <p
                className="
                  text-sm
                  text-[#8A7A6A]
                  dark:text-[#BCA99A]
                  mt-1
                "
              >
                AI will answer only from this document.
              </p>
            </div>
          </div>

          {/* ================= CHAT MESSAGES ================= */}

          <div
            className="
              flex-1
              overflow-y-auto
              px-4
              sm:px-6
              md:px-7
              py-5
              sm:py-6
              space-y-5
              bg-[#FBF9F5]
              dark:bg-[#211812]
            "
          >
            {/* Empty State */}

            {messages.length === 0 && (
              <div
                className="
                  flex
                  flex-col
                  items-center
                  justify-center
                  text-center
                  mt-16
                  sm:mt-20
                  px-5
                "
              >
                <div
                  className="
                    w-20
                    h-20
                    rounded-[24px]
                    bg-[#EFE7DE]
                    dark:bg-[#3A2B21]
                    text-[#4A3021]
                    dark:text-[#D9AE85]
                    flex
                    items-center
                    justify-center
                    mb-5
                    border
                    border-[#E5D8CC]
                    dark:border-[#60432D]
                  "
                >
                  <FiFileText size={36} />
                </div>

                <h3
                  className="
                    text-xl
                    sm:text-2xl
                    font-bold
                    text-[#4A3021]
                    dark:text-[#F3E5D7]
                    mb-2
                  "
                >
                  Start asking questions
                </h3>

                <p
                  className="
                    text-[#8A7A6A]
                    dark:text-[#BCA99A]
                    max-w-md
                  "
                >
                  Ask anything about this uploaded document.
                </p>
              </div>
            )}

            {/* Messages */}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`
                    max-w-[88%]
                    sm:max-w-[80%]
                    md:max-w-[75%]
                    rounded-[24px]
                    px-5
                    py-4
                    leading-7
                    shadow-sm
                    whitespace-pre-wrap
                    break-words
                    ${
                      msg.role === "user"
                        ? `
                          bg-[#4A3021]
                          dark:bg-[#6A4932]
                          text-white
                          dark:text-[#FFF5EC]
                          rounded-br-md
                        `
                        : `
                          bg-white
                          dark:bg-[#30241C]
                          text-[#4A3021]
                          dark:text-[#E6D7CB]
                          border
                          border-[#E7DDD2]
                          dark:border-[#60432D]
                          rounded-bl-md
                        `
                    }
                  `}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Loading */}

            {loading && (
              <div className="flex justify-start">
                <div
                  className="
                    bg-white
                    dark:bg-[#30241C]
                    border
                    border-[#E7DDD2]
                    dark:border-[#60432D]
                    text-[#8A7A6A]
                    dark:text-[#C7B5A6]
                    rounded-[24px]
                    rounded-bl-md
                    px-5
                    py-4
                    shadow-sm
                    flex
                    items-center
                    gap-3
                  "
                >
                  <span
                    className="
                      w-2
                      h-2
                      rounded-full
                      bg-[#4A3021]
                      dark:bg-[#C18B5D]
                      animate-bounce
                    "
                  ></span>

                  <span
                    className="
                      w-2
                      h-2
                      rounded-full
                      bg-[#4A3021]
                      dark:bg-[#C18B5D]
                      animate-bounce
                      [animation-delay:150ms]
                    "
                  ></span>

                  <span
                    className="
                      w-2
                      h-2
                      rounded-full
                      bg-[#4A3021]
                      dark:bg-[#C18B5D]
                      animate-bounce
                      [animation-delay:300ms]
                    "
                  ></span>

                  <span className="ml-1">Thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef}></div>
          </div>

          {/* ================= INPUT ================= */}

          <div
            className="
              border-t
              border-[#E7DDD2]
              dark:border-[#60432D]
              p-4
              sm:p-5
              md:p-6
              bg-[#FFFDF9]
              dark:bg-[#30241C]
              shrink-0
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
                bg-[#F8F3ED]
                dark:bg-[#241B16]
                border
                border-[#E4D8CD]
                dark:border-[#60432D]
                rounded-2xl
                p-2
                focus-within:border-[#4A3021]
                dark:focus-within:border-[#A66F45]
                focus-within:ring-2
                focus-within:ring-[#4A3021]/10
                dark:focus-within:ring-[#A66F45]/10
                transition-all
                duration-200
              "
            >
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    askAI();
                  }
                }}
                placeholder="Ask anything about this document..."
                className="
                  flex-1
                  min-w-0
                  bg-transparent
                  px-3
                  sm:px-4
                  py-3
                  sm:py-3.5
                  text-[#4A3021]
                  dark:text-[#F3E5D7]
                  placeholder:text-[#9A8B7D]
                  dark:placeholder:text-[#887568]
                  outline-none
                "
              />

              <button
                onClick={askAI}
                disabled={loading}
                className="
                  w-11
                  h-11
                  sm:w-12
                  sm:h-12
                  rounded-xl
                  bg-[#4A3021]
                  dark:bg-[#6A4932]
                  hover:bg-[#382319]
                  dark:hover:bg-[#7B563A]
                  text-white
                  dark:text-[#FFF4EA]
                  flex
                  items-center
                  justify-center
                  transition-all
                  duration-200
                  shadow-md
                  shrink-0
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                  active:scale-95
                "
                title="Send message"
              >
                <FiSend size={20} />
              </button>
            </div>

            <p
              className="
                text-[11px]
                sm:text-xs
                text-center
                text-[#9A8B7D]
                dark:text-[#806F63]
                mt-3
              "
            >
              DataNest AI answers using the content of this document.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
