import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CEMSU Cambará – Atendimento",
  description: "Central de Medidas Socialmente Úteis – Portal e Chat de Triagem",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
