"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

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
                    setErro(dados.msg || "Não foi possível carregar o imóvel.");
                    return;
                }

                /*
                 * A rota /imovel/:id retorna o imóvel.
                 * Caso o service retorne uma lista, pegamos o primeiro.
                 */
                const dadosImovel = Array.isArray(dados)
                    ? dados[0]
                    : dados;

                setImovel({
                    descricao: dadosImovel.descricao ?? "",
                    cep: dadosImovel.cep ?? "",
                    endereco: dadosImovel.endereco ?? "",
                    bairro: dadosImovel.bairro ?? "",
                    cidade: dadosImovel.cidade ?? "",
                    valor: dadosImovel.valor ?? "",
                    disponivel: dadosImovel.disponivel ?? "S"
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
                    dados.msg || "Não foi possível alterar o imóvel."
                );

                return;
            }

            alert("Imóvel alterado com sucesso!");

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
            <main className="min-h-screen p-8">
                <div className="mx-auto max-w-4xl">

                    <p className="text-slate-500">
                        Carregando imóvel...
                    </p>

                </div>
            </main>
        );

    }


    if (erro && !imovel.descricao) {

        return (
            <main className="min-h-screen p-8">
                <div className="mx-auto max-w-4xl">

                    <div className="rounded-xl bg-white p-8 shadow-sm">

                        <h1 className="text-2xl font-bold text-slate-900">
                            Erro
                        </h1>

                        <p className="mt-2 text-red-600">
                            {erro}
                        </p>

                        <button
                            type="button"
                            onClick={() => router.push("/admin")}
                            className="mt-6 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                            Voltar
                        </button>

                    </div>

                </div>
            </main>
        );

    }


    return (
        <main className="min-h-screen p-8">

            <div className="mx-auto max-w-4xl">

                {/* Cabeçalho */}
                <div className="mb-8">

                    <button
                        type="button"
                        onClick={() => router.push("/admin")}
                        className="mb-4 text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                        ← Voltar para imóveis
                    </button>

                    <h1 className="text-3xl font-bold text-slate-900">
                        Editar imóvel
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Altere as informações do imóvel abaixo.
                    </p>

                </div>


                {/* Formulário */}
                <form
                    onSubmit={salvar}
                    className="rounded-xl bg-white p-8 shadow-sm"
                >

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                        {/* Descrição */}
                        <div className="md:col-span-2">

                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Descrição
                            </label>

                            <input
                                type="text"
                                name="descricao"
                                value={imovel.descricao}
                                onChange={alterarCampo}
                                required
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-black outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                        </div>


                        {/* CEP */}
                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                CEP
                            </label>

                            <input
                                type="text"
                                name="cep"
                                value={imovel.cep}
                                onChange={alterarCampo}
                                required
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-black outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                        </div>


                        {/* Endereço */}
                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Endereço
                            </label>

                            <input
                                type="text"
                                name="endereco"
                                value={imovel.endereco}
                                onChange={alterarCampo}
                                required
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-black outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                        </div>


                        {/* Bairro */}
                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Bairro
                            </label>

                            <input
                                type="text"
                                name="bairro"
                                value={imovel.bairro}
                                onChange={alterarCampo}
                                required
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-black outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                        </div>


                        {/* Cidade */}
                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Cidade
                            </label>

                            <input
                                type="text"
                                name="cidade"
                                value={imovel.cidade}
                                onChange={alterarCampo}
                                required
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-black outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                        </div>


                        {/* Valor */}
                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Valor do aluguel
                            </label>

                            <input
                                type="number"
                                name="valor"
                                value={imovel.valor}
                                onChange={alterarCampo}
                                min="0"
                                step="0.01"
                                required
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-black outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                        </div>


                        {/* Disponibilidade */}
                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Disponibilidade
                            </label>

                            <select
                                name="disponivel"
                                value={imovel.disponivel}
                                onChange={alterarCampo}
                                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            >

                                <option value="S">
                                    Disponível
                                </option>

                                <option value="N">
                                    Indisponível
                                </option>

                            </select>

                        </div>

                    </div>


                    {/* Erro */}
                    {erro && (
                        <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                            {erro}
                        </div>
                    )}


                    {/* Botões */}
                    <div className="mt-8 flex justify-end gap-3 border-t border-slate-200 pt-6">

                        <button
                            type="button"
                            onClick={() => router.push("/admin")}
                            className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={salvando}
                            className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {salvando
                                ? "Salvando..."
                                : "Salvar alterações"
                            }
                        </button>

                    </div>

                </form>

            </div>

        </main>
    );
}