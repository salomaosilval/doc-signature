import { ReactNode } from "react";
import QueryProvider from "@/providers/QueryProvider";
import { ToastProvider } from "@/contexts/ToastContext";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <QueryProvider>
          <ToastProvider position="top-right">{children}</ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
