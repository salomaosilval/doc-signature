import { Signer, DocumentInput } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

export const api = {
  async uploadDocument(fileUrl: string, documentData: Omit<DocumentInput, "fileUrl">) {
    const response = await fetch(`${API_BASE_URL}/documents`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...documentData,
        fileUrl,
      }),
    });

    return response.json();
  },

  async addSigners(documentId: string, signers: Omit<Signer, "id" | "status" | "signedAt">[]) {
    const response = await fetch(`${API_BASE_URL}/documents/${documentId}/signers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ signers }),
    });

    return response.json();
  },

  async getDocumentStatus(documentId: string) {
    const response = await fetch(`${API_BASE_URL}/documents/${documentId}`);
    return response.json();
  },

  async getDocuments() {
    const response = await fetch(`${API_BASE_URL}/documents`);
    return response.json();
  },
};
