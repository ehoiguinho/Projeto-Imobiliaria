"use client";

import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { ArrowLeft, Building2, FileText, Mail, MapPin, User, Hash, CreditCard, Loader2, AlertTriangle } from "lucide-react";


export default function ContratoDetalhesPage() {

    const params = useParams();
    const router = useRouter();

    const [contrato, setContrato] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [cancelando, setCancelando] = useState(false);

    useEffect(() => {

        async function carregarContrato() {

            try {

                setCarregando(true);

                const resposta = await fetch(
                    `http://localhost:3000/admin/contratos/${params.id}`,
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );

                const dados = await resposta.json();

                if (!resposta.ok) {

                    toast.error(
                        dados.msg ||
                        "Erro ao carregar contrato."
                    );

                    console.log(
                        "Erro ao carregar contrato:",
                        dados
                    );

                    return;
                }

                setContrato(dados);

            } catch (error) {

                console.log(
                    "Erro ao carregar contrato:",
                    error
                );

                toast.error(
                    "Erro ao carregar contrato."
                );

            } finally {

                setCarregando(false);

            }

        }

        carregarContrato();

    }, [params.id]);


    /*
     * ============================================================
     * VOLTAR
     * ============================================================
     */

    function voltar() {

        router.push(
            "/admin/contratos"
        );

    }


    /*
     * ============================================================
     * FORMATAR VALOR
     * ============================================================
     */

    function formatarValor(valor) {

        return Number(valor).toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

    }


    /*
     * ============================================================
     * STATUS
     * ============================================================
     */

    function obterEstiloStatus(status) {

        switch (status) {

            case "ATIVO":

                return {
                    container:
                        "border-[#CFCBC3] bg-[#F7F5F0] text-[#55534E]",
                    ponto:
                        "bg-[#55534E]",
                    texto:
                        "Ativo"
                };


            case "CANCELADO":

                return {
                    container:
                        "border-[#E3E0D9] bg-[#F5F4F1] text-[#A19E98]",
                    ponto:
                        "bg-[#A19E98]",
                    texto:
                        "Cancelado"
                };


            default:

                return {
                    container:
                        "border-[#DAD7D0] bg-white text-[#77746E]",
                    ponto:
                        "bg-[#8A8883]",
                    texto:
                        status || "Indefinido"
                };

        }

    }


    /*
     * ============================================================
     * CANCELAR CONTRATO
     * ============================================================
     */

    async function cancelarContrato() {

        const confirmar =
            window.confirm(
                "Deseja realmente encerrar este contrato?\n\n" +
                "Os aluguéis pendentes serão cancelados " +
                "e o imóvel ficará novamente disponível para locação."
            );


        if (!confirmar) {
            return;
        }


        try {

            setCancelando(true);


            const resposta = await fetch(
                `http://localhost:3000/admin/contratos/${contrato.ctr_id}/cancelar`,
                {
                    method: "PUT",
                    credentials: "include"
                }
            );


            const dados =
                await resposta.json();


            if (!resposta.ok) {

                toast.error(
                    dados.msg ||
                    "Erro ao encerrar contrato."
                );

                return;

            }


            toast.success(
                dados.msg ||
                "Contrato encerrado com sucesso."
            );


            setContrato({
                ...contrato,
                con_status: "CANCELADO"
            });


        } catch (error) {

            console.log(
                "Erro ao cancelar contrato:",
                error
            );

            toast.error(
                "Erro ao encerrar contrato."
            );

        } finally {

            setCancelando(false);

        }

    }


    /*
     * ============================================================
     * LOADING
     * ============================================================
     */

    if (carregando) {

        return (

            <main className="min-h-full bg-white px-6 py-10 text-[#292825] lg:px-10">

                <div className="mx-auto max-w-6xl">

                    <div className="mb-10">

                        <div className="h-4 w-24 animate-pulse bg-[#E7E5E0]" />

                        <div className="mt-5 h-10 w-64 animate-pulse bg-[#F1F0ED]" />

                        <div className="mt-3 h-4 w-80 animate-pulse bg-[#F1F0ED]" />

                    </div>


                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

                        {[1, 2].map((item) => (

                            <div
                                key={item}
                                className="border border-[#E3E0D9] bg-white"
                            >

                                <div className="border-b border-[#E3E0D9] px-5 py-5">

                                    <div className="h-4 w-28 animate-pulse bg-[#E7E5E0]" />

                                    <div className="mt-3 h-3 w-52 animate-pulse bg-[#F1F0ED]" />

                                </div>


                                <div className="space-y-6 p-6">

                                    {[1, 2, 3, 4].map(
                                        (linha) => (

                                            <div key={linha}>

                                                <div className="h-2.5 w-20 animate-pulse bg-[#E7E5E0]" />

                                                <div className="mt-2 h-4 w-40 animate-pulse bg-[#F1F0ED]" />

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

            </main>

        );

    }


    if (!contrato) {

        return (

            <main className="min-h-full bg-white px-6 py-10 text-[#292825] lg:px-10">

                <div className="mx-auto max-w-6xl">


                    <button
                        type="button"
                        onClick={voltar}
                        className="group inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-[#77746E] transition hover:text-[#292825]"
                    >

                        <ArrowLeft
                            size={15}
                            strokeWidth={1.6}
                            className="transition-transform duration-200 group-hover:-translate-x-1"
                        />

                        Voltar para contratos

                    </button>


                    <div className="mt-8 border border-[#E3E0D9] bg-white px-6 py-16 text-center">

                        <div className="mx-auto flex h-12 w-12 items-center justify-center bg-[#F1F0ED] text-[#77746E]">

                            <FileText
                                size={21}
                                strokeWidth={1.4}
                            />

                        </div>


                        <h1 className="mt-5 text-base font-semibold text-[#292825]">
                            Contrato não encontrado
                        </h1>


                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#8A8883]">
                            Não foi possível encontrar o contrato
                            solicitado.
                        </p>


                        <button
                            type="button"
                            onClick={voltar}
                            className="group mt-5 inline-flex cursor-pointer items-center gap-2 bg-[#292825] px-5 py-2.5 text-xs font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#171614]"
                        >

                            Ver contratos

                            <ArrowLeft
                                size={14}
                                strokeWidth={1.7}
                                className="transition-transform duration-300 group-hover:-translate-x-1"
                            />

                        </button>

                    </div>

                </div>

            </main>

        );

    }


    const estiloStatus =
        obterEstiloStatus(
            contrato.con_status
        );


    return (

        <main className="min-h-full bg-white px-6 py-10 text-[#292825] lg:px-10">

            <div className="mx-auto max-w-6xl">


                {/* =================================================
                    VOLTAR
                ================================================== */}

                <button
                    type="button"
                    onClick={voltar}
                    className="group inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-[#77746E] transition hover:text-[#292825]"
                >

                    <ArrowLeft
                        size={15}
                        strokeWidth={1.6}
                        className="transition-transform duration-200 group-hover:-translate-x-1"
                    />

                    Voltar para contratos

                </button>

                <header className="mb-10 mt-8">

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">


                        <div>

                            <div className="flex items-center gap-3">

                                <div>

                                    <p className="text-[35px] font-medium text-black/90">
                                        Contrato
                                    </p>

                                </div>

                            </div>


                            <p className="mt-4 max-w-xl text-sm leading-6 text-[#77746E]">
                                Consulte as informações do imóvel e
                                do cliente vinculados a este contrato.
                            </p>

                        </div>


                        <div className="flex flex-wrap items-center gap-3">


                            <span
                                className={`inline-flex items-center gap-1.5 border px-3 py-2 text-[9px] font-semibold uppercase tracking-wide ${estiloStatus.container}`}
                            >

                                <span
                                    className={`h-1.5 w-1.5 ${estiloStatus.ponto}`}
                                />

                                {estiloStatus.texto}

                            </span>


                            {contrato.con_status === "ATIVO" && (

                                <button
                                    type="button"
                                    onClick={cancelarContrato}
                                    disabled={cancelando}
                                    className="group inline-flex cursor-pointer items-center gap-2 border border-[#D6D2CA] bg-white px-4 py-2 text-xs font-semibold text-[#55534E] transition-all duration-200 hover:bg-[#F7F5F0] hover:text-[#292825] disabled:cursor-not-allowed disabled:opacity-50"
                                >

                                    {cancelando ? (

                                        <Loader2
                                            size={14}
                                            strokeWidth={1.6}
                                            className="animate-spin"
                                        />

                                    ) : (

                                        <AlertTriangle
                                            size={14}
                                            strokeWidth={1.5}
                                        />

                                    )}

                                    {cancelando
                                        ? "Encerrando..."
                                        : "Encerrar contrato"}

                                </button>

                            )}

                        </div>

                    </div>

                </header>


                {/* =================================================
                    RESUMO
                ================================================== */}

                <div className="mb-5 grid grid-cols-2 border border-[#E3E0D9] bg-white md:grid-cols-4">


                    <div className="px-5 py-5">

                        <p className="text-[10px] font-semibold uppercase tracking-wide text-[#A19E98]">
                            Contrato
                        </p>

                        <p className="mt-2 text-lg font-medium tabular-nums text-[#292825]">
                            {contrato.ctr_id}
                        </p>

                    </div>


                    <div className="border-l border-[#E3E0D9] px-5 py-5">

                        <p className="text-[10px] font-semibold uppercase tracking-wide text-[#A19E98]">
                            Cliente
                        </p>

                        <p className="mt-2 truncate text-sm font-medium text-[#292825]">
                            {contrato.usu_nome}
                        </p>

                    </div>


                    <div className="border-t border-[#E3E0D9] px-5 py-5 md:border-l md:border-t-0">

                        <p className="text-[10px] font-semibold uppercase tracking-wide text-[#A19E98]">
                            Imóvel
                        </p>

                        <p className="mt-2 truncate text-sm font-medium text-[#292825]">
                            {contrato.imv_descricao}
                        </p>

                    </div>


                    <div className="border-l border-t border-[#E3E0D9] px-5 py-5 md:border-t-0">

                        <p className="text-[10px] font-semibold uppercase tracking-wide text-[#A19E98]">
                            Aluguel
                        </p>

                        <p className="mt-2 text-sm font-semibold text-[#292825]">
                            {formatarValor(
                                contrato.imv_valor
                            )}
                        </p>

                    </div>

                </div>


                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

                    <section className="border border-[#E3E0D9] bg-white">


                        <div className="border-b border-[#E3E0D9] px-5 py-5">

                            <div className="flex items-center gap-3">

                                <Building2
                                    size={17}
                                    strokeWidth={1.5}
                                    className="text-[#77746E]"
                                />

                                <div>

                                    <h2 className="text-sm font-semibold text-[#292825]">
                                        Imóvel
                                    </h2>

                                    <p className="mt-1 text-xs text-[#8A8883]">
                                        Informações do imóvel vinculado.
                                    </p>

                                </div>

                            </div>

                        </div>


                        <div className="p-6">


                            {/* DESCRIÇÃO */}

                            <div className="border-b border-[#E3E0D9] pb-5">

                                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#A19E98]">
                                    Descrição
                                </p>

                                <p className="mt-2 text-sm font-semibold leading-6 text-[#292825]">
                                    {contrato.imv_descricao}
                                </p>

                            </div>


                            {/* VALOR */}

                            <div className="grid grid-cols-2 border-b border-[#E3E0D9] py-5">


                                <div>

                                    <p className="text-[10px] font-semibold uppercase tracking-wide text-[#A19E98]">
                                        Valor mensal
                                    </p>

                                    <p className="mt-2 text-base font-semibold text-[#292825]">
                                        {formatarValor(
                                            contrato.imv_valor
                                        )}
                                    </p>

                                </div>


                                <div className="border-l border-[#E3E0D9] pl-5">

                                    <p className="text-[10px] font-semibold uppercase tracking-wide text-[#A19E98]">
                                        CEP
                                    </p>

                                    <p className="mt-2 text-sm font-medium text-[#55534E]">
                                        {contrato.imv_cep}
                                    </p>

                                </div>

                            </div>


                            {/* ENDEREÇO */}

                            <div className="border-b border-[#E3E0D9] py-5">

                                <div className="flex items-start gap-3">

                                    <MapPin
                                        size={16}
                                        strokeWidth={1.5}
                                        className="mt-0.5 shrink-0 text-[#8A8883]"
                                    />

                                    <div>

                                        <p className="text-[10px] font-semibold uppercase tracking-wide text-[#A19E98]">
                                            Endereço
                                        </p>

                                        <p className="mt-2 text-sm font-medium leading-5 text-[#292825]">
                                            {contrato.imv_endereco}
                                        </p>

                                    </div>

                                </div>

                            </div>


                            <div className="grid grid-cols-2 gap-5 pt-5">


                                <div>

                                    <p className="text-[10px] font-semibold uppercase tracking-wide text-[#A19E98]">
                                        Bairro
                                    </p>

                                    <p className="mt-2 text-sm font-medium text-[#292825]">
                                        {contrato.imv_bairro}
                                    </p>

                                </div>


                                <div>

                                    <p className="text-[10px] font-semibold uppercase tracking-wide text-[#A19E98]">
                                        Cidade
                                    </p>

                                    <p className="mt-2 text-sm font-medium text-[#292825]">
                                        {contrato.imv_cidade}
                                    </p>

                                </div>

                            </div>

                        </div>

                    </section>


                    <section className="border border-[#E3E0D9] bg-white">


                        <div className="border-b border-[#E3E0D9] px-5 py-5">

                            <div className="flex items-center gap-3">

                                <User
                                    size={17}
                                    strokeWidth={1.5}
                                    className="text-[#77746E]"
                                />

                                <div>

                                    <h2 className="text-sm font-semibold text-[#292825]">
                                        Cliente
                                    </h2>

                                    <p className="mt-1 text-xs text-[#8A8883]">
                                        Informações do responsável pelo contrato.
                                    </p>

                                </div>

                            </div>

                        </div>


                        <div className="p-6">


                            <div className="border-b border-[#E3E0D9] pb-5">

                                <div className="flex items-start gap-3">

                                    <User
                                        size={16}
                                        strokeWidth={1.5}
                                        className="mt-0.5 shrink-0 text-[#8A8883]"
                                    />

                                    <div className="min-w-0">

                                        <p className="text-[10px] font-semibold uppercase tracking-wide text-[#A19E98]">
                                            Nome
                                        </p>

                                        <p className="mt-2 text-sm font-semibold text-[#292825]">
                                            {contrato.usu_nome}
                                        </p>

                                    </div>

                                </div>

                            </div>


                            <div className="border-b border-[#E3E0D9] py-5">

                                <div className="flex items-start gap-3">

                                    <Mail
                                        size={16}
                                        strokeWidth={1.5}
                                        className="mt-0.5 shrink-0 text-[#8A8883]"
                                    />

                                    <div className="min-w-0">

                                        <p className="text-[10px] font-semibold uppercase tracking-wide text-[#A19E98]">
                                            E-mail
                                        </p>

                                        <p className="mt-2 break-all text-sm font-medium text-[#292825]">
                                            {contrato.usu_email}
                                        </p>

                                    </div>

                                </div>

                            </div>


                            <div className="grid grid-cols-2 gap-5 pt-5">


                                <div>

                                    <div className="flex items-center gap-2">

                                        <p className="text-[10px] font-semibold uppercase tracking-wide text-[#A19E98]">
                                            ID cliente
                                        </p>

                                    </div>

                                    <p className="mt-2 text-sm font-medium tabular-nums text-[#292825]">
                                        {contrato.usu_id}
                                    </p>

                                </div>


                                <div>

                                    <div className="flex items-center gap-2">

                                        <Building2
                                            size={14}
                                            strokeWidth={1.5}
                                            className="text-[#8A8883]"
                                        />

                                        <p className="text-[10px] font-semibold uppercase tracking-wide text-[#A19E98]">
                                            ID imóvel
                                        </p>

                                    </div>

                                    <p className="mt-2 text-sm font-medium tabular-nums text-[#292825]">
                                        {contrato.imv_id}
                                    </p>

                                </div>

                            </div>

                            <div className="mt-6 bg-[#FCFBF8] px-4 py-4">

                                <div className="flex items-start gap-3">

                                    <CreditCard
                                        size={16}
                                        strokeWidth={1.5}
                                        className="mt-0.5 shrink-0 text-[#77746E]"
                                    />

                                    <div>

                                        <p className="text-xs font-semibold text-[#292825]">
                                            Contrato vinculado
                                        </p>

                                        <p className="mt-1 text-[11px] leading-5 text-[#8A8883]">
                                            Este cliente está associado ao
                                            imóvel através do contrato {contrato.ctr_id}.
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </section>

                </div>

                {contrato.con_status === "ATIVO" && (

                    <div className="mt-5 border border-[#E3E0D9] bg-[#FCFBF8] px-5 py-4">

                        <div className="flex items-start gap-3">

                            <AlertTriangle
                                size={16}
                                strokeWidth={1.5}
                                className="mt-0.5 shrink-0 text-[#77746E]"
                            />

                            <div>

                                <p className="text-xs font-semibold text-[#292825]">
                                    Contrato ativo
                                </p>

                                <p className="mt-1 text-xs leading-5 text-[#8A8883]">
                                    Ao encerrar este contrato, os aluguéis
                                    pendentes serão cancelados e o imóvel
                                    ficará disponível novamente para locação.
                                </p>

                            </div>

                        </div>

                    </div>

                )}

            </div>

        </main>

    );

}
