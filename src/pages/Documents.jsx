import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../Services/supabase";
import {
  FiFileText,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiDownload,
  FiMessageSquare,
} from "react-icons/fi";
import { useSearch } from "../context/SearchContext";

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const [searchParams] = useSearchParams();
  const { search } = useSearch();
  const navigate = useNavigate();

  const keyword =
    search.trim() === ""
      ? ""
      : (searchParams.get("search") || "").toLowerCase();

  useEffect(() => {
    getDocuments();
  }, []);

  async function getDocuments() {
    setLoading(true);

    const { data, error } = await supabase
      .from("documents")
      .select(
        `
        *,
        chunks (
          content
        )
      `,
      )
      .order("uploaded_at", {
        ascending: false,
      });

    if (!error) {
      setDocuments(data || []);
    }

    setLoading(false);
  }

  async function deleteDocument(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this document?",
    );

    if (!confirmDelete) return;

    await supabase.from("chunks").delete().eq("document_id", id);
    await supabase.from("documents").delete().eq("id", id);

    setDocuments((prev) => prev.filter((doc) => doc.id !== id));

    if (selectedDocument?.id === id) {
      setSelectedDocument(null);
    }
  }
  async function downloadDocument(fileName) {
    const { data } = supabase.storage.from("documents").getPublicUrl(fileName);

    if (!data?.publicUrl) return;

    const response = await fetch(data.publicUrl);
    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName.replace(/^\d+[-_]/, "");
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  }
  function highlight(text) {
    if (!keyword) return text;

    const regex = new RegExp(`(${keyword})`, "gi");

    return text.split(regex).map((part, index) =>
      part.toLowerCase() === keyword.toLowerCase() ? (
        <mark key={index} className="bg-[#D8C3A5] text-[#5A3F2A] rounded px-1">
          {part}
        </mark>
      ) : (
        part
      ),
    );
  }

  const filteredDocuments =
    keyword === ""
      ? documents
      : documents.filter((doc) => {
          const titleMatch = doc.title?.toLowerCase().includes(keyword);

          const fileMatch = doc.file_name?.toLowerCase().includes(keyword);

          const chunkMatch = doc.chunks?.some((chunk) =>
            chunk.content?.toLowerCase().includes(keyword),
          );

          return titleMatch || fileMatch || chunkMatch;
        });

  return (
    <div className="flex-1 px-8 md:px-12 py-8 bg-[#F8F6F2] dark:bg-[#111827] min-h-screen transition-colors">
      {/* Header */}

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#5A3F2A] dark:text-white">
          Documents
        </h1>

        <p className="text-[#8A7A6A] dark:text-gray-400 mt-2">
          Manage your uploaded knowledge base files.
        </p>
      </div>

      <div
        className="
        bg-white
        dark:bg-[#1F2937]
        rounded-3xl
        border
        border-[#ECE6DE]
        dark:border-gray-700
        shadow-xl
        p-8
      "
      >
        {loading ? (
          <p className="text-[#8A7A6A] dark:text-gray-400 text-lg">
            Loading documents...
          </p>
        ) : filteredDocuments.length === 0 ? (
          <p className="text-[#8A7A6A] dark:text-gray-400">
            No documents found
            {keyword && (
              <>
                {" "}
                for <b>"{keyword}"</b>
              </>
            )}
          </p>
        ) : (
          <div className="space-y-6">
            {filteredDocuments.map((doc) => {
              const matchedChunk = doc.chunks?.find((chunk) =>
                chunk.content?.toLowerCase().includes(keyword),
              );

              return (
                <div
                  key={doc.id}
                  className="
                  bg-white
                  dark:bg-[#1F2937]
                  border
                  border-[#ECE6DE]
                  dark:border-gray-700
                  rounded-3xl
                  shadow-md
                  hover:shadow-2xl
                  hover:-translate-y-2
                  transition-all
                  duration-300
                  p-7
                "
                >
                  {/* Top */}

                  <div className="flex flex-col lg:flex-row justify-between gap-6">
                    {/* Left */}

                    <div className="flex gap-5 flex-1">
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
                        shadow-sm
                        shrink-0
                      "
                      >
                        <FiFileText size={28} />
                      </div>

                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-[#5A3F2A] dark:text-white">
                          {highlight(doc.title || "")}
                        </h2>

                        <p className="text-[#8A7A6A] dark:text-gray-400 mt-1">
                          {highlight(doc.file_name || "")}
                        </p>

                        <p className="text-sm text-[#8A7A6A] dark:text-gray-400 mt-3">
                          Uploaded:{" "}
                          {new Date(doc.uploaded_at).toLocaleDateString()}
                        </p>

                        <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                          Embeddings Generated ✓
                        </p>

                        <p className="text-sm text-[#8B5E3C] dark:text-[#D6A97A] mt-1">
                          Chunks: {doc.chunks?.length || 0}
                        </p>

                        {matchedChunk && (
                          <div
                            className="
                            mt-4
                            bg-[#F8F6F2]
                            dark:bg-[#111827]
                            border-l-4
                            border-[#C08A52]
                            rounded-2xl
                            p-4
                          "
                          >
                            <p className="font-semibold text-[#5A3F2A] dark:text-white">
                              Matching Text
                            </p>

                            <p className="text-[#6B625B] dark:text-gray-300 mt-2 leading-7">
                              {highlight(matchedChunk.content.slice(0, 250))}
                              ...
                            </p>
                          </div>
                        )}

                        {keyword && (
                          <p className="mt-3 text-sm font-semibold text-[#8B5E3C] dark:text-[#D6A97A]">
                            ⭐ Found by Global Search
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 self-start">
                      <button
                        onClick={() =>
                          setSelectedDocument(
                            selectedDocument?.id === doc.id ? null : doc,
                          )
                        }
                        className="
                        w-10
                        h-10
                        rounded-xl
                        bg-[#F8F6F2]
                        dark:bg-[#374151]
                        hover:bg-[#EFE7DE]
                        dark:hover:bg-[#4B5563]
                        text-[#8B5E3C]
                        dark:text-white
                        flex
                        items-center
                        justify-center
                        transition
                      "
                      >
                        {selectedDocument?.id === doc.id ? (
                          <FiEye size={20} />
                        ) : (
                          <FiEyeOff size={20} />
                        )}
                      </button>
                      <button
                        onClick={() => downloadDocument(doc.file_name)}
                        className=" w-10
                                    h-10
                                   rounded-xl
                                   bg-[#F8F6F2]
                                   dark:bg-[#374151]
                                   hover:bg-[#EFE7DE]
                                   dark:hover:bg-[#4B5563]
                                   text-[#8B5E3C]
                                   dark:text-white
                                   flex
                                   items-center
                                   justify-center
                                   transition
                                   "
                        title="Download Document"
                      >
                        <FiDownload size={20} />
                      </button>
                      <button
                        onClick={() => navigate(`/document-chat/${doc.id}`)}
                        className="
      w-10
      h-10
      rounded-xl
      bg-[#F8F6F2]
      dark:bg-[#374151]
      hover:bg-[#EFE7DE]
      dark:hover:bg-[#4B5563]
      text-[#8B5E3C]
      dark:text-white
      flex
      items-center
      justify-center
      transition
  "
                        title="Ask AI"
                      >
                        <FiMessageSquare size={20} />
                      </button>
                      <button
                        onClick={() => deleteDocument(doc.id)}
                        className="
                        w-10
                        h-10
                        rounded-xl
                        bg-red-50
                        dark:bg-red-900/30
                        hover:bg-red-100
                        dark:hover:bg-red-800/40
                        text-red-500
                        dark:text-red-400
                        flex
                        items-center
                        justify-center
                        transition
                      "
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Details */}

                  {selectedDocument?.id === doc.id && (
                    <div
                      className="
                      mt-6
                      bg-[#F8F6F2]
                      dark:bg-[#111827]
                      border
                      border-[#ECE6DE]
                      dark:border-gray-700
                      rounded-3xl
                      p-6
                    "
                    >
                      <h3 className="text-2xl font-bold text-[#5A3F2A] dark:text-white mb-5">
                        Document Details
                      </h3>

                      <div className="grid md:grid-cols-2 gap-4 text-[#5A3F2A] dark:text-gray-200">
                        <p>
                          <span className="font-semibold">Title:</span>{" "}
                          {doc.title}
                        </p>

                        <p>
                          <span className="font-semibold">File:</span>{" "}
                          {doc.file_name}
                        </p>

                        <p>
                          <span className="font-semibold">Uploaded:</span>{" "}
                          {new Date(doc.uploaded_at).toLocaleString()}
                        </p>

                        <p>
                          <span className="font-semibold">Chunks:</span>{" "}
                          {doc.chunks?.length || 0}
                        </p>
                      </div>

                      {doc.chunks?.length > 0 && (
                        <div
                          className="
                          mt-6
                          bg-white
                          dark:bg-[#1F2937]
                          border
                          border-[#ECE6DE]
                          dark:border-gray-700
                          rounded-2xl
                          p-5
                          text-[#6B625B]
                          dark:text-gray-300
                          leading-7
                        "
                        >
                          {doc.chunks[0].content.slice(0, 500)}
                          ...
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
