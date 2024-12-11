"use client";

import { useDocumentStatus } from "@/hooks/useDocumentStatus";
import { useStatusNotification } from "@/hooks/useStatusNotification";
import { Document, Signer } from "@/types";

interface StatusTrackerProps {
  document: Document;
}

export const StatusTracker = ({ document }: StatusTrackerProps) => {
  const { data: currentDocument } = useDocumentStatus(document.id);
  useStatusNotification(currentDocument);

  const getStatusColor = (status: Document["status"]) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500";
      case "PROCESSING":
        return "bg-blue-500";
      case "READY":
        return "bg-green-500";
      case "COMPLETED":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className={`w-3 h-3 rounded-full ${getStatusColor(currentDocument?.status || document.status)}`} />
        <h2 className="text-xl font-semibold">Status: {currentDocument?.status || document.status}</h2>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Signatários:</h3>
        <div className="grid gap-4">
          {(currentDocument?.signers || document.signers).map((signer: Signer) => (
            <div key={signer.id} className="p-4 border rounded-lg flex items-center justify-between">
              <div>
                <p className="font-medium">{signer.name}</p>
                <p className="text-sm text-gray-500">{signer.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${signer.status === "SIGNED" ? "bg-green-500" : "bg-yellow-500"}`}
                />
                <span className="text-sm">
                  {signer.status === "SIGNED" ? `Assinado em ${formatDate(signer.signedAt!)}` : "Pendente"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatusTracker;
