import type { Metadata } from "next";
import "./globals.css";
import AppShell from "../components/AppShell.jsx";

export const metadata: Metadata = {
  title: "Imobiliária",
  description: "Sistema de gerenciamento de imóveis"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}