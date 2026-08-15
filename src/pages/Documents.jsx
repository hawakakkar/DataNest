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
        <mark
          key={index}
          className="
            bg-[#E8D1B8]
            dark:bg-[#6A4A32]
            text-[#4A3021]
            dark:text-[#F3D6B7]
            rounded-md
            px-1
          "
        >
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
    <div
      className="
        flex-1
        px-4
        sm:px-6
        md:px-8
        lg:px-12
        py-6
        md:py-8
        bg-[#F8F6F2]
        dark:bg-[#0F0B08]
        min-h-screen
        transition-colors
        duration-300
      "
    >
      {/* ================= HEADER ================= */}

      <div className="mb-8 md:mb-10">
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
              dark:text-[#F1D2B1]
              flex
              items-center
              justify-center
              shadow-lg
              border
              border-[#4A3021]
              dark:border-[#5A3D29]
            "
          >
            <FiFileText size={27} />
          </div>

          <div>
            <h1
              className="
                text-3xl
                md:text-4xl
                font-bold
                tracking-tight
                text-[#4A3021]
                dark:text-[#F3E5D7]
              "
            >
              Documents
            </h1>

            <p
              className="
                text-[#8A7A6A]
                dark:text-[#BCA99A]
                mt-1
              "
            >
              Manage your uploaded knowledge base files.
            </p>
          </div>
        </div>
      </div>

      {/* ================= DOCUMENTS CONTAINER ================= */}

      <div
        className="
          bg-[#FFFDF9]
          dark:bg-[#30241C]
          rounded-[28px]
          border
          border-[#E7DDD2]
          dark:border-[#5A3D29]
          shadow-xl
          p-4
          sm:p-6
          md:p-8
          transition-all
          duration-300
        "
      >
        {loading ? (
          <div className="py-10">
            <p
              className="
                text-[#8A7A6A]
                dark:text-[#BCA99A]
                text-lg
              "
            >
              Loading documents...
            </p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="py-10 text-center">
            <div
              className="
                w-16
                h-16
                mx-auto
                rounded-2xl
                bg-[#EFE7DE]
                dark:bg-[#3A2B21]
                text-[#4A3021]
                dark:text-[#D9B18C]
                flex
                items-center
                justify-center
                mb-5
              "
            >
              <FiFileText size={28} />
            </div>

            <p
              className="
                text-[#8A7A6A]
                dark:text-[#BCA99A]
                text-lg
              "
            >
              No documents found
              {keyword && (
                <>
                  {" "}
                  for <b>"{keyword}"</b>
                </>
              )}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredDocuments.map((doc) => {
              const matchedChunk = doc.chunks?.find((chunk) =>
                chunk.content?.toLowerCase().includes(keyword),
              );

              return (
                <div
                  key={doc.id}
                  className="
                    bg-[#FFFDF9]
                    dark:bg-[#30241C]
                    border
                    border-[#E7DDD2]
                    dark:border-[#60432D]
                    rounded-[26px]
                    shadow-md
                    hover:shadow-xl
                    hover:-translate-y-1
                    transition-all
                    duration-300
                    p-5
                    sm:p-6
                    md:p-7
                  "
                >
                  {/* ================= TOP ================= */}

                  <div className="flex flex-col lg:flex-row justify-between gap-6">
                    {/* LEFT */}

                    <div className="flex gap-4 sm:gap-5 flex-1 min-w-0">
                      {/* File Icon */}

                      <div
                        className="
                          w-14
                          h-14
                          sm:w-16
                          sm:h-16
                          rounded-2xl
                          bg-[#EFE7DE]
                          dark:bg-[#3A2B21]
                          text-[#4A3021]
                          dark:text-[#E0B991]
                          flex
                          items-center
                          justify-center
                          shadow-sm
                          shrink-0
                          border
                          border-[#E5D6C7]
                          dark:border-[#5A3D29]
                        "
                      >
                        <FiFileText size={28} />
                      </div>

                      {/* Document Info */}

                      <div className="flex-1 min-w-0">
                        <h2
                          className="
                            text-lg
                            sm:text-xl
                            font-bold
                            text-[#4A3021]
                            dark:text-[#F3E5D7]
                            break-words
                          "
                        >
                          {highlight(doc.title || "")}
                        </h2>

                        <p
                          className="
                            text-[#8A7A6A]
                            dark:text-[#BCA99A]
                            mt-1
                            break-all
                          "
                        >
                          {highlight(doc.file_name || "")}
                        </p>

                        <p
                          className="
                            text-sm
                            text-[#8A7A6A]
                            dark:text-[#BCA99A]
                            mt-3
                          "
                        >
                          Uploaded:{" "}
                          {new Date(doc.uploaded_at).toLocaleDateString()}
                        </p>

                        {/* Embeddings */}

                        <p
                          className="
                            text-sm
                            text-[#4A3021]
                            dark:text-[#a0806b]
                            mt-2
                            font-medium
                          "
                        >
                          Embeddings Generated ✓
                        </p>

                        {/* Chunks */}

                        <p
                          className="
                            text-sm
                            text-[#4A3021]
                            dark:text-[#E0B991]
                            mt-1
                            font-medium
                          "
                        >
                          Chunks: {doc.chunks?.length || 0}
                        </p>

                        {/* ================= MATCHING TEXT ================= */}

                        {matchedChunk && (
                          <div
                            className="
                              mt-4
                              bg-[#F8F3ED]
                              dark:bg-[#241B16]
                              border
                              border-[#E5D8CC]
                              dark:border-[#5A3D29]
                              border-l-4
                              border-l-[#4A3021]
                              dark:border-l-[#B57A4D]
                              rounded-2xl
                              p-4
                            "
                          >
                            <p
                              className="
                                font-semibold
                                text-[#4A3021]
                                dark:text-[#F0D6BE]
                              "
                            >
                              Matching Text
                            </p>

                            <p
                              className="
                                text-[#6B625B]
                                dark:text-[#C8B8AA]
                                mt-2
                                leading-7
                              "
                            >
                              {highlight(matchedChunk.content.slice(0, 250))}
                              ...
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ================= BUTTONS ================= */}

                    <div
                      className="
                        flex
                        gap-2
                        sm:gap-3
                        self-start
                        shrink-0
                      "
                    >
                      {/* View */}

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
                          bg-[#F8F3ED]
                          dark:bg-[#3A2B21]
                          hover:bg-[#EDE1D5]
                          dark:hover:bg-[#493426]
                          border
                          border-[#E4D8CD]
                          dark:border-[#60432D]
                          text-[#4A3021]
                          dark:text-[#E5BE99]
                          flex
                          items-center
                          justify-center
                          transition-all
                          duration-200
                        "
                        title="View Details"
                      >
                        {selectedDocument?.id === doc.id ? (
                          <FiEye size={19} />
                        ) : (
                          <FiEyeOff size={19} />
                        )}
                      </button>

                      {/* Download */}

                      <button
                        onClick={() => downloadDocument(doc.file_name)}
                        className="
                          w-10
                          h-10
                          rounded-xl
                          bg-[#F8F3ED]
                          dark:bg-[#3A2B21]
                          hover:bg-[#EDE1D5]
                          dark:hover:bg-[#493426]
                          border
                          border-[#E4D8CD]
                          dark:border-[#60432D]
                          text-[#4A3021]
                          dark:text-[#E5BE99]
                          flex
                          items-center
                          justify-center
                          transition-all
                          duration-200
                        "
                        title="Download Document"
                      >
                        <FiDownload size={19} />
                      </button>

                      {/* Ask AI */}

                      <button
                        onClick={() => navigate(`/document-chat/${doc.id}`)}
                        className="
                          w-10
                          h-10
                          rounded-xl
                          bg-[#F8F3ED]
                          dark:bg-[#3A2B21]
                          hover:bg-[#EDE1D5]
                          dark:hover:bg-[#493426]
                          border
                          border-[#E4D8CD]
                          dark:border-[#60432D]
                          text-[#4A3021]
                          dark:text-[#E5BE99]
                          flex
                          items-center
                          justify-center
                          transition-all
                          duration-200
                        "
                        title="Ask AI"
                      >
                        <FiMessageSquare size={19} />
                      </button>

                      {/* Delete */}

                      <button
                        onClick={() => deleteDocument(doc.id)}
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
                        title="Delete Document"
                      >
                        <FiTrash2 size={19} />
                      </button>
                    </div>
                  </div>

                  {/* ================= DETAILS ================= */}

                  {selectedDocument?.id === doc.id && (
                    <div
                      className="
                        mt-6
                        bg-[#F8F3ED]
                        dark:bg-[#241B16]
                        border
                        border-[#E5D8CC]
                        dark:border-[#5A3D29]
                        rounded-3xl
                        p-5
                        sm:p-6
                      "
                    >
                      <h3
                        className="
                          text-xl
                          sm:text-2xl
                          font-bold
                          text-[#4A3021]
                          dark:text-[#F3E5D7]
                          mb-5
                        "
                      >
                        Document Details
                      </h3>

                      <div
                        className="
                          grid
                          md:grid-cols-2
                          gap-4
                          text-[#4A3021]
                          dark:text-[#E3D3C5]
                        "
                      >
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

                      {/* Text Preview */}

                      {doc.chunks?.length > 0 && (
                        <div
                          className="
                            mt-6
                            bg-[#FFFDF9]
                            dark:bg-[#30241C]
                            border
                            border-[#E5D8CC]
                            dark:border-[#60432D]
                            rounded-2xl
                            p-5
                            text-[#6B625B]
                            dark:text-[#C8B8AA]
                            leading-7
                          "
                        >
                          <p
                            className="
                              text-sm
                              font-semibold
                              text-[#4A3021]
                              dark:text-[#E0B991]
                              mb-3
                            "
                          >
                            Text Preview
                          </p>
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
