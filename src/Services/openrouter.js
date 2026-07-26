import axios from "axios";

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

export async function generateEmbedding(text) {
  try {
    if (!OPENROUTER_API_KEY) {
      console.error("OpenRouter API Key is missing.");
      return null;
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/embeddings",
      {
        model: "openai/text-embedding-3-small",
        input: text,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.data?.data?.length) {
      console.error("Embedding response is empty.");
      return null;
    }

    console.log("Embedding created successfully");
    console.log("Vector Length:", response.data.data[0].embedding.length);

    return response.data.data[0].embedding;
  } catch (error) {
    console.error("Embedding Error");

    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Response:", error.response.data);
    } else {
      console.log(error.message);
    }

    return null;
  }
}
