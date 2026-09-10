"use client";

import toast from "react-hot-toast";
import { useEffect, useState } from "react";

import { ArrowRight, Building2, ChevronDown, ClipboardList, CreditCard, FileText, ArrowLeft, Loader2, MapPin } from "lucide-react";


export default function LocacoesPage() {

    const [contratos, setContratos] = useState([]);
    const [contratoSelecionado, setContratoSelecionado] = useState(null);
    const [alugueis, setAlugueis] = useState([]);

    const [mostrarContratos, setMostrarContratos] = useState(false);

    const [carregandoContratos, setCarregandoContratos] = useState(true);
    const [carregandoAlugueis, setCarregandoAlugueis] = useState(false);
    const [pagandoAluguel, setPagandoAluguel] = useState(null);
    const [erro, setErro] = useState("");


    /*
     * ============================================================
     * CARREGAR CONTRATOS
     * ============================================================
     */

    async function carregarContratos() {

        try {

            setCarregandoContratos(true);
            setErro("");

            const resposta = await fetch(
                "http://localhost:3000/locacao/minhas",
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            const dados = await resposta.json();

            if (!resposta.ok) {

                throw new Error(
                    dados.msg || "Erro ao carregar contratos"
                );

            }

            const contratosUnicos = dados.filter(
                (contrato, index, array) => {

                    return (
                        array.findIndex(
                            (item) =>
                                item.id === contrato.id
                        ) === index
                    );

                }
            );

            setContratos(contratosUnicos);

        } catch (error) {

            setErro(error.message);

            toast.error(error.message);

        } finally {

            setCarregandoContratos(false);

        }

    }


    /*
     * ============================================================
     * CARREGAR ALUGUÉIS
     * ============================================================
     */

    async function carregarAlugueis(
        contratoId,
        mostrarToast = false
    ) {

        let toastId = null;

        if (mostrarToast) {

            toastId = toast.loading(
                "Atualizando seus pagamentos..."
            );

        }

        try {

            setCarregandoAlugueis(true);
            setErro("");

            setContratoSelecionado(contratoId);
            setAlugueis([]);
            setMostrarContratos(false);

            localStorage.setItem(
                "contratoSelecionado",
                String(contratoId)
            );

            const resposta = await fetch(
                `http://localhost:3000/aluguel/contrato/${contratoId}`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            const dados = await resposta.json();

            if (!resposta.ok) {

                throw new Error(
                    dados.msg || "Erro ao carregar aluguéis"
                );

            }

            setAlugueis(dados);

            if (mostrarToast) {

                toast.success(
                    "Pagamentos atualizados!",
                    {
                        id: toastId
                    }
                );

            }

        } catch (error) {

            setErro(error.message);
            setAlugueis([]);

            if (mostrarToast && toastId) {

                toast.error(
                    error.message,
                    {
                        id: toastId
                    }
                );

            } else {

                toast.error(error.message);

            }

        } finally {

            setCarregandoAlugueis(false);

        }

    }


    /*
     * ============================================================
     * PAGAMENTO
     * ============================================================
     */

    async function pagarAluguel(aluguelId) {

        const toastId = toast.loading(
            "Preparando pagamento..."
        );

        try {

            setPagandoAluguel(aluguelId);
            setErro("");

            localStorage.setItem(
                "pagamentoEmAndamento",
                "true"
            );

            const resposta = await fetch(
                `http://localhost:3000/pagamento/${aluguelId}`,
                {
                    method: "POST",
                    credentials: "include"
                }
            );

            const dados = await resposta.json();

            if (!resposta.ok) {

                throw new Error(
                    dados.msg || "Erro ao iniciar pagamento"
                );

            }

            if (!dados.url) {

                throw new Error(
                    "A URL de pagamento não foi retornada."
                );

            }

            toast.success(
                "Redirecionando para o pagamento...",
                {
                    id: toastId
                }
            );

            window.location.href = dados.url;

        } catch (error) {

            localStorage.removeItem(
                "pagamentoEmAndamento"
            );

            setErro(error.message);
            setPagandoAluguel(null);

            toast.error(
                error.message,
                {
                    id: toastId
                }
            );

        }

    }


    /*
     * ============================================================
     * EFEITOS
     * ============================================================
     */

    useEffect(() => {

        carregarContratos();

    }, []);


    useEffect(() => {

        if (contratos.length === 0) {
            return;
        }

        const contratoSalvo =
            localStorage.getItem(
                "contratoSelecionado"
            );

        if (!contratoSalvo) {
            return;
        }

        const contratoExiste = contratos.some(
            (contrato) =>
                String(contrato.id) ===
                String(contratoSalvo)
        );

        if (!contratoExiste) {
            return;
        }

        const pagamentoEmAndamento =
            localStorage.getItem(
                "pagamentoEmAndamento"
            );

        if (pagamentoEmAndamento === "true") {

            localStorage.removeItem(
                "pagamentoEmAndamento"
            );

            carregarAlugueis(
                Number(contratoSalvo),
                true
            );

            return;

        }

        carregarAlugueis(
            Number(contratoSalvo)
        );

    }, [contratos]);


    /*
     * ============================================================
     * DADOS
     * ============================================================
     */

    const contratoAtual = contratos.find(
        (contrato) =>
            String(contrato.id) ===
            String(contratoSelecionado)
    );


    const alugueisPagos = alugueis.filter(
        (aluguel) =>
            aluguel.status === "PAGO"
    ).length;


    const alugueisPendentes = alugueis.filter(
        (aluguel) =>
            aluguel.status === "PENDENTE" ||
            aluguel.status === "ATRASADO"
    ).length;


    const totalPendente = alugueis
        .filter(
            (aluguel) =>
                aluguel.status === "PENDENTE" ||
                aluguel.status === "ATRASADO"
        )
        .reduce(
            (total, aluguel) =>
                total + Number(aluguel.valor || 0),
            0
        );


    /*
     * ============================================================
     * STATUS
     * ============================================================
     */

    function obterEstiloStatus(status) {

        switch (status) {

            case "PAGO":

                return {
                    container:
                        "border-[#CFCBC3] bg-[#F7F5F0] text-[#55534E]",
                    ponto:
                        "bg-[#55534E]",
                    texto:
                        "Pago"
                };


            case "ATRASADO":

                return {
                    container:
                        "border-[#BDB9B1] bg-[#EEEDE9] text-[#292825]",
                    ponto:
                        "bg-[#292825]",
                    texto:
                        "Atrasado"
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
                        "Pendente"
                };

        }

    }


    /*
     * ============================================================
     * RENDER
     * ============================================================
     */

    return (

        <main className="min-h-full bg-white px-6 py-10 text-[#292825] lg:px-10">
                    
            <div className="mx-auto max-w-6xl">


                {/* =====================================================
                    CABEÇALHO
                ====================================================== */}

                <header className="mb-10">

                    <div className="flex items-start gap-4">

                        <div>

                            <h1 className="mt-2 text-3xl font-medium tracking-[-0.03em] text-[#292825] sm:text-4xl">
                                Minhas locações
                            </h1>

                            <p className="mt-2 max-w-xl text-sm leading-6 text-[#77746E]">
                                Consulte seus contratos e acompanhe
                                seus pagamentos.
                            </p>

                        </div>

                    </div>

                </header>


                {/* =====================================================
                    ERRO
                ====================================================== */}

                {erro && (

                    <div className="mb-6 border border-[#D6D2CA] bg-white px-5 py-4">

                        <p className="text-sm font-medium text-[#55534E]">
                            <span className="font-semibold">
                                Erro:
                            </span>{" "}
                            {erro}
                        </p>

                    </div>

                )}


                {/* =====================================================
                    LOADING CONTRATOS
                ====================================================== */}

                {carregandoContratos ? (

                    <div className="border border-[#E3E0D9] bg-white p-6">

                        <div className="h-4 w-32 animate-pulse bg-[#E7E5E0]" />

                        <div className="mt-4 h-12 animate-pulse bg-[#F1F0ED]" />

                    </div>


                ) : contratos.length === 0 ? (


                    /* =================================================
                       SEM CONTRATOS
                    ================================================== */

                    <div className="border border-[#E3E0D9] bg-white px-6 py-16 text-center">

                        <div className="mx-auto flex h-12 w-12 items-center justify-center bg-[#F1F0ED] text-[#77746E]">

                            <Building2
                                size={21}
                                strokeWidth={1.4}
                            />

                        </div>

                        <h2 className="mt-5 text-base font-semibold text-[#292825]">
                            Nenhuma locação encontrada
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#8A8883]">
                            Você ainda não possui contratos
                            de locação vinculados à sua conta.
                        </p>

                    </div>


                ) : (


                    /* =================================================
                       CONTEÚDO
                    ================================================== */

                    <section className="space-y-5">


                        {/* =================================================
                            SELETOR DE CONTRATOS
                        ================================================== */}

                        <div className="border border-[#E3E0D9] bg-white">


                            <button
                                type="button"
                                onClick={() =>
                                    setMostrarContratos(
                                        !mostrarContratos
                                    )
                                }
                                className="group flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-5 text-left transition hover:bg-[#FCFBF8]"
                            >

                                <div className="flex min-w-0 items-center gap-4">

                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center text-[#55534E]">

                                        <FileText
                                            size={18}
                                            strokeWidth={1.5}
                                        />

                                    </div>


                                    <div className="min-w-0">

                                        <div className="flex items-center gap-2">

                                            <h2 className="text-sm font-semibold text-[#292825]">
                                                Meus contratos
                                            </h2>

                                        </div>


                                        <p className="mt-1 truncate text-xs text-[#8A8883]">

                                            {contratoAtual
                                                ? `Contrato ${contratoAtual.id} • ${
                                                      contratoAtual.imovel ||
                                                      "Imóvel vinculado"
                                                  }`
                                                : "Selecione um contrato para consultar"}

                                        </p>

                                    </div>

                                </div>


                                <ChevronDown
                                    size={18}
                                    strokeWidth={1.6}
                                    className={`shrink-0 text-[#8A8883] transition-transform duration-300 ${
                                        mostrarContratos
                                            ? "rotate-180"
                                            : ""
                                    }`}
                                />

                            </button>


                            {mostrarContratos && (

                                <div className="border-t border-[#E3E0D9] p-3">

                                    <div className="space-y-1">

                                        {contratos.map(
                                            (contrato) => {

                                                const ativo =
                                                    String(
                                                        contrato.id
                                                    ) ===
                                                    String(
                                                        contratoSelecionado
                                                    );

                                                return (

                                                    <button
                                                        key={
                                                            contrato.id
                                                        }
                                                        type="button"
                                                        onClick={() =>
                                                            carregarAlugueis(
                                                                contrato.id
                                                            )
                                                        }
                                                        className={`group flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left transition ${
                                                            ativo
                                                                ? "bg-[#292825] text-white"
                                                                : "text-[#55534E] hover:bg-[#F7F5F0]"
                                                        }`}
                                                    >

                                                        <div className="flex min-w-0 items-center gap-3">

                                                            <Building2
                                                                size={16}
                                                                strokeWidth={1.5}
                                                                className={
                                                                    ativo
                                                                        ? "text-white"
                                                                        : "text-[#8A8883]"
                                                                }
                                                            />

                                                            <div className="min-w-0">

                                                                <p
                                                                    className={`text-sm font-semibold ${
                                                                        ativo
                                                                            ? "text-white"
                                                                            : "text-[#292825]"
                                                                    }`}
                                                                >
                                                                    Contrato | {contrato.id}
                                                                </p>

                                                               

                                                            </div>

                                                        </div>


                                                        <ArrowRight
                                                            size={15}
                                                            strokeWidth={1.6}
                                                            className={`shrink-0 transition-transform duration-200 ${
                                                                ativo
                                                                    ? "text-[#CFCBC3]"
                                                                    : "text-[#A19E98] group-hover:translate-x-1"
                                                            }`}
                                                        />

                                                    </button>

                                                );

                                            }
                                        )}

                                    </div>

                                </div>

                            )}

                        </div>


                        {/* =================================================
                            SEM CONTRATO SELECIONADO
                        ================================================== */}

                        {!contratoSelecionado && (

                            <div className="border border-dashed border-[#D5D1C9] bg-white px-6 py-14 text-center">

                                <h2 className="mt-4 text-sm font-semibold text-[#292825]">
                                    Selecione um contrato
                                </h2>

                                <p className="mt-1 text-xs text-[#8A8883]">
                                    Abra "Meus contratos" para
                                    escolher uma locação.
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setMostrarContratos(
                                            true
                                        )
                                    }
                                    className="group mt-5 inline-flex cursor-pointer items-center gap-2 bg-[#292825] px-5 py-2.5 text-xs font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#171614]"
                                >

                                    Ver contratos

                                    <ArrowRight
                                        size={14}
                                        strokeWidth={1.7}
                                        className="transition-transform duration-300 group-hover:translate-x-1"
                                    />

                                </button>

                            </div>

                        )}


                        {/* =================================================
                            CONTRATO SELECIONADO
                        ================================================== */}

                        {contratoAtual && (

                            <>

                                {/* =================================================
                                    RESUMO
                                ================================================== */}

                                {!carregandoAlugueis && (

                                    <div className="grid grid-cols-3 border border-[#E3E0D9] bg-white">


                                        <div className="px-5 py-5">

                                            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#A19E98]">
                                                Aluguéis
                                            </p>

                                            <p className="mt-2 text-2xl font-medium tabular-nums text-[#292825]">
                                                {alugueis.length}
                                            </p>

                                        </div>


                                        <div className="border-l border-[#E3E0D9] px-5 py-5">

                                            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#A19E98]">
                                                Pagos
                                            </p>

                                            <p className="mt-2 text-2xl font-medium tabular-nums text-[#55534E]">
                                                {alugueisPagos}
                                            </p>

                                        </div>


                                        <div className="border-l border-[#E3E0D9] px-5 py-5">

                                            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#A19E98]">
                                                Em aberto
                                            </p>

                                            <p className="mt-2 text-xl font-medium tabular-nums text-[#292825]">

                                                {totalPendente.toLocaleString(
                                                    "pt-BR",
                                                    {
                                                        style:
                                                            "currency",
                                                        currency:
                                                            "BRL"
                                                    }
                                                )}

                                            </p>

                                        </div>

                                    </div>

                                )}


                                {/* =================================================
                                    HISTÓRICO
                                ================================================== */}

                                <div className="overflow-hidden border border-[#E3E0D9] bg-white">


                                    <div className="border-b border-[#E3E0D9] px-5 py-5">

                                        <div className="flex items-center justify-between gap-4">

                                            <div>

                                                <div className="flex items-center gap-3">

                                                    <CreditCard
                                                        size={17}
                                                        strokeWidth={1.5}
                                                        className="text-[#77746E]"
                                                    />

                                                    <h2 className="text-sm font-semibold text-[#292825]">
                                                        Histórico de pagamentos
                                                    </h2>

                                                </div>

                                                <p className="mt-1 pl-7 text-xs text-[#8A8883]">
                                                    Vencimentos e situação
                                                    dos aluguéis.
                                                </p>

                                            </div>


                                            {alugueis.length > 0 && (

                                                <span className="bg-[#F1F0ED] px-2.5 py-1 text-[10px] font-semibold text-[#77746E]">
                                                    {alugueis.length}
                                                </span>

                                            )}

                                        </div>

                                    </div>


                                    <div>


                                        {/* =================================================
                                            LOADING
                                        ================================================== */}

                                        {carregandoAlugueis && (

                                            <div className="space-y-px">

                                                {[1, 2, 3, 4].map(
                                                    (item) => (

                                                        <div
                                                            key={
                                                                item
                                                            }
                                                            className="h-16 animate-pulse border-b border-[#E3E0D9] bg-[#FCFBF8]"
                                                        />

                                                    )
                                                )}

                                            </div>

                                        )}


                                        {/* =================================================
                                            NENHUM ALUGUEL
                                        ================================================== */}

                                        {!carregandoAlugueis &&
                                            contratoSelecionado &&
                                            alugueis.length === 0 && (

                                                <div className="px-5 py-14 text-center">

                                                    <div className="mx-auto flex h-10 w-10 items-center justify-center bg-[#F1F0ED] text-[#8A8883]">

                                                        <FileText
                                                            size={17}
                                                            strokeWidth={1.4}
                                                        />

                                                    </div>

                                                    <h3 className="mt-4 text-sm font-semibold text-[#292825]">
                                                        Nenhum pagamento encontrado
                                                    </h3>

                                                    <p className="mt-1 text-xs text-[#8A8883]">
                                                        Não existem registros
                                                        para este contrato.
                                                    </p>

                                                </div>

                                            )}


                                        {/* =================================================
                                            PAGAMENTOS
                                        ================================================== */}

                                        {!carregandoAlugueis &&
                                            alugueis.length > 0 && (

                                                <>


                                                    {/* =================================================
                                                        DESKTOP
                                                    ================================================== */}

                                                    <div className="hidden md:block">


                                                        <div className="grid grid-cols-[1.2fr_1fr_1fr_1.3fr] border-b border-[#E3E0D9] bg-[#FCFBF8] px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#A19E98]">

                                                            <span>
                                                                Referência
                                                            </span>

                                                            <span>
                                                                Vencimento
                                                            </span>

                                                            <span>
                                                                Valor
                                                            </span>

                                                            <span className="text-right">
                                                                Situação
                                                            </span>

                                                        </div>


                                                        {alugueis.map(
                                                            (aluguel) => {

                                                                const estilo =
                                                                    obterEstiloStatus(
                                                                        aluguel.status
                                                                    );

                                                                return (

                                                                    <div
                                                                        key={
                                                                            aluguel.id
                                                                        }
                                                                        className="grid grid-cols-[1.2fr_1fr_1fr_1.3fr] items-center border-b border-[#E3E0D9] px-5 py-4 last:border-b-0 transition hover:bg-[#FCFBF8]"
                                                                    >


                                                                        <div>

                                                                            <p className="text-sm font-semibold text-[#292825]">
                                                                                {
                                                                                    aluguel.mes
                                                                                }
                                                                            </p>

                                                                            <p className="mt-0.5 text-[10px] text-[#A19E98]">
                                                                                
                                                                                {
                                                                                    aluguel.id
                                                                                }
                                                                            </p>

                                                                        </div>


                                                                        <p className="text-sm text-[#77746E]">

                                                                            {new Date(
                                                                                aluguel.vencimento
                                                                            ).toLocaleDateString(
                                                                                "pt-BR"
                                                                            )}

                                                                        </p>


                                                                        <p className="text-sm font-semibold text-[#292825]">

                                                                            {Number(
                                                                                aluguel.valor
                                                                            ).toLocaleString(
                                                                                "pt-BR",
                                                                                {
                                                                                    style:
                                                                                        "currency",
                                                                                    currency:
                                                                                        "BRL"
                                                                                }
                                                                            )}

                                                                        </p>


                                                                        <div className="flex items-center justify-end gap-3">

                                                                            <span
                                                                                className={`inline-flex items-center gap-1.5 border px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-wide ${estilo.container}`}
                                                                            >

                                                                                <span
                                                                                    className={`h-1.5 w-1.5 ${estilo.ponto}`}
                                                                                />

                                                                                {
                                                                                    estilo.texto
                                                                                }

                                                                            </span>


                                                                            {(aluguel.status ===
                                                                                "PENDENTE" ||
                                                                                aluguel.status ===
                                                                                    "ATRASADO") && (

                                                                                <button
                                                                                    type="button"
                                                                                    disabled={
                                                                                        pagandoAluguel ===
                                                                                        aluguel.id
                                                                                    }
                                                                                    onClick={() =>
                                                                                        pagarAluguel(
                                                                                            aluguel.id
                                                                                        )
                                                                                    }
                                                                                    className="group inline-flex cursor-pointer items-center gap-1.5 bg-[#292825] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-wide text-white transition-all duration-200 hover:bg-[#171614] disabled:cursor-not-allowed disabled:opacity-50"
                                                                                >

                                                                                    {pagandoAluguel ===
                                                                                    aluguel.id ? (

                                                                                        <Loader2
                                                                                            size={
                                                                                                12
                                                                                            }
                                                                                            className="animate-spin"
                                                                                        />

                                                                                    ) : (

                                                                                        <CreditCard
                                                                                            size={
                                                                                                12
                                                                                            }
                                                                                            strokeWidth={
                                                                                                1.6
                                                                                            }
                                                                                        />

                                                                                    )}

                                                                                    {pagandoAluguel ===
                                                                                    aluguel.id
                                                                                        ? "Processando"
                                                                                        : "Pagar"}

                                                                                </button>

                                                                            )}

                                                                        </div>

                                                                    </div>

                                                                );

                                                            }
                                                        )}

                                                    </div>


                                                    {/* =================================================
                                                        MOBILE
                                                    ================================================== */}

                                                    <div className="divide-y divide-[#E3E0D9] md:hidden">

                                                        {alugueis.map(
                                                            (aluguel) => {

                                                                const estilo =
                                                                    obterEstiloStatus(
                                                                        aluguel.status
                                                                    );

                                                                return (

                                                                    <div
                                                                        key={
                                                                            aluguel.id
                                                                        }
                                                                        className="px-5 py-4"
                                                                    >

                                                                        <div className="flex items-start justify-between gap-3">

                                                                            <div>

                                                                                <p className="text-sm font-semibold text-[#292825]">
                                                                                    {
                                                                                        aluguel.mes
                                                                                    }
                                                                                </p>

                                                                                <p className="mt-1 text-xs text-[#8A8883]">

                                                                                    Vencimento:{" "}

                                                                                    {new Date(
                                                                                        aluguel.vencimento
                                                                                    ).toLocaleDateString(
                                                                                        "pt-BR"
                                                                                    )}

                                                                                </p>

                                                                            </div>


                                                                            <span
                                                                                className={`inline-flex items-center gap-1.5 border px-2 py-1 text-[9px] font-semibold uppercase tracking-wide ${estilo.container}`}
                                                                            >

                                                                                <span
                                                                                    className={`h-1.5 w-1.5 ${estilo.ponto}`}
                                                                                />

                                                                                {
                                                                                    estilo.texto
                                                                                }

                                                                            </span>

                                                                        </div>


                                                                        <div className="mt-4 flex items-center justify-between gap-3">

                                                                            <strong className="text-sm font-semibold text-[#292825]">

                                                                                {Number(
                                                                                    aluguel.valor
                                                                                ).toLocaleString(
                                                                                    "pt-BR",
                                                                                    {
                                                                                        style:
                                                                                            "currency",
                                                                                        currency:
                                                                                            "BRL"
                                                                                    }
                                                                                )}

                                                                            </strong>


                                                                            {(aluguel.status ===
                                                                                "PENDENTE" ||
                                                                                aluguel.status ===
                                                                                    "ATRASADO") && (

                                                                                <button
                                                                                    type="button"
                                                                                    disabled={
                                                                                        pagandoAluguel ===
                                                                                        aluguel.id
                                                                                    }
                                                                                    onClick={() =>
                                                                                        pagarAluguel(
                                                                                            aluguel.id
                                                                                        )
                                                                                    }
                                                                                    className="inline-flex cursor-pointer items-center gap-2 bg-[#292825] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#171614] disabled:cursor-not-allowed disabled:opacity-50"
                                                                                >

                                                                                    {pagandoAluguel ===
                                                                                    aluguel.id ? (

                                                                                        <Loader2
                                                                                            size={
                                                                                                13
                                                                                            }
                                                                                            className="animate-spin"
                                                                                        />

                                                                                    ) : (

                                                                                        <CreditCard
                                                                                            size={
                                                                                                13
                                                                                            }
                                                                                            strokeWidth={
                                                                                                1.6
                                                                                            }
                                                                                        />

                                                                                    )}

                                                                                    {pagandoAluguel ===
                                                                                    aluguel.id
                                                                                        ? "Processando..."
                                                                                        : "Pagar"}

                                                                                </button>

                                                                            )}

                                                                        </div>

                                                                    </div>

                                                                );

                                                            }
                                                        )}

                                                    </div>

                                                </>

                                            )}

                                    </div>

                                </div>

                            </>

                        )}

                    </section>

                )}

            </div>

        </main>

    );

}
