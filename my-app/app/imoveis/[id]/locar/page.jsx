"use client";
import { API_URL } from "@/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, FileText, Loader2, MapPin, ShieldCheck, TriangleAlert } from "lucide-react";

export default function LocarImovelPage() {
    const params = useParams();
    const router = useRouter();

    const [imovel, setImovel] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [locando, setLocando] = useState(false);
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");

    async function carregarImovel() {
        try {
            setCarregando(true);
            setErro("");

            const resposta = await fetch(
                `${API_URL}/imovel/${params.id}`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(dados.msg || "Erro ao carregar imóvel");
            }

            setImovel(dados[0] || dados);
        } catch (error) {
            setErro(error?.message || "Erro ao carregar imóvel");
        } finally {
            setCarregando(false);
        }
    }

    async function confirmarLocacao() {
        try {
            setLocando(true);
            setErro("");
            setSucesso("");

            const resposta = await fetch(
                `${API_URL}/locacao`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        id: params.id,
                    }),
                }
            );

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(dados.msg || "Erro ao locar imóvel");
            }

            setSucesso(
                dados.msg || "Imóvel locado com sucesso!"
            );

            setTimeout(() => {
                router.push("/imoveis");
            }, 1500);
        } catch (error) {
            setErro(
                error?.message || "Erro ao realizar a locação"
            );
        } finally {
            setLocando(false);
        }
    }

    useEffect(() => {
        if (params?.id) {
            carregarImovel();
        }
    }, [params?.id]);

    /*
     * LOADING
     */
    if (carregando) {
        return (
            <main className="min-h-screen bg-[#F7F5F0]">
                <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
                    <div className="mb-8 h-5 w-36 animate-pulse bg-[#E7E5E0]" />

                    <div className="overflow-hidden border border-[#DDDAD3] bg-white">
                        <div className="border-b border-[#E3E0D9] px-6 py-8 sm:px-8">
                            <div className="h-3 w-28 animate-pulse bg-[#E7E5E0]" />

                            <div className="mt-4 h-10 w-2/3 animate-pulse bg-[#E7E5E0]" />

                            <div className="mt-3 h-5 w-1/2 animate-pulse bg-[#E7E5E0]" />
                        </div>

                        <div className="p-6 sm:p-8">
                            <div className="h-44 animate-pulse bg-[#F0EEE9]" />

                            <div className="mt-10 grid gap-4 md:grid-cols-3">
                                <div className="h-40 animate-pulse bg-[#F0EEE9]" />
                                <div className="h-40 animate-pulse bg-[#F0EEE9]" />
                                <div className="h-40 animate-pulse bg-[#F0EEE9]" />
                            </div>

                            <div className="mt-8 h-14 animate-pulse bg-[#E7E5E0]" />
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    /*
     * ERRO
     */
    if (erro && !imovel) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#F7F5F0] px-6">
                <div className="w-full max-w-lg border border-[#DDDAD3] bg-white p-10 text-center">
                    <TriangleAlert
                        size={40}
                        strokeWidth={1.4}
                        className="mx-auto text-[#77746E]"
                    />

                    <h1 className="mt-6 text-2xl font-medium tracking-[-0.02em] text-[#292825]">
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
            </main>
        );
    }

    if (!imovel) {
        return null;
    }

    const disponivel = imovel.disponivel === "S";

    return (
        <main className="min-h-screen bg-white">
            <section className="mx-auto max-w-5xl px-6 py-10 lg:px-8 lg:py-14">
                {/* Voltar */}
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="mb-8 inline-flex cursor-pointer items-center gap-2 text-sm text-[#77746E] transition-colors hover:text-[#292825]"
                >
                    <ArrowLeft
                        size={16}
                        strokeWidth={1.8}
                    />

                    Voltar para o imóvel
                </button>

                <section className="overflow-hidden border border-[#DDDAD3] bg-white">
                    {/* Cabeçalho */}
                    <div className="border-b border-[#E3E0D9] bg-[#F7F5F0] px-6 py-8 sm:px-8">
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8A8883]">
                            Locação
                        </p>

                        <h1 className="mt-3 text-3xl font-medium tracking-[-0.03em] text-[#292825] sm:text-4xl">
                            Realizar locação
                        </h1>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#77746E] sm:text-base">
                            Confira os dados do imóvel antes de confirmar
                            sua solicitação de locação.
                        </p>
                    </div>

                    <div className="p-6 sm:p-8">
                        {/* Imóvel selecionado */}
                        <div className="border border-[#E3E0D9] bg-white p-6 sm:p-7">
                            <div className="flex flex-col gap-7 sm:flex-row sm:items-start sm:justify-between">
                                <div className="max-w-2xl">
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8A8883]">
                                        Imóvel selecionado
                                    </p>

                                    <h2 className="mt-3 text-2xl font-medium tracking-[-0.025em] text-[#292825]">
                                        {imovel.descricao}
                                    </h2>

                                    <div className="mt-5 flex items-start gap-3 text-sm text-[#77746E]">
                                        <MapPin
                                            size={19}
                                            strokeWidth={1.5}
                                            className="mt-0.5 shrink-0"
                                        />

                                        <div className="leading-6">
                                            <p>
                                                {imovel.endereco}, {imovel.bairro}
                                                {imovel.cidade
                                                    ? `, ${imovel.cidade}`
                                                    : ""}
                                            </p>

                                            <p className="mt-3 text-sm text-[#8A8883]">
                                              CEP: {imovel.cep}
                                          </p>
                                        </div>
                                    </div>

                        
                                </div>

                                <div className="shrink-0 border-t border-[#E3E0D9] pt-5 sm:border-0 sm:pt-0 sm:text-right">
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8A8883]">
                                        Valor mensal
                                    </p>

                                    <strong className="mt-2 block text-3xl font-medium tracking-[-0.03em] text-[#292825]">
                                        {Number(
                                            imovel.valor
                                        ).toLocaleString(
                                            "pt-BR",
                                            {
                                                style: "currency",
                                                currency: "BRL",
                                            }
                                        )}
                                    </strong>

                                    <span className="mt-1 block text-sm text-[#8A8883]">
                                        por mês
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="mt-6 flex items-center gap-2">
                            <span
                                className={`h-2 w-2 rounded-full ${
                                    disponivel
                                        ? "bg-[#55534E]"
                                        : "bg-[#A19E98]"
                                }`}
                            />

                            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#77746E]">
                                {disponivel
                                    ? "Imóvel disponível"
                                    : "Imóvel indisponível"}
                            </span>
                        </div>

                        {/* O que acontece */}
                        <div className="mt-10">
                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8A8883]">
                                Próximas etapas
                            </p>

                            <h2 className="mt-3 text-2xl font-medium tracking-[-0.02em] text-[#292825]">
                                O que acontece ao confirmar?
                            </h2>

                            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                                {/* Contrato */}
                                <div className="border border-[#E3E0D9] bg-white p-6">
                                    <div className="flex h-11 w-11 items-center justify-center text-[#55534E]">
                                        <FileText
                                            size={24}
                                            strokeWidth={1.4}
                                        />
                                    </div>

                                    <h3 className="mt-5 text-base font-medium text-[#292825]">
                                        Contrato
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-[#77746E]">
                                        Um contrato de locação será criado
                                        automaticamente.
                                    </p>
                                </div>

                                {/* Parcelas */}
                                <div className="border border-[#E3E0D9] bg-white p-6">
                                    <div className="flex h-11 w-11 items-center justify-center text-[#55534E]">
                                        <span className="text-2xl font-light">
                                            12
                                        </span>
                                    </div>

                                    <h3 className="mt-5 text-base font-medium text-[#292825]">
                                        12 parcelas
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-[#77746E]">
                                        Serão geradas 12 parcelas referentes
                                        ao período da locação.
                                    </p>
                                </div>

                                {/* Registro */}
                                <div className="border border-[#E3E0D9] bg-white p-6">
                                    <div className="flex h-11 w-11 items-center justify-center text-[#55534E]">
                                        <ShieldCheck
                                            size={24}
                                            strokeWidth={1.4}
                                        />
                                    </div>

                                    <h3 className="mt-5 text-base font-medium text-[#292825]">
                                        Locação registrada
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-[#77746E]">
                                        Após a confirmação, a locação será
                                        registrada no sistema.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Aviso */}
                        <div className="mt-8 border border-[#DDDAD3] bg-[#F7F5F0] p-5">
                            <div className="flex gap-3">
                                <TriangleAlert
                                    size={19}
                                    strokeWidth={1.5}
                                    className="mt-0.5 shrink-0 text-[#77746E]"
                                />

                                <div>
                                    <p className="text-sm font-semibold text-[#292825]">
                                        Antes de confirmar
                                    </p>

                                    <p className="mt-1 text-sm leading-6 text-[#77746E]">
                                        Certifique-se de que os dados e o
                                        valor do imóvel estão corretos. A
                                        confirmação criará o contrato e as
                                        parcelas de aluguel.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Erro */}
                        {erro && (
                            <div className="mt-6 border border-[#D6D2CB] bg-[#F5F3EF] p-4">
                                <div className="flex gap-3">
                                    <TriangleAlert
                                        size={19}
                                        strokeWidth={1.5}
                                        className="mt-0.5 shrink-0 text-[#77746E]"
                                    />

                                    <p className="text-sm leading-6 text-[#55534E]">
                                        {erro}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Sucesso */}
                        {sucesso && (
                            <div className="mt-6 border border-[#D6D2CB] bg-[#F5F3EF] p-4">
                                <div className="flex gap-3">
                                    <Check
                                        size={19}
                                        strokeWidth={1.8}
                                        className="mt-0.5 shrink-0 text-[#55534E]"
                                    />

                                    <div>
                                        <p className="text-sm font-semibold text-[#292825]">
                                            Locação confirmada
                                        </p>

                                        <p className="mt-1 text-sm leading-6 text-[#77746E]">
                                            {sucesso}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Botões */}
                        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                disabled={locando}
                                className="cursor-pointer border border-[#D8D5CE] bg-white px-6 py-3.5 text-sm font-medium text-[#55534E] transition-colors hover:bg-[#F7F5F0] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                onClick={confirmarLocacao}
                                disabled={
                                    locando || !disponivel
                                }
                                className="group inline-flex cursor-pointer items-center justify-center gap-3 bg-[#292825] px-7 py-3.5 text-sm font-medium text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {locando ? (
                                    <>
                                        <Loader2
                                            size={17}
                                            className="animate-spin"
                                        />

                                        Confirmando...
                                    </>
                                ) : (
                                    <>
                                        Confirmar locação

                                        <ArrowRight
                                            size={17}
                                            strokeWidth={1.7}
                                            className="transition-transform duration-200 group-hover:translate-x-1"
                                        />
                                    </>
                                )}
                            </button>
                        </div>

                        {!disponivel && (
                            <p className="mt-4 text-center text-sm text-[#77746E]">
                                Este imóvel não está disponível para locação.
                            </p>
                        )}
                    </div>
                </section>
            </section>

            {/* Footer Vitta */}
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
