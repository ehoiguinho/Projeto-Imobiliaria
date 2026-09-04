"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ContratosPage() {

const [contratos, setContratos] = useState([]);
const [carregando, setCarregando] = useState(true);

const [busca, setBusca] = useState("");
const [filtroStatus, setFiltroStatus] = useState("TODOS");

const router = useRouter();

useEffect(() => {
    async function carregarContratos() {
        try {
            const resposta = await fetch(
                "http://localhost:3000/admin/contratos",
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            const dados = await resposta.json();

            if (!resposta.ok) {
                console.log(
                    "Erro ao carregar contratos:",
                    dados
                );
                return;
            }

            setContratos(dados);

        } catch (error) {
            console.log(
                "Erro ao carregar contratos:",
                error
            );
        } finally {
            setCarregando(false);
        }
    }

    carregarContratos();
}, []);

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

const contratosFiltrados = contratos.filter((contrato) => {

    const textoBusca = busca.toLowerCase();

    const correspondeBusca =
        contrato.usu_nome?.toLowerCase().includes(textoBusca) ||
        contrato.usu_email?.toLowerCase().includes(textoBusca) ||
        contrato.imv_descricao?.toLowerCase().includes(textoBusca) ||
        contrato.imv_endereco?.toLowerCase().includes(textoBusca);

    const correspondeStatus =
        filtroStatus === "TODOS" ||
        contrato.con_status === filtroStatus;

    return correspondeBusca && correspondeStatus;
});

const totalContratos = contratos.length;

const contratosAtivos = contratos.filter(
    (contrato) => contrato.con_status === "ATIVO"
).length;

const contratosCancelados = contratos.filter(
    (contrato) => contrato.con_status === "CANCELADO"
).length;

return (
    <main className="min-h-screen p-8">
        <div className="mx-auto max-w-7xl">

            {/* CABEÇALHO */}

            <div className="mb-8">

                <button
                    type="button"
                    onClick={() => router.push("/admin")}
                    className="mb-4 inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                >
                    ← Voltar
                </button>

                <h1 className="text-3xl font-bold text-slate-900">
                    Contratos
                </h1>

                <p className="mt-2 text-slate-500">
                    Gerencie os contratos cadastrados no sistema.
                </p>

            </div>

            {/* INDICADORES */}

            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">

                <div className="rounded-xl bg-white p-6 shadow-sm">

                    <span className="text-sm font-medium text-slate-500">
                        Total de contratos
                    </span>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                        {totalContratos}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                        Contratos cadastrados
                    </p>

                </div>

                <div className="rounded-xl bg-white p-6 shadow-sm">

                    <span className="text-sm font-medium text-slate-500">
                        Contratos ativos
                    </span>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                        {contratosAtivos}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                        Contratos em andamento
                    </p>

                </div>

                <div className="rounded-xl bg-white p-6 shadow-sm">

                    <span className="text-sm font-medium text-slate-500">
                        Cancelados
                    </span>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                        {contratosCancelados}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                        Contratos encerrados
                    </p>

                </div>

            </div>

            {/* TABELA */}

            <section className="rounded-xl bg-white shadow-sm">

                {/* FILTROS */}

                <div className="border-b border-slate-200 p-6">

                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                        <div>

                            <h2 className="text-xl font-bold text-slate-900">
                                Lista de contratos
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Consulte os contratos cadastrados.
                            </p>

                        </div>

                        <span className="text-sm text-slate-500">
                            {contratosFiltrados.length} contrato(s)
                        </span>

                    </div>

                    <div className="mt-5 flex flex-col gap-3 md:flex-row">

                        <input
                            type="text"
                            placeholder="Buscar cliente, imóvel ou e-mail..."
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-black outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 md:max-w-md"
                        />

                        <select
                            value={filtroStatus}
                            onChange={(e) =>
                                setFiltroStatus(e.target.value)
                            }
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >

                            <option value="TODOS">
                                Todos
                            </option>

                            <option value="ATIVO">
                                Ativos
                            </option>

                            <option value="CANCELADO">
                                Cancelados
                            </option>

                        </select>

                    </div>

                </div>

                {/* CONTEÚDO */}

                {carregando ? (

                    <div className="p-10 text-center">

                        <p className="text-sm text-slate-500">
                            Carregando contratos...
                        </p>

                    </div>

                ) : contratosFiltrados.length === 0 ? (

                    <div className="p-10 text-center">

                        <p className="font-medium text-slate-700">
                            Nenhum contrato encontrado.
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                            Tente alterar a busca ou o filtro.
                        </p>

                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full text-left">

                            <thead className="border-b border-slate-200 bg-slate-50">

                                <tr>

                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Contrato
                                    </th>

                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Imóvel
                                    </th>

                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Endereço
                                    </th>

                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Cliente
                                    </th>

                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        E-mail
                                    </th>

                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Ações
                                    </th>

                                </tr>

                            </thead>

                            <tbody className="divide-y divide-slate-100">

                                {contratosFiltrados.map((contrato) => (

                                    <tr
                                        key={contrato.ctr_id}
                                        className="transition hover:bg-slate-50"
                                    >

                                        <td className="px-6 py-4">

                                            <span className="font-medium text-slate-900">
                                                #{contrato.ctr_id}
                                            </span>

                                        </td>

                                        <td className="px-6 py-4">

                                            <div className="font-medium text-slate-900">
                                                {contrato.imv_descricao}
                                            </div>

                                            <div className="text-xs text-slate-400">
                                                ID: {contrato.imv_id}
                                            </div>

                                        </td>

                                        <td className="px-6 py-4 text-sm text-slate-600">

                                            <div>
                                                {contrato.imv_endereco}
                                            </div>

                                            <div className="text-xs text-slate-400">
                                                {contrato.imv_bairro} -{" "}
                                                {contrato.imv_cidade}
                                            </div>

                                        </td>

                                        <td className="px-6 py-4">

                                            <div className="font-medium text-slate-900">
                                                {contrato.usu_nome}
                                            </div>

                                            <div className="text-xs text-slate-400">
                                                ID: {contrato.usu_id}
                                            </div>

                                        </td>

                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {contrato.usu_email}
                                        </td>

                                        <td className="px-6 py-4">
                                            {formatarStatus(
                                                contrato.con_status
                                            )}
                                        </td>

                                        <td className="px-6 py-4">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    router.push(
                                                        `/admin/contratos/${contrato.ctr_id}`
                                                    )
                                                }
                                                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                                            >
                                                Visualizar
                                            </button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>

        </div>
    </main>
);


}
