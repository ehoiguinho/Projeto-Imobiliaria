"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    async function buscarUsuarioLogado() {
      try {
        const resposta = await fetch(
          "http://localhost:3000/login/usuario",
          {
            method: "GET",
            credentials: "include"
          }
        );

        if (!resposta.ok) {
          const erro = await resposta.json();
          console.log("ERRO AO BUSCAR USUÁRIO:", resposta.status, erro);
          return;
        }

        const dados = await resposta.json();
        setUsuario(dados);

      } catch (error) {
        console.log("Erro ao buscar usuário:", error);
      }
    }

    buscarUsuarioLogado();
  }, []);

  // Perfil 1 = ADMIN
  const ehAdministrador = usuario?.perfil === 1;

  const links = [
    { href: "/imoveis", label: "Imóveis" },
    { href: "/locacoes", label: "Minhas locações" }
];

if (ehAdministrador) {
    links.push(
        {
            href: "/admin",
            label: "Gerenciar"
        },
        {
            href: "/imoveis/cadastro",
            label: "Cadastrar imóvel"
        }
    );
}

  async function fazerLogout() {
    try {
      const resposta = await fetch(
        "http://localhost:3000/login/logout",
        {
          method: "POST",
          credentials: "include"
        }
      );

      if (resposta.ok) {
        setUsuario(null);
        router.push("/login");
        router.refresh();
      } else {
        console.log("Não foi possível realizar o logout.");
      }

    } catch (error) {
      console.log("Erro ao realizar logout:", error);
    }
  }

  return (
<aside className="flex h-full w-64 shrink-0 flex-col border-r border-slate-200 bg-white px-5 py-6 shadow-sm">      {/* Cabeçalho */}
      
      <div className="mb-10">
        <h1 className="text-xl font-bold text-slate-900">
          Imobiliária
        </h1>
        </div>
      {ehAdministrador && (
        <div>
        <p className="mt-1 text-sm text-slate-500">
          Painel administrativo
        </p>
        <br></br>
      </div>)}

      {/* Navegação */}
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

    </aside>
  );
}