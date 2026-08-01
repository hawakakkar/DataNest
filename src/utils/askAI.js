import axios from "axios";

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

export async function askAI(question, chunks) {
  try {
    if (!OPENROUTER_API_KEY) {
      throw new Error("OpenRouter API Key is missing.");
    }

    const context = chunks
      .slice(0, 3)
      .map(
        (chunk) => `
Document: ${chunk.file_name}

${chunk.content}
`,
      )
      .join("\n\n");

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "nvidia/nemotron-3-ultra-550b-a55b:free",

        messages: [
          {
            role: "system",
            content: `
You are a document assistant.

Rules:

- NEVER explain your thinking.
- NEVER analyze the documents.
- NEVER say:
  "Looking at the documents"
  "The user is asking"
  "I need to answer"
  "Based on the context"
  "The second document"
- NEVER list documents.
- NEVER quote large sections.
- ONLY answer the question naturally.

At the END write exactly:


`,
          },
          {
            role: "user",
            content: `Context:\n${context}\n\nQuestion:\n${question}`,
          },
        ],

        temperature: 0,
        max_tokens: 250,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    let answer = response.data.choices[0].message.content;

    // حذف متن‌های اضافی
    answer = answer
      .replace(/Looking at the documents:?/gis, "")
      .replace(/The user is asking.*?\./gis, "")
      .replace(/I need to answer.*?\./gis, "")
      .replace(/Based on the provided context.*?\./gis, "")
      .replace(/The second document.*?\./gis, "")
      .replace(/The first document.*?\./gis, "")
      .replace(/Document \d+:.*?\n/gis, "")
      .replace(/^\d+\.\s.*$/gm, "")
      .trim();

    return answer;
  } catch (error) {
    if (error.response) {
      return (
        error.response.data?.error?.message || "OpenRouter request failed."
      );
    }

    return error.message;
  }
}
