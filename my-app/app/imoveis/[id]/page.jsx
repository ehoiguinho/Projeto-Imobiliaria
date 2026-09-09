
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    ArrowRight,
    Building2,
    Image as ImageIcon,
    MapPin,
} from "lucide-react";

export default function ImovelDetalhes() {
    const params = useParams();
    const router = useRouter();

    const [imovel, setImovel] = useState(null);
    const [imagens, setImagens] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        if (!params?.id) return;

        async function carregarDados() {
            try {
                setCarregando(true);
                setErro("");

                const respostaImovel = await fetch(
                    `http://localhost:3000/imovel/${params.id}`,
                    {
                        credentials: "include",
                    }
                );

                if (!respostaImovel.ok) {
                    throw new Error("Não foi possível carregar o imóvel.");
                }

                const dadosImovel = await respostaImovel.json();

                setImovel(dadosImovel[0] || dadosImovel);

                const respostaImagens = await fetch(
                    `http://localhost:3000/imovel/${params.id}/imagem`,
                    {
                        credentials: "include",
                    }
                );

                if (respostaImagens.ok) {
                    const dadosImagens = await respostaImagens.json();
                    setImagens(dadosImagens);
                }
            } catch (error) {
                setErro(
                    error?.message ||
                        "Ocorreu um erro ao carregar os dados do imóvel."
                );
            } finally {
                setCarregando(false);
            }
        }

        carregarDados();
    }, [params?.id]);

    if (carregando) {
        return (
            <main className="min-h-screen bg-[#F7F5F0]">
                <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
                    <div className="mb-10 h-5 w-32 animate-pulse rounded bg-[#E7E5E0]" />

                    <div className="grid gap-10 lg:grid-cols-[1.4fr_0.8fr]">
                        <div className="h-[520px] animate-pulse rounded bg-[#E7E5E0]" />

                        <div className="space-y-6">
                            <div className="h-6 w-32 animate-pulse rounded bg-[#E7E5E0]" />
                            <div className="h-12 w-4/5 animate-pulse rounded bg-[#E7E5E0]" />
                            <div className="h-8 w-40 animate-pulse rounded bg-[#E7E5E0]" />

                            <div className="space-y-3 pt-6">
                                <div className="h-20 animate-pulse rounded bg-[#E7E5E0]" />
                                <div className="h-20 animate-pulse rounded bg-[#E7E5E0]" />
                                <div className="h-20 animate-pulse rounded bg-[#E7E5E0]" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (erro) {
        return (
            <main className="min-h-screen bg-[#F7F5F0]">
                <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-6">
                    <div className="w-full border border-[#DDDAD3] bg-white p-10 text-center">
                        <Building2
                            size={38}
                            strokeWidth={1.4}
                            className="mx-auto mb-5 text-[#8A8883]"
                        />

                        <h1 className="text-2xl font-medium tracking-[-0.02em] text-[#292825]">
                            Não foi possível carregar o imóvel
                        </h1>

                        <p className="mt-3 text-sm leading-6 text-[#77746E]">
                            {erro}
                        </p>

                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="mt-8 inline-flex cursor-pointer items-center gap-2 bg-[#292825] px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-80"
                        >
                            <ArrowLeft size={16} />
                            Voltar
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    if (!imovel) {
        return (
            <main className="min-h-screen bg-[#F7F5F0]">
                <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-6">
                    <div className="w-full border border-[#DDDAD3] bg-white p-10 text-center">
                        <Building2
                            size={38}
                            strokeWidth={1.4}
                            className="mx-auto mb-5 text-[#8A8883]"
                        />

                        <h1 className="text-2xl font-medium tracking-[-0.02em] text-[#292825]">
                            Imóvel não encontrado
                        </h1>

                        <p className="mt-3 text-sm text-[#77746E]">
                            O imóvel solicitado não está disponível.
                        </p>

                        <Link
                            href="/imoveis"
                            className="mt-8 inline-flex items-center gap-2 bg-[#292825] px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-80"
                        >
                            <ArrowLeft size={16} />
                            Ver imóveis
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    const disponivel = imovel.disponivel === "S";

    const imagemPrincipal =
        imagens.length > 0
            ? `http://localhost:3000${imagens[0].caminho}`
            : null;

    return (
        <main className="min-h-screen bg-white">
            {/* Conteúdo principal */}
            <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
                {/* Voltar */}
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="mb-8 inline-flex cursor-pointer items-center gap-2 text-sm text-[#77746E] transition-colors hover:text-[#292825]"
                >
                    <ArrowLeft size={16} strokeWidth={1.8} />
                    Voltar para imóveis
                </button>

                <div className="grid gap-10 lg:grid-cols-[1.35fr_0.85fr] lg:gap-14">
                    {/* Galeria principal */}
                    <div>
                        <div className="overflow-hidden bg-[#E7E5E0]">
                            {imagemPrincipal ? (
                                <img
                                    src={imagemPrincipal}
                                    alt={imovel.descricao || "Imagem do imóvel"}
                                    className="h-[420px] w-full object-cover sm:h-[520px]"
                                />
                            ) : (
                                <div className="flex h-[420px] items-center justify-center sm:h-[520px]">
                                    <div className="text-center">
                                        <ImageIcon
                                            size={42}
                                            strokeWidth={1.2}
                                            className="mx-auto text-[#8A8883]"
                                        />
                                        <p className="mt-3 text-sm text-[#8A8883]">
                                            Imagem não disponível
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Galeria secundária */}
                        {imagens.length > 1 && (
                            <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
                                {imagens.slice(1).map((imagem) => (
                                    <div
                                        key={imagem.id}
                                        className="overflow-hidden bg-[#E7E5E0]"
                                    >
                                        <img
                                            src={`http://localhost:3000${imagem.caminho}`}
                                            alt="Imagem adicional do imóvel"
                                            className="h-20 w-full object-cover sm:h-24"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Informações */}
                    <div className="flex flex-col">
                        {/* Status */}
                        <div className="mb-5 flex items-center gap-2">
                            <span
                                className={`h-2 w-2 rounded-full ${
                                    disponivel
                                        ? "bg-[#55534E]"
                                        : "bg-[#A19E98]"
                                }`}
                            />

                            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#77746E]">
                                {disponivel ? "Disponível" : "Indisponível"}
                            </span>
                        </div>

                        {/* Título */}
                        <h1 className="text-3xl font-medium leading-tight tracking-[-0.03em] text-[#292825] sm:text-4xl">
                            {imovel.descricao || "Imóvel"}
                        </h1>

                        {/* Localização */}
                        <div className="mt-5 flex items-start gap-3 text-[#77746E]">
                            <MapPin
                                size={19}
                                strokeWidth={1.5}
                                className="mt-0.5 shrink-0"
                            />

                            <div className="text-sm leading-6">
                                <p>{imovel.endereco}</p>

                                {imovel.bairro && (
                                    <p>
                                        {imovel.bairro}
                                        {imovel.cidade
                                            ? `, ${imovel.cidade}`
                                            : ""}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Preço */}
                        <div className="mt-8 border-y border-[#E3E0D9] py-6">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8A8883]">
                                Aluguel mensal
                            </p>

                            <p className="mt-2 text-3xl font-medium tracking-[-0.03em] text-[#292825]">
                                {Number(imovel.valor).toLocaleString(
                                    "pt-BR",
                                    {
                                        style: "currency",
                                        currency: "BRL",
                                    }
                                )}
                            </p>
                        </div>

                        {/* Informações */}
                        <div className="mt-7 space-y-3">
                            <div className="flex items-center justify-between border border-[#E3E0D9] bg-[#FCFBF8] px-5 py-4">
                                <span className="text-sm text-[#77746E]">
                                    CEP
                                </span>

                                <span className="text-sm font-medium text-[#292825]">
                                    {imovel.cep || "Não informado"}
                                </span>
                            </div>

                            <div className="flex items-center justify-between border border-[#E3E0D9] bg-[#FCFBF8] px-5 py-4">
                                <span className="text-sm text-[#77746E]">
                                    Cidade
                                </span>

                                <span className="text-sm font-medium text-[#292825]">
                                    {imovel.cidade || "Não informado"}
                                </span>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="mt-8">
                            {disponivel ? (
                                <Link
                                    href={`/imoveis/${imovel.id}/locar`}
                                    className="group flex w-full cursor-pointer items-center justify-center gap-3 bg-[#292825] px-6 py-4 text-sm font-medium text-white transition-opacity hover:opacity-85"
                                >
                                    Quero alugar este imóvel
                                    <ArrowRight
                                        size={17}
                                        strokeWidth={1.7}
                                        className="transition-transform duration-200 group-hover:translate-x-1"
                                    />
                                </Link>
                            ) : (
                                <span className="flex w-full items-center justify-center border border-[#D8D5CE] bg-[#EDEBE6] px-6 py-4 text-sm font-medium text-[#8A8883]">
                                    Imóvel indisponível
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Rodapé */}
            <footer className="bg-[#F7F5F0] text-black">
                <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
                    <div className="grid gap-10 md:grid-cols-3">
                        {/* Logo */}
                        <div>
                            <Link
                                href="/"
                                className="inline-flex items-center gap-3"
                            >
                                <span className="flex h-10 w-10 items-center justify-center bg-white text-lg font-semibold text-[#292825]">
                                    V
                                </span>

                                <span>
                                    <span className="block text-lg font-semibold tracking-[0.08em]">
                                        VITTA
                                    </span>

                                    <span className="block text-[9px] tracking-[0.28em] text-[#A19E98]">
                                        IMOBILIÁRIA
                                    </span>
                                </span>
                            </Link>

                            <p className="mt-5 max-w-xs text-sm leading-6 text-[#A19E98]">
                                Encontrar um imóvel é encontrar seu lugar.
                            </p>
                        </div>

                        <div>

                            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#292825]">
                                Navegação
                            </h3>

                            <div className="mt-5 flex flex-col gap-3">

                                <button
                                    type="button"
                                    onClick={() =>
                                        router.push("/")
                                    }
                                    className="text-left text-sm text-[#77746E] transition hover:text-[#292825]"
                                >
                                    Início
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        router.push("/imoveis")
                                    }
                                    className="text-left text-sm text-[#77746E] transition hover:text-[#292825]"
                                >
                                    Imóveis
                                </button>

                                
                                    <button
                                        type="button"
                                        onClick={() =>
                                            router.push("/login")
                                        }
                                        className="text-left text-sm text-[#77746E] transition hover:text-[#292825]"
                                    >
                                        Entrar
                                    </button>
                            </div>
                        </div>

                        <div>

                            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#292825]">
                                Atendimento
                            </h3>

                            <div className="mt-5 flex flex-col gap-3 text-sm text-[#77746E]">

                                <span>
                                    Segunda a sexta 08:00 às 18:00

                                </span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        router.push("/atendimento")
                                    }
                                    className="text-left transition hover:text-[#292825]"
                                >
                                    Fale conosco →
                                </button>

                            </div>

                        </div>

                    </div>

                    <div className="mt-12 border-t border-[#E7E5E0] pt-6">
                        <p className="text-xs text-[#8A8883]">
                            © {new Date().getFullYear()} Vitta Imobiliária.
                            Todos os direitos reservados.
                        </p>
                    </div>
                </div>
            </footer>
        </main>
    );
}
