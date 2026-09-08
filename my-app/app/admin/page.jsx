"use client";

import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {

    const [imoveis, setImoveis] = useState([]);
    const [contratos, setContratos] = useState([]);
    const [alugueis, setAlugueis] = useState([]);

    const router = useRouter();

    const [busca, setBusca] = useState("");
    const [filtroStatus, setFiltroStatus] = useState("TODOS");

    useEffect(() => {

    async function carregarDados() {

        try {

            const [
                respostaImoveis,
                respostaContratos,
                respostaAlugueis
            ] = await Promise.all([
                fetch("http://localhost:3000/admin/imoveis", {
                    method: "GET",
                    credentials: "include"
                }),

                fetch("http://localhost:3000/admin/contratos", {
                    method: "GET",
                    credentials: "include"
                }),

                fetch("http://localhost:3000/admin/alugueis", {
                    method: "GET",
                    credentials: "include"
                })
            ]);

            const dadosImoveis = await respostaImoveis.json();
            const dadosContratos = await respostaContratos.json();
            const dadosAlugueis = await respostaAlugueis.json();

            if (!respostaImoveis.ok) {
                throw new Error(
                    dadosImoveis.msg || "Erro ao carregar imóveis."
                );
            }

            if (!respostaContratos.ok) {
                throw new Error(
                    dadosContratos.msg || "Erro ao carregar contratos."
                );
            }

            if (!respostaAlugueis.ok) {
                throw new Error(
                    dadosAlugueis.msg || "Erro ao carregar aluguéis."
                );
            }

            setImoveis(dadosImoveis);
            setContratos(dadosContratos);
            setAlugueis(dadosAlugueis);

        } catch (error) {

            console.log(
                "Erro ao carregar dados administrativos:",
                error
            );

            toast.error(
                error.message ||
                "Erro ao carregar dados administrativos."
            );
        }
    }

    carregarDados();

}, []);

    async function excluirImovel(id) {

    const confirmar = window.confirm(
        "Tem certeza que deseja excluir este imóvel?"
    );

    if (!confirmar) {
        return;
    }

    const toastId = toast.loading("Excluindo imóvel...");

    try {

        const resposta = await fetch(
            `http://localhost:3000/imovel/${id}`,
            {
                method: "DELETE",
                credentials: "include"
            }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
            toast.error(
                dados.msg || "Não foi possível excluir o imóvel.",
                {
                    id: toastId
                }
            );
            return;
        }

        setImoveis((imoveisAtuais) =>
            imoveisAtuais.filter(
                (imovel) => imovel.imv_id !== id
            )
        );

        toast.success("Imóvel excluído com sucesso!", {
            id: toastId
        });

    } catch (error) {

        console.log("Erro ao excluir imóvel:", error);

        toast.error("Erro ao excluir o imóvel.", {
            id: toastId
        });
    }
}

    // Filtro dos imóveis
    const imoveisFiltrados = imoveis.filter((imovel) => {

        const textoBusca = busca.toLowerCase();

        const correspondeBusca =
            imovel.imv_descricao?.toLowerCase().includes(textoBusca) ||
            imovel.imv_endereco?.toLowerCase().includes(textoBusca) ||
            imovel.imv_bairro?.toLowerCase().includes(textoBusca) ||
            imovel.imv_cidade?.toLowerCase().includes(textoBusca);

        const correspondeStatus =
            filtroStatus === "TODOS" ||
            imovel.imv_disponivel === filtroStatus;

        return correspondeBusca && correspondeStatus;
    });

    function formatarValor(valor) {
        return Number(valor).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    return (
        <main className="min-h-screen p-8">
            <div className="mx-auto max-w-7xl">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">
                        Painel Administrativo
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Gerencie imóveis, contratos e aluguéis.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <span className="text-sm font-medium text-slate-500">
                            Imóveis
                        </span>

                        <p className="mt-2 text-3xl font-bold text-slate-900">
                            {imoveis.length}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                            Total de imóveis
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => router.push("/admin/contratos")}
                        className="group rounded-xl bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    >
                        <span className="text-sm font-medium text-slate-500">
                            Contratos
                        </span>

                        <p className="mt-2 text-3xl font-bold text-slate-900">
                            {contratos.length}
                        </p>

                        <p className="mt-2 text-sm font-medium text-blue-600 group-hover:underline">
                            Gerenciar contratos →
                        </p>
                    </button>

                    <button
                        type="button"
                        onClick={() => router.push("/admin/alugueis")}
                        className="group rounded-xl bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    >
                        <span className="text-sm font-medium text-slate-500">
                            Aluguéis
                        </span>

                        <p className="mt-2 text-3xl font-bold text-slate-900">
                            {alugueis.length}
                        </p>

                        <p className="mt-2 text-sm font-medium text-blue-600 group-hover:underline">
                            Gerenciar aluguéis →
                        </p>
                    </button>

                </div>

                <section className="mt-8 rounded-xl bg-white shadow-sm">

                    <div className="border-b border-slate-200 p-6">

                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                            <div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    Imóveis
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Todos os imóveis cadastrados no sistema.
                                </p>
                            </div>

                            <span className="text-sm text-slate-500">
                                {imoveisFiltrados.length} imóvel(is)
                            </span>

                        </div>

                        <div className="mt-5 flex flex-col gap-3 md:flex-row">

                            <input
                                type="text"
                                placeholder="Buscar imóvel..."
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)}
                                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 md:max-w-md"
                            />

                            <select
                                value={filtroStatus}
                                onChange={(e) => setFiltroStatus(e.target.value)}
                                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="TODOS">
                                    Todos
                                </option>

                                <option value="S">
                                    Disponíveis
                                </option>

                                <option value="N">
                                    Indisponíveis
                                </option>
                            </select>

                        </div>

                    </div>

                    <div className="overflow-x-auto">

                        <table className="w-full text-left">

                            <thead className="border-b border-slate-200 bg-slate-50">
                                <tr>

                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Imóvel
                                    </th>

                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Endereço
                                    </th>

                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Cidade
                                    </th>

                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Valor
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

                                {imoveisFiltrados.map((imovel) => (

                                    <tr
                                        key={imovel.imv_id}
                                        className="transition hover:bg-slate-50"
                                    >

                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-slate-900">
                                                    {imovel.imv_descricao}
                                                </p>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            <div>
                                                {imovel.imv_endereco}
                                            </div>

                                            <div className="text-xs text-slate-400">
                                                {imovel.imv_bairro}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {imovel.imv_cidade}
                                        </td>

                                        <td className="px-6 py-4 text-sm font-medium text-slate-900">
                                            {formatarValor(imovel.imv_valor)}
                                        </td>

                                        <td className="px-6 py-4">

                                            {imovel.imv_disponivel === "S" ? (

                                                <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                                    Disponível
                                                </span>

                                            ) : (

                                                <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                                                    Indisponível
                                                </span>

                                            )}

                                        </td>

                                       <td className="px-6 py-4">

                                        <div className="flex gap-2">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    router.push(
                                                        `/admin/imoveis/editar/${imovel.imv_id}`
                                                    )
                                                }
                                                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                                            >
                                                    Editar
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        excluirImovel(imovel.imv_id)
                                                    }
                                                    className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                                                >
                                                    Excluir
                                                </button>

                                        </div>

                                    </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                        {imoveisFiltrados.length === 0 && (

                            <div className="p-10 text-center">

                                <p className="font-medium text-slate-700">
                                    Nenhum imóvel encontrado.
                                </p>

                                <p className="mt-1 text-sm text-slate-400">
                                    Tente alterar a busca ou o filtro.
                                </p>

                            </div>

                        )}

                    </div>

                </section>

            </div>
        </main>
    );
}

