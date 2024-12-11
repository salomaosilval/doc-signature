"use client";

import { useState } from "react";
import { DocumentUpload } from "@/components/DocumentUpload";
import { SignerForm } from "@/components/SignerForm";
import { StatusTracker } from "@/components/StatusTracker";
import { DocumentKanban } from "@/components/DocumentKanban";
import { Document } from "@/types";

export default function Home() {
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [view, setView] = useState<"form" | "kanban">("form");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">DocSignature</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setView("form")}
            className={`px-4 py-2 rounded-lg ${view === "form" ? "bg-blue-500 text-white" : "bg-gray-100 text-black"}`}
          >
            Formulário
          </button>
          <button
            onClick={() => setView("kanban")}
            className={`px-4 py-2 rounded-lg ${
              view === "kanban" ? "bg-blue-500 text-white" : "bg-gray-100 text-black"
            }`}
          >
            Kanban
          </button>
        </div>
      </div>

      {view === "form" ? (
        <>
          {!currentDocument && <DocumentUpload onUploadSuccess={setCurrentDocument} />}
          {currentDocument && !currentDocument.signers.length && <SignerForm documentId={currentDocument.id} />}
          {currentDocument && currentDocument.signers.length > 0 && <StatusTracker document={currentDocument} />}
        </>
      ) : (
        <DocumentKanban />
      )}
    </div>
  );
}
