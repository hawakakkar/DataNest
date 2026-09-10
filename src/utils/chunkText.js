export function chunkText(text, chunkSize = 300) {
  if (!text) return [];

  const words = text.split(/\s+/).filter(Boolean);
  const chunks = [];

  for (let i = 0; i < words.length; i += chunkSize) {
    const chunk = words
      .slice(i, i + chunkSize)
      .join(" ")
      .trim();

    if (chunk) {
      chunks.push(chunk);
    }
  }

  console.log("Total chunks:", chunks.length);

  chunks.forEach((chunk, index) => {
    console.log(`Chunk ${index + 1}:`, chunk.split(/\s+/).length, "words");
  });

  return chunks;
}
