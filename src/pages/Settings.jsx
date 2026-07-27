import {
  FiSettings,
  FiDatabase,
  FiCpu,
  FiUser,
  FiMoon,
  FiDownload,
  FiTrash2,
  FiShield,
  FiCheckCircle,
} from "react-icons/fi";

import { supabase } from "../Services/supabase";

export default function Settings() {
  async function exportQuestions() {
    const { data, error } = await supabase.from("questions").select("*");

    if (error) {
      alert("Failed to export questions");
      return;
    }

    const csv = [
      ["Question", "Answer", "Created At"],
      ...data.map((item) => [item.query, item.answer, item.created_at]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "questions.csv";

    link.click();

    URL.revokeObjectURL(url);
  }

  async function exportDocuments() {
    const { data, error } = await supabase.from("documents").select("*");

    if (error) {
      alert("Failed to export documents");
      return;
    }

    const csv = [
      ["Title", "File Name", "Uploaded At"],
      ...data.map((item) => [item.title, item.file_name, item.uploaded_at]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "documents.csv";

    link.click();

    URL.revokeObjectURL(url);
  }

  async function clearAIHistory() {
    const confirmDelete = window.confirm("Delete all AI questions?");

    if (!confirmDelete) return;

    const { error } = await supabase.from("questions").delete().neq("id", 0);

    if (error) {
      alert("Failed to clear history");
      return;
    }

    alert("AI history cleared successfully");
  }

  function resetApplication() {
    const confirmReset = window.confirm("Reset application settings?");

    if (!confirmReset) return;

    localStorage.clear();

    window.location.reload();
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-6 min-h-screen bg-[#F8F6F2] dark:bg-[#111827] transition-colors">
      {/* Header */}

      <div>
        <h1 className="text-4xl font-bold text-[#5A3F2A] dark:text-white">
          Settings
        </h1>

        <p className="text-[#7B6A5C] dark:text-gray-400 mt-2">
          Configure your DataNest AI application.
        </p>
      </div>

      {/* Profile + Project */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile */}

        <div
          className="
          bg-white
          dark:bg-[#1F2937]
          rounded-3xl
          border
          border-[#ECE6DE]
          dark:border-gray-700
          shadow-lg
          hover:shadow-2xl
          hover:-translate-y-2
          transition-all
          duration-300
          p-8
        "
        >
          <div className="flex items-center gap-4 mb-8">
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
              <FiUser size={28} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#5A3F2A] dark:text-white">
                Administrator
              </h2>

              <p className="text-[#7B6A5C] dark:text-gray-400">User Profile</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#5A3F2A] dark:text-white mb-2">
                Name
              </label>

              <input
                readOnly
                value="Bibi Hawa Abdul Shukoor"
                className="
                w-full
                bg-[#F8F6F2]
                dark:bg-[#374151]
                border
                border-[#ECE6DE]
                dark:border-gray-600
                rounded-2xl
                p-4
                outline-none
                text-[#5A3F2A]
                dark:text-white
              "
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#5A3F2A] dark:text-white mb-2">
                Role
              </label>

              <input
                readOnly
                value="Administrator"
                className="
                w-full
                bg-[#F8F6F2]
                dark:bg-[#374151]
                border
                border-[#ECE6DE]
                dark:border-gray-600
                rounded-2xl
                p-4
                outline-none
                text-[#5A3F2A]
                dark:text-white
              "
              />
            </div>
          </div>
        </div>

        {/* Project */}

        <div
          className="
          bg-white
          dark:bg-[#1F2937]
          rounded-3xl
          border
          border-[#ECE6DE]
          dark:border-gray-700
          shadow-lg
          hover:shadow-2xl
          hover:-translate-y-2
          transition-all
          duration-300
          p-8
        "
        >
          <div className="flex items-center gap-4 mb-8">
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
              <FiSettings size={28} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#5A3F2A] dark:text-white">
                Project
              </h2>

              <p className="text-[#7B6A5C] dark:text-gray-400">
                System Information
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex justify-between">
              <span className="text-[#7B6A5C] dark:text-gray-400">
                Application
              </span>

              <strong className="text-[#5A3F2A] dark:text-white">
                DataNest AI
              </strong>
            </div>

            <div className="flex justify-between">
              <span className="text-[#7B6A5C] dark:text-gray-400">Version</span>

              <strong className="text-[#5A3F2A] dark:text-white">v1.0</strong>
            </div>

            <div className="flex justify-between">
              <span className="text-[#7B6A5C] dark:text-gray-400">
                Environment
              </span>

              <strong className="text-green-500">Production</strong>
            </div>
          </div>
        </div>
      </div>
      {/* Preferences + Backup */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Preferences */}

        <div
          className="
            bg-white dark:bg-[#1F2937]
            rounded-3xl
            border border-[#ECE6DE] dark:border-gray-700
            shadow-lg
            hover:shadow-2xl
            hover:-translate-y-2
            transition-all
            duration-300
            p-8
          "
        >
          <div className="flex items-center gap-4 mb-8">
            <div
              className="
                w-16 h-16
                rounded-2xl
                bg-[#EFE7DE] dark:bg-[#374151]
                text-[#8B5E3C] dark:text-amber-400
                flex items-center justify-center
              "
            >
              <FiMoon size={28} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#5A3F2A] dark:text-white">
                Preferences
              </h2>

              <p className="text-[#7B6A5C] dark:text-gray-400">
                Application Settings
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-[#7B6A5C] dark:text-gray-400">
                Dark Mode
              </span>

              <button
                className="
                  inline-block
                  px-3 py-1
                  rounded-lg
                  bg-gray-100 dark:bg-gray-700
                  text-[#5A3F2A] dark:text-white
                  text-sm font-medium
                "
              >
                Coming Soon
              </button>
            </div>

            <div className="flex justify-between">
              <span className="text-[#7B6A5C] dark:text-gray-400">
                Language
              </span>

              <strong className="text-[#5A3F2A] dark:text-white">
                English
              </strong>
            </div>

            <div className="flex justify-between">
              <span className="text-[#7B6A5C] dark:text-gray-400">
                Timezone
              </span>

              <strong className="text-[#5A3F2A] dark:text-white">
                Local Time
              </strong>
            </div>
          </div>
        </div>

        {/* Backup */}

        <div
          className="
            bg-white dark:bg-[#1F2937]
            rounded-3xl
            border border-[#ECE6DE] dark:border-gray-700
            shadow-lg
            hover:shadow-2xl
            hover:-translate-y-2
            transition-all
            duration-300
            p-8
          "
        >
          <div className="flex items-center gap-4 mb-8">
            <div
              className="
                w-16 h-16
                rounded-2xl
                bg-[#EFE7DE] dark:bg-[#374151]
                text-[#8B5E3C] dark:text-amber-400
                flex items-center justify-center
              "
            >
              <FiDownload size={28} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#5A3F2A] dark:text-white">
                Backup & Export
              </h2>

              <p className="text-[#7B6A5C] dark:text-gray-400">
                Export your data
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={exportQuestions}
              className="
                w-full
                bg-[#8B5E3C]
                hover:bg-[#70492C]
                text-white
                py-3
                rounded-2xl
                transition
              "
            >
              Export Questions
            </button>

            <button
              onClick={exportDocuments}
              className="
                w-full
                bg-[#5A3F2A]
                dark:bg-[#5A3F2A]
                hover:bg-[#4B3423]
                dark:hover:bg-[#5A3F2A]
                text-white
                py-3
                rounded-2xl
                transition
              "
            >
              Export Documents
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}

      <div
        className="
          bg-white dark:bg-[#1F2937]
          rounded-3xl
          border border-red-200 dark:border-red-800
          shadow-lg
          p-8
        "
      >
        <h2 className="text-2xl font-bold text-red-600 mb-8">Danger Zone</h2>

        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <h3 className="font-bold text-[#5A3F2A] dark:text-white">
                Clear AI History
              </h3>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Remove all saved AI questions.
              </p>
            </div>

            <button
              onClick={clearAIHistory}
              className="
                bg-red-500
                hover:bg-red-600
                text-white
                px-6
                py-3
                rounded-2xl
                transition
              "
            >
              <FiTrash2 className="inline mr-2" />
              Clear
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <h3 className="font-bold text-[#5A3F2A] dark:text-white">
                Reset Application
              </h3>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Restore default application settings.
              </p>
            </div>

            <button
              onClick={resetApplication}
              className="
                bg-red-700
                hover:bg-red-800
                text-white
                px-6
                py-3
                rounded-2xl
                transition
                "
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* About */}

      <div
        className="
          bg-white dark:bg-[#1F2937]
          rounded-3xl
          border border-[#ECE6DE] dark:border-gray-700
          shadow-lg
          p-8
        "
      >
        <div className="flex items-center gap-4 mb-6">
          <div
            className="
              w-14 h-14
              rounded-2xl
              bg-[#EFE7DE] dark:bg-[#374151]
              text-[#8B5E3C] dark:text-amber-400
              flex items-center justify-center
            "
          >
            <FiSettings size={24} />
          </div>

          <h2 className="text-2xl font-bold text-[#5A3F2A] dark:text-white">
            About
          </h2>
        </div>

        <div className="space-y-4 text-[#7B6A5C] dark:text-gray-300">
          <p>
            <strong className="text-[#5A3F2A] dark:text-white">Project:</strong>{" "}
            DataNest AI
          </p>

          <p>
            <strong className="text-[#5A3F2A] dark:text-white">
              Developer:
            </strong>{" "}
            Bibi Hawa Abdul Shukoor
          </p>

          <p>
            <strong className="text-[#5A3F2A] dark:text-white">
              Framework:
            </strong>{" "}
            React + Supabase + OpenRouter
          </p>

          <p>
            <strong className="text-[#5A3F2A] dark:text-white">Version:</strong>{" "}
            1.0
          </p>
        </div>
      </div>
    </div>
  );
}
