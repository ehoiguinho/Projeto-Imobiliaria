"use client";

import { Building2, Heart, ShieldCheck } from "lucide-react";

export default function SobreNosPage() {

return (
    <main className="min-h-screen bg-slate-50">

        {/* CONTEÚDO */}
        <section className="mx-auto max-w-5xl px-6 py-20 lg:px-8">

            <div className="text-center">

                <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                    Sobre nós
                </p>

                <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
                    Encontre o lugar ideal para chamar de lar.
                </h1>

                <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-500">
                    Somos uma imobiliária dedicada a conectar pessoas
                    aos imóveis que mais combinam com seus objetivos,
                    necessidades e estilo de vida.
                </p>

            </div>

            <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">

                <div className="rounded-2xl bg-white p-7 shadow-sm">

                    <Building2
                        size={30}
                        className="text-blue-600"
                    />

                    <h2 className="mt-5 text-lg font-bold text-slate-900">
                        Bons imóveis
                    </h2>

                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                        Trabalhamos para oferecer opções de imóveis
                        que atendam diferentes necessidades e perfis.
                    </p>

                </div>

                <div className="rounded-2xl bg-white p-7 shadow-sm">

                    <ShieldCheck
                        size={30}
                        className="text-blue-600"
                    />

                    <h2 className="mt-5 text-lg font-bold text-slate-900">
                        Segurança
                    </h2>

                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                        Buscamos proporcionar uma experiência segura,
                        transparente e simples durante todo o processo.
                    </p>

                </div>

                <div className="rounded-2xl bg-white p-7 shadow-sm">

                    <Heart
                        size={30}
                        className="text-blue-600"
                    />

                    <h2 className="mt-5 text-lg font-bold text-slate-900">
                        Atendimento
                    </h2>

                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                        Estamos aqui para ajudar você a encontrar
                        uma opção que realmente faça sentido.
                    </p>

                </div>

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
