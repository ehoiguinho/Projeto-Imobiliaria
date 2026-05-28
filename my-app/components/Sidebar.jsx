"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    {
      href: "/imoveis",
      label: "Imóveis"
    },
    {
      href: "/imoveis/cadastro",
      label: "Cadastrar imóvel"
    },
    {
    href: "/locacoes",
    label: "Minhas locações"
    }
  ];

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-slate-200 bg-white px-5 py-6 shadow-sm">
      <div className="mb-10">
        <h1 className="text-xl font-bold text-slate-900">Imobiliária</h1>
        <p className="mt-1 text-sm text-slate-500">Painel administrativo</p>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {links.map((link) => {
          const ativo = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-4 py-3 text-sm font-medium transition ${
                ativo
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <Link
        href="/login"
        className="rounded-lg border border-slate-200 px-4 py-3 text-center text-sm font-medium text-slate-600 transition hover:bg-slate-100"
      >
        Login
      </Link>
    </aside>
  );
}