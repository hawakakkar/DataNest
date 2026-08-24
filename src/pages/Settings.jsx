import { useEffect, useRef, useState } from "react";

import {
  FiSettings,
  FiUser,
  FiMoon,
  FiSun,
  FiDownload,
  FiTrash2,
  FiInfo,
  FiShield,
  FiGlobe,
  FiClock,
  FiChevronDown,
  FiCheck,
} from "react-icons/fi";

import { supabase } from "../Services/supabase";

// =====================================================
// ADMIN ACCOUNT
// =====================================================

const ADMIN_EMAIL = "kkrhawa@gmail.com";

// =====================================================
// SAFE LOCAL STORAGE
// =====================================================

function getStorageItem(key, fallback = null) {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch (error) {
    console.error("LOCAL STORAGE GET ERROR:", error);
    return fallback;
  }
}

function setStorageItem(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error("LOCAL STORAGE SET ERROR:", error);
  }
}

// =====================================================
// USER
// =====================================================

async function getCurrentUser() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error("GET USER ERROR:", error);
      alert(`Could not get current user: ${error.message}`);
      return null;
    }

    if (!user) {
      alert("Please login first.");
      return null;
    }

    return user;
  } catch (error) {
    console.error("GET CURRENT USER FAILED:", error);
    alert("Could not get current user.");
    return null;
  }
}

// =====================================================
// DOWNLOAD HELPERS
// =====================================================

