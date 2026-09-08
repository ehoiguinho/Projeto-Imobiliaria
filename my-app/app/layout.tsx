import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import AppShell from "../components/AppShell.jsx";

export const metadata: Metadata = {
    title: "Sua Imobiliária",
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
                <Toaster position="top-center" />

                <AppShell>
                    {children}
                </AppShell>
            </body>
        </html>
    );
}