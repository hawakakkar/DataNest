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
        const filePath = doc.file_path || doc.file_name;

        if (!filePath) {
          console.warn("Document has no file path:", doc);
          continue;
        }

        try {
          const { data: file, error: downloadError } = await supabase.storage
            .from("documents")
            .download(filePath);

          if (downloadError) {
            console.error("DOWNLOAD ERROR:", filePath, downloadError);
            continue;
          }

          if (!file) continue;

          const originalFileName =
            doc.file_name || filePath.split("/").pop() || "document";

          const url = window.URL.createObjectURL(file);

          const link = window.document.createElement("a");

          link.href = url;
          link.download = originalFileName;

          link.style.display = "none";

          window.document.body.appendChild(link);

          link.click();

          window.document.body.removeChild(link);

          setTimeout(() => {
            window.URL.revokeObjectURL(url);
          }, 5000);

          successCount++;

          // فقط یک تأخیر خیلی کوتاه برای ثبت دانلود بعدی
          await new Promise((resolve) => setTimeout(resolve, 150));
        } catch (err) {
          console.error("DOWNLOAD FAILED:", filePath, err);
        }
      }

      if (successCount === 0) {
        alert("No documents could be downloaded.");
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

      for (const doc of documents) {
        const filePath = doc.file_path || doc.file_name;

        if (!filePath) {
          console.warn("No file path:", doc);
          continue;
        }

        try {
          const { data: publicData } = supabase.storage
            .from("documents")
            .getPublicUrl(filePath);

          const publicUrl = publicData?.publicUrl;

          if (!publicUrl) {
            console.warn("No public URL:", filePath);
            continue;
          }

          // فایل را به صورت Blob می‌گیریم
          const response = await fetch(publicUrl);

          if (!response.ok) {
            console.error("FILE FETCH ERROR:", filePath, response.status);
            continue;
          }

          const blob = await response.blob();

          const url = window.URL.createObjectURL(blob);

          const link = window.document.createElement("a");

          link.href = url;

          link.download =
            doc.file_name || filePath.split("/").pop() || "document";

          link.style.display = "none";

          window.document.body.appendChild(link);

          link.click();

          window.document.body.removeChild(link);

          setTimeout(() => {
            window.URL.revokeObjectURL(url);
          }, 5000);

          successCount++;

          await new Promise((resolve) => setTimeout(resolve, 300));
        } catch (error) {
          console.error("DOWNLOAD ERROR:", filePath, error);
        }
      }

      if (successCount === 0) {
        alert("No documents could be downloaded.");
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
    <div
      className="
        min-h-screen
        max-w-7xl
        mx-auto
        space-y-8
        px-6
        bg-[#F8F3EC]
        text-[#3E2A1E]
        dark:bg-[#0F0B08]
        dark:text-white
        transition-colors
        duration-500
      "
    >
      {/* Header */}

      <div>
        <h1 className="text-4xl font-bold text-[#4A3021] dark:text-white">
          Settings
        </h1>

        <p className="mt-2 text-[#806A59] dark:text-gray-400">
          Configure your DataNest AI application.
        </p>
      </div>

      {/* Profile + Project */}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Profile */}

        <div
          className="
            rounded-[28px]
            border
            border-[#E9DED2]
            bg-white
            p-8
            shadow-[0_12px_35px_rgba(91,56,34,0.07)]
            transition-all
            duration-300
            hover:-translate-y-1
            hover:shadow-[0_18px_45px_rgba(91,56,34,0.12)]
            dark:border-white/10
            dark:bg-[#1A1410]
          "
        >
          <div className="mb-8 flex items-center gap-4">
            <div
              className="
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-[#F1E7DD]
                text-[#8B5E3C]
                dark:bg-[#30241C]
                dark:text-[#D8A778]
              "
            >
              <FiUser size={28} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#4A3021] dark:text-white">
                Administrator
              </h2>

              <p className="text-[#806A59] dark:text-gray-400">User Profile</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#4A3021] dark:text-white">
                Name
              </label>

              <input
                readOnly
                value="Bibi Hawa Abdul Shukoor"
                className="
                  w-full
                  rounded-2xl
                  border
                  border-[#E9DED2]
                  bg-[#FCFAF7]
                  p-4
                  text-[#4A3021]
                  outline-none
                  transition
                  dark:border-white/10
                  dark:bg-[#30241C]
                  dark:text-white
                "
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#4A3021] dark:text-white">
                Role
              </label>

              <input
                readOnly
                value="Administrator"
                className="
                  w-full
                  rounded-2xl
                  border
                  border-[#E9DED2]
                  bg-[#FCFAF7]
                  p-4
                  text-[#4A3021]
                  outline-none
                  transition
                  dark:border-white/10
                  dark:bg-[#30241C]
                  dark:text-white
                "
              />
            </div>
          </div>
        </div>

        {/* Project */}

        <div
          className="
            rounded-[28px]
            border
            border-[#E9DED2]
            bg-white
            p-8
            shadow-[0_12px_35px_rgba(91,56,34,0.07)]
            transition-all
            duration-300
            hover:-translate-y-1
            hover:shadow-[0_18px_45px_rgba(91,56,34,0.12)]
            dark:border-white/10
            dark:bg-[#1A1410]
          "
        >
          <div className="mb-8 flex items-center gap-4">
            <div
              className="
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-[#F1E7DD]
                text-[#8B5E3C]
                dark:bg-[#30241C]
                dark:text-[#D8A778]
              "
            >
              <FiSettings size={28} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#4A3021] dark:text-white">
                Project
              </h2>

              <p className="text-[#806A59] dark:text-gray-400">
                System Information
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex justify-between">
              <span className="text-[#806A59] dark:text-gray-400">
                Application
              </span>

              <strong className="text-[#4A3021] dark:text-white">
                DataNest AI
              </strong>
            </div>

            <div className="flex justify-between">
              <span className="text-[#806A59] dark:text-gray-400">Version</span>

              <strong className="text-[#4A3021] dark:text-white">v1.0</strong>
            </div>

            <div className="flex justify-between">
              <span className="text-[#806A59] dark:text-gray-400">
                Environment
              </span>

              <strong className="text-[#4A3021]">Production</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences + Backup */}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Preferences */}

        <div
          className="
            rounded-[28px]
            border
            border-[#E9DED2]
            bg-white
            p-8
            shadow-[0_12px_35px_rgba(91,56,34,0.07)]
            transition-all
            duration-300
            hover:-translate-y-1
            hover:shadow-[0_18px_45px_rgba(91,56,34,0.12)]
            dark:border-white/10
            dark:bg-[#1A1410]
          "
        >
          <div className="mb-8 flex items-center gap-4">
            <div
              className="
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-[#F1E7DD]
                text-[#8B5E3C]
                dark:bg-[#30241C]
                dark:text-[#D8A778]
              "
            >
              <FiMoon size={28} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#4A3021] dark:text-white">
                Preferences
              </h2>

              <p className="text-[#806A59] dark:text-gray-400">
                Application Settings
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-[#806A59] dark:text-gray-400">
                Dark Mode
              </span>

              <button
                className="
                  rounded-lg
                  bg-[#F1E7DD]
                  px-3
                  py-1
                  text-sm
                  font-medium
                  text-[#4A3021]
                  dark:bg-[#30241C]
                  dark:text-white
                "
              >
                Active
              </button>
            </div>

            <div className="flex justify-between">
              <span className="text-[#806A59] dark:text-gray-400">
                Language
              </span>

              <strong className="text-[#4A3021] dark:text-white">
                English
              </strong>
            </div>

            <div className="flex justify-between">
              <span className="text-[#806A59] dark:text-gray-400">
                Timezone
              </span>

              <strong className="text-[#4A3021] dark:text-white">
                Local Time
              </strong>
            </div>
          </div>
        </div>

        {/* Backup */}

        <div
          className="
            rounded-[28px]
            border
            border-[#E9DED2]
            bg-white
            p-8
            shadow-[0_12px_35px_rgba(91,56,34,0.07)]
            transition-all
            duration-300
            hover:-translate-y-1
            hover:shadow-[0_18px_45px_rgba(91,56,34,0.12)]
            dark:border-white/10
            dark:bg-[#1A1410]
          "
        >
          <div className="mb-8 flex items-center gap-4">
            <div
              className="
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-[#F1E7DD]
                text-[#8B5E3C]
                dark:bg-[#30241C]
                dark:text-[#D8A778]
              "
            >
              <FiDownload size={28} />
            </div>

            <div className="min-w-0">
              <h2
                className="
                  text-xl
                  font-bold
                  leading-tight
                  text-[#4A3021]
                  sm:text-2xl
                  dark:text-white
                "
              >
                Backup & Export
              </h2>

              <p
                className="
                  mt-1
                  text-xs
                  leading-5
                  text-[#806A59]
                  sm:text-sm
                  dark:text-gray-400
                "
              >
                Download and backup your DataNest AI data
              </p>
            </div>
          </div>

          {/* Information box */}

          <div
            className="
              relative
              mb-5
              rounded-2xl
              border
              border-[#E9DED2]
              bg-[#FCFAF7]
              p-4
              sm:mb-6
              sm:p-5
              dark:border-white/10
              dark:bg-[#30241C]
            "
          >
            <div className="flex items-start gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#4A3021] sm:text-base dark:text-white">
                  Export your information
                </p>

                <p className="mt-1 text-xs leading-5 text-[#806A59] sm:text-sm sm:leading-6 dark:text-gray-400">
                  Save your questions, answers, and original documents directly
                  to your computer.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={exportQuestions}
              className="
                w-full
                rounded-2xl
                bg-gradient-to-r
                from-[#9A5F37]
                to-[#6E4026]
                py-3
                font-semibold
                text-white
                shadow-lg
                shadow-[#6E4026]/15
                transition
                duration-300
                hover:-translate-y-0.5
                hover:shadow-xl
              "
            >
              Export Questions
            </button>

            <button
              onClick={exportDocuments}
              className="
                w-full
                rounded-2xl
                bg-[#70472D]
                py-3
                font-semibold
                text-white
                transition
                duration-300
                hover:-translate-y-0.5
                hover:bg-[#59351F]
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
          rounded-[28px]
          border
          border-[#A85B50]
          bg-white
          p-8
          shadow-[0_12px_35px_rgba(91,56,34,0.07)]
          dark:border-[#7B4037]
          dark:bg-[#1A1410]
        "
      >
        <h2 className="mb-8 text-2xl font-bold text-[#8F362C]">Danger Zone</h2>

        <div className="space-y-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-bold text-[#4A3021] dark:text-white">
                Clear AI History
              </h3>

              <p className="mt-1 text-sm text-[#806A59] dark:text-gray-400">
                Remove all saved AI questions.
              </p>
            </div>

            <button
              onClick={clearAIHistory}
              className="
                rounded-2xl
                bg-[#8F362C]
                px-6
                py-3
                text-white
                transition
                hover:bg-[#7D3830]
              "
            >
              <FiTrash2 className="mr-2 inline" />
              Clear
            </button>
          </div>

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-bold text-[#4A3021] dark:text-white">
                Reset Application
              </h3>

              <p className="mt-1 text-sm text-[#806A59] dark:text-gray-400">
                Restore default application settings.
              </p>
            </div>

            <button
              onClick={resetApplication}
              className="
                rounded-2xl
                bg-[#8F362C]
                px-6
                py-3
                text-white
                transition
                hover:bg-[#7D3830]
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
          rounded-[28px]
          border
          border-[#E9DED2]
          bg-white
          p-8
          shadow-[0_12px_35px_rgba(91,56,34,0.07)]
          dark:border-white/10
          dark:bg-[#1A1410]
        "
      >
        <div className="mb-6 flex items-center gap-4">
          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-[#F1E7DD]
              text-[#8B5E3C]
              dark:bg-[#30241C]
              dark:text-[#D8A778]
            "
          >
            <FiSettings size={24} />
          </div>

          <h2 className="text-2xl font-bold text-[#4A3021] dark:text-white">
            About
          </h2>
        </div>

        <div className="space-y-4 text-[#806A59] dark:text-gray-300">
          <p>
            <strong className="text-[#4A3021] dark:text-white">Project:</strong>{" "}
            DataNest AI
          </p>

          <p>
            <strong className="text-[#4A3021] dark:text-white">
              Developer:
            </strong>{" "}
            Bibi Hawa Abdul Shukoor
          </p>

          <p>
            <strong className="text-[#4A3021] dark:text-white">
              Framework:
            </strong>{" "}
            React + Supabase + OpenRouter
          </p>

          <p>
            <strong className="text-[#4A3021] dark:text-white">Version:</strong>{" "}
            1.0
          </p>
        </div>
      </div>
    </div>
  );
}
