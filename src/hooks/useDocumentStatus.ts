import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";

export const useDocumentStatus = (documentId: string) => {
  return useQuery({
    queryKey: ["document", documentId],
    queryFn: () => api.getDocumentStatus(documentId),
    refetchInterval: 5000,
  });
};

export default useDocumentStatus;
