import {
  FiSettings,
  FiUser,
  FiMoon,
  FiDownload,
  FiTrash2,
} from "react-icons/fi";

import { supabase } from "../Services/supabase";

// =====================================================
// HELPER FUNCTIONS
// =====================================================

async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("GET USER ERROR:", error);
    alert("Could not get current user.");
    return null;
  }

  if (!user) {
    alert("Please login first.");
    return null;
  }

  return user;
}

function downloadTextFile(fileName, content) {
  const blob = new Blob(["\uFEFF" + content], {
    type: "text/plain;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}

function downloadOriginalFile(file, fileName) {
  const url = URL.createObjectURL(file);

  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}

async function getChatHistory(userId) {
  const { data, error } = await supabase
    .from("chat_history")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    console.error("GET CHAT HISTORY ERROR:", error);

    alert(`Could not load AI history: ${error.message}`);

    return [];
  }

  return data || [];
}

function makeConversations(messages) {
  const conversations = [];

  let current = null;

  messages.forEach((message) => {
    if (message.role === "user") {
      current = {
        question: message,
        answer: null,
      };

      conversations.push(current);
    } else if (message.role === "assistant" && current && !current.answer) {
      current.answer = message;
    }
  });

  return conversations;
}

// =====================================================
// SETTINGS
// =====================================================

export default function Settings() {
  // =====================================================
  // EXPORT QUESTIONS
  // =====================================================

  async function exportQuestions() {
    const user = await getCurrentUser();

    if (!user) return;

    const choice = window.prompt(
      "What do you want to export?\n\n" +
        "1 - General Questions\n" +
        "2 - Document Questions\n\n" +
        "Enter 1 or 2:",
    );

    if (choice === null) return;

    if (choice !== "1" && choice !== "2") {
      alert("Please enter 1 or 2.");
      return;
    }

    const history = await getChatHistory(user.id);

    if (!history.length) {
      alert("No AI history found.");
      return;
    }

    const conversations = makeConversations(history);

    // ===================================================
    // GENERAL QUESTIONS
    // ===================================================

    if (choice === "1") {
      const generalConversations = conversations.filter(
        (conversation) => !conversation.question.document_id,
      );

      if (generalConversations.length === 0) {
        alert("No general questions found.");
        return;
      }

      let text = "";

      generalConversations.forEach((conversation, index) => {
        text += "========================================\n";

        text += `GENERAL QUESTION ${index + 1}\n`;

        text += "========================================\n\n";

        text += "QUESTION:\n";

        text += `${conversation.question.content || "No question"}\n\n`;

        text += "ANSWER:\n";

        text += `${conversation.answer?.content || "No answer found"}\n\n`;

        text += "DATE:\n";

        text += `${conversation.question.created_at || ""}\n\n`;

        text += "----------------------------------------\n\n";
      });

      downloadTextFile("general_questions_and_answers.txt", text);

      alert("General questions and answers downloaded successfully.");

      return;
    }

    // ===================================================
    // DOCUMENT QUESTIONS
    // ===================================================

    const documentConversations = conversations.filter(
      (conversation) => conversation.question.document_id,
    );

    if (documentConversations.length === 0) {
      alert("No document questions found.");
      return;
    }

    const documents = {};

    documentConversations.forEach((conversation) => {
      const question = conversation.question;

      const documentId = question.document_id;

      if (!documents[documentId]) {
        documents[documentId] = {
          id: documentId,
          name: question.document_name || "Unknown Document",
          conversations: [],
        };
      }

      documents[documentId].conversations.push(conversation);
    });

    const documentList = Object.values(documents);

    let documentOptions = "Which document do you want to export?\n\n";

    documentOptions += "0 - All Documents\n\n";

    documentList.forEach((document, index) => {
      documentOptions += `${index + 1} - ${document.name}\n`;
    });

    const documentChoice = window.prompt(documentOptions);

    if (documentChoice === null) return;

    const selectedNumber = Number(documentChoice);

    if (
      !Number.isInteger(selectedNumber) ||
      selectedNumber < 0 ||
      selectedNumber > documents.length
    ) {
      alert("Invalid document selection.");
      return;
    }

    // =====================================================
    // ALL DOCUMENTS
    // =====================================================

    if (selectedNumber === 0) {
      let successCount = 0;

      for (const doc of documents) {
        let filePath = document.file_path || document.file_name;

        if (!filePath) {
          console.warn("Document has no file path:", document);
          continue;
        }

        // اگر مسیر با documents/ شروع شده، bucket name را حذف کن
        if (filePath.startsWith("documents/")) {
          filePath = filePath.replace(/^documents\//, "");
        }

        // اگر مسیر URL-encoded شده، decode کن
        try {
          filePath = decodeURIComponent(filePath);
        } catch (e) {
          console.warn("Could not decode file path:", filePath);
        }

        console.log("FINAL STORAGE PATH:", filePath);

        if (!filePath) {
          console.warn("Document has no file path:", doc);
          continue;
        }

        const { data: file, error: downloadError } = await supabase.storage
          .from("documents")
          .download(filePath);

        if (downloadError) {
          console.error("FILE DOWNLOAD ERROR:", filePath, downloadError);
          continue;
        }

        if (!file) continue;

        const originalFileName =
          filePath.split("/").pop() || doc.file_name || "document";

        const url = URL.createObjectURL(file);

        const link = window.document.createElement("a");

        link.href = url;
        link.download = originalFileName;

        window.document.body.appendChild(link);
        link.click();
        window.document.body.removeChild(link);

        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 2000);

        successCount++;
      }

      if (successCount === 0) {
        alert("No files could be downloaded.");
        return;
      }

      alert(`${successCount} document(s) downloaded successfully.`);

      return;
    }

    // =====================================================
    // ONE DOCUMENT
    // =====================================================

    const selectedDocument = documents[selectedNumber - 1];

    if (!selectedDocument) {
      alert("Document not found.");
      return;
    }

    let text = "";

    text += "========================================\n";

    text += `DOCUMENT: ${selectedDocument.name}\n`;

    text += "========================================\n\n";

    selectedDocument.conversations.forEach((conversation, index) => {
      text += `QUESTION ${index + 1}:\n`;

      text += `${conversation.question.content || "No question"}\n\n`;

      text += "ANSWER:\n";

      text += `${conversation.answer?.content || "No answer found"}\n\n`;

      text += "DATE:\n";

      text += `${conversation.question.created_at || ""}\n\n`;

      text += "----------------------------------------\n\n";
    });

    const safeName = selectedDocument.name.replace(/[<>:"/\\|?*]/g, "_").trim();

    downloadTextFile(`${safeName}_questions_and_answers.txt`, text);

    alert("Document questions and answers downloaded successfully.");
  }

  // =====================================================
  // EXPORT ORIGINAL DOCUMENTS
  // =====================================================

  async function exportDocuments() {
    const user = await getCurrentUser();

    if (!user) return;

    const { data: documents, error } = await supabase
      .from("documents")
      .select("*");

    if (error) {
      console.error("GET DOCUMENTS ERROR:", error);

      alert(`Could not load documents: ${error.message}`);

      return;
    }

    if (!documents || documents.length === 0) {
      alert("No documents found.");
      return;
    }

    let options = "Which document do you want to download?\n\n";

    options += "0 - All Documents\n\n";

    documents.forEach((document, index) => {
      options += `${index + 1} - ${
        document.title || document.file_name || "Unknown Document"
      }\n`;
    });

    const choice = window.prompt(options);

    if (choice === null) return;

    const selectedNumber = Number(choice);

    if (
      !Number.isInteger(selectedNumber) ||
      selectedNumber < 0 ||
      selectedNumber > documents.length
    ) {
      alert("Invalid document selection.");
      return;
    }

    // ===================================================
    // ALL DOCUMENTS
    // ===================================================

    if (selectedNumber === 0) {
      let successCount = 0;

      for (const document of documents) {
        const filePath = document.file_path || document.file_name;

        if (!filePath) {
          console.warn("Document has no file path:", document);

          continue;
        }

        const { data: file, error: downloadError } = await supabase.storage
          .from("documents")
          .download(filePath);

        if (downloadError) {
          console.error("FILE DOWNLOAD ERROR:", filePath, downloadError);

          continue;
        }

        if (!file) continue;

        const originalFileName =
          filePath.split("/").pop() || document.file_name || "document";

        downloadOriginalFile(file, originalFileName);

        successCount++;

        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      if (successCount === 0) {
        alert(
          "No files could be downloaded. Check your Supabase Storage bucket and file paths.",
        );

        return;
      }

      alert(`${successCount} document(s) downloaded successfully.`);

      return;
    }

    // ===================================================
    // ONE DOCUMENT
    // ===================================================

    const selectedDocument = documents[selectedNumber - 1];

    if (!selectedDocument) {
      alert("Document not found.");
      return;
    }

    const filePath = selectedDocument.file_path || selectedDocument.file_name;

    if (!filePath) {
      alert("This document does not have a file path.");

      return;
    }

    const { data: file, error: downloadError } = await supabase.storage
      .from("documents")
      .download(filePath);

    if (downloadError) {
      console.error("FILE DOWNLOAD ERROR:", downloadError);

      alert(`Could not download file: ${downloadError.message}`);

      return;
    }

    if (!file) {
      alert("File was not returned by Supabase.");

      return;
    }

    const originalFileName =
      filePath.split("/").pop() || selectedDocument.file_name || "document";

    downloadOriginalFile(file, originalFileName);

    alert("Document downloaded successfully.");
  }

  // =====================================================
  // CLEAR AI HISTORY
  // =====================================================

  async function clearAIHistory() {
    const confirmDelete = window.confirm("Delete all your AI questions?");

    if (!confirmDelete) return;

    const user = await getCurrentUser();

    if (!user) return;

    const { error } = await supabase
      .from("chat_history")
      .delete()
      .eq("user_id", user.id);

    if (error) {
      console.error("DELETE CHAT HISTORY ERROR:", error);

      alert(`Failed to clear history: ${error.message}`);

      return;
    }

    alert("AI history cleared successfully.");
  }

  // =====================================================
  // RESET APPLICATION
  // =====================================================

  function resetApplication() {
    const confirmReset = window.confirm("Reset application settings?");

    if (!confirmReset) return;

    localStorage.clear();

    window.location.reload();
  }

  // =====================================================
  // UI
  // =====================================================

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

        <div className="bg-white dark:bg-[#1F2937] rounded-3xl border border-[#ECE6DE] dark:border-gray-700 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[#EFE7DE] dark:bg-[#374151] text-[#8B5E3C] dark:text-[#D6A97A] flex items-center justify-center">
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
                className="w-full bg-[#F8F6F2] dark:bg-[#374151] border border-[#ECE6DE] dark:border-gray-600 rounded-2xl p-4 outline-none text-[#5A3F2A] dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#5A3F2A] dark:text-white mb-2">
                Role
              </label>

              <input
                readOnly
                value="Administrator"
                className="w-full bg-[#F8F6F2] dark:bg-[#374151] border border-[#ECE6DE] dark:border-gray-600 rounded-2xl p-4 outline-none text-[#5A3F2A] dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Project */}

        <div className="bg-white dark:bg-[#1F2937] rounded-3xl border border-[#ECE6DE] dark:border-gray-700 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[#EFE7DE] dark:bg-[#374151] text-[#8B5E3C] dark:text-[#D6A97A] flex items-center justify-center">
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

        <div className="bg-white dark:bg-[#1F2937] rounded-3xl border border-[#ECE6DE] dark:border-gray-700 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[#EFE7DE] dark:bg-[#374151] text-[#8B5E3C] dark:text-amber-400 flex items-center justify-center">
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

              <button className="inline-block px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-[#5A3F2A] dark:text-white text-sm font-medium">
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

        <div className="bg-white dark:bg-[#1F2937] rounded-3xl border border-[#ECE6DE] dark:border-gray-700 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[#EFE7DE] dark:bg-[#374151] text-[#8B5E3C] dark:text-amber-400 flex items-center justify-center">
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
              className="w-full bg-[#8B5E3C] hover:bg-[#70492C] text-white py-3 rounded-2xl transition"
            >
              Export Questions
            </button>

            <button
              onClick={exportDocuments}
              className="w-full bg-[#5A3F2A] hover:bg-[#4B3423] text-white py-3 rounded-2xl transition"
            >
              Export Documents
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}

      <div className="bg-white dark:bg-[#1F2937] rounded-3xl border border-[#85453e] dark:border-[#5A3F2A] shadow-lg p-8">
        <h2 className="text-2xl font-bold text-[#85453e] mb-8">Danger Zone</h2>

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
              className="bg-[#8f362c] hover:bg-[#7d3830] text-white px-6 py-3 rounded-2xl transition"
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
              className="bg-[#8f362c] hover:bg-[#7d3830] text-white px-6 py-3 rounded-2xl transition"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* About */}

      <div className="bg-white dark:bg-[#1F2937] rounded-3xl border border-[#ECE6DE] dark:border-gray-700 shadow-lg p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#EFE7DE] dark:bg-[#374151] text-[#8B5E3C] dark:text-amber-400 flex items-center justify-center">
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
