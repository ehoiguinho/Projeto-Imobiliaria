"use client";

import { MapPin, Building2, CircleDollarSign, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
    const router = useRouter();

    const [cidade, setCidade] = useState("");
    const [bairro, setBairro] = useState("");
    const [valorMin, setValorMin] = useState("");
    const [valorMax, setValorMax] = useState("");

    function buscarImoveis(e) {
        e.preventDefault();

        const params = new URLSearchParams();

        if (cidade.trim()) {
            params.set("cidade", cidade.trim());
        }

        if (bairro.trim()) {
            params.set("bairro", bairro.trim());
        }

        if (valorMin) {
            params.set("min", valorMin);
        }

        if (valorMax) {
            params.set("max", valorMax);
        }

        router.push(`/imoveis?${params.toString()}`);
    }

    return (
        <main className="min-h-screen bg-white text-zinc-900">

            {/* NAVBAR */}
            <nav className="h-20 w-full border-b border-zinc-100 bg-white">
                <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 lg:px-8">

                    {/* LOGO */}
                    <a
                        href="/"
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

                        <span className="text-xl font-semibold tracking-tight">
                            Sua Imobiliária
                        </span>
                    </a>

                    {/* MENU */}
                    <div className="flex items-center gap-3">
                        <a
                            href="/login"
                            className="rounded-full border border-zinc-200 px-6 py-2.5 text-sm font-medium transition hover:bg-zinc-50"
                        >
                            Entrar
                        </a>
                    </div>

                </div>
            </nav>


            {/* HERO */}
            <section className="relative min-h-[calc(100vh-80px)] overflow-hidden">

                {/* IMAGEM DE FUNDO */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: "url('/images/home.jpg')",
                    }}
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-black/35" />


                {/* CONTEÚDO */}
                <div className="relative z-10 flex min-h-[calc(100vh-80px)] items-center">

                    <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">

                        {/* CARD DE BUSCA */}
                        <div className="w-full max-w-md">

                            <form
                                onSubmit={buscarImoveis}
                                className="rounded-2xl bg-white p-7 shadow-2xl"
                            >

                                {/* TÍTULO */}
                                <div className="mb-7">

                                    <h1 className="text-3xl font-bold leading-tight text-zinc-900">
                                        Encontre o lugar ideal para chamar de lar.
                                    </h1>

                                </div>


                                {/* CAMPOS */}
                                <div className="flex flex-col gap-5">

                                    {/* CIDADE */}
                                    <div>
                                        <label
                                            htmlFor="cidade"
                                            className="mb-2 flex items-center gap-2 text-sm font-semibold text-zinc-700"
                                        >
                                            <MapPin
                                                size={18}
                                                strokeWidth={2}
                                                className="text-blue-600"
                                            />

                                            Cidade
                                        </label>

                                        <input
                                            id="cidade"
                                            type="text"
                                            value={cidade}
                                            onChange={(e) => setCidade(e.target.value)}
                                            placeholder="Digite a cidade"
                                            className="w-full rounded-lg border border-zinc-300 px-4 py-3 text-sm
                                                       outline-none transition
                                                       placeholder:text-zinc-400
                                                       focus:border-blue-500
                                                       focus:ring-2 focus:ring-blue-500/20"
                                        />
                                    </div>


                                    {/* BAIRRO */}
                                    <div>
                                        <label
                                            htmlFor="bairro"
                                            className="mb-2 flex items-center gap-2 text-sm font-semibold text-zinc-700"
                                        >
                                            <Building2
                                                size={18}
                                                strokeWidth={2}
                                                className="text-blue-600"
                                            />

                                            Bairro
                                        </label>

                                        <input
                                            id="bairro"
                                            type="text"
                                            value={bairro}
                                            onChange={(e) => setBairro(e.target.value)}
                                            placeholder="Digite o bairro"
                                            className="w-full rounded-lg border border-zinc-300 px-4 py-3 text-sm
                                                       outline-none transition
                                                       placeholder:text-zinc-400
                                                       focus:border-blue-500
                                                       focus:ring-2 focus:ring-blue-500/20"
                                        />
                                    </div>


                                    {/* VALOR MÍNIMO */}
                                    <div>
                                        <label
                                            htmlFor="valorMin"
                                            className="mb-2 flex items-center gap-2 text-sm font-semibold text-zinc-700"
                                        >
                                            <CircleDollarSign
                                                size={18}
                                                strokeWidth={2}
                                                className="text-blue-600"
                                            />

                                            Valor mínimo
                                        </label>

                                        <input
                                            id="valorMin"
                                            type="number"
                                            min="0"
                                            value={valorMin}
                                            onChange={(e) => setValorMin(e.target.value)}
                                            placeholder="R$ 0,00"
                                            className="w-full rounded-lg border border-zinc-300 px-4 py-3 text-sm
                                                       outline-none transition
                                                       placeholder:text-zinc-400
                                                       focus:border-blue-500
                                                       focus:ring-2 focus:ring-blue-500/20"
                                        />
                                    </div>


                                    {/* VALOR MÁXIMO */}
                                    <div>
                                        <label
                                            htmlFor="valorMax"
                                            className="mb-2 flex items-center gap-2 text-sm font-semibold text-zinc-700"
                                        >
                                            <CircleDollarSign
                                                size={18}
                                                strokeWidth={2}
                                                className="text-blue-600"
                                            />

                                            Valor máximo
                                        </label>

                                        <input
                                            id="valorMax"
                                            type="number"
                                            min="0"
                                            value={valorMax}
                                            onChange={(e) => setValorMax(e.target.value)}
                                            placeholder="R$ 0,00"
                                            className="w-full rounded-lg border border-zinc-300 px-4 py-3 text-sm
                                                       outline-none transition
                                                       placeholder:text-zinc-400
                                                       focus:border-blue-500
                                                       focus:ring-2 focus:ring-blue-500/20"
                                        />
                                    </div>


                                    {/* BOTÃO */}
                                    <button
                                        type="submit"
                                        className="mt-1 flex w-full items-center justify-center gap-2
                                                   rounded-lg bg-blue-600 py-3
                                                   text-sm font-semibold text-white
                                                   transition hover:bg-blue-700
                                                   focus:outline-none focus:ring-2
                                                   focus:ring-blue-500 focus:ring-offset-2"
                                    >
                                        <Search size={19} />

                                        Buscar imóveis
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                </div>

            </section>

        </main>
    );
}