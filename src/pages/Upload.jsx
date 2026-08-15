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

  async function handleUpload() {
    if (!selectedFile) return;

    setUploading(true);
    setMessage("");
    setUploadedChunks(null);

    try {
      const startTime = performance.now();

      const file = selectedFile;

      const { data: existing } = await supabase
        .from("documents")
        .select("id")
        .eq("file_name", file.name)
        .maybeSingle();

      if (existing) {
        setMessage(
          "A file with this name already exists. Please rename the file and upload again. ❌",
        );
        setUploading(false);
        return;
      }

      const extractedText = await extractText(file);

      const chunks = chunkText(extractedText);

      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(file.name, file);

      if (uploadError) {
        setMessage("Upload failed ❌");
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
          },
        ])
        .select()
        .single();

      if (databaseError) {
        setMessage("Database save failed ❌");
        setUploading(false);
        return;
      }

      if (chunks.length > 0) {
        const chunkRows = [];

        for (const chunk of chunks) {
          const embedding = await generateEmbedding(chunk);

          chunkRows.push({
            document_id: documentData.id,
            content: chunk,
            page: 1,
            section: "Unknown",
            embedding,
          });
        }

        const { error: chunkError } = await supabase
          .from("chunks")
          .insert(chunkRows);

        if (chunkError) {
          setMessage("Chunks save failed ❌");
          setUploading(false);
          return;
        }

        setUploadedChunks(chunks.length);
      }

      const endTime = performance.now();

      const seconds = ((endTime - startTime) / 1000).toFixed(2);

      setMessage(`Document uploaded successfully ✅ (${seconds}s)`);

      setSelectedFile(null);
    } catch (error) {
      console.log(error);
      setMessage("Something went wrong ❌");
    }

    setUploading(false);
  }

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
          dark:border-[#4A3021]
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
                Uploading document and generating embeddings...
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
