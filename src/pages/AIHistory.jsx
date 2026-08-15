import { useEffect, useState } from "react";
import { supabase } from "../Services/supabase";
import {
  FiChevronDown,
  FiChevronRight,
  FiTrash2,
  FiFileText,
} from "react-icons/fi";

export default function AIHistory() {
  const [groups, setGroups] = useState({
    documents: [],
    general: [],
  });

  const [loading, setLoading] = useState(true);

  const [openGroups, setOpenGroups] = useState({});
  const [generalOpen, setGeneralOpen] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("chat_history")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    const docs = {};
    const general = [];

    data.forEach((item) => {
      if (!item.document_id) {
        general.push(item);
        return;
      }

      if (!docs[item.document_id]) {
        docs[item.document_id] = {
          document_id: item.document_id,
          document_name: item.document_name || "Unknown Document",
          chats: [],
        };
      }

      docs[item.document_id].chats.push(item);
    });

    setGroups({
      documents: Object.values(docs),
      general,
    });

    const opened = {};

    Object.values(docs).forEach((d) => {
      opened[d.document_id] = true;
    });

    setOpenGroups(opened);

    setLoading(false);
  }

  function toggleGroup(id) {
    setOpenGroups((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  async function deleteGroup(documentId) {
    if (!window.confirm("Delete this conversation?")) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first.");
      return;
    }

    console.log("Deleting document:", documentId);
    console.log("Current user:", user.id);

    let query = supabase.from("chat_history").delete().eq("user_id", user.id);

    if (documentId === "general") {
      query = query.is("document_id", null);
    } else {
      query = query.eq("document_id", documentId);
    }

    const { data, error } = await query.select();

    console.log("DELETE RESULT:", data);
    console.log("DELETE ERROR:", error);

    if (error) {
      console.error("DELETE GROUP ERROR:", error);
      alert(`Could not delete conversation: ${error.message}`);
      return;
    }

    if (!data || data.length === 0) {
      alert(
        "Nothing was deleted. Check the Supabase DELETE RLS policy for chat_history.",
      );
      return;
    }

    console.log("Deleted rows:", data.length);

    await loadHistory();
  }

  async function deleteSingleConversation(questionId) {
    if (!window.confirm("Delete this question?")) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: question } = await supabase
      .from("chat_history")
      .select("*")
      .eq("id", questionId)
      .single();

    if (!question) return;

    const { data: answer } = await supabase
      .from("chat_history")
      .select("*")
      .eq("user_id", user.id)
      .eq("role", "assistant")
      .eq("document_id", question.document_id)
      .gt("created_at", question.created_at)
      .order("created_at", { ascending: true })
      .limit(1);

    await supabase.from("chat_history").delete().eq("id", question.id);

    if (answer?.length) {
      await supabase.from("chat_history").delete().eq("id", answer[0].id);
    }

    loadHistory();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F8F3EC] dark:bg-[#17110D] text-[#5A3F2A] dark:text-white">
        Loading AI History...
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#F8F3EC] dark:bg-[#0F0B08] min-h-screen transition-colors duration-300">
      <h1 className="text-4xl font-bold mb-2 text-[#4A3021] dark:text-white">
        AI History
      </h1>

      <p className="text-[#8A7A6A] dark:text-gray-400 mb-10">
        All your previous conversations.
      </p>

      {/* ============================= */}
      {/* DOCUMENT HISTORY */}
      {/* ============================= */}

      <h2 className="text-2xl font-bold mb-6 text-[#4A3021] dark:text-white">
        The History of Documents
      </h2>

      {groups.documents.length === 0 && (
        <div className="bg-white dark:bg-[#30241C] rounded-3xl p-6 shadow mb-10 border border-[#ECE6DE] dark:border-[#4A3021]">
          No document conversations found.
        </div>
      )}

      {groups.documents.map((group) => (
        <div
          key={group.document_id}
          className="mb-6 bg-white dark:bg-[#30241C] rounded-3xl shadow-lg overflow-hidden border border-[#ECE6DE] dark:border-[#4A3021]"
        >
          <div className="flex items-center justify-between p-6">
            <button
              onClick={() => toggleGroup(group.document_id)}
              className="flex items-center gap-4"
            >
              {openGroups[group.document_id] ? (
                <FiChevronDown
                  size={22}
                  className="text-[#4A3021] dark:text-white"
                />
              ) : (
                <FiChevronRight
                  size={22}
                  className="text-[#4A3021] dark:text-white"
                />
              )}

              <FiFileText
                size={22}
                className="text-[#8B5E3C] dark:text-[#C08A52]"
              />

              <div className="text-left">
                <h2 className="font-bold text-lg text-[#4A3021] dark:text-white">
                  Chat with: {group.document_name}
                </h2>

                <p className="text-sm text-[#8A7A6A] dark:text-gray-400">
                  {group.chats.filter((m) => m.role === "user").length}{" "}
                  conversations
                </p>
              </div>
            </button>

            <button
              onClick={() => deleteGroup(group.document_id)}
              className="
                          w-10
                          h-10
                          rounded-xl
                          bg-[#F8F3ED]
                          dark:bg-[#3A1D19]
                          hover:bg-[#874239]
                          dark:hover:bg-[#51241E]
                          border
                          border-red-100
                          dark:border-[#713128]
                          text-[#4A3021]
                          dark:text-[#E5BE99]
                          flex
                          items-center
                          justify-center
                          transition-all
                          duration-200
                        "
            >
              <FiTrash2 size={22} />
            </button>
          </div>

          {openGroups[group.document_id] && (
            <div className="border-t border-[#ECE6DE] dark:border-[#4A3021]">
              {(() => {
                const conversations = [];

                let current = null;

                group.chats.forEach((msg) => {
                  if (msg.role === "user") {
                    current = {
                      question: msg,
                      answer: null,
                    };

                    conversations.push(current);
                  } else if (msg.role === "assistant" && current) {
                    current.answer = msg;
                  }
                });

                return conversations.map((chat, index) => (
                  <div
                    key={index}
                    className="p-6 border-b border-[#ECE6DE] dark:border-[#4A3021]"
                  >
                    <div className="flex justify-between items-center">
                      <div className="font-semibold text-[#8B5E3C] dark:text-[#C08A52]">
                        AI Question
                      </div>

                      <button
                        onClick={() =>
                          deleteSingleConversation(chat.question.id)
                        }
                        className="
                          w-10
                          h-10
                          rounded-xl
                          bg-[#F8F3ED]
                          dark:bg-[#3A1D19]
                          hover:bg-[#874239]
                          dark:hover:bg-[#51241E]
                          border
                          border-red-100
                          dark:border-[#713128]
                          text-[#4A3021]
                          dark:text-[#E5BE99]
                          flex
                          items-center
                          justify-center
                          transition-all
                          duration-200
                        "
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>

                    <p className="mt-2 whitespace-pre-wrap text-[#4A3021] dark:text-gray-200">
                      {chat.question?.content || "No Question"}
                    </p>

                    <div className="mt-6 font-semibold text-[#4A3021] dark:text-[#C08A52]">
                      AI Answer
                    </div>

                    <p className="mt-2 whitespace-pre-wrap text-[#6B625B] dark:text-gray-300">
                      {chat.answer?.content || "No Answer"}
                    </p>

                    <div className="text-xs text-gray-400 mt-4">
                      {new Date(chat.question?.created_at).toLocaleString()}
                    </div>
                  </div>
                ));
              })()}
            </div>
          )}
        </div>
      ))}

      {/* ============================= */}
      {/* GENERAL HISTORY */}
      {/* ============================= */}

      <h2 className="text-2xl font-bold mt-12 mb-6 text-[#4A3021] dark:text-white">
        The General History
      </h2>

      {groups.general.length === 0 ? (
        <div className="bg-white dark:bg-[#30241C] rounded-3xl p-6 shadow border border-[#ECE6DE] dark:border-[#4A3021]">
          No general conversations found.
        </div>
      ) : (
        <div className="bg-white dark:bg-[#30241C] rounded-3xl shadow-lg overflow-hidden border border-[#ECE6DE] dark:border-[#4A3021]">
          {/* General History Header */}

          <div className="flex items-center justify-between p-6">
            <button
              onClick={() => setGeneralOpen((prev) => !prev)}
              className="flex items-center gap-4 text-left"
            >
              {generalOpen ? (
                <FiChevronDown
                  size={22}
                  className="text-[#4A3021] dark:text-white"
                />
              ) : (
                <FiChevronRight
                  size={22}
                  className="text-[#4A3021] dark:text-white"
                />
              )}

              <div className="w-12 h-12 rounded-2xl bg-[#EFE7DE] dark:bg-[#4A3021] flex items-center justify-center">
                <FiFileText
                  size={22}
                  className="text-[#8B5E3C] dark:text-[#C08A52]"
                />
              </div>

              <div>
                <h2 className="font-bold text-lg text-[#4A3021] dark:text-white">
                  General AI Conversations
                </h2>

                <p className="text-sm text-[#8A7A6A] dark:text-gray-400">
                  {groups.general.filter((m) => m.role === "user").length}{" "}
                  conversations
                </p>
              </div>
            </button>

            <button
              onClick={() => deleteGroup("general")}
              className="
                          w-10
                          h-10
                          rounded-xl
                          bg-[#F8F3ED]
                          dark:bg-[#3A1D19]
                          hover:bg-[#874239]
                          dark:hover:bg-[#51241E]
                          border
                          border-red-100
                          dark:border-[#713128]
                          text-[#4A3021]
                          dark:text-[#E5BE99]
                          flex
                          items-center
                          justify-center
                          transition-all
                          duration-200
                        "
              title="Delete General History"
            >
              <FiTrash2 size={22} />
            </button>
          </div>

          {/* General Questions & Answers */}

          {generalOpen && (
            <div className="border-t border-[#ECE6DE] dark:border-[#4A3021]">
              {(() => {
                const conversations = [];

                let current = null;

                groups.general.forEach((msg) => {
                  if (msg.role === "user") {
                    current = {
                      question: msg,
                      answer: null,
                    };

                    conversations.push(current);
                  } else if (msg.role === "assistant" && current) {
                    current.answer = msg;
                  }
                });

                return conversations.map((chat, index) => (
                  <div
                    key={index}
                    className="p-6 border-b border-[#ECE6DE] dark:border-[#4A3021]"
                  >
                    <div className="flex justify-between items-center">
                      <div className="font-semibold text-[#8B5E3C] dark:text-[#C08A52]">
                        AI Question
                      </div>

                      <button
                        onClick={() =>
                          deleteSingleConversation(chat.question.id)
                        }
                        className="
                          w-10
                          h-10
                          rounded-xl
                          bg-[#F8F3ED]
                          dark:bg-[#3A1D19]
                          hover:bg-[#874239]
                          dark:hover:bg-[#51241E]
                          border
                          border-red-100
                          dark:border-[#713128]
                          text-[#4A3021]
                          dark:text-[#E5BE99]
                          flex
                          items-center
                          justify-center
                          transition-all
                          duration-200
                        "
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>

                    <p className="mt-2 whitespace-pre-wrap text-[#4A3021] dark:text-gray-200">
                      {chat.question?.content || "No Question"}
                    </p>

                    <div className="mt-6 font-semibold text-[#4A3021] dark:text-[#C08A52]">
                      AI Answer
                    </div>

                    <p className="mt-2 whitespace-pre-wrap text-[#6B625B] dark:text-gray-300">
                      {chat.answer?.content || "No Answer"}
                    </p>

                    <div className="text-xs text-gray-400 mt-4">
                      {new Date(chat.question?.created_at).toLocaleString()}
                    </div>
                  </div>
                ));
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
