import axios from "axios";

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

export async function generateEmbedding(text) {
  try {
    if (!OPENROUTER_API_KEY) {
      throw new Error("OpenRouter API Key is missing.");
    }

    if (!text || !text.trim()) {
      throw new Error("Cannot generate embedding for empty text.");
    }

    console.log("Embedding request:");
    console.log("Text length:", text.length);
    console.log("Approx words:", text.trim().split(/\s+/).length);

    const response = await axios.post(
      "https://openrouter.ai/api/v1/embeddings",
      {
        model: "liquid/lfm-2.5-embedding-350m:free",
        input: text.trim(),
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    const embedding = response.data?.data?.[0]?.embedding;

    if (!Array.isArray(embedding) || embedding.length === 0) {
      throw new Error("OpenRouter returned an empty embedding.");
    }

    console.log("Embedding created successfully ✅");
    console.log("Vector length:", embedding.length);

    return embedding;
  } catch (error) {
    console.error("========== OPENROUTER EMBEDDING ERROR ==========");

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Response:", error.response.data);

      const message =
        error.response.data?.error?.message ||
        error.response.data?.message ||
        "OpenRouter API request failed.";

      throw new Error(
        `Embedding API Error (${error.response.status}): ${message}`,
      );
    }

    console.error("Error:", error.message);

    throw new Error(error.message || "Failed to generate embedding.");
  }
}
