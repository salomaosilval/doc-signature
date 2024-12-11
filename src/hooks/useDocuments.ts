import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";

export function useDocuments() {
  return useQuery({
    queryKey: ["documents"],
    queryFn: () => api.getDocuments(),
    refetchInterval: 5000,
  });
}
