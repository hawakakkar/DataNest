import OpenAI from "openai";

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

export async function generateEmbedding(text) {
  try {
    if (!text || !text.trim()) {
      throw new Error("Cannot generate embedding for empty text.");
    }

    const response = await client.embeddings.create({
      model: "liquid/lfm-2.5-embedding-350m:free",
      input: text.trim(),
    });

    const embedding = response.data?.[0]?.embedding;

    if (!Array.isArray(embedding) || embedding.length === 0) {
      throw new Error("OpenRouter returned an empty embedding.");
    }

    console.log("Question embedding created ✅");
    console.log("Vector length:", embedding.length);

    return embedding;
  } catch (error) {
    console.error("Embedding error:", error);
    throw error;
  }
}
