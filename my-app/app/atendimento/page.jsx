"use client";

import {Clock, Mail, MessageCircle} from "lucide-react";

export default function AtendimentoPage() {


return (
    <main className="min-h-screen bg-slate-50">

        {/* CONTEÚDO */}
        <section className="mx-auto max-w-4xl px-6 py-20 lg:px-8">

            <div className="text-center">

                <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                    Atendimento
                </p>

                <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
                    Como podemos ajudar?
                </h1>

                <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500">
                    Entre em contato conosco. Nossa equipe está pronta
                    para ajudar você.
                </p>

            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">

                <div className="rounded-2xl bg-white p-7 text-center shadow-sm">

                    <Mail
                        size={30}
                        className="mx-auto text-blue-600"
                    />

                    <h2 className="mt-4 font-bold text-slate-900">
                        E-mail
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        contato@suaimobiliaria.com
                    </p>

                </div>

                <div className="rounded-2xl bg-white p-7 text-center shadow-sm">

                    <Clock
                        size={30}
                        className="mx-auto text-blue-600"
                    />

                    <h2 className="mt-4 font-bold text-slate-900">
                        Horário
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Segunda a sexta
                        <br />
                        08:00 às 18:00
                    </p>

                </div>

                <div className="rounded-2xl bg-white p-7 text-center shadow-sm">

                    <MessageCircle
                        size={30}
                        className="mx-auto text-blue-600"
                    />

                    <h2 className="mt-4 font-bold text-slate-900">
                        Suporte
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Estamos disponíveis para
                        tirar suas dúvidas.
                    </p>

                </div>

            </div>

            <div className="mt-10 text-center">

                <a
                    href="mailto:contato@suaimobiliaria.com"
                    className="inline-flex rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                    Entrar em contato
                </a>

            </div>

        </section>
        <footer className="border-t border-zinc-200 bg-zinc-100">

                <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">

                    <div className="grid grid-cols-1 gap-10 md:grid-cols-3">

                        {/* EMPRESA */}
                        <div>

                            <div className="flex items-center gap-2">

                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-white">

                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        className="h-5 w-5"
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

                                <span className="font-semibold text-zinc-900">
                                    Sua Imobiliária
                                </span>

                            </div>

                            <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-500">
                                Encontre imóveis que combinam com você e encontre o lugar ideal para chamar de lar.
                            </p>

                        </div>

                        {/* NAVEGAÇÃO */}
                        <div>

                            <h3 className="text-sm font-semibold text-zinc-900">
                                Navegação
                            </h3>

                            <div className="mt-4 flex flex-col gap-3 text-sm">

                                <a
                                    href="/"
                                    className="text-zinc-500 transition hover:text-zinc-900"
                                >
                                    Início
                                </a>

                                <a
                                    href="/imoveis"
                                    className="text-zinc-500 transition hover:text-zinc-900"
                                >
                                    Imóveis
                                </a>

                                <a
                                    href="/login"
                                    className="text-zinc-500 transition hover:text-zinc-900"
                                >
                                    Entrar
                                </a>

                            </div>

                        </div>

                        {/* ATENDIMENTO */}
                        <div>

                            <h3 className="text-sm font-semibold text-zinc-900">
                                Atendimento
                            </h3>

                            <div className="mt-4 flex flex-col gap-3 text-sm text-zinc-500">

                                <span>
                                    Segunda a sexta
                                </span>

                                <span>
                                    08:00 às 18:00
                                </span>

                                <span>
                                    contato@suaimobiliaria.com
                                </span>

                            </div>

                        </div>

                    </div>

                    <div className="mt-12 border-t border-zinc-200 pt-6">

                        <p className="text-center text-sm text-zinc-400">
                            © {new Date().getFullYear()} Sua Imobiliária. Todos os direitos reservados.
                        </p>

                    </div>

                </div>

            </footer>

    </main>
);

}
