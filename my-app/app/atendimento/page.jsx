"use client";

import { Clock, Mail, MessageCircle, ArrowRight } from "lucide-react";

export default function AtendimentoPage() {
    return (
        <main className="min-h-screen bg-[#F7F5F0] text-[#292825]">

            {/* Hero */}

            <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">

                <div className="max-w-4xl">

                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8A8883]">
                        Atendimento
                    </p>

                    <h1 className="mt-5 text-5xl font-medium leading-[1.05] tracking-[-0.04em] text-[#171614] sm:text-6xl lg:text-7xl">
                        Estamos aqui para
                        <span className="block">
                            ajudar você.
                        </span>
                    </h1>

                    <p className="mt-6 max-w-2xl text-base leading-7 text-[#6F6D68] sm:text-lg">
                        Precisa de ajuda para encontrar um imóvel, tirar uma
                        dúvida ou entender melhor nossos serviços? Entre em
                        contato com a Vitta.
                    </p>

                </div>

            </section>


            {/* Canais de atendimento */}

            <section className="border-y border-[#E7E5E0] bg-white">

                <div className="mx-auto max-w-5xl px-6 py-16 lg:px-8 lg:py-20">

                    <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[#E7E5E0] bg-[#E7E5E0] md:grid-cols-3">

                        {/* E-mail */}

                        <div className="bg-white p-8 transition">

                            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E7E5E0] text-[#292825]">

                                <Mail size={20} strokeWidth={1.7} />

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


                        {/* Horário */}

                        <div className="bg-white p-8 transition">

                            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E7E5E0] text-[#292825]">

                                <Clock size={20} strokeWidth={1.7} />

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


                        {/* Suporte */}

                        <div className="bg-white p-8 transition">

                            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E7E5E0] text-[#292825]">

                                <MessageCircle size={20} strokeWidth={1.7} />

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
                            className="inline-flex w-fit shrink-0 items-center gap-3 px-6 py-6 text-sm font-semibold text-[#292825] cursor-pointer"
                        >
                            Entrar em contato
                            <ArrowRight
                                size={17}
                                strokeWidth={1.8}
                            />

                        </a>

                        </div>

                    </div>

                </div>

            </section>


            {/* Footer */}

            <footer className="bg-[#F7F5F0]">

                <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">

                    <div className="grid grid-cols-1 gap-10 md:grid-cols-3">

                        {/* Marca */}

                        <div>

                            <div className="flex items-center gap-3">

                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#292825] text-white">

                                    <span className="text-sm font-semibold tracking-tight">
                                        V
                                    </span>

                                </div>

                                <div>

                                    <p className="text-sm font-semibold tracking-[0.12em] text-[#171614]">
                                        VITTA
                                    </p>

                                    <p className="text-[9px] font-medium tracking-[0.2em] text-[#8A8883]">
                                        IMOBILIÁRIA
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* Navegação */}

                        <div>

                            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#292825]">
                                Navegação
                            </h3>

                            <div className="mt-5 flex flex-col gap-3 text-sm">

                                <a
                                    href="/"
                                    className="text-[#77746F] transition hover:text-[#171614]"
                                >
                                    Início
                                </a>

                                <a
                                    href="/imoveis"
                                    className="text-[#77746F] transition hover:text-[#171614]"
                                >
                                    Imóveis
                                </a>

                                <a
                                    href="/sobrenos"
                                    className="text-[#77746F] transition hover:text-[#171614]"
                                >
                                    Sobre nós
                                </a>

                                <a
                                    href="/atendimento"
                                    className="text-[#171614] font-medium"
                                >
                                    Atendimento
                                </a>

                            </div>

                        </div>


                        {/* Atendimento */}

                        <div>

                            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#292825]">
                                Atendimento
                            </h3>

                            <div className="mt-5 flex flex-col gap-3 text-sm text-[#77746F]">

                                <span>
                                    Segunda a sexta 8:00 às 18:00
                                </span>

                                <span>
                                    contato@vittaimobiliaria.com
                                </span>

                            </div>

                        </div>

                    </div>


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
