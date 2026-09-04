"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ContratoDetalhesPage() {

const params = useParams();
const router = useRouter();

const [contrato, setContrato] = useState(null);
const [carregando, setCarregando] = useState(true);
const [cancelando, setCancelando] = useState(false);

useEffect(() => {
    async function carregarContrato() {
        try {
            const resposta = await fetch(
                `http://localhost:3000/admin/contratos/${params.id}`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            const dados = await resposta.json();

            if (!resposta.ok) {
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
        } finally {
            setCarregando(false);
        }
    }

    carregarContrato();
}, [params.id]);

function voltar() {
    router.push("/admin/contratos");
}

function formatarValor(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function formatarStatus(status) {

    if (status === "ATIVO") {
        return (
            <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                Ativo
            </span>
        );
    }

    if (status === "CANCELADO") {
        return (
            <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                Cancelado
            </span>
        );
    }

    return (
        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {status}
        </span>
    );
}

async function cancelarContrato() {

    const confirmar = window.confirm(
        "Tem certeza que deseja encerrar este contrato?\n\n" +
        "Os aluguéis pendentes serão cancelados e o imóvel " +
        "ficará novamente disponível para locação."
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

        const dados = await resposta.json();

        if (!resposta.ok) {
            alert(
                dados.msg ||
                "Erro ao cancelar contrato."
            );
            return;
        }

        alert(
            dados.msg ||
            "Contrato cancelado com sucesso."
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

        alert("Erro ao cancelar contrato.");

    } finally {

        setCancelando(false);

    }
}

if (carregando) {
    return (
        <main className="min-h-screen p-8">
            <div className="mx-auto max-w-5xl">
                <p className="text-sm text-slate-500">
                    Carregando contrato...
                </p>
            </div>
        </main>
    );
}

if (!contrato) {
    return (
        <main className="min-h-screen p-8">
            <div className="mx-auto max-w-5xl">

                <button
                    type="button"
                    onClick={voltar}
                    className="mb-6 text-sm font-medium text-blue-600 hover:underline"
                >
                    ← Voltar para contratos
                </button>

                <div className="rounded-xl bg-white p-10 text-center shadow-sm">
                    <p className="font-medium text-slate-700">
                        Contrato não encontrado.
                    </p>
                </div>

            </div>
        </main>
    );
}

return (
    <main className="min-h-screen p-8">
        <div className="mx-auto max-w-5xl">

            {/* CABEÇALHO */}

            <div className="mb-8">

                <button
                    type="button"
                    onClick={voltar}
                    className="mb-4 text-sm font-medium text-blue-600 hover:underline"
                >
                    ← Voltar para contratos
                </button>

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            Contrato #{contrato.ctr_id}
                        </h1>

                        <p className="mt-2 text-slate-500">
                            Detalhes do contrato de locação.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">

                        {formatarStatus(
                            contrato.con_status
                        )}

                        {contrato.con_status === "ATIVO" && (
                            <button
                                type="button"
                                onClick={cancelarContrato}
                                disabled={cancelando}
                                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {cancelando
                                    ? "Encerrando..."
                                    : "Encerrar contrato"
                                }
                            </button>
                        )}

                    </div>

                </div>

            </div>

            {/* IMÓVEL */}

            <section className="mb-6 rounded-xl bg-white p-6 shadow-sm">

                <h2 className="text-lg font-bold text-slate-900">
                    Imóvel
                </h2>

                <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">

                    <div>
                        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Descrição
                        </span>

                        <p className="mt-1 font-medium text-slate-900">
                            {contrato.imv_descricao}
                        </p>
                    </div>

                    <div>
                        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Valor do aluguel
                        </span>

                        <p className="mt-1 font-medium text-slate-900">
                            {formatarValor(contrato.imv_valor)}
                        </p>
                    </div>

                    <div>
                        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Endereço
                        </span>

                        <p className="mt-1 text-slate-700">
                            {contrato.imv_endereco}
                        </p>
                    </div>

                    <div>
                        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            CEP
                        </span>

                        <p className="mt-1 text-slate-700">
                            {contrato.imv_cep}
                        </p>
                    </div>

                    <div>
                        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Bairro
                        </span>

                        <p className="mt-1 text-slate-700">
                            {contrato.imv_bairro}
                        </p>
                    </div>

                    <div>
                        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Cidade
                        </span>

                        <p className="mt-1 text-slate-700">
                            {contrato.imv_cidade}
                        </p>
                    </div>

                </div>

            </section>

            {/* CLIENTE */}

            <section className="rounded-xl bg-white p-6 shadow-sm">

                <h2 className="text-lg font-bold text-slate-900">
                    Cliente
                </h2>

                <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">

                    <div>
                        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Nome
                        </span>

                        <p className="mt-1 font-medium text-slate-900">
                            {contrato.usu_nome}
                        </p>
                    </div>

                    <div>
                        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            E-mail
                        </span>

                        <p className="mt-1 text-slate-700">
                            {contrato.usu_email}
                        </p>
                    </div>

                    <div>
                        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            ID do cliente
                        </span>

                        <p className="mt-1 text-slate-700">
                            {contrato.usu_id}
                        </p>
                    </div>

                    <div>
                        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            ID do imóvel
                        </span>

                        <p className="mt-1 text-slate-700">
                            {contrato.imv_id}
                        </p>
                    </div>

                </div>

            </section>

        </div>
    </main>
);


}
