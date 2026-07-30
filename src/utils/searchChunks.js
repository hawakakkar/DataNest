import { supabase } from "../Services/supabase";
import { generateEmbedding } from "./createEmbeddings";

export async function searchChunks(question) {
  const embedding = await generateEmbedding(question);

  if (!embedding) return [];

  const { data, error } = await supabase.rpc("match_chunks", {
    query_embedding: embedding,
    match_threshold: 0,
    match_count: 5,
  });

  if (error) {
    console.error(error);
    return [];
  }

  if (!data || data.length === 0) {
    return [];
  }

  const documentIds = [...new Set(data.map((item) => item.document_id))];

  const { data: documents, error: docsError } = await supabase
    .from("documents")
    .select("id, file_name")
    .in("id", documentIds);

  if (docsError) {
    console.error(docsError);
    return data;
  }

  const documentMap = {};

  documents.forEach((doc) => {
    documentMap[doc.id] = doc.file_name;
  });

  const results = data.map((item) => ({
    ...item,
    file_name: documentMap[item.document_id] || "Unknown File",
  }));

  console.log("Chunks Found:");
  console.log(results);

  return results;
}
