"use client";
import { Search } from "lucide-react";
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

  /*
   * Normaliza textos para permitir comparações
   * ignorando:
   * - maiúsculas/minúsculas
   * - acentos
   * - espaços extras
   *
   * Exemplo:
   * "Santo André" === "santo andre"
   */
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
   *
   * Exemplo:
   * /imoveis?cidade=Santo+André&bairro=Campestre&min=1000&max=2500
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
   * Monta a lista de bairros de acordo com
   * a cidade selecionada.
   *
   * A comparação também é normalizada.
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
   *
   * Cada filtro é opcional.
   *
   * Cidade:
   *   somente cidade -> filtra pela cidade
   *
   * Cidade + bairro:
   *   filtra pelos dois
   *
   * Bairro:
   *   filtra pelo bairro
   *
   * Valores:
   *   mínimo e/ou máximo
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
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-6xl">

        {/* Cabeçalho */}
        <div className="mb-8">

          <h1 className="text-3xl font-bold text-slate-900">
            Imóveis disponíveis
          </h1>

          <p className="mt-2 text-slate-600">
            Encontre o imóvel ideal para você.
          </p>

        </div>

        {/* Filtros */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">

          <div className="mb-5">

            <h2 className="text-lg font-semibold text-slate-900">
              Filtros
            </h2>

            <p className="text-sm text-slate-500">
              Refine sua busca pelos imóveis disponíveis.
            </p>

          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">

            {/* Valor mínimo */}
            <div>

              <label
                htmlFor="valorMinimo"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Valor mínimo
              </label>

              <input
                id="valorMinimo"
                type="number"
                min="0"
                placeholder="R$"
                value={valorMinimo}
                onChange={(event) =>
                  setValorMinimo(event.target.value)
                }
                className="w-full rounded-lg border border-slate-300 text-black px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/* Valor máximo */}
            <div>

              <label
                htmlFor="valorMaximo"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Valor máximo
              </label>

              <input
                id="valorMaximo"
                type="number"
                min="0"
                placeholder="R$ "
                value={valorMaximo}
                onChange={(event) =>
                  setValorMaximo(event.target.value)
                }
                className="w-full rounded-lg border border-slate-300 text-black px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/* Cidade */}
            <div>

              <label
                htmlFor="cidade"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Cidade
              </label>

              <select
                id="cidade"
                value={cidadeSelecionada}
                onChange={alterarCidade}
                className="w-full rounded-lg border border-slate-300 bg-white text-black px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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

            {/* Bairro */}
            <div>

              <label
                htmlFor="bairro"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Bairro
              </label>

              <select
                id="bairro"
                value={bairroSelecionado}
                onChange={(event) =>
                  setBairroSelecionado(event.target.value)
                }
                disabled={!cidadeSelecionada}
                className="w-full rounded-lg border border-slate-300 text-black bg-white px-4 py-2.5 outline-none transition disabled:cursor-not-allowed disabled:bg-slate-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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

          {/* Informações dos filtros */}
          <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-sm text-slate-600">

              <span className="font-semibold text-slate-900">
                {imoveisFiltrados.length}
              </span>{" "}

              {imoveisFiltrados.length === 1
                ? "imóvel encontrado"
                : "imóveis encontrados"}

            </p>

            {filtrosAtivos && (
              <button
                type="button"
                onClick={limparFiltros}
                className="text-sm font-medium text-blue-600 transition hover:text-blue-800"
              >
                Limpar filtros
              </button>
            )}

          </div>

        </div>

        {/* Carregando */}
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

        {/* Erro */}
        {!carregando && erro && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">

            <p className="font-medium text-red-700">
              Não foi possível carregar os imóveis.
            </p>

            <p className="mt-1 text-sm text-red-600">
              {erro}
            </p>

            <button
              type="button"
              onClick={carregarImoveis}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
            >
              Tentar novamente
            </button>

          </div>
        )}

        {/* Nenhum imóvel */}
        {!carregando &&
          !erro &&
          imoveisFiltrados.length === 0 && (

            <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm">

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

        {/* Lista de imóveis */}
        {!carregando &&
          !erro &&
          imoveisFiltrados.length > 0 && (

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

              {imoveisFiltrados.map((imovel) => (

                <ImovelCard
                  key={imovel.id}
                  imovel={imovel}
                />

              ))}

            </div>
          )}

      </div>

    </main>
  );
}