"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AlugueisAdmin() {
    const [alugueis, setAlugueis] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [busca, setBusca] = useState("");
    const [filtroStatus, setFiltroStatus] = useState("TODOS");

    const router = useRouter();

    useEffect(() => {
        async function carregarAlugueis() {
            try {
                const resposta = await fetch(
                    "http://localhost:3000/admin/alugueis",
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );

                if (!resposta.ok) {
                    const erro = await resposta.json();
                    console.log("ERRO AO BUSCAR ALUGUÉIS:", erro);
                    return;
                }

                const dados = await resposta.json();
                setAlugueis(dados);

            } catch (error) {
                console.log("Erro ao buscar aluguéis:", error);
            } finally {
                setCarregando(false);
            }
        }

        carregarAlugueis();
    }, []);

    

    function formatarValor(valor) {
        return Number(valor).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    function formatarData(data) {
        if (!data) return "-";

        return new Date(data).toLocaleDateString("pt-BR", {
            timeZone: "UTC"
        });
    }
    

    if (carregando) {
        return (
            <main className="p-8">
                <p className="text-slate-500">
                    Carregando mensalidades...
                </p>
            </main>
        );
    }

    const totalAlugueis = alugueis.length;

    const alugueisPagos = alugueis.filter(aluguel => aluguel.alu_status === "PAGO").length;

    const alugueisPendentes = alugueis.filter(aluguel => aluguel.alu_status === "PENDENTE").length;

    const alugueisAtrasados = alugueis.filter(aluguel => aluguel.alu_status === "ATRASADO").length;

    const alugueisFiltrados = alugueis.filter((aluguel) => {const termo = busca.toLowerCase();

        const correspondeBusca =
            aluguel.usu_nome?.toLowerCase().includes(termo) ||
            aluguel.usu_email?.toLowerCase().includes(termo) ||
            aluguel.imv_descricao?.toLowerCase().includes(termo);

        const correspondeStatus =filtroStatus === "TODOS" || aluguel.alu_status === filtroStatus;

        return correspondeBusca && correspondeStatus;
    });

    return (
        <main className="p-8">
            <button
                type="button"
                onClick={() => router.push("/admin")}
                className="mb-4 inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
            >
                ← Voltar
            </button>

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">
                    Aluguéis
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                    Gerenciamento das mensalidades dos contratos ativos.
                </p>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

                <div className="rounded-xl bg-white p-5 shadow-sm">
                    <span className="text-sm font-medium text-slate-500">
                        Total de mensalidades
                    </span>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                        {totalAlugueis}
                    </p>
                </div>

                    <div className="rounded-xl bg-white p-5 shadow-sm">
                        <span className="text-sm font-medium text-slate-500">
                            Pagas
                        </span>

                        <p className="mt-2 text-3xl font-bold text-black">
                            {alugueisPagos}
                        </p>
                    </div>

                        <div className="rounded-xl bg-white p-5 shadow-sm">
                            <span className="text-sm font-medium text-slate-500">
                                Pendentes
                            </span>

                            <p className="mt-2 text-3xl font-bold text-black">
                                {alugueisPendentes}
                            </p>
                        </div>

                            <div className="rounded-xl bg-white p-5 shadow-sm">
                                <span className="text-sm font-medium text-slate-500">
                                    Atrasadas
                                </span>

                                <p className="mt-2 text-3xl font-bold text-black">
                                    {alugueisAtrasados}
                                </p>
                            </div>

                        </div>

                        <div className="mb-6 flex flex-col gap-4 md:flex-row">

                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Buscar cliente, e-mail ou imóvel..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                <div className="w-full md:w-72">
                    <select
                        value={filtroStatus}
                        onChange={(e) => setFiltroStatus(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                        <option value="TODOS">Todos os status</option>
                        <option value="PAGO">Pagos</option>
                        <option value="PENDENTE">Pendentes</option>
                        <option value="ATRASADO">Atrasados</option>
                        <option value="CANCELADO">Cancelados</option>
                    </select>
                </div>

                    </div>

            <div className="overflow-hidden rounded-xl bg-white shadow-sm">

                <div className="overflow-x-auto">

                    <table className="w-full text-left">

                        <thead className="border-b border-slate-200 bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                                    Contrato
                                </th>

                                <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                                    Imóvel
                                </th>

                                <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                                    Cliente
                                </th>

                                <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                                    Mês
                                </th>

                                <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                                    Vencimento
                                </th>

                                <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                                    Valor
                                </th>

                                <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                                    Pagamento
                                </th>

                                <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                                    Status
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">

                            {alugueisFiltrados.map((aluguel) => (
                                <tr
                                    key={aluguel.alu_id}
                                    className="transition hover:bg-slate-50"
                                >

                                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                                        #{aluguel.ctr_id}
                                    </td>

                                    <td className="px-6 py-4">
                                        <p className="text-sm font-medium text-slate-900">
                                            {aluguel.imv_descricao}
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            ID: {aluguel.imv_id}
                                        </p>
                                    </td>

                                    <td className="px-6 py-4">
                                        <p className="text-sm font-medium text-slate-900">
                                            {aluguel.usu_nome}
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            {aluguel.usu_email}
                                        </p>
                                    </td>

                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {aluguel.alu_mes}
                                    </td>

                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {formatarData(aluguel.alu_vencimento)}
                                    </td>

                                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                                        {formatarValor(aluguel.alu_valor)}
                                    </td>

                                    <td className="px-6 py-4">

                                        <span
                                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                                                aluguel.alu_pago ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                                            }`}
                                        >
                                            {aluguel.alu_pago ? "Pago" : "Não pago"}
                                        </span>

                                    </td>

                                    <td className="px-6 py-4">

                                        <span
                                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                                                aluguel.alu_status === "PAGO"
                                                    ? "bg-green-100 text-green-700"
                                                    : aluguel.alu_status === "ATRASADO"
                                                    ? "bg-red-100 text-red-700"
                                                    : aluguel.alu_status === "CANCELADO"
                                                    ? "bg-slate-100 text-slate-600"
                                                    : "bg-blue-100 text-blue-700"
                                            }`}
                                        >
                                            {aluguel.alu_status}
                                        </span>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

                {alugueisFiltrados.length === 0 && (
                    <div className="px-6 py-12 text-center">
                        <p className="text-sm text-slate-500">
                            Nenhuma mensalidade encontrada.
                        </p>
                    </div>
                )}

            </div>

        </main>
    );
}