"use client";

import { useState, ChangeEvent } from "react";
import { useDocument } from "@/hooks/useDocument";
import { useToast } from "@/contexts/ToastContext";
import { Document, DocumentInput, SignerInput } from "@/types";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";

interface DocumentUploadProps {
  onUploadSuccess: (document: Document) => void;
}

export const DocumentUpload = ({ onUploadSuccess }: DocumentUploadProps) => {
  const [fileUrl, setFileUrl] = useState("");
  const [documentData, setDocumentData] = useState<Omit<DocumentInput, "fileUrl">>({
    name: "",
    description: "",
    signers: [{ name: "", email: "" }],
  });
  const { uploadDocument, isUploading, error } = useDocument();
  const { addToast } = useToast();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDocumentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignerChange = (index: number, field: keyof SignerInput, value: string) => {
    setDocumentData((prev) => {
      const newSigners = [...prev.signers];
      newSigners[index] = { ...newSigners[index], [field]: value };
      return { ...prev, signers: newSigners };
    });
  };

  const handleAddSigner = () => {
    setDocumentData((prev) => ({
      ...prev,
      signers: [...prev.signers, { name: "", email: "" }],
    }));
  };

  const handleRemoveSigner = (index: number) => {
    setDocumentData((prev) => ({
      ...prev,
      signers: prev.signers.filter((_, i) => i !== index),
    }));
  };

  const handleFileUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFileUrl(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!documentData.name.trim()) {
      addToast("O nome do documento é obrigatório", "error");
      return;
    }

    if (!fileUrl.trim()) {
      addToast("A URL do documento é obrigatória", "error");
      return;
    }

    if (!documentData.signers.every((signer) => signer.name && signer.email)) {
      addToast("Preencha todos os campos dos signatários", "error");
      return;
    }

    uploadDocument({ fileUrl, documentData });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4">
        <Input label="Nome do Documento" id="name" name="name" value={documentData.name} onChange={handleInputChange} />

        <TextArea
          label="Descrição"
          id="description"
          name="description"
          value={documentData.description}
          onChange={handleInputChange}
          rows={3}
        />

        <Input
          label="URL do PDF"
          type="url"
          id="fileUrl"
          value={fileUrl}
          onChange={handleFileUrlChange}
          placeholder="https://exemplo.com/documento.pdf"
        />

        <div className="space-y-4">
          <h3 className="font-medium text-gray-700">Signatários:</h3>
          <div className="grid gap-4">
            {documentData.signers.map((signer, index) => (
              <div key={index} className="flex gap-4 items-start">
                <Input
                  placeholder="Nome do signatário"
                  value={signer.name}
                  onChange={(e) => handleSignerChange(index, "name", e.target.value)}
                />
                <Input
                  type="email"
                  placeholder="Email do signatário"
                  value={signer.email}
                  onChange={(e) => handleSignerChange(index, "email", e.target.value)}
                />
                {documentData.signers.length > 1 && (
                  <Button type="button" variant="danger" onClick={() => handleRemoveSigner(index)}>
                    Remover
                  </Button>
                )}
              </div>
            ))}
          </div>
          <Button type="button" variant="success" onClick={handleAddSigner} className="w-full">
            Adicionar Signatário
          </Button>
        </div>
      </div>

      <Button type="submit" isLoading={isUploading} className="w-full">
        {isUploading ? "Enviando..." : "Enviar Documento"}
      </Button>

      {error && <p className="mt-4 text-red-500 text-sm">Erro ao enviar documento. Tente novamente.</p>}
    </form>
  );
};

export default DocumentUpload;
