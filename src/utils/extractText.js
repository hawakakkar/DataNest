import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import mammoth from "mammoth";

// PDF Worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export async function extractText(file) {
  // TXT
  if (file.type === "text/plain") {
    return await file.text();
  }

  // PDF
  if (file.type === "application/pdf") {
    try {
      const arrayBuffer = await file.arrayBuffer();

      const pdf = await pdfjsLib.getDocument({
        data: arrayBuffer,
      }).promise;

      let text = "";

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);

        const content = await page.getTextContent();

        const pageText = content.items.map((item) => item.str || "").join(" ");

        text += pageText + "\n";
      }

      return text;
    } catch (error) {
      console.error("PDF Extract Error:", error);
      throw new Error("Failed to read PDF file.");
    }
  }

  // DOCX
  if (
    file.type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    try {
      const arrayBuffer = await file.arrayBuffer();

      const result = await mammoth.extractRawText({
        arrayBuffer,
      });

      return result.value;
    } catch (error) {
      console.error("DOCX Extract Error:", error);
      throw new Error("Failed to read DOCX file.");
    }
  }

  return "";
}
