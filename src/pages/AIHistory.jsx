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
      console.log(error);
      setLoading(false);
      return;
    }

    const documentGroups = {};
    const generalChats = [];

    for (const item of data) {
      let documentName = item.document_name;

      if (!documentName && item.document_id) {
        const { data: doc } = await supabase
          .from("documents")
          .select("file_name")
          .eq("id", item.document_id)
          .single();

        documentName =
          doc?.file_name?.replace(/^\d+[-_]/, "") || "Unknown Document";
      }

      if (item.chat_type === "general") {
        generalChats.push(item);
        continue;
      }

      if (!documentGroups[item.document_id]) {
        documentGroups[item.document_id] = {
          document_id: item.document_id,
          document_name: documentName,
          chats: [],
        };
      }

      documentGroups[item.document_id].chats.push(item);
    }

    setGroups({
      documents: Object.values(documentGroups),
      general: generalChats,
    });

    const opened = {};

    Object.values(documentGroups).forEach((g) => {
      opened[g.document_id] = true;
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
      query = query.eq("chat_type", "general");
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

              <FiFileText size={22} className="text-[#8B5E3C]" />

              <div className="text-left">
                <h2 className="font-bold text-lg">
                  Chat with: {group.document_name}
                </h2>

                <p className="text-sm text-gray-500">
                  {group.chats.length} messages
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
              {group.chats.map((chat) => (
                <div
                  key={chat.id}
                  className="p-6 border-b dark:border-gray-700"
                >
                  <div
                    className={`mb-4 font-semibold ${
                      chat.role === "user" ? "text-[#8B5E3C]" : "text-[#2563EB]"
                    }`}
                  >
                    {chat.role === "user" ? "Question" : "AI Answer"}
                  </div>

                  <div className="whitespace-pre-wrap leading-8">
                    {chat.content}
                  </div>

                  <div className="text-xs text-gray-400 mt-4">
                    {new Date(chat.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
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
          {groups.general.map((chat) => (
            <div
              key={chat.id}
              className="p-6 border-b last:border-b-0 dark:border-gray-700"
            >
              <div
                className={`mb-4 font-semibold ${
                  chat.role === "user" ? "text-[#8B5E3C]" : "text-[#2563EB]"
                }`}
              >
                {chat.role === "user" ? "Question" : "AI Answer"}
              </div>

              <div className="whitespace-pre-wrap leading-8 text-[#2F2A27] dark:text-white">
                {chat.content}
              </div>

              <div className="text-xs text-gray-400 mt-4">
                {new Date(chat.created_at).toLocaleString()}
              </div>
            </div>
          ))}

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
