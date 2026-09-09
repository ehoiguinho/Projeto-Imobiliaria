"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Settings } from "lucide-react";
import Sidebar from "./Sidebar";

export default function AppShell({ children }) {

    const pathname = usePathname();
    const router = useRouter();

    const [usuario, setUsuario] = useState(null);
    const [carregandoUsuario, setCarregandoUsuario] = useState(true);
    const [menuAjudaAberto, setMenuAjudaAberto] = useState(false);

    /*
     * A Sidebar aparece somente nas áreas administrativas.
     */
    const mostrarSidebar = pathname.startsWith("/admin");

    /*
     * A Home possui sua própria navbar sobre o hero.
     * Portanto, a navbar global não aparece em "/".
     */
    const mostrarNavbar = pathname !== "/";

    /*
     * ============================================================
     * CARREGAR USUÁRIO
     * ============================================================
     */
    useEffect(() => {

        async function carregarUsuario() {

            try {

                const resposta = await fetch(
                    "http://localhost:3000/login/usuario",
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );

                if (!resposta.ok) {
                    setUsuario(null);
                    return;
                }

                const dados = await resposta.json();

                setUsuario(dados);

            } catch (error) {

                console.log("Usuário não autenticado.");

                setUsuario(null);

            } finally {

                setCarregandoUsuario(false);

            }
        }

        carregarUsuario();

    }, [pathname]);


    /*
     * ============================================================
     * NAVEGAÇÃO
     * ============================================================
     */
    function navegarPara(rota) {

        setMenuAjudaAberto(false);
        router.push(rota);

    }


    /*
     * ============================================================
     * LOGOUT
     * ============================================================
     */
    async function logout() {

        try {

            const resposta = await fetch(
                "http://localhost:3000/login/logout",
                {
                    method: "POST",
                    credentials: "include"
                }
            );

            if (!resposta.ok) {

                console.log(
                    "Não foi possível realizar o logout."
                );

                return;
            }

            setUsuario(null);

            router.push("/");

        } catch (error) {

            console.error(
                "Erro ao realizar logout:",
                error
            );

        }

    }


    return (

        <div className="min-h-screen bg-[#F7F5F0] text-[#292825]">

            {/* =====================================================
                NAVBAR GLOBAL VITTA
                Não aparece na Home.
            ====================================================== */}

            {mostrarNavbar && (

                <nav className="h-20 w-full border-b border-[#E7E5E0] bg-white">

                    <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 lg:px-8">

                        {/* =================================================
                            LOGO
                        ================================================== */}

                        <button
                            type="button"
                            onClick={() => router.push("/")}
                            className="group flex items-center gap-3"
                        >

                            {/* Símbolo */}

                            <div
                                className="
                                    flex h-10 w-10
                                    items-center justify-center
                                    border border-[#292825]
                                    bg-[#292825]
                                    text-white
                                    transition
                                    group-hover:bg-[#45433F]
                                "
                            >

                                <span className="text-lg font-medium tracking-[-0.08em]">
                                    V
                                </span>

                            </div>


                            {/* Nome */}

                            <div className="leading-none text-left">

                                <span
                                    className="
                                        block text-lg font-semibold
                                        tracking-[0.18em]
                                        text-[#292825]
                                    "
                                >
                                    VITTA
                                </span>

                                <span
                                    className="
                                        mt-1 block text-[8px] font-medium
                                        tracking-[0.28em]
                                        text-[#8A8883]
                                    "
                                >
                                    IMOBILIÁRIA
                                </span>

                            </div>

                        </button>


                        {/* =================================================
                            NAVEGAÇÃO + USUÁRIO
                        ================================================== */}

                        <div className="flex items-center gap-8">

                            {/* INÍCIO */}

                            <button
                                type="button"
                                onClick={() => navegarPara("/")}
                                className={`text-sm font-medium transition ${
                                    pathname === "/"
                                        ? "text-zinc-950"
                                        : "text-zinc-500 hover:text-zinc-950"
                                }`}
                            >
                                Início
                            </button>


                            {/* IMÓVEIS */}

                            <button
                                type="button"
                                onClick={() =>
                                    navegarPara("/imoveis")
                                }
                                className={`text-sm font-medium transition ${
                                    pathname.startsWith("/imoveis")
                                        ? "text-zinc-950"
                                        : "text-zinc-500 hover:text-zinc-950"
                                }`}
                            >
                                Imóveis
                            </button>


                            {/* AJUDA */}

                            <div className="relative">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setMenuAjudaAberto(
                                            !menuAjudaAberto
                                        )
                                    }
                                    className={`flex items-center gap-1.5 text-sm font-medium transition ${
                                        pathname === "/sobrenos" ||
                                        pathname === "/atendimento"
                                            ? "text-zinc-950"
                                            : "text-zinc-500 hover:text-zinc-950"
                                    }`}
                                >

                                    Ajuda

                                    <ChevronDown
                                        size={15}
                                        strokeWidth={1.8}
                                        className={`transition-transform duration-200 ${
                                            menuAjudaAberto
                                                ? "rotate-180"
                                                : ""
                                        }`}
                                    />

                                </button>


                                {/* DROPDOWN */}

                                {menuAjudaAberto && (

                                    <div
                                        className="
                                            absolute right-0 top-9 z-50 w-48
                                            overflow-hidden rounded-xl
                                            border border-zinc-200
                                            bg-white py-1.5
                                            shadow-lg
                                        "
                                    >

                                        <button
                                            type="button"
                                            onClick={() =>
                                                navegarPara(
                                                    "/sobrenos"
                                                )
                                            }
                                            className="
                                                flex w-full
                                                px-4 py-2.5
                                                text-left text-sm
                                                text-zinc-600
                                                transition
                                                hover:bg-zinc-50
                                                hover:text-zinc-950
                                            "
                                        >
                                            Sobre nós
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                navegarPara(
                                                    "/atendimento"
                                                )
                                            }
                                            className="
                                                flex w-full
                                                px-4 py-2.5
                                                text-left text-sm
                                                text-zinc-600
                                                transition
                                                hover:bg-zinc-50
                                                hover:text-zinc-950
                                            "
                                        >
                                            Atendimento
                                        </button>

                                    </div>

                                )}

                            </div>


                            {/* =================================================
                                ÁREA DO USUÁRIO
                            ================================================== */}

                            <div className="flex items-center gap-3">

                                {carregandoUsuario ? (

                                    <div
                                        className="
                                            h-9 w-24
                                            animate-pulse
                                            rounded-full
                                            bg-zinc-100
                                        "
                                    />

                                ) : usuario ? (

                                    <>

                                        {/* NOME */}

                                        <span
                                            className="
                                                whitespace-nowrap
                                                text-sm font-medium
                                                text-zinc-600
                                            "
                                        >
                                            Olá, {usuario.nome}
                                        </span>


                                        {/* SAIR */}

                                        <button
                                            type="button"
                                            onClick={logout}
                                            className="
                                                rounded-full
                                                border border-zinc-200
                                                px-5 py-2.5
                                                text-sm font-medium
                                                text-zinc-600
                                                transition
                                                hover:border-zinc-300
                                                hover:bg-zinc-50
                                                hover:text-zinc-950
                                            "
                                        >
                                            Sair
                                        </button>


                                        {/* ADMIN */}

                                        {usuario.perfil === 1 && (

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    router.push(
                                                        "/admin"
                                                    )
                                                }
                                                title="Painel administrativo"
                                                aria-label="Abrir painel administrativo"
                                                className="
                                                    flex h-9 w-9
                                                    items-center justify-center
                                                    rounded-full
                                                    text-zinc-500
                                                    transition
                                                    hover:bg-zinc-100
                                                    hover:text-zinc-950
                                                "
                                            >

                                                <Settings
                                                    size={18}
                                                    strokeWidth={1.8}
                                                />

                                            </button>

                                        )}

                                    </>

                                ) : (

                                    /* =================================================
                                       USUÁRIO NÃO AUTENTICADO
                                    ================================================== */

                                    <button
                                        type="button"
                                        onClick={() =>
                                            router.push("/login")
                                        }
                                        className="
                                            rounded-full
                                            bg-zinc-950
                                            px-6 py-2.5
                                            text-sm font-medium
                                            text-white
                                            transition
                                            hover:bg-zinc-800
                                        "
                                    >
                                        Entrar
                                    </button>

                                )}

                            </div>

                        </div>

                    </div>

                </nav>

            )}


            {/* =====================================================
                CONTEÚDO
            ====================================================== */}

            {mostrarSidebar ? (

                <div
                    className={`
                        flex bg-[#F1EFEA]
                        ${
                            mostrarNavbar
                                ? "h-[calc(100vh-80px)]"
                                : "min-h-screen"
                        }
                    `}
                >

                    <Sidebar />

                    <main className="min-w-0 flex-1 overflow-y-auto">
                        {children}
                    </main>

                </div>

            ) : (

                <main>
                    {children}
                </main>

            )}

        </div>

    );

}
