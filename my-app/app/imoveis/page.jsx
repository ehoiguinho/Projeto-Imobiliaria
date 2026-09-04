"use client";

import { useState, useEffect } from "react";
import ImovelCard from "../../components/ImovelCard";

export default function ImoveisPage() {
  const [imoveis, setImoveis] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [valorMinimo, setValorMinimo] = useState("");
  const [valorMaximo, setValorMaximo] = useState("");

  const [cidadeSelecionada, setCidadeSelecionada] = useState("");
  const [bairroSelecionado, setBairroSelecionado] = useState("");

  const [erro, setErro] = useState("");

  async function carregarImoveis() {
    try {
      setCarregando(true);
      setErro("");

      const resposta = await fetch(
        "http://localhost:3000/imovel/disponivel",
        {
          method: "GET",
          credentials: "include"
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.msg || "Erro ao carregar imóveis");
      }

      setImoveis(dados);
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarImoveis();
  }, []);

  // Obtém as cidades existentes nos imóveis
  const cidades = [
    ...new Set(
      imoveis
        .map((imovel) => imovel.cidade)
        .filter(Boolean)
    )
  ].sort();

  // Obtém somente os bairros da cidade selecionada
  const bairros = [
    ...new Set(
      imoveis
        .filter((imovel) => imovel.cidade === cidadeSelecionada)
        .map((imovel) => imovel.bairro)
        .filter(Boolean)
    )
  ].sort();

  // Aplica todos os filtros
  const imoveisFiltrados = imoveis.filter((imovel) => {
    const valor = Number(imovel.valor);

    const atendeMinimo =
      valorMinimo === "" || valor >= Number(valorMinimo);

    const atendeMaximo =
      valorMaximo === "" || valor <= Number(valorMaximo);

    const atendeCidade =
      cidadeSelecionada === "" ||
      imovel.cidade === cidadeSelecionada;

    const atendeBairro =
      bairroSelecionado === "" ||
      imovel.bairro === bairroSelecionado;

    return (
      atendeMinimo &&
      atendeMaximo &&
      atendeCidade &&
      atendeBairro
    );
  });

  function alterarCidade(event) {
    const cidade = event.target.value;

    setCidadeSelecionada(cidade);

    // Ao trocar a cidade, limpa o bairro selecionado
    setBairroSelecionado("");
  }

  function limparFiltros() {
    setValorMinimo("");
    setValorMaximo("");
    setCidadeSelecionada("");
    setBairroSelecionado("");
  }

  const filtrosAtivos =
    valorMinimo !== "" ||
    valorMaximo !== "" ||
    cidadeSelecionada !== "" ||
    bairroSelecionado !== "";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Cabeçalho */}
        <header className="mb-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600">
                Encontre seu próximo lar
              </p>

              <p className="mt-2 max-w-2xl text-slate-500">
                Confira os imóveis disponíveis para locação e encontre a opção
                ideal para você.
              </p>
            </div>
          </div>
        </header>

        {/* Filtros */}
        {!carregando && !erro && imoveis.length > 0 && (
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Filtrar imóveis
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Encontre imóveis de acordo com seu orçamento e localização.
                </p>
              </div>

              {filtrosAtivos && (
                <button
                  type="button"
                  onClick={limparFiltros}
                  className="self-start text-sm font-semibold text-blue-600 transition hover:text-blue-700 sm:self-auto"
                >
                  Limpar filtros
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
  {/* Valor mínimo */}
  <div>
    <label className="mb-2 block text-sm font-semibold text-slate-700">
      Valor mínimo
    </label>

    <input
      type="number"
      value={valorMinimo}
      onChange={(e) => setValorMinimo(e.target.value)}
      placeholder="Ex.: 1000"
      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
    />
  </div>

  {/* Valor máximo */}
  <div>
    <label className="mb-2 block text-sm font-semibold text-slate-700">
      Valor máximo
    </label>

    <input
      type="number"
      value={valorMaximo}
      onChange={(e) => setValorMaximo(e.target.value)}
      placeholder="Ex.: 3000"
      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
    />
  </div>

  {/* Cidade */}
<div className="w-full">
  <label className="mb-2 block text-sm font-semibold text-slate-700">
    Cidade
  </label>

  <select
    value={cidadeSelecionada}
    onChange={alterarCidade}
    className="h-[50px] w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
  >
    <option value="">Todas as cidades</option>

    {cidades.map((cidade) => (
      <option key={cidade} value={cidade}>
        {cidade}
      </option>
    ))}
  </select>
</div>

{/* Bairro */}
<div className="w-full">
  <label className="mb-2 block text-sm font-semibold text-slate-700">
    Bairro
  </label>

  <select
    value={bairroSelecionado}
    onChange={(e) => setBairroSelecionado(e.target.value)}
    disabled={!cidadeSelecionada}
    className="h-[50px] w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
  >
    <option value="">
      {cidadeSelecionada
        ? "Todos os bairros"
        : "Selecione uma cidade"}
    </option>

    {bairros.map((bairro) => (
      <option key={bairro} value={bairro}>
        {bairro}
      </option>
    ))}
  </select>
  </div>
</div>
          </section>
        )}

        {/* Contador */}
        {!carregando && !erro && imoveis.length > 0 && (
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              <span className="font-semibold text-slate-900">
                {imoveisFiltrados.length}
              </span>{" "}
              {imoveisFiltrados.length === 1
                ? "imóvel encontrado"
                : "imóveis encontrados"}
            </p>

            {filtrosAtivos && (
              <span className="text-xs font-medium text-slate-400">
                Filtros aplicados
              </span>
            )}
          </div>
        )}

        {/* Carregando */}
        {carregando && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="font-medium text-slate-600">
              Carregando imóveis...
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Aguarde enquanto buscamos as opções disponíveis.
            </p>
          </div>
        )}

        {/* Erro */}
        {erro && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="font-semibold text-red-800">
              Não foi possível carregar os imóveis.
            </p>

            <p className="mt-1 text-sm text-red-600">
              {erro}
            </p>
          </div>
        )}

        {/* Nenhum imóvel */}
        {!carregando && !erro && imoveis.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
            <div className="text-4xl">
              🏠
            </div>

            <h2 className="mt-4 text-lg font-bold text-slate-900">
              Nenhum imóvel disponível
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              No momento não existem imóveis disponíveis para locação.
              Tente novamente mais tarde.
            </p>
          </div>
        )}

        {/* Nenhum imóvel encontrado pelos filtros */}
        {!carregando &&
          !erro &&
          imoveis.length > 0 &&
          imoveisFiltrados.length === 0 && (
            <div className="rounded-2xl border border-slate-500 bg-white px-6 py-12 text-center shadow-sm">
              <div className="text-4xl">
                🔎
              </div>

              <h2 className="mt-4 text-lg font-bold text-slate-900">
                Nenhum imóvel encontrado
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                Não encontramos imóveis que correspondam aos filtros
                selecionados.
              </p>

              <button
                type="button"
                onClick={limparFiltros}
                className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
              >
                Limpar filtros
              </button>
            </div>
          )}

        {/* Lista */}
        {!carregando &&
          !erro &&
          imoveisFiltrados.length > 0 && (
            <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {imoveisFiltrados.map((imovel) => (
                <ImovelCard
                  key={imovel.id}
                  imovel={imovel}
                />
              ))}
            </section>
          )}

      </div>
    </main>
  );
}