import { useEffect, useRef } from "react";
import { Document } from "@/types";
import { useToast } from "@/contexts/ToastContext";

export function useStatusNotification(document: Document | null | undefined) {
  const { addToast } = useToast();
  const previousStatus = useRef<Document["status"] | null>(null);

  useEffect(() => {
    if (!document) return;

    if (previousStatus.current && previousStatus.current !== document.status) {
      const messages = {
        PENDING: "Documento aguardando processamento",
        PROCESSING: "Documento está sendo processado",
        READY: "Documento pronto para assinatura",
        COMPLETED: "Todas as assinaturas foram coletadas!",
      };

      addToast(messages[document.status], "info");
    }

    previousStatus.current = document.status;
  }, [document?.status, addToast]);
}
