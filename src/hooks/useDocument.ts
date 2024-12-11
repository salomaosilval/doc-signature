import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Document, DocumentInput } from "@/types";

export const useDocument = () => {
  const queryClient = useQueryClient();
  const uploadMutation = useMutation({
    mutationFn: (params: { fileUrl: string; documentData: Omit<DocumentInput, "fileUrl"> }) =>
      api.uploadDocument(params.fileUrl, params.documentData),
    onSuccess: (data: Document) => {
      queryClient.setQueryData(["document", data.id], data);
    },
  });

  return {
    uploadDocument: uploadMutation.mutate,
    isUploading: uploadMutation.isPending,
    error: uploadMutation.error,
  };
};

export default useDocument;
