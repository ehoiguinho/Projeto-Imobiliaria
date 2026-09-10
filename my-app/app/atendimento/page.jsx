"use client";

import { useEffect, useRef, useState } from "react";
import { Clock, Mail, MessageCircle, ArrowRight } from "lucide-react";

export default function AtendimentoPage() {
    const [cardsVisiveis, setCardsVisiveis] = useState(false);
    const cardsRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setCardsVisiveis(true);
                    observer.disconnect();
                }
            },
            {
                threshold: 0.2,
            }
        );

        if (cardsRef.current) {
            observer.observe(cardsRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <main className="min-h-screen bg-[#F7F5F0] text-[#292825]">

            {/* =========================================================
                HERO
            ========================================================= */}

            <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">

                <div className="max-w-4xl">

                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8A8883]">
                        Atendimento
                    </p>

                    <h1 className="mt-5 text-5xl font-medium leading-[1.05] tracking-[-0.04em] text-black sm:text-6xl lg:text-7xl">
                        Estamos aqui para
                        <span className="block text-[#8A8883]">
                            ajudar você.
                        </span>
                    </h1>

                    <p className="mt-6 max-w-2xl text-base leading-7 text-[#8A8883] sm:text-lg">
                        Precisa de ajuda para encontrar um imóvel, tirar uma
                        dúvida ou entender melhor nossos serviços? Entre em
                        contato com a Vitta.
                    </p>

                </div>

            </section>


            {/* =========================================================
                CANAIS DE ATENDIMENTO
            ========================================================= */}

            <section className="border-y border-[#E7E5E0] bg-white">

                <div className="mx-auto max-w-5xl px-6 py-16 lg:px-8 lg:py-20">

                    <div
                        ref={cardsRef}
                        className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[#E7E5E0] bg-[#E7E5E0] md:grid-cols-3"
                    >

                        {/* =================================================
                            E-MAIL
                        ================================================= */}

                        <div
                            className={`group bg-white p-8 transition-all duration-700 hover:-translate-y-1 ${
                                cardsVisiveis
                                    ? "translate-y-0 opacity-100"
                                    : "-translate-y-8 opacity-0"
                            }`}
                        >

                            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E7E5E0] text-[#292825] transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[#CFCBC3]">

                                <Mail
                                    size={20}
                                    strokeWidth={1.7}
                                />

                            </div>

                            <h2 className="mt-6 text-lg font-semibold text-[#171614]">
                                E-mail
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-[#77746F]">
                                Envie sua mensagem e fale diretamente
                                com nossa equipe.
                            </p>

                            <p className="mt-5 text-sm font-bold text-[#292825]">
                                contato@vittaimobiliaria.com
                            </p>

                        </div>


                        {/* =================================================
                            HORÁRIO
                        ================================================= */}

                        <div
                            className={`group bg-white p-8 transition-all delay-100 duration-700 hover:-translate-y-1 ${
                                cardsVisiveis
                                    ? "translate-y-0 opacity-100"
                                    : "translate-y-8 opacity-0"
                            }`}
                        >

                            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E7E5E0] text-[#292825] transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[#CFCBC3]">

                                <Clock
                                    size={20}
                                    strokeWidth={1.7}
                                />

                            </div>

                            <h2 className="mt-6 text-lg font-semibold text-[#171614]">
                                Horário
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-[#77746F]">
                                Nossa equipe está disponível
                                para atender você.
                            </p>

                            <p className="mt-5 text-sm font-bold leading-6 text-[#292825]">
                                Segunda a sexta 08:00 às 18:00
                            </p>

                        </div>


                        {/* =================================================
                            SUPORTE
                        ================================================= */}

                        <div
                            className={`group bg-white p-8 transition-all delay-200 duration-700 hover:-translate-y-1 ${
                                cardsVisiveis
                                    ? "translate-y-0 opacity-100"
                                    : "translate-y-8 opacity-0"
                            }`}
                        >

                            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E7E5E0] text-[#292825] transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[#CFCBC3]">

                                <MessageCircle
                                    size={20}
                                    strokeWidth={1.7}
                                />

                            </div>

                            <h2 className="mt-6 text-lg font-semibold text-[#171614]">
                                Suporte
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-[#77746F]">
                                Estamos disponíveis para esclarecer
                                suas dúvidas e orientar você.
                            </p>

                            <a
                                href="mailto:contato@vittaimobiliaria.com"
                                className="group/contact mt-5 inline-flex w-fit shrink-0 cursor-pointer items-center gap-3 text-sm font-semibold text-[#292825]"
                            >
                                Entrar em contato

                                <ArrowRight
                                    size={17}
                                    strokeWidth={1.8}
                                    className="transition-transform duration-300 group-hover/contact:translate-x-1"
                                />

                            </a>

                        </div>

                    </div>

                </div>

            </section>


            {/* =========================================================
                FOOTER
            ========================================================= */}

            <footer className="bg-[#F7F5F0]">

                <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

                    <div className="grid grid-cols-1 gap-12 md:grid-cols-4">

                        {/* MARCA */}

                        <div className="md:col-span-2">

                            <a
                                href="/"
                                className="inline-block"
                            >

                                <span className="block text-2xl font-semibold tracking-[0.16em] text-[#292825]">
                                    VITTA
                                </span>

                                <span className="mt-1 block text-[9px] font-medium tracking-[0.3em] text-[#8A8883]">
                                    IMOBILIÁRIA
                                </span>

                            </a>

                            <p className="mt-6 max-w-sm text-sm leading-7 text-[#77746E]">
                                Encontre imóveis que combinam com você
                                e descubra um lugar para chamar de lar.
                            </p>

                        </div>


                        {/* NAVEGAÇÃO */}

                        <div>

                            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#292825]">
                                Navegação
                            </h3>

                            <div className="mt-5 flex flex-col gap-3">

                                <a
                                    href="/"
                                    className="text-sm text-[#77746E] transition hover:text-[#292825]"
                                >
                                    Início
                                </a>

                                <a
                                    href="/imoveis"
                                    className="text-sm text-[#77746E] transition hover:text-[#292825]"
                                >
                                    Imóveis
                                </a>

                                <a
                                    href="/sobrenos"
                                    className="text-sm text-[#77746E] transition hover:text-[#292825]"
                                >
                                    Sobre nós
                                </a>

                                <a
                                    href="/login"
                                    className="text-sm text-[#77746E] transition hover:text-[#292825]"
                                >
                                    Entrar
                                </a>

                            </div>

                        </div>


                        {/* ATENDIMENTO */}

                        <div>

                            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#292825]">
                                Atendimento
                            </h3>

                            <div className="mt-5 flex flex-col gap-3 text-sm text-[#77746E]">

                                <span>
                                    Segunda a sexta 08:00 às 18:00
                                </span>

                                <a
                                    href="/atendimento"
                                    className="transition hover:text-[#292825]"
                                >
                                    Fale conosco →
                                </a>

                            </div>

                        </div>

                    </div>


                    {/* COPYRIGHT */}

                    <div className="mt-12 border-t border-[#E7E5E0] pt-6">

                        <p className="text-center text-xs text-[#A19E98]">
                            © {new Date().getFullYear()} Vitta Imobiliária.
                            Todos os direitos reservados.
                        </p>

                    </div>

                </div>

            </footer>

        </main>
    );
}
