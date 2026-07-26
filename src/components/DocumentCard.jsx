import { useEffect, useState } from "react";
import { supabase } from "../Services/supabase";
import { useSearch } from "../context/SearchContext";

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Global Search
  const { search } = useSearch();
  console.log("Search =", search);

  const fetchDocuments = async () => {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .order("uploaded_at", { ascending: false });

    if (error) {
      console.log(error);
    } else {
      setDocuments(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Filter documents
  const filteredDocuments = documents.filter((doc) => {
    const keyword = search.toLowerCase();

    return (
      (doc.title || "").toLowerCase().includes(keyword) ||
      (doc.file_name || "").toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Documents</h1>

      <div className="bg-white rounded-2xl shadow p-6">
        {loading ? (
          <p>Loading documents...</p>
        ) : filteredDocuments.length === 0 ? (
          <p className="text-gray-500">No documents found.</p>
        ) : (
          <div className="space-y-4">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="
                  border
                  rounded-xl
                  p-5
                  flex
                  justify-between
                  items-center
                "
              >
                <div>
                  <h2 className="font-semibold text-lg">{doc.title}</h2>

                  <p className="text-sm text-gray-500">{doc.file_name}</p>
                </div>

                <div className="text-sm text-gray-500">
                  {new Date(doc.uploaded_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
