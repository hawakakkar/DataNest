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
    if (!question.trim()) return;
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first");
      return;
    }

    const userMessage = {
      role: "user",
      content: question,
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
                content: question,
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
        question,
        aiAnswer,
      );

      setQuestion("");
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
    <div className="flex-1 px-8 md:px-12 py-8 bg-[#F8F6F2] dark:bg-[#111827] min-h-screen transition-colors">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#5A3F2A] dark:text-white">
          Ask AI About This Document
        </h1>

        <p className="text-[#8A7A6A] dark:text-gray-400 mt-2">
          {document?.title || "Loading document..."}
        </p>
      </div>

      <div className="bg-white dark:bg-[#1F2937] border border-[#ECE6DE] dark:border-gray-700 rounded-3xl shadow-xl h-[75vh] flex flex-col">
        {/* Header */}

        <div className="flex items-center gap-4 border-b border-[#ECE6DE] dark:border-gray-700 p-6">
          <div className="w-14 h-14 rounded-2xl bg-[#EFE7DE] dark:bg-[#374151] flex items-center justify-center">
            <FiFileText
              className="text-[#8B5E3C] dark:text-[#D6A97A]"
              size={24}
            />
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#5A3F2A] dark:text-white">
              {document?.file_name?.replace(/^\d+[-_]/, "")}
            </h2>

            <p className="text-sm text-[#8A7A6A] dark:text-gray-400">
              AI will answer only from this document.
            </p>
          </div>
        </div>

        {/* Chat */}

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {messages.length === 0 && (
            <div className="text-center text-[#8A7A6A] dark:text-gray-400 mt-20">
              <FiFileText size={55} className="mx-auto mb-5 opacity-60" />

              <h3 className="text-2xl font-bold mb-2">
                Start asking questions
              </h3>

              <p>Ask anything about this uploaded document.</p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] rounded-3xl px-5 py-4 leading-7 shadow-md ${
                  msg.role === "user"
                    ? "bg-[#C08A52] text-white"
                    : "bg-[#F8F6F2] dark:bg-[#111827] text-[#5A3F2A] dark:text-gray-200 border border-[#ECE6DE] dark:border-gray-700"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#F8F6F2] dark:bg-[#111827] border border-[#ECE6DE] dark:border-gray-700 rounded-3xl px-5 py-4">
                Thinking...
              </div>
            </div>
          )}

          <div ref={messagesEndRef}></div>
        </div>
        {/* Input */}

        <div className="border-t border-[#ECE6DE] dark:border-gray-700 p-5">
          <div className="flex gap-4">
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
                rounded-2xl
                border
                border-[#ECE6DE]
                dark:border-gray-700
                bg-[#F8F6F2]
                dark:bg-[#111827]
                px-5
                py-4
                text-[#5A3F2A]
                dark:text-white
                outline-none
                focus:ring-2
                focus:ring-[#C08A52]
              "
            />

            <button
              onClick={askAI}
              disabled={loading}
              className="
                w-14
                h-14
                rounded-2xl
                bg-[#C08A52]
                hover:bg-[#B37A42]
                text-white
                flex
                items-center
                justify-center
                transition
                disabled:opacity-60
              "
            >
              <FiSend size={22} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
