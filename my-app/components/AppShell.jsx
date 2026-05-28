"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

export default function AppShell({ children }) {
  const pathname = usePathname();

  const esconderSidebar = pathname === "/login";

  if (esconderSidebar) {
    return children;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar />

      <div className="ml-64 min-h-screen">
        {children}
      </div>
    </div>
  );
}