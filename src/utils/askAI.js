import axios from "axios";

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

export async function askAI(question, chunks) {
  try {
    if (!OPENROUTER_API_KEY) {
      throw new Error("OpenRouter API Key is missing.");
    }

    console.log("========== OPENROUTER DEBUG ==========");

    const context = chunks
      .slice(0, 3) // فقط 3 چانک
      .map((chunk) => chunk.content)
      .join("\n\n");

    console.log("Context Length:", context.length);

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",

        messages: [
          {
            role: "system",
            content:
              "You are a helpful AI assistant. Answer ONLY using the provided document context. If the answer is not in the context, reply: I don't know.",
          },
          {
            role: "user",
            content: `Context:\n${context}\n\nQuestion:\n${question}`,
          },
        ],

        temperature: 0.2,

        max_tokens: 300,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    console.log(response.data);

    return response.data.choices[0].message.content;
  } catch (error) {
    console.log("========== ERROR ==========");

    if (error.response) {
      console.log("Status:", error.response.status);
      console.log(error.response.data);

      return (
        error.response.data?.error?.message || "OpenRouter request failed."
      );
    }

    console.log(error.message);

    return error.message;
  }
}
