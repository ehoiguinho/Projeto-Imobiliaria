"use client";

import {Clock, Mail, MessageCircle} from "lucide-react";

export default function AtendimentoPage() {


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
                        <MessageCircle size={20} />
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

    </main>
);

}
