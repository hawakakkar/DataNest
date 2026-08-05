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

    let query = supabase.from("chat_history").delete().eq("user_id", user.id);

    if (documentId === "general") {
      query = query.is("document_id", null);
    } else {
      query = query.eq("document_id", documentId);
    }

    await query;

    loadHistory();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading AI History...
      </div>
    );
  }
  return (
    <div className="p-8 bg-[#F8F6F2] dark:bg-[#111827] min-h-screen">
      <h1 className="text-4xl font-bold mb-2 text-[#5A3F2A] dark:text-white">
        AI History
      </h1>

      <p className="text-gray-500 dark:text-gray-400 mb-10">
        All your previous conversations.
      </p>

      <h2 className="text-2xl font-bold mb-6 text-[#5A3F2A] dark:text-white">
        The History of Documents
      </h2>

      {groups.documents.length === 0 && (
        <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-6 shadow mb-10">
          No document conversations found.
        </div>
      )}

      {groups.documents.map((group) => (
        <div
          key={group.document_id}
          className="mb-6 bg-white dark:bg-[#1F2937] rounded-3xl shadow-lg overflow-hidden"
        >
          <div className="flex items-center justify-between p-6">
            <button
              onClick={() => toggleGroup(group.document_id)}
              className="flex items-center gap-4"
            >
              {openGroups[group.document_id] ? (
                <FiChevronDown size={22} />
              ) : (
                <FiChevronRight size={22} />
              )}

              <FiFileText size={22} />

              <div className="text-left">
                <h2 className="font-bold text-lg">
                  Chat with: {group.document_name}
                </h2>

                <p className="text-sm text-gray-500">
                  {Math.floor(group.chats.length / 2)} conversations
                </p>
              </div>
            </button>

            <button
              onClick={() => deleteGroup(group.document_id)}
              className="text-red-500 hover:text-red-700"
            >
              <FiTrash2 size={22} />
            </button>
          </div>

          {openGroups[group.document_id] && (
            <div className="border-t dark:border-gray-700">
              {(() => {
                const conversations = [];

                for (let i = 0; i < group.chats.length; i += 2) {
                  conversations.push({
                    question: group.chats[i],
                    answer: group.chats[i + 1],
                  });
                }

                return conversations.map((chat, index) => (
                  <div
                    key={index}
                    className="p-6 border-b dark:border-gray-700"
                  >
                    <div className="font-semibold text-[#8B5E3C]">
                      {" "}
                      AI Question
                    </div>

                    <p className="mt-2 whitespace-pre-wrap">
                      {chat.answer?.content}
                    </p>

                    <div className="mt-6 font-semibold text-blue-600">
                      AI Answer
                    </div>
                    <p className="mt-2 whitespace-pre-wrap">
                      {chat.question?.content}
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
      <h2 className="text-2xl font-bold mt-12 mb-6 text-[#5A3F2A] dark:text-white">
        The General History
      </h2>

      {groups.general.length === 0 ? (
        <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-6 shadow">
          No general conversations found.
        </div>
      ) : (
        <div className="bg-white dark:bg-[#1F2937] rounded-3xl shadow-lg overflow-hidden">
          {(() => {
            const conversations = [];

            for (let i = 0; i < groups.general.length; i += 2) {
              conversations.push({
                question: groups.general[i],
                answer: groups.general[i + 1],
              });
            }

            return conversations.map((chat, index) => (
              <div key={index} className="p-6 border-b dark:border-gray-700">
                <div className="font-semibold text-[#8B5E3C]">AI Question</div>

                <p className="mt-2 whitespace-pre-wrap">
                  {chat.answer?.content}
                </p>

                <div className="mt-6 font-semibold text-blue-600">
                  AI Answer
                </div>
                <p className="mt-2 whitespace-pre-wrap">
                  {chat.question?.content}
                </p>

                <div className="text-xs text-gray-400 mt-4">
                  {new Date(chat.question?.created_at).toLocaleString()}
                </div>
              </div>
            ));
          })()}

          <div className="flex justify-end p-6 border-t dark:border-gray-700">
            <button
              onClick={() => deleteGroup("general")}
              className="flex items-center gap-2 text-red-500 hover:text-red-700"
            >
              <FiTrash2 size={20} />
              Delete General History
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
