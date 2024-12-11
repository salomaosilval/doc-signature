"use client";

import { useDocuments } from "@/hooks/useDocuments";
import { useStatusNotification } from "@/hooks/useStatusNotification";
import { Document, Signer } from "@/types";

const DOCUMENT_STATUS = ["PENDING", "PROCESSING", "READY", "COMPLETED"] as const;

export const DocumentKanban = () => {
  const { data: documents = [] } = useDocuments();

  const latestDocument = documents[0];
  useStatusNotification(latestDocument);

  console.log(documents);

  const getDocumentsByStatus = (status: Document["status"]) => {
    return documents.filter((doc: Document) => doc.status === status);
  };

  const getStatusColor = (status: Document["status"]) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 border-yellow-500";
      case "PROCESSING":
        return "bg-blue-100 border-blue-500";
      case "READY":
        return "bg-green-100 border-green-500";
      case "COMPLETED":
        return "bg-purple-100 border-purple-500";
      default:
        return "bg-gray-100 border-gray-500";
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="grid grid-cols-4 gap-4 h-[calc(100vh-200px)]">
      {DOCUMENT_STATUS.map((status) => (
        <div key={status} className="flex flex-col h-full">
          <h3 className="font-semibold mb-4">{status}</h3>
          <div className="flex-1 bg-gray-50 rounded-lg p-4 overflow-y-auto">
            {getDocumentsByStatus(status).map((doc: Document) => (
              <div
                key={doc.id}
                className={`p-4 rounded-lg border-l-4 mb-3 bg-white shadow-sm ${getStatusColor(doc.status)}`}
              >
                <h4 className="font-medium mb-2 text-black">{doc.name}</h4>
                <div className="text-sm text-gray-500">
                  <p>Criado em: {formatDate(doc.createdAt.toString())}</p>
                  <p>Signatários: {doc.signers.length}</p>
                  <p>Assinados: {doc.signers.filter((signer: Signer) => signer.status === "SIGNED").length}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentKanban;
