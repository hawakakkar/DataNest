import axios from "axios";

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

export async function askAI(question, chunks) {
  try {
    if (!OPENROUTER_API_KEY) {
      throw new Error("OpenRouter API Key is missing.");
    }

    const context = chunks
      .slice(0, 10)
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
        model: "poolside/laguna-s-2.1:free",

        messages: [
          {
            role: "system",
            content: `
You are an AI assistant that answers questions ONLY using the provided document context.

Rules:

- Answer completely and clearly.
- Use all relevant information from the context.
- Never invent information.
- If the answer is not found in the documents, simply say:
"I couldn't find that information in the uploaded documents."

- Do not explain your reasoning.
- Do not mention the context or documents.
- Write naturally in complete sentences.
- If the answer contains multiple points, present them as bullet points.
`,
          },
          {
            role: "user",
            content: `Context:\n${context}\n\nQuestion:\n${question}`,
          },
        ],

        temperature: 0,
        max_tokens: 2500,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    let answer = response.data.choices[0].message.content;

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
