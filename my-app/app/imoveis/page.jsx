
"use client";

import {Search, MapPin, Building2, CircleDollarSign, SlidersHorizontal, X} from "lucide-react";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ImovelCard from "../../components/ImovelCard";

export default function ImoveisPage() {

  const searchParams = useSearchParams();

  const [imoveis, setImoveis] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [valorMinimo, setValorMinimo] = useState("");
  const [valorMaximo, setValorMaximo] = useState("");

  const [cidadeSelecionada, setCidadeSelecionada] = useState("");
  const [bairroSelecionado, setBairroSelecionado] = useState("");

  const [erro, setErro] = useState("");

  function normalizarTexto(texto) {
    return texto
      ?.normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLowerCase();
  }

  /*
   * Carrega os imóveis disponíveis.
   */
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
        throw new Error(
          dados.msg || "Erro ao carregar imóveis"
        );
      }

      setImoveis(dados);

    } catch (error) {

      console.error("Erro ao carregar imóveis:", error);

      setErro(error.message);

    } finally {

      setCarregando(false);

    }
  }

  /*
   * Carrega os imóveis somente uma vez.
   */
  useEffect(() => {
    carregarImoveis();
  }, []);

  /*
   * Lê os filtros enviados pela Home através da URL.
   */
  useEffect(() => {

    const cidade = searchParams.get("cidade") || "";
    const bairro = searchParams.get("bairro") || "";
    const min = searchParams.get("min") || "";
    const max = searchParams.get("max") || "";

    setCidadeSelecionada(cidade);
    setBairroSelecionado(bairro);
    setValorMinimo(min);
    setValorMaximo(max);

  }, [searchParams]);

  /*
   * Monta a lista de cidades disponíveis.
   */
  const cidades = [
    ...new Set(
      imoveis
        .map((imovel) => imovel.cidade)
        .filter(Boolean)
    )
  ].sort((a, b) =>
    a.localeCompare(b, "pt-BR")
  );

  /*
   * Monta a lista de bairros de acordo
   * com a cidade selecionada.
   */
  const bairros = cidadeSelecionada
    ? [
        ...new Set(
          imoveis
            .filter(
              (imovel) =>
                normalizarTexto(imovel.cidade) ===
                normalizarTexto(cidadeSelecionada)
            )
            .map((imovel) => imovel.bairro)
            .filter(Boolean)
        )
      ].sort((a, b) =>
        a.localeCompare(b, "pt-BR")
      )
    : [];

  /*
   * Aplica todos os filtros.
   */
  const imoveisFiltrados = imoveis.filter((imovel) => {

    const valor = Number(imovel.valor);

    const atendeMinimo =
      valorMinimo === "" ||
      valor >= Number(valorMinimo);

    const atendeMaximo =
      valorMaximo === "" ||
      valor <= Number(valorMaximo);

    const atendeCidade =
      cidadeSelecionada === "" ||
      normalizarTexto(imovel.cidade) ===
        normalizarTexto(cidadeSelecionada);

    const atendeBairro =
      bairroSelecionado === "" ||
      normalizarTexto(imovel.bairro) ===
        normalizarTexto(bairroSelecionado);

    return (
      atendeMinimo &&
      atendeMaximo &&
      atendeCidade &&
      atendeBairro
    );
  });

  /*
   * Quando a cidade muda manualmente,
   * o bairro precisa ser resetado.
   */
  function alterarCidade(event) {

    const cidade = event.target.value;

    setCidadeSelecionada(cidade);
    setBairroSelecionado("");

  }

  /*
   * Limpa todos os filtros.
   */
  function limparFiltros() {

    setValorMinimo("");
    setValorMaximo("");
    setCidadeSelecionada("");
    setBairroSelecionado("");

  }

  /*
   * Verifica se existe algum filtro ativo.
   */
  const filtrosAtivos =
    valorMinimo !== "" ||
    valorMaximo !== "" ||
    cidadeSelecionada !== "" ||
    bairroSelecionado !== "";

  return (

    <main className="min-h-screen bg-slate-50">

      {/* CABEÇALHO DA PÁGINA */}

      <section className="border-b border-slate-200 bg-white">

        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

            <div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Encontre seu próximo imóvel
              </h1>

              <p className="mt-2 max-w-2xl text-slate-500">
                Explore nossa seleção de imóveis disponíveis e
                encontre uma opção que combine com você.
              </p>

            </div>


            {/* CONTADOR */}

            {!carregando && !erro && (

              <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2.5">

                <span className="text-lg font-bold text-slate-900">
                  {imoveisFiltrados.length}
                </span>

                <span className="text-sm text-slate-500">
                  {imoveisFiltrados.length === 1
                    ? "imóvel encontrado"
                    : "imóveis encontrados"}
                </span>

              </div>

            )}

          </div>

        </div>

      </section>


      {/* CONTEÚDO */}

      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">


        {/* FILTROS */}

        <section className="mb-10">

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* CABEÇALHO DOS FILTROS */}

            <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-3">

                <div>

                  <h2 className="text-sm font-semibold text-slate-900">
                    Filtrar imóveis
                  </h2>

                </div>

              </div>


              {filtrosAtivos && (

                <button
                  type="button"
                  onClick={limparFiltros}
                  className="flex items-center gap-1.5 self-start text-sm font-medium text-blue-600 transition hover:text-blue-800 sm:self-auto"
                >

                  <X size={15} />

                  Limpar filtros

                </button>

              )}

            </div>


            {/* CAMPOS */}

            <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2 lg:grid-cols-4">


              {/* VALOR MÍNIMO */}

              <div>

                <label
                  htmlFor="valorMinimo"
                  className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-600"
                >

                  <CircleDollarSign
                    size={15}
                    className="text-blue-600"
                  />

                  Valor mínimo

                </label>

                <input
                  id="valorMinimo"
                  type="number"
                  min="0"
                  placeholder="R$ 0,00"
                  value={valorMinimo}
                  onChange={(event) =>
                    setValorMinimo(event.target.value)
                  }
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>


              {/* VALOR MÁXIMO */}

              <div>

                <label
                  htmlFor="valorMaximo"
                  className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-600"
                >

                  <CircleDollarSign
                    size={15}
                    className="text-blue-600"
                  />

                  Valor máximo

                </label>

                <input
                  id="valorMaximo"
                  type="number"
                  min="0"
                  placeholder="R$ 0,00"
                  value={valorMaximo}
                  onChange={(event) =>
                    setValorMaximo(event.target.value)
                  }
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>


              {/* CIDADE */}

              <div>

                <label
                  htmlFor="cidade"
                  className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-600"
                >

                  <MapPin
                    size={15}
                    className="text-blue-600"
                  />

                  Cidade

                </label>

                <select
                  id="cidade"
                  value={cidadeSelecionada}
                  onChange={alterarCidade}
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >

                  <option value="">
                    Todas as cidades
                  </option>

                  {cidades.map((cidade) => (

                    <option
                      key={cidade}
                      value={cidade}
                    >
                      {cidade}
                    </option>

                  ))}

                </select>

              </div>


              {/* BAIRRO */}

              <div>

                <label
                  htmlFor="bairro"
                  className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-600"
                >

                  <Building2
                    size={15}
                    className="text-blue-600"
                  />

                  Bairro

                </label>

                <select
                  id="bairro"
                  value={bairroSelecionado}
                  onChange={(event) =>
                    setBairroSelecionado(event.target.value)
                  }
                  disabled={!cidadeSelecionada}
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-900 outline-none transition disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >

                  <option value="">
                    {cidadeSelecionada
                      ? "Todos os bairros"
                      : "Selecione uma cidade"}
                  </option>

                  {bairros.map((bairro) => (

                    <option
                      key={bairro}
                      value={bairro}
                    >
                      {bairro}
                    </option>

                  ))}

                </select>

              </div>

            </div>

          </div>

        </section>


        {/* RESULTADOS */}

        <section>


          {/* CABEÇALHO DOS RESULTADOS */}

          {!carregando && !erro && imoveisFiltrados.length > 0 && (

            <div className="mb-6 flex items-center justify-between">

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  Imóveis disponíveis
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Confira as opções encontradas para você.
                </p>

              </div>

            </div>

          )}


          {/* CARREGANDO */}

          {carregando && (

            <div className="flex min-h-60 items-center justify-center">

              <div className="text-center">

                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                <p className="text-sm text-slate-600">
                  Carregando imóveis...
                </p>

              </div>

            </div>

          )}


          {/* ERRO */}

          {!carregando && erro && (

            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">

              <p className="font-medium text-red-700">
                Não foi possível carregar os imóveis.
              </p>

              <p className="mt-1 text-sm text-red-600">
                {erro}
              </p>

              <button
                type="button"
                onClick={carregarImoveis}
                className="mt-4 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
              >
                Tentar novamente
              </button>

            </div>

          )}


          {/* NENHUM IMÓVEL */}

          {!carregando &&
            !erro &&
            imoveisFiltrados.length === 0 && (

              <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">

                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">

                  <Search
                    size={30}
                    className="text-slate-400"
                  />

                </div>

                <h2 className="text-xl font-semibold text-slate-900">
                  Nenhum imóvel encontrado
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                  Não encontramos imóveis disponíveis com os
                  filtros selecionados.
                </p>

                {filtrosAtivos && (

                  <button
                    type="button"
                    onClick={limparFiltros}
                    className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                  >
                    Limpar filtros
                  </button>

                )}

              </div>

            )}


          {/* LISTA DE IMÓVEIS */}

          {!carregando &&
            !erro &&
            imoveisFiltrados.length > 0 && (

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

                {/*
                 * IMPORTANTE:
                 * Os cards permanecem exatamente como estavam.
                 */}

                {imoveisFiltrados.map((imovel) => (

                  <ImovelCard
                    key={imovel.id}
                    imovel={imovel}
                  />

                ))}

              </div>

            )}

        </section>

      </div>

    </main>
  );
}
