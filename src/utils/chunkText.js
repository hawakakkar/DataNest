export function chunkText(text, chunkSize = 80) {
  if (!text) return [];

  const words = text.split(/\s+/);
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

  return chunks;
}
