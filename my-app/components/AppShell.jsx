"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import Sidebar from "./Sidebar";

export default function AppShell({ children }) {

    const pathname = usePathname();
    const router = useRouter();

    const [usuario, setUsuario] = useState(null);
    const [carregandoUsuario, setCarregandoUsuario] = useState(true);
    const [menuAjudaAberto, setMenuAjudaAberto] = useState(false);

    const mostrarSidebar = pathname.startsWith("/admin");

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


    function navegarPara(rota) {

        setMenuAjudaAberto(false);
        router.push(rota);

    }


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
                console.log("Não foi possível realizar o logout.");
                return;
            }

            setUsuario(null);

            router.push("/");

        } catch (error) {

            console.error("Erro ao realizar logout:", error);

        }

    }


    return (
        <div className="min-h-screen bg-white">

            {/* NAVBAR */}

            <nav className="h-20 w-full border-b border-zinc-100 bg-white">

                <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 lg:px-8">

                    {/* LOGO */}

                    <button
                        type="button"
                        onClick={() => router.push("/")}
                        className="flex items-center gap-2"
                    >

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-white">

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                className="h-6 w-6"
                            >

                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m3 10 9-7 9 7"
                                />

                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 9.5V21h14V9.5"
                                />

                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 21v-6h6v6"
                                />

                            </svg>

                        </div>

                        <span className="text-xl font-semibold tracking-tight text-zinc-900">
                            Sua Imobiliária
                        </span>

                    </button>


                    {/* NAVEGAÇÃO + USUÁRIO */}

                    <div className="flex items-center gap-8">

                        {/* INÍCIO */}

                        <button
                            type="button"
                            onClick={() => navegarPara("/")}
                            className="text-sm font-semibold text-zinc-700 transition hover:text-blue-600"
                        >
                            Início
                        </button>


                        {/* IMÓVEIS */}

                        <button
                            type="button"
                            onClick={() => navegarPara("/imoveis")}
                            className="text-sm font-semibold text-zinc-700 transition hover:text-blue-600"
                        >
                            Imóveis
                        </button>


                        {/* AJUDA */}

                        <div className="relative">

                            <button
                                type="button"
                                onClick={() =>
                                    setMenuAjudaAberto(!menuAjudaAberto)
                                }
                                className="flex items-center gap-1.5 text-sm font-semibold text-zinc-700 transition hover:text-blue-600"
                            >

                                Ajuda

                                <ChevronDown
                                    size={16}
                                    className={`transition-transform duration-200 ${
                                        menuAjudaAberto
                                            ? "rotate-180"
                                            : ""
                                    }`}
                                />

                            </button>


                            {/* DROPDOWN */}

                            {menuAjudaAberto && (

                                <div className="absolute right-0 top-9 z-50 w-48 overflow-hidden rounded-xl border border-zinc-200 bg-white py-2 shadow-xl">

                                    <button
                                        type="button"
                                        onClick={() => navegarPara("/sobrenos")}
                                        className="flex w-full px-4 py-3 text-left text-sm text-zinc-700 transition hover:bg-zinc-50 hover:text-blue-600"
                                    >
                                        Sobre nós
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => navegarPara("/atendimento")}
                                        className="flex w-full px-4 py-3 text-left text-sm text-zinc-700 transition hover:bg-zinc-50 hover:text-blue-600"
                                    >
                                        Atendimento
                                    </button>

                                </div>

                            )}

                        </div>


                        {/* USUÁRIO */}

                        <div className="flex items-center gap-3">

                            {carregandoUsuario ? (

                                <div className="h-10 w-20" />

                            ) : usuario ? (

                                <>

                                    <span className="text-sm font-medium text-zinc-700">
                                        Olá, {usuario.nome}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={logout}
                                        className="rounded-full border border-zinc-200 px-6 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 hover:text-red-600"
                                    >
                                        Sair
                                    </button>

                                </>

                            ) : (

                                <button
                                    type="button"
                                    onClick={() => router.push("/login")}
                                    className="rounded-full border border-zinc-200 px-6 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                                >
                                    Entrar
                                </button>

                            )}

                        </div>

                    </div>

                </div>

            </nav>


            {/* CONTEÚDO */}

            {mostrarSidebar ? (

                <div className="flex h-[calc(100vh-80px)] bg-slate-100">

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
