"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { useToast } from "@/contexts/ToastContext";
import { useFormValidation } from "@/hooks/useFormValidation";

interface SignerFormProps {
  documentId: string;
}

interface SignerInput {
  name: string;
  email: string;
}

const validationRules = {
  name: [
    {
      validate: (value: string) => value.length >= 3,
      message: "Nome deve ter pelo menos 3 caracteres",
    },
    {
      validate: (value: string) => /^[a-zA-Z\s]*$/.test(value),
      message: "Nome deve conter apenas letras",
    },
  ],
  email: [
    {
      validate: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      message: "Email inválido",
    },
  ],
};

export const SignerForm = ({ documentId }: SignerFormProps) => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [signers, setSigners] = useState<SignerInput[]>([{ name: "", email: "" }]);

  const { errors, touched, validateField, validateForm, handleBlur } = useFormValidation<SignerInput>(validationRules);

  const addSignersMutation = useMutation({
    mutationFn: (signers: SignerInput[]) => api.addSigners(documentId, signers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["document", documentId] });
      addToast("Signatários adicionados com sucesso!", "success");
    },
    onError: () => {
      addToast("Erro ao adicionar signatários. Tente novamente.", "error");
    },
  });

  const handleAddSigner = () => {
    setSigners([...signers, { name: "", email: "" }]);
  };

  const handleRemoveSigner = (index: number) => {
    setSigners(signers.filter((_, i) => i !== index));
  };

  const handleSignerChange = (index: number, field: keyof SignerInput, value: string) => {
    const newSigners = [...signers];
    newSigners[index][field] = value;
    setSigners(newSigners);

    const error = validateField(field, value);
    if (error && touched[field]) {
      addToast(error, "error");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = signers.every((signer) => {
      return validateForm(signer);
    });

    if (!isValid) {
      addToast("Por favor, corrija os erros no formulário", "error");
      return;
    }

    const validSigners = signers.filter((signer) => signer.name && signer.email);
    if (validSigners.length > 0) {
      addSignersMutation.mutate(validSigners);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {signers.map((signer, index) => (
          <div key={index} className="space-y-2">
            <div className="flex gap-4 items-start">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Nome do signatário"
                  value={signer.name}
                  onChange={(e) => handleSignerChange(index, "name", e.target.value)}
                  onBlur={() => handleBlur("name")}
                  className={`w-full px-4 py-2 border rounded-lg ${
                    touched.name && errors.name ? "border-red-500" : ""
                  }`}
                  required
                />
                {touched.name && errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              <div className="flex-1">
                <input
                  type="email"
                  placeholder="Email do signatário"
                  value={signer.email}
                  onChange={(e) => handleSignerChange(index, "email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  className={`w-full px-4 py-2 border rounded-lg ${
                    touched.email && errors.email ? "border-red-500" : ""
                  }`}
                  required
                />
                {touched.email && errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              {signers.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveSigner(index)}
                  className="px-3 py-2 text-red-500 hover:text-red-700"
                >
                  Remover
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={handleAddSigner}
          className="px-4 py-2 text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-50"
        >
          Adicionar Signatário
        </button>

        <button
          type="submit"
          disabled={addSignersMutation.isPending}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {addSignersMutation.isPending ? "Enviando..." : "Enviar para Assinatura"}
        </button>
      </div>

      {addSignersMutation.error && (
        <p className="text-red-500 text-sm">Erro ao adicionar signatários. Tente novamente.</p>
      )}
    </form>
  );
};

export default SignerForm;
