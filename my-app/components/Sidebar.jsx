"use client";

import { API_URL } from "@/lib/api";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Building2, ClipboardList, LayoutDashboard, Plus } from "lucide-react";

export default function Sidebar() {

    const pathname = usePathname();
    const router = useRouter();

    const [usuario, setUsuario] = useState(null);


    useEffect(() => {

        async function buscarUsuarioLogado() {

            try {

                const resposta = await fetch(
                    `${API_URL}/login/usuario`,
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );

                if (!resposta.ok) {

                    const erro = await resposta.json();

                    console.log(
                        "ERRO AO BUSCAR USUÁRIO:",
                        resposta.status,
                        erro
                    );

                    return;
                }

                const dados = await resposta.json();

                setUsuario(dados);

            } catch (error) {

                console.log(
                    "Erro ao buscar usuário:",
                    error
                );

            }

        }

        buscarUsuarioLogado();

    }, []);


    // Perfil 1 = ADMIN
    const ehAdministrador = usuario?.perfil === 1;


    const links = [
        {
            href: "/imoveis",
            label: "Imóveis",
            icon: Building2
        },
        {
            href: "/locacoes",
            label: "Minhas locações",
            icon: ClipboardList
        }
    ];


    if (ehAdministrador) {

        links.push(
            {
                href: "/admin",
                label: "Gerenciar",
                icon: LayoutDashboard
            },
            {
                href: "/imoveis/cadastro",
                label: "Cadastrar imóvel",
                icon: Plus
            }
        );

    }


    async function fazerLogout() {

        try {

            const resposta = await fetch(
                `${API_URL}/login/logout`,
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

                console.log(
                    "Não foi possível realizar o logout."
                );

            }

        } catch (error) {

            console.log(
                "Erro ao realizar logout:",
                error
            );

        }

    }


    return (

        <aside className="flex h-full w-64 shrink-0 flex-col border-r border-[#E3E0D9] bg-[#F7F5F0] px-5 py-7">


            {/* =====================================================
                LOGO
            ====================================================== */}

            <div className="mb-10 px-2">

                <Link
                    href="/"
                    className="inline-block"
                >

                    <div className="text-[22px] font-semibold tracking-[0.18em] text-[#292825]">
                        VITTA
                    </div>

                    <div className="mt-0.5 text-[8px] font-medium tracking-[0.32em] text-[#8A8883]">
                        IMOBILIÁRIA
                    </div>

                </Link>


                <div className="mt-6 border-t border-[#E3E0D9] pt-4">

                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A19E98]">
                        Área administrativa
                    </p>

                </div>

            </div>


            {/* =====================================================
                NAVEGAÇÃO
            ====================================================== */}

            <nav className="flex flex-1 flex-col gap-1">

                {links.map((link) => {

                    const ativo =
                        pathname === link.href ||
                        (
                            link.href === "/admin" &&
                            pathname.startsWith("/admin/")
                        );

                    const Icon = link.icon;

                    return (

                        <Link
                            key={link.href}
                            href={link.href}
                            className={`group flex items-center gap-3 px-3 py-3 text-sm font-medium transition-all duration-200 ${
                                ativo
                                    ? "bg-[#292825] text-white"
                                    : "text-[#77746E] hover:bg-[#ECEAE5] hover:text-[#292825]"
                            }`}
                        >

                            <Icon
                                size={17}
                                strokeWidth={1.6}
                                className={`shrink-0 transition-transform duration-200 ${
                                    ativo
                                        ? ""
                                        : "group-hover:translate-x-0.5"
                                }`}
                            />

                            <span>
                                {link.label}
                            </span>

                            {ativo && (

                                <span className="ml-auto text-xs text-[#A19E98]">
                                    →
                                </span>

                            )}

                        </Link>

                    );

                })}

            </nav>

        </aside>

    );

}
