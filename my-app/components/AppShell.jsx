"use client";

import { API_URL } from "@/lib/api";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Settings } from "lucide-react";
import Sidebar from "./Sidebar";

export default function AppShell({ children }) {

    const pathname = usePathname();
    const router = useRouter();

    const [usuario, setUsuario] = useState(null);
    const [carregandoUsuario, setCarregandoUsuario] = useState(true);

    const [menuAjudaAberto, setMenuAjudaAberto] = useState(false);
    const [menuUsuarioAberto, setMenuUsuarioAberto] = useState(false);

    /*
     * Referências dos menus.
     * Usadas para detectar cliques fora dos dropdowns.
     */
    const menuAjudaRef = useRef(null);
    const menuUsuarioRef = useRef(null);


    /*
     * A Sidebar aparece somente nas áreas administrativas.
     */
    const mostrarSidebar = pathname.startsWith("/admin");


    /*
     * A Home possui sua própria navbar sobre o hero.
     * As páginas de autenticação também não possuem navbar.
     */
    const mostrarNavbar =
        pathname !== "/" &&
        pathname !== "/login" &&
        pathname !== "/cadastro" &&
        pathname !== "/esqueci-senha" &&
        pathname !== "/redefinir-senha";


    /*
     * ============================================================
     * CARREGAR USUÁRIO
     * ============================================================
     */
    useEffect(() => {

        async function carregarUsuario() {

            try {

                const resposta = await fetch(
                    `${API_URL}/login/usuario`,
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
     * FECHAR MENUS AO CLICAR FORA
     * ============================================================
     */
    useEffect(() => {

        function fecharMenusAoClicarFora(event) {

            /*
             * Fecha o menu Ajuda caso o clique
             * tenha acontecido fora dele.
             */
            if (
                menuAjudaRef.current &&
                !menuAjudaRef.current.contains(event.target)
            ) {

                setMenuAjudaAberto(false);

            }


            /*
             * Fecha o menu do usuário caso o clique
             * tenha acontecido fora dele.
             */
            if (
                menuUsuarioRef.current &&
                !menuUsuarioRef.current.contains(event.target)
            ) {

                setMenuUsuarioAberto(false);

            }

        }

        document.addEventListener(
            "mousedown",
            fecharMenusAoClicarFora
        );

        return () => {

            document.removeEventListener(
                "mousedown",
                fecharMenusAoClicarFora
            );

        };

    }, []);


    /*
     * ============================================================
     * NAVEGAÇÃO
     * ============================================================
     */
    function navegarPara(rota) {

        setMenuAjudaAberto(false);
        setMenuUsuarioAberto(false);

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
                `${API_URL}/login/logout`,
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
            setMenuUsuarioAberto(false);

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
                Não aparece na Home nem nas páginas de autenticação.
            ====================================================== */}

            {mostrarNavbar && (

                <nav className="h-20 w-full border-b border-[#45433F] bg-[#292825]">

                    <div
                        className="
                            relative
                            mx-auto
                            flex
                            h-full
                            max-w-7xl
                            items-center
                            px-6
                            lg:px-8
                        "
                    >

                        {/* =================================================
                            LOGO
                        ================================================== */}

                        <button
                            type="button"
                            onClick={() => router.push("/")}
                            className="group flex items-center"
                        >

                            <Image
                                src="/images/logo.png"
                                alt="Vitta Imobiliária"
                                width={150}
                                height={45}
                                priority
                                className="h-10 w-auto object-contain"
                            />

                        </button>


                        {/* =================================================
                            NAVEGAÇÃO CENTRAL
                        ================================================== */}

                        <div
                            className="
                                absolute
                                left-1/2
                                top-1/2
                                flex
                                -translate-x-1/2
                                -translate-y-1/2
                                items-center
                                gap-8
                            "
                        >

                            {/* INÍCIO */}

                            <button
                                type="button"
                                onClick={() =>
                                    navegarPara("/")
                                }
                                className={`
                                    text-sm
                                    font-medium
                                    transition
                                    ${
                                        pathname === "/"
                                            ? "text-white"
                                            : "text-[#B8B5AF] hover:text-white"
                                    }
                                `}
                            >
                                Início
                            </button>


                            {/* IMÓVEIS */}

                            <button
                                type="button"
                                onClick={() =>
                                    navegarPara("/imoveis")
                                }
                                className={`
                                    text-sm
                                    font-medium
                                    transition
                                    ${
                                        pathname.startsWith("/imoveis")
                                            ? "text-white"
                                            : "text-[#B8B5AF] hover:text-white"
                                    }
                                `}
                            >
                                Imóveis
                            </button>



                            <div
                                ref={menuAjudaRef}
                                className="relative"
                            >

                                <button
                                    type="button"
                                    onClick={() => {

                                        setMenuAjudaAberto(
                                            !menuAjudaAberto
                                        );

                                        setMenuUsuarioAberto(false);

                                    }}
                                    className={`
                                        flex
                                        items-center
                                        gap-1.5
                                        text-sm
                                        font-medium
                                        transition
                                        ${
                                            pathname === "/sobrenos" ||
                                            pathname === "/atendimento"
                                                ? "text-white"
                                                : "text-[#B8B5AF] hover:text-white"
                                        }
                                    `}
                                >

                                    Ajuda

                                    <ChevronDown
                                        size={15}
                                        strokeWidth={1.8}
                                        className={`
                                            transition-transform
                                            duration-200
                                            ${
                                                menuAjudaAberto
                                                    ? "rotate-180"
                                                    : ""
                                            }
                                        `}
                                    />

                                </button>


                                {/* DROPDOWN AJUDA */}

                                {menuAjudaAberto && (

                                    <div
                                        className="
                                            absolute
                                            left-1/2
                                            top-9
                                            z-50
                                            w-48
                                            -translate-x-1/2
                                            overflow-hidden
                                            rounded-xl
                                            border
                                            border-[#E3E0D9]
                                            bg-white
                                            py-1.5
                                            shadow-[0_12px_30px_rgba(23,22,20,0.08)]
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
                                                flex
                                                w-full
                                                px-4
                                                py-2.5
                                                text-left
                                                text-sm
                                                text-[#77746E]
                                                transition
                                                hover:bg-[#F7F5F0]
                                                hover:text-[#292825]
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
                                                flex
                                                w-full
                                                px-4
                                                py-2.5
                                                text-left
                                                text-sm
                                                text-[#77746E]
                                                transition
                                                hover:bg-[#F7F5F0]
                                                hover:text-[#292825]
                                            "
                                        >
                                            Atendimento
                                        </button>

                                    </div>

                                )}

                            </div>

                        </div>


                        {/* =================================================
                            ÁREA DO USUÁRIO
                        ================================================== */}

                        <div className="ml-auto flex items-center gap-3">

                            {carregandoUsuario ? (

                                <div
                                    className="
                                        h-9
                                        w-28
                                        animate-pulse
                                        rounded-full
                                        bg-[#45433F]
                                    "
                                />

                            ) : usuario ? (

                                <>

                                    {/* =================================================
                                        DROPDOWN DO USUÁRIO
                                    ================================================== */}

                                    <div
                                        ref={menuUsuarioRef}
                                        className="relative"
                                    >

                                        {/* BOTÃO DO USUÁRIO */}

                                        <button
                                            type="button"
                                            onClick={() => {

                                                setMenuUsuarioAberto(
                                                    !menuUsuarioAberto
                                                );

                                                setMenuAjudaAberto(false);

                                            }}
                                            className="
                                                flex
                                                cursor-pointer
                                                items-center
                                                gap-1.5
                                                whitespace-nowrap
                                                text-sm
                                                font-medium
                                                text-[#B8B5AF]
                                                transition
                                                hover:text-white
                                            "
                                            aria-expanded={
                                                menuUsuarioAberto
                                            }
                                        >

                                            Olá, {usuario.nome}

                                            <ChevronDown
                                                size={15}
                                                strokeWidth={1.8}
                                                className={`
                                                    transition-transform
                                                    duration-200
                                                    ${
                                                        menuUsuarioAberto
                                                            ? "rotate-180"
                                                            : ""
                                                    }
                                                `}
                                            />

                                        </button>


                                        {/* =================================================
                                            MENU DO USUÁRIO
                                        ================================================== */}

                                        {menuUsuarioAberto && (

                                            <div
                                                className="
                                                    absolute
                                                    right-0
                                                    top-11
                                                    z-50
                                                    w-48
                                                    overflow-hidden
                                                    rounded-xl
                                                    border
                                                    border-[#E3E0D9]
                                                    bg-white
                                                    py-1.5
                                                    shadow-[0_12px_30px_rgba(23,22,20,0.08)]
                                                "
                                            >

                                                {/* MINHAS LOCAÇÕES */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        navegarPara(
                                                            "/locacoes"
                                                        )
                                                    }
                                                    className="
                                                        flex
                                                        w-full
                                                        px-4
                                                        py-2.5
                                                        text-left
                                                        text-sm
                                                        text-[#77746E]
                                                        transition
                                                        hover:bg-[#F7F5F0]
                                                        hover:text-[#292825]
                                                    "
                                                >
                                                    Minhas locações
                                                </button>


                                                {/* DIVISOR */}

                                                <div
                                                    className="
                                                        my-1
                                                        border-t
                                                        border-[#F0EEE9]
                                                    "
                                                />


                                                {/* SAIR */}

                                                <button
                                                    type="button"
                                                    onClick={logout}
                                                    className="
                                                        flex
                                                        w-full
                                                        px-4
                                                        py-2.5
                                                        text-left
                                                        text-sm
                                                        text-[#77746E]
                                                        transition
                                                        hover:bg-[#F7F5F0]
                                                        hover:text-[#292825]
                                                    "
                                                >
                                                    Sair
                                                </button>

                                            </div>

                                        )}

                                    </div>


                                    {/* =================================================
                                        BOTÃO ADMIN
                                        Fica separado do dropdown.
                                    ================================================== */}

                                    {usuario?.perfil === 1 && (

                                        <button
                                            type="button"
                                            onClick={() =>
                                                router.push("/admin")
                                            }
                                            title="Painel administrativo"
                                            aria-label="Abrir painel administrativo"
                                            className="
                                                flex
                                                h-9
                                                w-9
                                                cursor-pointer
                                                items-center
                                                justify-center
                                                text-[#B8B5AF]
                                                transition
                                                hover:text-white
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
                                        bg-white
                                        px-6
                                        py-2.5
                                        text-sm
                                        font-medium
                                        text-[#292825]
                                        transition
                                        hover:bg-[#EDEBE6]
                                    "
                                >
                                    Entrar
                                </button>

                            )}

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
                        flex
                        bg-[#F1EFEA]
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
