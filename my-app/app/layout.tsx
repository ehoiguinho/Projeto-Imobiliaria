import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}