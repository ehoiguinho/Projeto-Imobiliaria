"use client";

import {
    MapPin,
    Building2,
    CircleDollarSign,
    Search
} from "lucide-react";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {

    const router = useRouter();

    const [cidade, setCidade] = useState("");
    const [bairro, setBairro] = useState("");
    const [valorMin, setValorMin] = useState("");
    const [valorMax, setValorMax] = useState("");

    const [imoveisDestaque, setImoveisDestaque] = useState([]);
    const [carregandoDestaques, setCarregandoDestaques] = useState(true);

    useEffect(() => {

        async function carregarDestaques() {

            try {

                const response = await fetch(
                    "http://localhost:3000/imovel/destaques"
                );

                if (!response.ok) {
                    throw new Error(
                        "Erro ao carregar imóveis em destaque."
                    );
                }

                const data = await response.json();

                setImoveisDestaque(data);

            } catch (error) {

                console.error(
                    "Erro ao carregar imóveis em destaque:",
                    error
                );

            } finally {

                setCarregandoDestaques(false);

            }
        }

        carregarDestaques();

    }, []);

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

                    <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">

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
                                            onChange={(e) =>
                                                setCidade(e.target.value)
                                            }
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
                                            onChange={(e) =>
                                                setBairro(e.target.value)
                                            }
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
                                            onChange={(e) =>
                                                setValorMin(e.target.value)
                                            }
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
                                            onChange={(e) =>
                                                setValorMax(e.target.value)
                                            }
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
                                                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    >

                                        Buscar imóveis

                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                </div>

            </section>

            {/* IMÓVEIS EM DESTAQUE */}
            <section className="bg-white py-20">

                <div className="mx-auto max-w-7xl px-6 lg:px-8">

                    {/* TÍTULO */}
                    <div className="mb-10">

                        <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
                            Imóveis em destaque
                        </h2>

                        <p className="mt-2 text-zinc-500">
                            Confira algumas das melhores opções disponíveis.
                        </p>

                    </div>

                    {/* CARREGANDO */}
                    {carregandoDestaques && (

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

                            {[1, 2, 3].map((item) => (

                                <div
                                    key={item}
                                    className="h-[390px] animate-pulse rounded-2xl bg-zinc-100"
                                />

                            ))}

                        </div>

                    )}

                    {/* IMÓVEIS */}
                    {!carregandoDestaques &&
                        imoveisDestaque.length > 0 && (

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

                                {imoveisDestaque.map((imovel) => {

                                    const imagem = imovel.imagem?.caminho
                                        ? `http://localhost:3000${imovel.imagem.caminho}`
                                        : null;

                                    return (

                                        <a
                                            key={imovel.id}
                                            href={`/imoveis/${imovel.id}`}
                                            className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                                        >

                                            {/* IMAGEM */}
                                            <div className="relative h-64 overflow-hidden bg-zinc-100">

                                                {imagem ? (

                                                    <img
                                                        src={imagem}
                                                        alt={imovel.descricao}
                                                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                                    />

                                                ) : (

                                                    <div className="flex h-full w-full items-center justify-center bg-zinc-100">

                                                        <div className="text-center">

                                                            <Building2
                                                                size={42}
                                                                className="mx-auto text-zinc-300"
                                                            />

                                                            <p className="mt-2 text-sm text-zinc-400">
                                                                Imagem não disponível
                                                            </p>

                                                        </div>

                                                    </div>

                                                )}

                                            </div>

                                            {/* INFORMAÇÕES */}
                                            <div className="p-5">

                                                <p className="text-xl font-bold text-zinc-900">

                                                    R${" "}
                                                    {Number(imovel.valor).toLocaleString(
                                                        "pt-BR",
                                                        {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2
                                                        }
                                                    )}

                                                </p>

                                                <h3 className="mt-2 line-clamp-1 text-lg font-semibold text-zinc-900">
                                                    {imovel.descricao}
                                                </h3>

                                                <p className="mt-2 text-sm text-zinc-500">
                                                    {imovel.bairro}, {imovel.cidade}
                                                </p>

                                                <p className="mt-1 text-sm text-zinc-400">
                                                    {imovel.endereco}
                                                </p>

                                            </div>

                                        </a>

                                    );

                                })}

                                {/* BOTÃO */}
                                <div className="col-span-1 mt-2 flex justify-center md:col-span-2 lg:col-span-3">

                                    <a
                                        href="/imoveis"
                                        className="rounded-full bg-zinc-900 px-7 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700"
                                    >
                                        Buscar mais imóveis
                                    </a>

                                </div>

                            </div>

                        )}

                    {/* NENHUM IMÓVEL */}
                    {!carregandoDestaques &&
                        imoveisDestaque.length === 0 && (

                            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-10 text-center">

                                <p className="text-zinc-500">
                                    Nenhum imóvel disponível no momento.
                                </p>

                            </div>

                        )}

                </div>

            </section>

            {/* FOOTER */}
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