function downloadTextFile(fileName, content) {
  try {
    const blob = new Blob(["\uFEFF" + content], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  } catch (error) {
    console.error("TEXT DOWNLOAD ERROR:", error);
    alert("Could not download the file.");
  }
}

function downloadOriginalFile(file, fileName) {
  try {
    const url = URL.createObjectURL(file);

    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  } catch (error) {
    console.error("FILE DOWNLOAD ERROR:", error);
    alert("Could not download the file.");
  }
}

// =====================================================
// CHAT HISTORY
// =====================================================

async function getChatHistory(userId) {
  try {
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
  } catch (error) {
    console.error("GET CHAT HISTORY FAILED:", error);
    alert("Could not load AI history.");
    return [];
  }
}

// =====================================================
// CONVERSATIONS
// =====================================================

function makeConversations(messages) {
  const conversations = [];

  let current = null;

  (messages || []).forEach((message) => {
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
// TIMEZONE
// =====================================================

function getAvailableTimezones() {
  try {
    if (
      typeof Intl !== "undefined" &&
      typeof Intl.supportedValuesOf === "function"
    ) {
      return Intl.supportedValuesOf("timeZone");
    }
  } catch (error) {
    console.warn("TIMEZONE LIST ERROR:", error);
  }

  return [
    "UTC",
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "America/Toronto",
    "America/Vancouver",
    "America/Sao_Paulo",
    "Europe/London",
    "Europe/Paris",
    "Europe/Berlin",
    "Europe/Istanbul",
    "Asia/Dubai",
    "Asia/Kabul",
    "Asia/Karachi",
    "Asia/Kolkata",
    "Asia/Dhaka",
    "Asia/Bangkok",
    "Asia/Singapore",
    "Asia/Tokyo",
    "Australia/Sydney",
  ];
}

function getBrowserTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

function getTimezoneLabel(timezone) {
  if (!timezone) {
    return "Local Time";
  }

  const parts = timezone.split("/");

  if (parts.length === 1) {
    return parts[0];
  }

  return parts[parts.length - 1].replace(/_/g, " ");
}

function getCurrentTime(timezone) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(new Date());
  } catch {
    return "--:--:--";
  }
}

// =====================================================
// SETTINGS
// =====================================================

export default function Settings() {
  // ===================================================
  // DARK MODE
  // ===================================================

  const [darkMode, setDarkMode] = useState(() => {
    return getStorageItem("theme", "light") === "dark";
  });

  function toggleTheme() {
    setDarkMode((current) => !current);
  }

  useEffect(() => {
    try {
      if (darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      setStorageItem("theme", darkMode ? "dark" : "light");
    } catch (error) {
      console.error("THEME ERROR:", error);
    }
  }, [darkMode]);

  // ===================================================
  // TIMEZONE
  // ===================================================

  const [timezone, setTimezone] = useState(() => {
    const savedTimezone = getStorageItem("datanest-timezone");

    return savedTimezone || getBrowserTimezone();
  });

  const [currentTime, setCurrentTime] = useState(() => {
    const savedTimezone =
      getStorageItem("datanest-timezone") || getBrowserTimezone();

    return getCurrentTime(savedTimezone);
  });

  const [timezoneOpen, setTimezoneOpen] = useState(false);

  const timezoneDropdownRef = useRef(null);

  const availableTimezones = getAvailableTimezones();

  // ===================================================
  // PROFILE
  // ===================================================

  const [profile, setProfile] = useState({
    name: "Loading...",
    email: "Loading...",
    role: "User",
  });

  // ===================================================
  // LOAD PROFILE
  // ===================================================

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      const user = await getCurrentUser();

      if (!mounted) {
        return;
      }

      if (!user) {
        setProfile({
          name: "Unknown User",
          email: "Not available",
          role: "User",
        });

        return;
      }

      const metadata = user.user_metadata || {};

      const userName =
        metadata.full_name ||
        metadata.name ||
        metadata.display_name ||
        user.email?.split("@")[0] ||
        "User";

      const normalizedEmail = String(user.email || "")
        .trim()
        .toLowerCase();

      const normalizedAdminEmail = ADMIN_EMAIL.trim().toLowerCase();

      const userRole =
        normalizedEmail === normalizedAdminEmail ? "Administrator" : "User";

      setProfile({
        name: userName,
        email: user.email || "Not available",
        role: userRole,
      });
    }

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  // ===================================================
  // TIMEZONE CLOCK
  // ===================================================

  useEffect(() => {
    setStorageItem("datanest-timezone", timezone);

    setCurrentTime(getCurrentTime(timezone));

    const interval = setInterval(() => {
      setCurrentTime(getCurrentTime(timezone));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [timezone]);

  // ===================================================
  // CLOSE DROPDOWN
  // ===================================================

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        timezoneDropdownRef.current &&
        !timezoneDropdownRef.current.contains(event.target)
      ) {
        setTimezoneOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ===================================================
  // CHANGE TIMEZONE
  // ===================================================

  function handleTimezoneChange(selectedTimezone) {
    setTimezone(selectedTimezone);
    setStorageItem("datanest-timezone", selectedTimezone);
    setTimezoneOpen(false);
  }

  // ===================================================
  // EXPORT QUESTIONS
  // ===================================================

  async function exportQuestions() {
    const user = await getCurrentUser();

    if (!user) {
      return;
    }

    const choice = window.prompt(
      "What do you want to export?\n\n" +
        "1 - General Questions\n" +
        "2 - Document Questions\n\n" +
        "Enter 1 or 2:",
    );

    if (choice === null) {
      return;
    }

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

    // =================================================
    // GENERAL
    // =================================================

    if (choice === "1") {
      const generalConversations = conversations.filter(
        (conversation) => !conversation.question?.document_id,
      );

      if (!generalConversations.length) {
        alert("No general questions found.");
        return;
      }

      let text = "";

      generalConversations.forEach((conversation, index) => {
        text += "========================================\n";
        text += `GENERAL QUESTION ${index + 1}\n`;
        text += "========================================\n\n";

        text += "QUESTION:\n";
        text += `${conversation.question?.content || "No question"}\n\n`;

        text += "ANSWER:\n";
        text += `${conversation.answer?.content || "No answer found"}\n\n`;

        text += "DATE:\n";
        text += `${conversation.question?.created_at || ""}\n\n`;

        text += "----------------------------------------\n\n";
      });

      downloadTextFile("general_questions_and_answers.txt", text);

      alert("General questions and answers downloaded successfully.");

      return;
    }

    // =================================================
    // DOCUMENT QUESTIONS
    // =================================================

    const documentConversations = conversations.filter(
      (conversation) => conversation.question?.document_id,
    );

    if (!documentConversations.length) {
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
          file_path: question.file_path,
          file_name: question.file_name,
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

    if (documentChoice === null) {
      return;
    }

    const selectedNumber = Number(documentChoice);

    if (
      !Number.isInteger(selectedNumber) ||
      selectedNumber < 0 ||
      selectedNumber > documentList.length
    ) {
      alert("Invalid document selection.");
      return;
    }

    // =================================================
    // ALL DOCUMENTS
    // =================================================

    if (selectedNumber === 0) {
      let successCount = 0;

      for (const doc of documentList) {
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

          if (!file) {
            continue;
          }

          const originalFileName =
            doc.file_name || filePath.split("/").pop() || "document";

          downloadOriginalFile(file, originalFileName);

          successCount++;

          await new Promise((resolve) => setTimeout(resolve, 200));
        } catch (error) {
          console.error("DOWNLOAD FAILED:", filePath, error);
        }
      }

      if (successCount === 0) {
        alert("No documents could be downloaded.");
        return;
      }

      alert(`${successCount} document(s) downloaded successfully.`);

      return;
    }

    // =================================================
    // ONE DOCUMENT
    // =================================================

    const selectedDocument = documentList[selectedNumber - 1];

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
      text += `${conversation.question?.content || "No question"}\n\n`;

      text += "ANSWER:\n";
      text += `${conversation.answer?.content || "No answer found"}\n\n`;

      text += "DATE:\n";
      text += `${conversation.question?.created_at || ""}\n\n`;

      text += "----------------------------------------\n\n";
    });

    const safeName =
      String(selectedDocument.name || "document")
        .replace(/[<>:"/\\|?*]/g, "_")
        .trim() || "document";

    downloadTextFile(`${safeName}_questions_and_answers.txt`, text);

    alert("Document questions and answers downloaded successfully.");
  }

  // ===================================================
  // EXPORT ORIGINAL DOCUMENTS
  // ===================================================

  async function exportDocuments() {
    const user = await getCurrentUser();

    if (!user) {
      return;
    }

    try {
      const { data: documents, error } = await supabase
        .from("documents")
        .select("*")
        .eq("user_id", user.id);

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

      if (choice === null) {
        return;
      }

      const selectedNumber = Number(choice);

      if (
        !Number.isInteger(selectedNumber) ||
        selectedNumber < 0 ||
        selectedNumber > documents.length
      ) {
        alert("Invalid document selection.");
        return;
      }

      // ===============================================
      // ALL DOCUMENTS
      // ===============================================

      if (selectedNumber === 0) {
        let successCount = 0;

        for (const doc of documents) {
          const filePath = doc.file_path || doc.file_name;

          if (!filePath) {
            console.warn("No file path:", doc);
            continue;
          }

          try {
            const { data: file, error: downloadError } = await supabase.storage
              .from("documents")
              .download(filePath);

            if (downloadError) {
              console.error("FILE DOWNLOAD ERROR:", filePath, downloadError);

              continue;
            }

            if (!file) {
              continue;
            }

            const fileName =
              doc.file_name || filePath.split("/").pop() || "document";

            downloadOriginalFile(file, fileName);

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

      // ===============================================
      // ONE DOCUMENT
      // ===============================================

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
        selectedDocument.file_name || filePath.split("/").pop() || "document";

      downloadOriginalFile(file, originalFileName);

      alert("Document downloaded successfully.");
    } catch (error) {
      console.error("EXPORT DOCUMENTS ERROR:", error);
      alert("Could not export documents.");
    }
  }

  // ===================================================
  // CLEAR AI HISTORY
  // ===================================================

  async function clearAIHistory() {
    const confirmDelete = window.confirm(
      "Delete all your AI questions and answers?",
    );

    if (!confirmDelete) {
      return;
    }

    const user = await getCurrentUser();

    if (!user) {
      return;
    }

    try {
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
    } catch (error) {
      console.error("CLEAR AI HISTORY ERROR:", error);

      alert("Failed to clear AI history.");
    }
  }

  // ===================================================
  // RESET APPLICATION
  // ===================================================

  function resetApplication() {
    const confirmReset = window.confirm("Reset application settings?");

    if (!confirmReset) {
      return;
    }

    try {
      localStorage.clear();
    } catch (error) {
      console.error("RESET STORAGE ERROR:", error);
    }

    window.location.reload();
  }

  // ===================================================
  // UI
  // ===================================================

  return (
    <div
      className="
        min-h-screen
        w-full
        bg-[#F8F3EC]
        px-4
        py-8
        text-[#3E2A1E]
        transition-colors
        duration-500
        sm:px-6
        lg:px-8
        dark:bg-[#0F0B08]
        dark:text-white
      "
    >
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}

        <div className="mb-10">
          <h1
            className="
              text-4xl
              font-bold
              tracking-tight
              text-[#3E2A1E]
              dark:text-white
            "
          >
            Settings
          </h1>

          <p
            className="
              mt-2
              text-[#806A59]
              dark:text-gray-400
            "
          >
            Configure your DataNest AI application.
          </p>
        </div>

        {/* =================================================
            PROFILE + PROJECT
        ================================================= */}

        <div
          className="
            mb-8
            grid
            grid-cols-1
            gap-8
            lg:grid-cols-2
          "
        >
          {/* PROFILE */}

          <div
            className="
              rounded-[28px]
              border
              border-[#E9DED2]
              bg-white
              p-6
              shadow-[0_12px_35px_rgba(91,56,34,0.07)]
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-[0_18px_45px_rgba(91,56,34,0.12)]
              sm:p-8
              dark:border-white/10
              dark:bg-[#1A1410]
            "
          >
            <div className="mb-8 flex items-center gap-4">
              <div
                className="
                  flex
                  h-14
                  w-14
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[#F1E7DD]
                  text-[#8B5E3C]
                  dark:bg-[#30241C]
                  dark:text-[#D8A778]
                "
              >
                <FiUser size={26} />
              </div>

              <div>
                <h2
                  className="
                    text-2xl
                    font-bold
                    text-[#4A3021]
                    dark:text-white
                  "
                >
                  User Profile
                </h2>

                <p
                  className="
                    mt-1
                    text-sm
                    text-[#806A59]
                    dark:text-gray-400
                  "
                >
                  Manage your profile information
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* NAME */}

              <div>
                <label
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-[#4A3021]
                    dark:text-white
                  "
                >
                  Name
                </label>

                <div
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-2xl
                    border
                    border-[#E9DED2]
                    bg-[#FCFAF7]
                    p-4
                    text-[#4A3021]
                    dark:border-white/10
                    dark:bg-[#30241C]
                    dark:text-white
                  "
                >
                  <FiUser className="text-[#8B5E3C]" />

                  <span>{profile.name}</span>
                </div>
              </div>

              {/* EMAIL */}

              <div>
                <label
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-[#4A3021]
                    dark:text-white
                  "
                >
                  Email
                </label>

                <div
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-2xl
                    border
                    border-[#E9DED2]
                    bg-[#FCFAF7]
                    p-4
                    text-[#4A3021]
                    dark:border-white/10
                    dark:bg-[#30241C]
                    dark:text-white
                  "
                >
                  <FiUser className="text-[#8B5E3C]" />

                  <span className="break-all">{profile.email}</span>
                </div>
              </div>

              {/* ROLE */}

              <div>
                <label
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-[#4A3021]
                    dark:text-white
                  "
                >
                  Role
                </label>

                <div
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-2xl
                    border
                    border-[#E9DED2]
                    bg-[#FCFAF7]
                    p-4
                    text-[#4A3021]
                    dark:border-white/10
                    dark:bg-[#30241C]
                    dark:text-white
                  "
                >
                  <FiShield className="text-[#8B5E3C]" />

                  <span>{profile.role}</span>
                </div>
              </div>
            </div>

            <div
              className="
                mt-7
                rounded-2xl
                bg-[#FCF5EC]
                p-4
                text-sm
                leading-6
                text-[#806A59]
                dark:bg-[#30241C]
                dark:text-gray-400
              "
            >
              Profile information is managed by your administrator and cannot be
              changed.
            </div>
          </div>

          {/* PROJECT */}

          <div
            className="
              rounded-[28px]
              border
              border-[#E9DED2]
              bg-white
              p-6
              shadow-[0_12px_35px_rgba(91,56,34,0.07)]
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-[0_18px_45px_rgba(91,56,34,0.12)]
              sm:p-8
              dark:border-white/10
              dark:bg-[#1A1410]
            "
          >
            <div className="mb-8 flex items-center gap-4">
              <div
                className="
                  flex
                  h-14
                  w-14
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[#F1E7DD]
                  text-[#8B5E3C]
                  dark:bg-[#30241C]
                  dark:text-[#D8A778]
                "
              >
                <FiSettings size={26} />
              </div>

              <div>
                <h2
                  className="
                    text-2xl
                    font-bold
                    text-[#4A3021]
                    dark:text-white
                  "
                >
                  Project Information
                </h2>

                <p
                  className="
                    mt-1
                    text-sm
                    text-[#806A59]
                    dark:text-gray-400
                  "
                >
                  System and application details
                </p>
              </div>
            </div>

            <div>
              <div
                className="
                  flex
                  items-center
                  justify-between
                  border-b
                  border-[#E9DED2]
                  py-4
                  dark:border-white/10
                "
              >
                <span className="text-[#806A59] dark:text-gray-400">
                  Application
                </span>

                <strong className="text-[#4A3021] dark:text-white">
                  DataNest AI
                </strong>
              </div>

              <div
                className="
                  flex
                  items-center
                  justify-between
                  border-b
                  border-[#E9DED2]
                  py-4
                  dark:border-white/10
                "
              >
                <span className="text-[#806A59] dark:text-gray-400">
                  Version
                </span>

                <strong className="text-[#4A3021] dark:text-white">v1.0</strong>
              </div>

              <div
                className="
                  flex
                  items-center
                  justify-between
                  border-b
                  border-[#E9DED2]
                  py-4
                  dark:border-white/10
                "
              >
                <span className="text-[#806A59] dark:text-gray-400">
                  Environment
                </span>

                <span
                  className="
                    rounded-full
                    bg-[#EAF6ED]
                    px-4
                    py-1.5
                    text-sm
                    font-medium
                    text-[#357548]
                    dark:bg-[#1D3525]
                    dark:text-[#8ED3A0]
                  "
                >
                  Production
                </span>
              </div>

              <div className="flex items-center justify-between py-4">
                <span className="text-[#806A59] dark:text-gray-400">
                  Status
                </span>

                <span
                  className="
                    flex
                    items-center
                    gap-2
                    font-medium
                    text-[#356D47]
                    dark:text-[#8ED3A0]
                  "
                >
                  <span
                    className="
                      flex
                      h-5
                      w-5
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#4E9B67]
                    "
                  >
                    ✓
                  </span>
                  Active
                </span>
              </div>
            </div>

            <div
              className="
                mt-5
                flex
                items-center
                gap-3
                rounded-2xl
                bg-[#FCF5EC]
                p-4
                text-sm
                text-[#806A59]
                dark:bg-[#30241C]
                dark:text-gray-400
              "
            >
              <FiInfo className="shrink-0 text-[#8B5E3C]" />

              <span>Your application is up to date and running smoothly.</span>
            </div>
          </div>
        </div>

        {/* =================================================
            PREFERENCES + BACKUP
        ================================================= */}

        <div
          className="
            mb-8
            grid
            grid-cols-1
            gap-8
            lg:grid-cols-2
          "
        >
          {/* PREFERENCES */}

          <div
            className="
              rounded-[28px]
              border
              border-[#E9DED2]
              bg-white
              p-6
              shadow-[0_12px_35px_rgba(91,56,34,0.07)]
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-[0_18px_45px_rgba(91,56,34,0.12)]
              sm:p-8
              dark:border-white/10
              dark:bg-[#1A1410]
            "
          >
            <div className="mb-8 flex items-center gap-4">
              <div
                className="
                  flex
                  h-14
                  w-14
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[#F1E7DD]
                  text-[#8B5E3C]
                  dark:bg-[#30241C]
                  dark:text-[#D8A778]
                "
              >
                {darkMode ? <FiMoon size={26} /> : <FiSun size={26} />}
              </div>

              <div>
                <h2
                  className="
                    text-2xl
                    font-bold
                    text-[#4A3021]
                    dark:text-white
                  "
                >
                  Preferences
                </h2>

                <p
                  className="
                    mt-1
                    text-sm
                    text-[#806A59]
                    dark:text-gray-400
                  "
                >
                  Customize your experience
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {/* DARK MODE */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  rounded-2xl
                  border
                  border-[#E9DED2]
                  bg-[#FCFAF7]
                  p-4
                  dark:border-white/10
                  dark:bg-[#211A15]
                "
              >
                <div className="flex items-center gap-4">
                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-xl
                      bg-white
                      text-[#4A3021]
                      shadow-sm
                      dark:bg-[#30241C]
                      dark:text-white
                    "
                  >
                    {darkMode ? <FiMoon size={20} /> : <FiSun size={20} />}
                  </div>

                  <div>
                    <p
                      className="
                        font-semibold
                        text-[#3E2A1E]
                        dark:text-white
                      "
                    >
                      Dark Mode
                    </p>

                    <p
                      className="
                        mt-1
                        text-xs
                        text-[#806A59]
                        dark:text-gray-400
                      "
                    >
                      {darkMode ? "Dark theme enabled" : "Light theme enabled"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label="Toggle dark mode"
                  aria-pressed={darkMode}
                  className={`
                    relative
                    flex
                    h-8
                    w-14
                    shrink-0
                    items-center
                    rounded-full
                    p-1
                    transition-all
                    duration-300
                    focus:outline-none
                    focus:ring-2
                    focus:ring-[#9A5F37]/30
                    ${darkMode ? "bg-[#70472D]" : "bg-[#D8C8B9]"}
                  `}
                >
                  <span
                    className={`
                      flex
                      h-6
                      w-6
                      items-center
                      justify-center
                      rounded-full
                      bg-white
                      shadow-md
                      transition-transform
                      duration-300
                      ${darkMode ? "translate-x-6" : "translate-x-0"}
                    `}
                  >
                    {darkMode ? (
                      <FiMoon size={14} className="text-[#70472D]" />
                    ) : (
                      <FiSun size={14} className="text-[#8B5E3C]" />
                    )}
                  </span>
                </button>
              </div>

              {/* LANGUAGE */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  rounded-2xl
                  border
                  border-[#E9DED2]
                  bg-[#FCFAF7]
                  p-4
                  dark:border-white/10
                  dark:bg-[#211A15]
                "
              >
                <div className="flex items-center gap-4">
                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-xl
                      bg-white
                      text-[#4A3021]
                      shadow-sm
                      dark:bg-[#30241C]
                      dark:text-white
                    "
                  >
                    <FiGlobe size={20} />
                  </div>

                  <div>
                    <p
                      className="
                        font-semibold
                        text-[#3E2A1E]
                        dark:text-white
                      "
                    >
                      Language
                    </p>

                    <p
                      className="
                        mt-1
                        text-xs
                        text-[#806A59]
                        dark:text-gray-400
                      "
                    >
                      The preferred language
                    </p>
                  </div>
                </div>

                <span
                  className="
                    text-sm
                    font-medium
                    text-[#4A3021]
                    dark:text-white
                  "
                >
                  English
                </span>
              </div>

              {/* TIMEZONE */}

              <div
                className="
                  rounded-2xl
                  border
                  border-[#E9DED2]
                  bg-[#FCFAF7]
                  p-4
                  dark:border-white/10
                  dark:bg-[#211A15]
                "
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div
                      className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-white
                        text-[#4A3021]
                        shadow-sm
                        dark:bg-[#30241C]
                        dark:text-white
                      "
                    >
                      <FiClock size={20} />
                    </div>

                    <div>
                      <p
                        className="
                          font-semibold
                          text-[#3E2A1E]
                          dark:text-white
                        "
                      >
                        Timezone
                      </p>

                      <p
                        className="
                          mt-1
                          text-xs
                          text-[#806A59]
                          dark:text-gray-400
                        "
                      >
                        Set your local timezone
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p
                      className="
                        text-sm
                        font-semibold
                        text-[#4A3021]
                        dark:text-white
                      "
                    >
                      {getTimezoneLabel(timezone)}
                    </p>

                    <p
                      className="
                        mt-1
                        text-xs
                        font-medium
                        text-[#8B5E3C]
                        dark:text-[#D8A778]
                      "
                    >
                      {currentTime}
                    </p>
                  </div>
                </div>

                <div ref={timezoneDropdownRef} className="relative mt-4">
                  <button
                    type="button"
                    onClick={() => setTimezoneOpen((current) => !current)}
                    aria-haspopup="listbox"
                    aria-expanded={timezoneOpen}
                    className="
                      flex
                      w-full
                      items-center
                      justify-between
                      rounded-xl
                      border
                      border-[#E9DED2]
                      bg-white
                      px-4
                      py-3
                      text-left
                      text-sm
                      font-medium
                      text-[#4A3021]
                      outline-none
                      transition-all
                      duration-200
                      hover:border-[#C9B29E]
                      focus:border-[#9A5F37]
                      focus:ring-2
                      focus:ring-[#9A5F37]/20
                      dark:border-white/10
                      dark:bg-[#30241C]
                      dark:text-white
                      dark:hover:border-white/20
                    "
                  >
                    <span className="truncate">
                      {timezone.replace(/_/g, " ")}
                    </span>

                    <FiChevronDown
                      size={18}
                      className={`
                        ml-3
                        shrink-0
                        transition-transform
                        duration-200
                        ${timezoneOpen ? "rotate-180" : ""}
                      `}
                    />
                  </button>

                  {timezoneOpen && (
                    <div
                      className="
                        absolute
                        left-0
                        top-full
                        z-[100]
                        mt-2
                        w-full
                        overflow-hidden
                        rounded-2xl
                        border
                        border-[#E9DED2]
                        bg-white
                        shadow-[0_18px_45px_rgba(91,56,34,0.18)]
                        dark:border-white/10
                        dark:bg-[#211A15]
                        dark:shadow-[0_18px_45px_rgba(0,0,0,0.45)]
                      "
                    >
                      <div
                        role="listbox"
                        className="
                          max-h-64
                          overflow-y-auto
                          overscroll-contain
                          p-2
                        "
                      >
                        {availableTimezones.map((zone) => {
                          const selected = zone === timezone;

                          return (
                            <button
                              key={zone}
                              type="button"
                              role="option"
                              aria-selected={selected}
                              onClick={() => handleTimezoneChange(zone)}
                              className={`
                                  flex
                                  w-full
                                  items-center
                                  justify-between
                                  rounded-xl
                                  px-3
                                  py-2.5
                                  text-left
                                  text-sm
                                  transition
                                  ${
                                    selected
                                      ? "bg-[#4A3021] text-white"
                                      : "text-[#4A3021] hover:bg-[#F3EAE1] dark:text-gray-200 dark:hover:bg-white/10"
                                  }
                                `}
                            >
                              <span className="truncate">
                                {zone.replace(/_/g, " ")}
                              </span>

                              {selected && (
                                <FiCheck size={17} className="ml-3 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className="
                    mt-3
                    rounded-xl
                    bg-[#F5EDE4]
                    px-3
                    py-2
                    text-xs
                    text-[#806A59]
                    dark:bg-[#30241C]
                    dark:text-gray-400
                  "
                >
                  Current timezone:{" "}
                  <span className="font-semibold text-[#4A3021] dark:text-white">
                    {timezone}
                  </span>
                </div>
              </div>
            </div>

            <div
              className="
                mt-5
                flex
                items-center
                gap-3
                rounded-2xl
                bg-[#FCF5EC]
                p-4
                text-sm
                text-[#806A59]
                dark:bg-[#30241C]
                dark:text-gray-400
              "
            >
              <FiSettings className="text-[#8B5E3C]" />

              <span>Preferences are saved automatically.</span>
            </div>
          </div>

          {/* BACKUP */}

          <div
            className="
              rounded-[28px]
              border
              border-[#E9DED2]
              bg-white
              p-6
              shadow-[0_12px_35px_rgba(91,56,34,0.07)]
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-[0_18px_45px_rgba(91,56,34,0.12)]
              sm:p-8
              dark:border-white/10
              dark:bg-[#1A1410]
            "
          >
            <div className="mb-8 flex items-center gap-4">
              <div
                className="
                  flex
                  h-14
                  w-14
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[#F1E7DD]
                  text-[#8B5E3C]
                  dark:bg-[#30241C]
                  dark:text-[#D8A778]
                "
              >
                <FiDownload size={26} />
              </div>

              <div>
                <h2
                  className="
                    text-2xl
                    font-bold
                    text-[#4A3021]
                    dark:text-white
                  "
                >
                  Backup & Export
                </h2>

                <p
                  className="
                    mt-1
                    text-sm
                    text-[#806A59]
                    dark:text-gray-400
                  "
                >
                  Download and backup your data
                </p>
              </div>
            </div>

            <div
              className="
                mb-5
                rounded-2xl
                bg-[#FCF5EC]
                p-5
                dark:bg-[#30241C]
              "
            >
              <div className="flex items-start gap-3">
                <FiDownload
                  className="
                    mt-0.5
                    shrink-0
                    text-xl
                    text-[#8B5E3C]
                  "
                />

                <div>
                  <p
                    className="
                      font-semibold
                      text-[#4A3021]
                      dark:text-white
                    "
                  >
                    Export your information
                  </p>

                  <p
                    className="
                      mt-1
                      text-sm
                      leading-6
                      text-[#806A59]
                      dark:text-gray-400
                    "
                  >
                    Save your questions, answers, and original documents
                    directly to your computer.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={exportQuestions}
                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  rounded-2xl
                  bg-[#70472D]
                  px-5
                  py-4
                  text-left
                  text-white
                  shadow-lg
                  shadow-[#6E4026]/15
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-[#4A3021]
                  hover:shadow-xl
                "
              >
                <div className="flex items-center gap-3">
                  <FiDownload size={20} />

                  <div>
                    <p className="font-semibold">Export Questions</p>

                    <p className="mt-0.5 text-xs text-white/80">
                      Export all your AI questions and answers
                    </p>
                  </div>
                </div>

                <span className="text-xl">›</span>
              </button>

              <button
                type="button"
                onClick={exportDocuments}
                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  rounded-2xl
                  border
                  border-[#E9DED2]
                  bg-white
                  px-5
                  py-4
                  text-left
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-[#FCFAF7]
                  dark:border-white/10
                  dark:bg-[#211A15]
                  dark:hover:bg-[#30241C]
                "
              >
                <div className="flex items-center gap-3">
                  <FiDownload size={20} className="text-[#8B5E3C]" />

                  <div>
                    <p
                      className="
                        font-semibold
                        text-[#4A3021]
                        dark:text-white
                      "
                    >
                      Export Documents
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-xs
                        text-[#806A59]
                        dark:text-gray-400
                      "
                    >
                      Download your original uploaded documents
                    </p>
                  </div>
                </div>

                <span
                  className="
                    text-xl
                    text-[#806A59]
                    dark:text-gray-400
                  "
                >
                  ›
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* =================================================
            DANGER ZONE
        ================================================= */}

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
          <h2 className="mb-8 text-2xl font-bold text-[#8F362C]">
            Danger Zone
          </h2>

          <div className="space-y-6">
            <div
              className="
                flex
                flex-col
                gap-5
                md:flex-row
                md:items-center
                md:justify-between
              "
            >
              <div>
                <h3 className="font-bold text-[#4A3021] dark:text-white">
                  Clear AI History
                </h3>

                <p className="mt-1 text-sm text-[#806A59] dark:text-gray-400">
                  Remove all saved AI questions.
                </p>
              </div>

              <button
                type="button"
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

            <div
              className="
                flex
                flex-col
                gap-5
                md:flex-row
                md:items-center
                md:justify-between
              "
            >
              <div>
                <h3 className="font-bold text-[#4A3021] dark:text-white">
                  Reset Application
                </h3>

                <p className="mt-1 text-sm text-[#806A59] dark:text-gray-400">
                  Restore default application settings.
                </p>
              </div>

              <button
                type="button"
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

        {/* =================================================
            ABOUT
        ================================================= */}

        <div
          className="
            mt-8
            rounded-[28px]
            border
            border-[#E9DED2]
            bg-white
            p-6
            shadow-[0_12px_35px_rgba(91,56,34,0.07)]
            sm:p-8
            dark:border-white/10
            dark:bg-[#1A1410]
          "
        >
          <div className="mb-6 flex items-center gap-4">
            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-xl
                bg-[#F1E7DD]
                text-[#8B5E3C]
                dark:bg-[#30241C]
                dark:text-[#D8A778]
              "
            >
              <FiInfo size={24} />
            </div>

            <div>
              <h2
                className="
                  text-2xl
                  font-bold
                  text-[#4A3021]
                  dark:text-white
                "
              >
                About DataNest AI
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-[#806A59]
                  dark:text-gray-400
                "
              >
                Learn more about your application
              </p>
            </div>
          </div>

          <div
            className="
              grid
              grid-cols-1
              gap-4
              sm:grid-cols-2
              lg:grid-cols-4
            "
          >
            {/* PROJECT */}

            <div
              className="
                rounded-2xl
                border
                border-[#E9DED2]
                bg-[#FCFAF7]
                p-5
                text-center
                dark:border-white/10
                dark:bg-[#211A15]
              "
            >
              <FiSettings size={24} className="mx-auto mb-3 text-[#8B5E3C]" />

              <p className="text-sm font-semibold text-[#4A3021] dark:text-white">
                Project
              </p>

              <p className="mt-1 text-sm text-[#806A59] dark:text-gray-400">
                DataNest AI
              </p>
            </div>

            {/* DEVELOPER */}

            <div
              className="
                rounded-2xl
                border
                border-[#E9DED2]
                bg-[#FCFAF7]
                p-5
                text-center
                dark:border-white/10
                dark:bg-[#211A15]
              "
            >
              <FiUser size={24} className="mx-auto mb-3 text-[#8B5E3C]" />

              <p className="text-sm font-semibold text-[#4A3021] dark:text-white">
                Developer
              </p>

              <p className="mt-1 text-sm text-[#806A59] dark:text-gray-400">
                Bibi Hawa Abdul Shukoor
              </p>
            </div>

            {/* FRAMEWORK */}

            <div
              className="
                rounded-2xl
                border
                border-[#E9DED2]
                bg-[#FCFAF7]
                p-5
                text-center
                dark:border-white/10
                dark:bg-[#211A15]
              "
            >
              <FiSettings size={24} className="mx-auto mb-3 text-[#8B5E3C]" />

              <p className="text-sm font-semibold text-[#4A3021] dark:text-white">
                Framework
              </p>

              <p className="mt-1 text-sm text-[#806A59] dark:text-gray-400">
                React + Supabase + OpenRouter
              </p>
            </div>

            {/* VERSION */}

            <div
              className="
                rounded-2xl
                border
                border-[#E9DED2]
                bg-[#FCFAF7]
                p-5
                text-center
                dark:border-white/10
                dark:bg-[#211A15]
              "
            >
              <FiInfo size={24} className="mx-auto mb-3 text-[#8B5E3C]" />

              <p className="text-sm font-semibold text-[#4A3021] dark:text-white">
                Version
              </p>

              <p className="mt-1 text-sm text-[#806A59] dark:text-gray-400">
                1.0
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER */}

        <div
          className="
            py-8
            text-center
            text-sm
            text-[#806A59]
            dark:text-gray-500
          "
        >
          © 2026 DataNest AI. All rights reserved.
        </div>
      </div>
    </div>
  );
}
