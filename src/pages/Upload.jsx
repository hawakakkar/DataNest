import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { supabase } from "../Services/supabase";
import { extractText } from "../utils/extractText";
import { chunkText } from "../utils/chunkText";
import { generateEmbedding } from "../Services/openrouter";

export default function Upload() {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedChunks, setUploadedChunks] = useState(null);

  const MAX_FILE_SIZE = 20 * 1024 * 1024;

  // -----------------------------
  // Select File
  // -----------------------------
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];

    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setMessage("File is too large. Maximum size is 20MB ❌");
      return;
    }

    setSelectedFile(file);
    setMessage("");
    setUploadedChunks(null);
  };

  // -----------------------------
  // Upload
  // -----------------------------
  async function handleUpload() {
    if (!selectedFile || uploading) return;

    setUploading(true);
    setMessage("");
    setUploadedChunks(null);

    let storagePath = null;
    let documentId = null;

    try {
      const startTime = performance.now();
      const file = selectedFile;

      // --------------------------------
      // 1. Check duplicate file name
      // --------------------------------
      const { data: existingFiles, error: checkError } = await supabase
        .from("documents")
        .select("id")
        .eq("file_name", file.name)
        .limit(1);

      if (checkError) {
        console.error("Duplicate check error:", checkError);
        throw new Error("Could not check existing documents.");
      }

      if (existingFiles && existingFiles.length > 0) {
        setMessage(
          "A file with this name already exists. Please rename the file and upload again. ❌",
        );
        setUploading(false);
        return;
      }

      // --------------------------------
      // 2. Extract text
      // --------------------------------
      const extractedText = await extractText(file);

      if (!extractedText || !extractedText.trim()) {
        throw new Error("No readable text was found in this document.");
      }

      // --------------------------------
      // 3. Create chunks
      // --------------------------------
      const chunks = chunkText(extractedText);

      if (!chunks || chunks.length === 0) {
        throw new Error("Could not create text chunks from this document.");
      }

      // --------------------------------
      // 4. Create unique storage path
      // --------------------------------
      const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");

      storagePath = `${Date.now()}-${crypto.randomUUID()}-${safeFileName}`;

      // --------------------------------
      // 5. Upload file to Supabase Storage
      // --------------------------------
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(storagePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type || "application/octet-stream",
        });

      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        throw new Error(`File upload failed: ${uploadError.message}`);
      }

      // --------------------------------
      // 6. Save document in database
      // --------------------------------
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setMessage("Please login first ❌");
        setUploading(false);
        return;
      }

      const { data: documentData, error: databaseError } = await supabase
        .from("documents")
        .insert([
          {
            title: file.name,
            file_name: file.name,
            uploaded_at: new Date(),
            text_content: extractedText,
            user_id: user.id,
          },
        ])
        .select()
        .single();

      if (databaseError) {
        console.error("Database error:", databaseError);

        // Remove uploaded file if database insert fails
        await supabase.storage.from("documents").remove([storagePath]);

        throw new Error(`Database save failed: ${databaseError.message}`);
      }

      documentId = documentData.id;

      // --------------------------------
      // 7. Generate embeddings
      // --------------------------------
      const chunkRows = [];

      for (const chunk of chunks) {
        if (!chunk || !chunk.trim()) continue;

        const embedding = await generateEmbedding(chunk);

        if (!embedding) {
          throw new Error("Failed to generate embedding for a document chunk.");
        }

        chunkRows.push({
          document_id: documentId,
          content: chunk,
          page: 1,
          section: "Unknown",
          embedding,
        });
      }

      // --------------------------------
      // 8. Save chunks
      // --------------------------------
      if (chunkRows.length > 0) {
        const { error: chunkError } = await supabase
          .from("chunks")
          .insert(chunkRows);

        if (chunkError) {
          console.error("Chunks error:", chunkError);

          // Remove document if chunks fail
          await supabase.from("documents").delete().eq("id", documentId);

          // Remove storage file
          await supabase.storage.from("documents").remove([storagePath]);

          throw new Error(`Chunks save failed: ${chunkError.message}`);
        }

        setUploadedChunks(chunkRows.length);
      }

      // --------------------------------
      // 9. Success
      // --------------------------------
      const endTime = performance.now();

      const seconds = ((endTime - startTime) / 1000).toFixed(2);

      setMessage(`Document uploaded successfully ✅ (${seconds}s)`);

      setSelectedFile(null);
    } catch (error) {
      console.error("UPLOAD ERROR:", error);

      setMessage(
        error?.message ||
          "Something went wrong while uploading the document ❌",
      );
    } finally {
      setUploading(false);
    }
  }

  // -----------------------------
  // Dropzone
  // -----------------------------
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
  });

  return (
    <div className="min-h-screen bg-[#F8F3EC] dark:bg-[#0F0B08] p-8 transition-colors">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-[#4A3021] dark:text-white">
          Upload Documents
        </h1>

        <p className="text-center text-[#72685F] dark:text-gray-400 mt-3">
          Upload PDF, DOCX or TXT files to build your AI Knowledge Base.
        </p>

        {/* Drop Zone */}
        <div
          {...getRootProps()}
          className="
            mt-10
            bg-white
            dark:bg-[#30241C]
            border-2
            border-dashed
            border-[#4A3021]
            rounded-3xl
            p-16
            text-center
            cursor-pointer
            hover:bg-[#F8F6F2]
            dark:hover:bg-[#3A2B22]
            transition-all
            duration-300
          "
        >
          <input {...getInputProps()} />

          <div className="text-6xl">📄</div>

          <h2 className="text-2xl font-bold text-[#4A3021] dark:text-white mt-5">
            Drag & Drop Files
          </h2>

          <p className="text-[#72685F] dark:text-gray-400 mt-2">
            or click to select document
          </p>

          <p className="text-sm text-[#9A9087] dark:text-gray-500 mt-3">
            PDF • DOCX • TXT (Max 20MB)
          </p>
        </div>

        {/* Selected File */}
        {selectedFile && (
          <div
            className="
              mt-6
              bg-[#F8F6F2]
              dark:bg-[#30241C]
              border
              border-[#ECE6DE]
              dark:border-[#4A3021]
              rounded-3xl
              p-6
            "
          >
            <h3 className="font-semibold text-[#4A3021] dark:text-[#D6A97A]">
              Selected File
            </h3>

            <p className="mt-2 text-[#4A3021] dark:text-white">
              📄 {selectedFile.name}
            </p>

            <p className="text-sm text-[#72685F] dark:text-gray-400">
              Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>

            {!uploading && (
              <div className="flex gap-3 mt-5">
                <button
                  onClick={handleUpload}
                  className="
                    px-6
                    py-3
                    rounded-xl
                    bg-[#4A3021]
                    text-white
                    hover:bg-[#3A251A]
                    transition
                  "
                >
                  Submit
                </button>

                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setMessage("");
                    setUploadedChunks(null);
                  }}
                  className="
                    px-6
                    py-3
                    rounded-xl
                    border
                    border-[#8f362c]
                    text-[#000000]
                    hover:bg-[#8f362c]
                    hover:text-white
                    dark:text-white
                    transition
                  "
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        )}

        {/* Upload Status */}
        <div
          className="
            bg-white
            dark:bg-[#30241C]
            rounded-3xl
            border
            border-[#ECE6DE]
            dark:border-[#4A3021]
            shadow-lg
            mt-8
            p-8
          "
        >
          <h2 className="font-bold text-2xl text-[#4A3021] dark:text-white">
            Upload Status
          </h2>

          {uploading ? (
            <div className="mt-5">
              <div className="h-3 bg-[#ECE6DE] dark:bg-[#4A3021] rounded-full overflow-hidden">
                <div className="h-3 bg-[#4A3021] rounded-full w-full animate-pulse"></div>
              </div>

              <p className="mt-3 text-[#4A3021] dark:text-[#D6A97A] font-medium">
                Processing document and generating embeddings...
              </p>
            </div>
          ) : (
            <p className="mt-4 text-[#72685F] dark:text-gray-400">
              {selectedFile
                ? "Ready to upload. Click Submit."
                : "Select a file first."}
            </p>
          )}

          {uploadedChunks && (
            <div
              className="
                mt-5
                bg-[#F8F6F2]
                dark:bg-[#17110D]
                border
                border-[#ECE6DE]
                dark:border-[#4A3021]
                rounded-2xl
                p-4
                text-[#4A3021]
                dark:text-[#D6A97A]
              "
            >
              Chunks created:
              <span className="font-bold ml-2">{uploadedChunks}</span>✅
            </div>
          )}

          {message && (
            <div className="mt-5 text-center font-semibold text-[#2F2A27] dark:text-white">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
