"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Building2, Check, ChevronDown, MapPin, Save } from "lucide-react";

export default function EditarImovelPage() {

    const params = useParams();
    const router = useRouter();

    const [imovel, setImovel] = useState({
        descricao: "",
        cep: "",
        endereco: "",
        bairro: "",
        cidade: "",
        valor: "",
        disponivel: "S"
    });

    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");

    useEffect(() => {

        async function buscarImovel() {

            try {

                const resposta = await fetch(
                    `http://localhost:3000/imovel/${params.id}`,
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );

                const dados = await resposta.json();

                if (!resposta.ok) {
                    setErro(
                        dados.msg ||
                        "Não foi possível carregar o imóvel."
                    );
                    return;
                }

                const dadosImovel = Array.isArray(dados)
                    ? dados[0]
                    : dados;

                setImovel({
                    descricao: dadosImovel?.descricao ?? "",
                    cep: dadosImovel?.cep ?? "",
                    endereco: dadosImovel?.endereco ?? "",
                    bairro: dadosImovel?.bairro ?? "",
                    cidade: dadosImovel?.cidade ?? "",
                    valor: dadosImovel?.valor ?? "",
                    disponivel: dadosImovel?.disponivel ?? "S"
                });

            } catch (error) {

                console.log(error);

                setErro(
                    "Erro ao carregar os dados do imóvel."
                );

            } finally {

                setCarregando(false);

            }
        }

        if (params.id) {
            buscarImovel();
        }

    }, [params.id]);


    function alterarCampo(e) {

        const { name, value } = e.target;

        setImovel((estadoAtual) => ({
            ...estadoAtual,
            [name]: value
        }));

    }


    async function salvar(e) {

        e.preventDefault();

        setSalvando(true);
        setErro("");

        try {

            const resposta = await fetch(
                `http://localhost:3000/imovel/${params.id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    credentials: "include",

                    body: JSON.stringify({
                        descricao: imovel.descricao,
                        cep: imovel.cep,
                        endereco: imovel.endereco,
                        bairro: imovel.bairro,
                        cidade: imovel.cidade,
                        valor: Number(imovel.valor),
                        disponivel: imovel.disponivel
                    })
                }
            );

            const dados = await resposta.json();

            if (!resposta.ok) {

                setErro(
                    dados.msg ||
                    "Não foi possível alterar o imóvel."
                );

                return;
            }

            router.push("/admin");

        } catch (error) {

            console.log(error);

            setErro(
                "Erro ao alterar o imóvel."
            );

        } finally {

            setSalvando(false);

        }
    }


    if (carregando) {

        return (
            <main className="min-h-screen bg-white px-6 py-10 lg:px-10">

                <div className="mx-auto max-w-6xl">

                    <div className="mb-10">
                        <div className="h-4 w-32 animate-pulse bg-[#F1F0ED]" />
                        <div className="mt-5 h-10 w-72 animate-pulse bg-[#F1F0ED]" />
                        <div className="mt-3 h-4 w-96 max-w-full animate-pulse bg-[#F7F5F0]" />
                    </div>

                    <div className="border border-[#E3E0D9] bg-white">

                        <div className="border-b border-[#E3E0D9] px-6 py-5">
                            <div className="h-5 w-44 animate-pulse bg-[#F1F0ED]" />
                            <div className="mt-2 h-3 w-64 animate-pulse bg-[#F7F5F0]" />
                        </div>

                        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">

                            {Array.from({ length: 7 }).map((_, index) => (
                                <div
                                    key={index}
                                    className={index === 0 ? "md:col-span-2" : ""}
                                >
                                    <div className="mb-2 h-3 w-20 animate-pulse bg-[#F1F0ED]" />
                                    <div className="h-11 w-full animate-pulse bg-[#F7F5F0]" />
                                </div>
                            ))}

                        </div>

                        <div className="flex justify-end gap-3 border-t border-[#E3E0D9] px-6 py-5">
                            <div className="h-10 w-24 animate-pulse bg-[#F1F0ED]" />
                            <div className="h-10 w-40 animate-pulse bg-[#F1F0ED]" />
                        </div>

                    </div>

                </div>

            </main>
        );

    }


    if (erro && !imovel.descricao) {

        return (
            <main className="min-h-screen bg-white px-6 py-10 lg:px-10">

                <div className="mx-auto max-w-6xl">

                    <button
                        type="button"
                        onClick={() => router.push("/admin")}
                        className="mb-8 inline-flex items-center gap-2 text-xs font-semibold text-[#77746E] transition hover:text-[#292825]"
                    >
                        <ArrowLeft size={15} strokeWidth={1.6} />
                        Voltar para imóveis
                    </button>

                    <div className="border border-[#E3E0D9] bg-white p-8">

                        <div className="flex h-11 w-11 items-center justify-center border border-[#E3E0D9] bg-[#FCFBF8]">
                            <Building2
                                size={20}
                                strokeWidth={1.5}
                                className="text-[#77746E]"
                            />
                        </div>

                        <h1 className="mt-6 text-2xl font-medium tracking-[-0.03em] text-[#292825]">
                            Não foi possível carregar o imóvel
                        </h1>

                        <p className="mt-2 max-w-lg text-sm leading-6 text-[#77746E]">
                            {erro}
                        </p>

                        <button
                            type="button"
                            onClick={() => router.push("/admin")}
                            className="mt-7 inline-flex items-center gap-2 bg-[#292825] px-5 py-3 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#171614]"
                        >
                            <ArrowLeft size={14} strokeWidth={1.7} />
                            Voltar
                        </button>

                    </div>

                </div>

            </main>
        );

    }


    return (
        <main className="min-h-screen bg-white px-6 py-10 lg:px-10">

            <div className="mx-auto max-w-6xl">

                {/* Cabeçalho */}

                <div className="mb-10">

                    <button
                        type="button"
                        onClick={() => router.push("/admin")}
                        className="mb-7 inline-flex items-center gap-2 text-xs font-semibold text-[#77746E] transition hover:text-[#292825]"
                    >
                        <ArrowLeft
                            size={15}
                            strokeWidth={1.6}
                        />
                        Voltar para imóveis
                    </button>

                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

                        <div>

                            <div className="mb-4 flex items-center gap-3">

                                <span className="text-[15px] font-semibold uppercase tracking-[0.14em] text-[#A19E98]">
                                    Imóvel {params.id}
                                </span>

                            </div>

                            <h1 className="text-3xl font-medium tracking-[-0.03em] text-[#292825] sm:text-4xl">
                                Editar imóvel
                            </h1>

                            <p className="mt-2 max-w-xl text-sm leading-6 text-[#77746E]">
                                Atualize as informações cadastrais e a disponibilidade
                                deste imóvel.
                            </p>

                        </div>

                    </div>

                </div>


                {/* Formulário */}

                <form onSubmit={salvar}>

                    {/* Informações do imóvel */}

                    <section className="border border-[#E3E0D9] bg-white">

                        <div className="border-b border-[#E3E0D9] px-6 py-5">

                            <div className="flex items-center gap-3">

                                <div className="flex h-8 w-8 items-center justify-center">
                                    <Building2
                                        size={16}
                                        strokeWidth={1.5}
                                        className="text-[#55534E]"
                                    />
                                </div>

                                <div>

                                    <h2 className="text-sm font-semibold text-[#292825]">
                                        Informações do imóvel
                                    </h2>

                                    <p className="mt-0.5 text-xs text-[#A19E98]">
                                        Dados principais do imóvel
                                    </p>

                                </div>

                            </div>

                        </div>


                        <div className="grid grid-cols-1 gap-x-8 gap-y-6 p-6 md:grid-cols-2">

                            {/* Descrição */}

                            <div className="md:col-span-2">

                                <label
                                    htmlFor="descricao"
                                    className="mb-2 block text-[10px] font-semibold uppercase tracking-wide text-[#A19E98]"
                                >
                                    Descrição
                                </label>

                                <input
                                    id="descricao"
                                    type="text"
                                    name="descricao"
                                    value={imovel.descricao}
                                    onChange={alterarCampo}
                                    required
                                    className="w-full border border-[#D6D2CA] bg-white px-4 py-3 text-sm text-[#292825] outline-none transition placeholder:text-[#A19E98] focus:border-[#77746E]"
                                />

                            </div>


                            {/* CEP */}

                            <div>

                                <label
                                    htmlFor="cep"
                                    className="mb-2 block text-[10px] font-semibold uppercase tracking-wide text-[#A19E98]"
                                >
                                    CEP
                                </label>

                                <div className="relative">

                                    <MapPin
                                        size={15}
                                        strokeWidth={1.5}
                                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#A19E98]"
                                    />

                                    <input
                                        id="cep"
                                        type="text"
                                        name="cep"
                                        value={imovel.cep}
                                        onChange={alterarCampo}
                                        required
                                        className="w-full border border-[#D6D2CA] bg-white py-3 pl-10 pr-4 text-sm text-[#292825] outline-none transition focus:border-[#77746E]"
                                    />

                                </div>

                            </div>


                            {/* Endereço */}

                            <div>

                                <label
                                    htmlFor="endereco"
                                    className="mb-2 block text-[10px] font-semibold uppercase tracking-wide text-[#A19E98]"
                                >
                                    Endereço
                                </label>

                                <input
                                    id="endereco"
                                    type="text"
                                    name="endereco"
                                    value={imovel.endereco}
                                    onChange={alterarCampo}
                                    required
                                    className="w-full border border-[#D6D2CA] bg-white px-4 py-3 text-sm text-[#292825] outline-none transition focus:border-[#77746E]"
                                />

                            </div>


                            {/* Bairro */}

                            <div>

                                <label
                                    htmlFor="bairro"
                                    className="mb-2 block text-[10px] font-semibold uppercase tracking-wide text-[#A19E98]"
                                >
                                    Bairro
                                </label>

                                <input
                                    id="bairro"
                                    type="text"
                                    name="bairro"
                                    value={imovel.bairro}
                                    onChange={alterarCampo}
                                    required
                                    className="w-full border border-[#D6D2CA] bg-white px-4 py-3 text-sm text-[#292825] outline-none transition focus:border-[#77746E]"
                                />

                            </div>


                            {/* Cidade */}

                            <div>

                                <label
                                    htmlFor="cidade"
                                    className="mb-2 block text-[10px] font-semibold uppercase tracking-wide text-[#A19E98]"
                                >
                                    Cidade
                                </label>

                                <input
                                    id="cidade"
                                    type="text"
                                    name="cidade"
                                    value={imovel.cidade}
                                    onChange={alterarCampo}
                                    required
                                    className="w-full border border-[#D6D2CA] bg-white px-4 py-3 text-sm text-[#292825] outline-none transition focus:border-[#77746E]"
                                />

                            </div>


                            {/* Valor */}

                            <div>

                                <label
                                    htmlFor="valor"
                                    className="mb-2 block text-[10px] font-semibold uppercase tracking-wide text-[#A19E98]"
                                >
                                    Valor do aluguel
                                </label>

                                <div className="relative">

                                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xs text-[#A19E98]">
                                        R$
                                    </span>

                                    <input
                                        id="valor"
                                        type="number"
                                        name="valor"
                                        value={imovel.valor}
                                        onChange={alterarCampo}
                                        min="0"
                                        step="0.01"
                                        required
                                        className="w-full border border-[#D6D2CA] bg-white py-3 pl-11 pr-4 text-sm text-[#292825] outline-none transition focus:border-[#77746E]"
                                    />

                                </div>

                            </div>


                            {/* Disponibilidade */}

                            <div>

                                <label
                                    htmlFor="disponivel"
                                    className="mb-2 block text-[10px] font-semibold uppercase tracking-wide text-[#A19E98]"
                                >
                                    Disponibilidade
                                </label>

                                <div className="relative">

                                    <select
                                        id="disponivel"
                                        name="disponivel"
                                        value={imovel.disponivel}
                                        onChange={alterarCampo}
                                        className="w-full appearance-none border border-[#D6D2CA] bg-white px-4 py-3 pr-10 text-sm text-[#292825] outline-none transition focus:border-[#77746E]"
                                    >
                                        <option value="S">
                                            Disponível
                                        </option>

                                        <option value="N">
                                            Indisponível
                                        </option>

                                    </select>

                                    <ChevronDown
                                        size={15}
                                        strokeWidth={1.6}
                                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#A19E98]"
                                    />

                                </div>

                            </div>

                        </div>

                    </section>


                    {/* Erro */}

                    {erro && (
                        <div className="mt-5 flex items-start gap-3 border border-[#E3D7D4] bg-[#FCF8F7] px-4 py-3">

                            <div className="mt-0.5 h-1.5 w-1.5 shrink-0 bg-[#9A6F68]" />

                            <p className="text-xs leading-5 text-[#8A625B]">
                                {erro}
                            </p>

                        </div>
                    )}


                    {/* Rodapé de ações */}

                    <div className="mt-6 flex flex-col-reverse justify-between gap-4 border-t border-[#E3E0D9] pt-6 sm:flex-row sm:items-center">

                        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wide text-[#A19E98]">

                            <Check
                                size={14}
                                strokeWidth={1.7}
                            />

                            Alterações serão salvas no sistema

                        </div>


                        <div className="flex gap-3">

                            <button
                                type="button"
                                onClick={() => router.push("/admin")}
                                className="border border-[#D6D2CA] bg-white px-5 py-3 text-xs font-semibold text-[#77746E] transition hover:-translate-y-0.5 hover:bg-[#FCFBF8] hover:text-[#292825]"
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                disabled={salvando}
                                className="inline-flex items-center justify-center gap-2 bg-[#292825] px-5 py-3 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#171614] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                            >

                                <Save
                                    size={14}
                                    strokeWidth={1.7}
                                />

                                {salvando
                                    ? "Salvando..."
                                    : "Salvar alterações"
                                }

                            </button>

                        </div>

                    </div>

                </form>

            </div>

        </main>
    );
}
