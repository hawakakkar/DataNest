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
    <div className="max-w-7xl mx-auto space-y-8 px-6">
      {/* Header */}

      <div>
        <h1 className="text-4xl font-bold text-[#5A3F2A]">Settings</h1>

        <p className="text-[#7B6A5C] mt-2">
          Configure your DataNest AI application.
        </p>
      </div>

      {/* Profile + Project */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile */}

        <div
          className="
            bg-white
            rounded-3xl
            border
            border-[#ECE6DE]
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
                text-[#8B5E3C]
                flex
                items-center
                justify-center
              "
            >
              <FiUser size={28} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#5A3F2A]">
                Administrator
              </h2>

              <p className="text-[#7B6A5C]">User Profile</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#5A3F2A] mb-2">
                Name
              </label>

              <input
                readOnly
                value="Bibi Hawa Abdul Shukoor"
                className="
                  w-full
                  bg-[#F8F6F2]
                  border
                  border-[#ECE6DE]
                  rounded-2xl
                  p-4
                  outline-none
                "
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#5A3F2A] mb-2">
                Role
              </label>

              <input
                readOnly
                value="Administrator"
                className="
                  w-full
                  bg-[#F8F6F2]
                  border
                  border-[#ECE6DE]
                  rounded-2xl
                  p-4
                  outline-none
                "
              />
            </div>
          </div>
        </div>

        {/* Project */}

        <div
          className="
            bg-white
            rounded-3xl
            border
            border-[#ECE6DE]
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
                text-[#8B5E3C]
                flex
                items-center
                justify-center
              "
            >
              <FiSettings size={28} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#5A3F2A]">Project</h2>

              <p className="text-[#7B6A5C]">System Information</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex justify-between">
              <span className="text-[#7B6A5C]">Application</span>

              <strong className="text-[#5A3F2A]">DataNest AI</strong>
            </div>

            <div className="flex justify-between">
              <span className="text-[#7B6A5C]">Version</span>

              <strong className="text-[#5A3F2A]">v1.0</strong>
            </div>

            <div className="flex justify-between">
              <span className="text-[#7B6A5C]">Environment</span>

              <strong className="text-green-600">Production</strong>
            </div>
          </div>
        </div>
        {/* Connected Services */}

        <div
          className="
          bg-white
          rounded-3xl
          border
          border-[#ECE6DE]
          shadow-lg
          hover:shadow-2xl
          transition-all
          duration-300
          p-8
        "
        >
          <h2 className="text-2xl font-bold text-[#5A3F2A] mb-8">
            Connected Services
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Supabase */}

            <div
              className="
              bg-[#F8F6F2]
              rounded-2xl
              border
              border-[#ECE6DE]
              p-6
              hover:-translate-y-1
              hover:shadow-lg
              transition-all
            "
            >
              <div
                className="flex items-center gap-3 mb-4 
              "
              >
                <div className="bg-[#EFE7DE] rounded-xl text-[#8B5E3C]">
                  <FiDatabase size={18} />
                </div>

                <h3 className="font-bold text-[#5A3F2A]">Supabase</h3>
              </div>

              <p className="text-green-600 flex items-center gap-2 text-sm mt-1">
                <FiCheckCircle />
                Connected
              </p>
            </div>

            {/* OpenRouter */}

            <div
              className="
              bg-[#F8F6F2]
              rounded-2xl
              border
              border-[#ECE6DE]
              p-1
              hover:-translate-y-1
              hover:shadow-lg
              transition-all
            "
            >
              <div
                className="flex items-center gap-3 mb-4 mt-4 ml-3
              "
              >
                <div className="bg-[#EFE7DE]  rounded-xl text-[#8B5E3C]">
                  <FiCpu size={16} />
                </div>

                <h3 className="font-bold text-[#5A3F2A]">OpenRouter AI</h3>
              </div>

              <p className="text-green-600 flex items-center gap-2">
                <FiCheckCircle />
                Connected
              </p>
            </div>

            {/* Security */}

            <div
              className="
              bg-[#F8F6F2]
              rounded-2xl
              border
              border-[#ECE6DE]
              p-6
              hover:-translate-y-1
              hover:shadow-lg
              transition-all
            "
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-[#EFE7DE] p-3 rounded-xl text-[#8B5E3C]">
                  <FiShield size={24} />
                </div>

                <h3 className="font-bold text-[#5A3F2A]">Security</h3>
              </div>

              <p className="text-green-600 flex items-center gap-2">
                <FiCheckCircle />
                Protected
              </p>
            </div>
          </div>
        </div>

        {/* Preferences + Backup */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Preferences */}

          <div
            className="
            bg-white
            rounded-3xl
            border
            border-[#ECE6DE]
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
                text-[#8B5E3C]
                flex
                items-center
                justify-center
              "
              >
                <FiMoon size={28} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#5A3F2A]">
                  Preferences
                </h2>

                <p className="text-[#7B6A5C]">Application Settings</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-[#7B6A5C]">Dark Mode</span>

                <button
                  className="
                  px-4
                  py-2
                  rounded-xl
                  bg-[#EFE7DE]
                  text-[#8B5E3C]
                  cursor-not-allowed
                "
                >
                  Coming Soon
                </button>
              </div>

              <div className="flex justify-between">
                <span className="text-[#7B6A5C]">Language</span>

                <strong className="text-[#5A3F2A]">English</strong>
              </div>

              <div className="flex justify-between">
                <span className="text-[#7B6A5C]">Timezone</span>

                <strong className="text-[#5A3F2A]">Local Time</strong>
              </div>
            </div>
          </div>

          {/* Backup */}

          <div
            className="
            bg-white
            rounded-3xl
            border
            border-[#ECE6DE]
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
                text-[#8B5E3C]
                flex
                items-center
                justify-center
              "
              >
                <FiDownload size={28} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#5A3F2A]">
                  Backup & Export
                </h2>

                <p className="text-[#7B6A5C]">Export your data</p>
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
                hover:bg-[#4B3423]
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
          bg-white
          rounded-3xl
          border
          border-red-200
          shadow-lg
          p-8
        "
        >
          <h2 className="text-2xl font-bold text-red-600 mb-8">Danger Zone</h2>

          <div className="space-y-6">
            {/* Clear History */}

            <div
              className="
              flex
              flex-col
              md:flex-row
              md:items-center
              md:justify-between
              gap-5
            "
            >
              <div>
                <h3 className="font-bold text-[#5A3F2A]">Clear AI History</h3>

                <p className="text-sm text-gray-500 mt-1">
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

            {/* Reset Application */}

            <div
              className="
              flex
              flex-col
              md:flex-row
              md:items-center
              md:justify-between
              gap-5
            "
            >
              <div>
                <h3 className="font-bold text-[#5A3F2A]">Reset Application</h3>

                <p className="text-sm text-gray-500 mt-1">
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
          bg-white
          rounded-3xl
          border
          border-[#ECE6DE]
          shadow-lg
          p-8
        "
        >
          <div className="flex items-center gap-4 mb-6">
            <div
              className="
              w-14
              h-14
              rounded-2xl
              bg-[#EFE7DE]
              text-[#8B5E3C]
              flex
              items-center
              justify-center
            "
            >
              <FiSettings size={24} />
            </div>

            <h2 className="text-2xl font-bold text-[#5A3F2A]">About</h2>
          </div>

          <div
            className="
            space-y-4
            text-[#7B6A5C]
          "
          >
            <p>
              <strong className="text-[#5A3F2A]">Project:</strong> DataNest AI
            </p>

            <p>
              <strong className="text-[#5A3F2A]">Developer:</strong> Bibi Hawa
              Abdul Shukoor
            </p>

            <p>
              <strong className="text-[#5A3F2A]">Framework:</strong> React +
              Supabase + OpenRouter
            </p>

            <p>
              <strong className="text-[#5A3F2A]">Version:</strong> 1.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
