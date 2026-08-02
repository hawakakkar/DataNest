import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "../Services/supabase";
import { useSearch } from "../context/SearchContext";

function Search() {
  const [questions, setQuestions] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const [searchParams] = useSearchParams();
  const { search } = useSearch();

  const keyword =
    search.trim() === "" ? "" : (searchParams.get("q") || "").toLowerCase();

  useEffect(() => {
    loadQuestions();
  }, []);

  async function loadQuestions() {
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.log(error);
      return;
    }

    setQuestions(data || []);
  }

  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this question?",
    );

    if (!confirmDelete) return;

    const { error } = await supabase.from("questions").delete().eq("id", id);

    if (error) {
      console.log(error);
      return;
    }

    setQuestions((prev) => prev.filter((item) => item.id !== id));
    setSelectedIds((prev) => prev.filter((item) => item !== id));
  }

  async function deleteSelected() {
    if (selectedIds.length === 0) return;

    if (!window.confirm("Delete selected questions?")) return;

    const { error } = await supabase
      .from("questions")
      .delete()
      .in("id", selectedIds);

    if (error) {
      console.log(error);
      return;
    }

    setQuestions((prev) =>
      prev.filter((item) => !selectedIds.includes(item.id)),
    );

    setSelectedIds([]);
  }

  const filteredQuestions =
    keyword === ""
      ? questions
      : questions.filter((item) => {
          const questionMatch = item.query?.toLowerCase().includes(keyword);

          const answerMatch = item.answer?.toLowerCase().includes(keyword);

          return questionMatch || answerMatch;
        });

  function toggleSelectAll() {
    if (selectedIds.length === filteredQuestions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredQuestions.map((q) => q.id));
    }
  }

  function highlightText(text = "") {
    if (!keyword) return text;

    const regex = new RegExp(`(${keyword})`, "gi");

    return text.split(regex).map((part, index) =>
      part.toLowerCase() === keyword.toLowerCase() ? (
        <mark
          key={index}
          className="bg-yellow-300 dark:bg-yellow-600 rounded px-1 font-semibold text-black"
        >
          {part}
        </mark>
      ) : (
        part
      ),
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-6 py-8 min-h-screen bg-[#F8F6F2] dark:bg-[#111827] transition-colors duration-300">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-[#5A3F2A] dark:text-white">
            AI History
          </h1>

          <p className="text-gray-500 dark:text-gray-400 mt-2">
            View and manage all your previous AI conversations.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={toggleSelectAll}
            className="
              px-5
              py-2
              rounded-xl
              bg-[#EFE7DE]
              dark:bg-[#374151]
              text-[#5A3F2A]
              dark:text-white
              hover:bg-[#E3D7CA]
              dark:hover:bg-[#4B5563]
              transition
            "
          >
            {selectedIds.length === filteredQuestions.length
              ? "Unselect All"
              : "Select All"}
          </button>

          <button
            onClick={deleteSelected}
            disabled={selectedIds.length === 0}
            className="
              px-5
              py-2
              rounded-xl
              bg-red-500
              text-white
              hover:bg-red-600
              disabled:opacity-40
            "
          >
            Delete Selected
          </button>
        </div>
      </div>

      {filteredQuestions.length === 0 ? (
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
          <p className="text-gray-500 dark:text-gray-400">
            No matching questions found.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredQuestions.map((item) => (
            <div
              key={item.id}
              className="
                bg-white
                dark:bg-[#1F2937]
                rounded-3xl
                border
                border-[#ECE6DE]
                dark:border-gray-700
                shadow-lg
                hover:shadow-2xl
                hover:-translate-y-1
                hover:border-[#8B5E3C]
                dark:hover:border-[#D6A97A]
                transition-all
                duration-300
                p-7
              "
            >
              <div className="flex justify-between items-start gap-5">
                <div className="flex gap-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds([...selectedIds, item.id]);
                      } else {
                        setSelectedIds(
                          selectedIds.filter((id) => id !== item.id),
                        );
                      }
                    }}
                    className="mt-1 w-5 h-5 accent-[#8B5E3C]"
                  />

                  <div>
                    <h2 className="font-semibold text-[#8B5E3C] dark:text-[#D6A97A] text-lg">
                      Question
                    </h2>

                    <p className="mt-3 leading-7 text-[#2F2A27] dark:text-gray-200">
                      {highlightText(item.query)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="
                    bg-[#8B5E3C]
                    hover:bg-[#70492C]
                    text-white
                    px-5
                    py-2
                    rounded-xl
                    transition
                  "
                >
                  Delete
                </button>
              </div>

              <hr className="my-6 border-[#ECE6DE] dark:border-gray-700" />
              <h2 className="font-semibold text-[#8B5E3C] dark:text-[#D6A97A] text-lg">
                AI Answer
              </h2>

              <p
                className="
                  mt-3
                  whitespace-pre-wrap
                  leading-8
                  text-gray-700
                  dark:text-gray-300
                "
              >
                {highlightText(item.answer)}
              </p>

              <div
                className="
                  mt-6
                  text-xs
                  text-gray-400
                  dark:text-gray-500
                "
              >
                {new Date(item.created_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Search;
