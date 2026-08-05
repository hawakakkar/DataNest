import { supabase } from "./supabase";

export async function saveGeneralChat(question, answer) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  return await supabase.from("chat_history").insert([
    {
      user_id: user.id,
      chat_type: "general",
      role: "user",
      content: question,
      document_id: null,
      document_name: null,
    },
    {
      user_id: user.id,
      chat_type: "general",
      role: "assistant",
      content: answer,
      document_id: null,
      document_name: null,
    },
  ]);
}

export async function saveDocumentChat(
  documentId,
  documentName,
  question,
  answer,
) {
  console.log("documentId:", documentId);
  console.log("documentName:", documentName);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  return await supabase.from("chat_history").insert([
    {
      user_id: user.id,
      chat_type: "document",
      document_id: documentId,
      document_name: documentName,
      role: "user",
      content: question,
    },
    {
      user_id: user.id,
      chat_type: "document",
      document_id: documentId,
      document_name: documentName,
      role: "assistant",
      content: answer,
    },
  ]);
}
