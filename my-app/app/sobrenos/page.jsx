"use client";

import { Building2, Heart, ShieldCheck } from "lucide-react";

export default function SobreNosPage() {

return (
    <main className="min-h-screen bg-slate-50">

        {/* HEADER */}
        <header className="border-b border-slate-200 bg-white">

            <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">

                <a
                    href="/"
                    className="flex items-center gap-2"
                >

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-white">
                        <Building2 size={20} />
                    </div>

                    <span className="font-semibold text-zinc-900">
                        Sua Imobiliária
                    </span>

                </a>

                <a
                    href="/imoveis"
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                    Ver imóveis
                </a>

            </nav>

        </header>

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

    </main>
);

}
