"use client";

import {
  Search,
  MapPin,
  Building2,
  CircleDollarSign,
  SlidersHorizontal,
  X
} from "lucide-react";

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
      console.log("IMÓVEIS RECEBIDOS:", dados);

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


  useEffect(() => {
    carregarImoveis();
  }, []);


  /*
   * Recupera os filtros enviados pela Home.
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

    <main className="min-h-screen bg-white text-[#292825]">


      {/* =====================================================
          CABEÇALHO
      ====================================================== */}

      <section className="border-b border-[#E7E5E0] bg-[#F7F5F0]">

        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">

          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">

            <div className="max-w-2xl">

              <h1 className="mt-4 text-4xl font-medium tracking-[-0.04em] text-[#292825] sm:text-5xl">
                Encontre seu próximo imóvel
              </h1>

              <p className="mt-4 max-w-xl text-base leading-7 text-[#77746E]">
                Explore nossa seleção de imóveis disponíveis
                e encontre um espaço que combine com seu
                momento e seu estilo de vida.
              </p>

            </div>


            {!carregando && !erro && (

              <div className="flex items-baseline gap-2 border-b border-[#292825] pb-2">

                <span className="text-3xl font-medium tracking-tight text-[#292825]">
                  {imoveisFiltrados.length}
                </span>

                <span className="text-sm text-[#77746E]">
                  {imoveisFiltrados.length === 1
                    ? "imóvel encontrado"
                    : "imóveis encontrados"}
                </span>

              </div>

            )}

          </div>

        </div>

      </section>


      {/* =====================================================
          CONTEÚDO
      ====================================================== */}

      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">


        {/* =====================================================
            FILTROS
        ====================================================== */}

        <section className="mb-12">

          <div className="border border-[#E3E0D9] bg-white">

            {/* CABEÇALHO */}

            <div className="flex flex-col gap-4 border-b border-[#E7E5E0] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center">

                  <SlidersHorizontal
                    size={17}
                    strokeWidth={1.6}
                    className="text-[#55534E]"
                  />

                </div>

                <div>

                  <h2 className="text-sm font-semibold text-[#292825]">
                    Filtrar imóveis
                  </h2>

                </div>

              </div>


              {filtrosAtivos && (

                <button
                  type="button"
                  onClick={limparFiltros}
                  className="
                    flex items-center gap-1.5
                    self-start
                    text-xs font-semibold uppercase
                    tracking-wide
                    text-[#77746E]
                    transition
                    hover:text-[#292825]
                    sm:self-auto
                  "
                >

                  <X size={14} strokeWidth={1.8} />

                  Limpar filtros

                </button>

              )}

            </div>


            {/* CAMPOS */}

            <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2 lg:grid-cols-4">


              {/* VALOR MÍNIMO */}

              <div>

                <label
                  htmlFor="valorMinimo"
                  className="
                    mb-2 flex items-center gap-1.5
                    text-[11px] font-semibold
                    uppercase tracking-wide
                    text-[#77746E]
                  "
                >

                  <CircleDollarSign
                    size={14}
                    strokeWidth={1.6}
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
                  className="
                    h-11 w-full
                    border border-[#D8D5CF]
                    bg-white
                    px-3.5
                    text-sm text-[#292825]
                    outline-none
                    transition
                    placeholder:text-[#B0ADA6]
                    focus:border-[#292825]
                  "
                />

              </div>


              {/* VALOR MÁXIMO */}

              <div>

                <label
                  htmlFor="valorMaximo"
                  className="
                    mb-2 flex items-center gap-1.5
                    text-[11px] font-semibold
                    uppercase tracking-wide
                    text-[#77746E]
                  "
                >

                  <CircleDollarSign
                    size={14}
                    strokeWidth={1.6}
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
                  className="
                    h-11 w-full
                    border border-[#D8D5CF]
                    bg-white
                    px-3.5
                    text-sm text-[#292825]
                    outline-none
                    transition
                    placeholder:text-[#B0ADA6]
                    focus:border-[#292825]
                  "
                />

              </div>


              {/* CIDADE */}

              <div>

                <label
                  htmlFor="cidade"
                  className="
                    mb-2 flex items-center gap-1.5
                    text-[11px] font-semibold
                    uppercase tracking-wide
                    text-[#77746E]
                  "
                >

                  <MapPin
                    size={14}
                    strokeWidth={1.6}
                  />

                  Cidade

                </label>

                <select
                  id="cidade"
                  value={cidadeSelecionada}
                  onChange={alterarCidade}
                  className="
                    h-11 w-full
                    border border-[#D8D5CF]
                    bg-white
                    px-3.5
                    text-sm text-[#292825]
                    outline-none
                    transition
                    focus:border-[#292825]
                  "
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
                  className="
                    mb-2 flex items-center gap-1.5
                    text-[11px] font-semibold
                    uppercase tracking-wide
                    text-[#77746E]
                  "
                >

                  <Building2
                    size={14}
                    strokeWidth={1.6}
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
                  className="
                    h-11 w-full
                    border border-[#D8D5CF]
                    bg-white
                    px-3.5
                    text-sm text-[#292825]
                    outline-none
                    transition
                    disabled:cursor-not-allowed
                    disabled:bg-[#F7F5F0]
                    disabled:text-[#B0ADA6]
                    focus:border-[#292825]
                  "
                >

                  <option value="">
                    {cidadeSelecionada
                      ? "Todos os bairros"
                      : "Selecione um bairro"}
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


        {/* =====================================================
            LISTAGEM
        ====================================================== */}

        <section>


          {!carregando &&
            !erro &&
            imoveisFiltrados.length > 0 && (

              <div className="mb-7 flex items-end justify-between">

                <div>

                  <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#8A8883]">
                    Nossa seleção
                  </p>

                  <h2 className="mt-2 text-2xl font-medium tracking-[-0.03em] text-[#292825]">
                    Imóveis disponíveis
                  </h2>

                </div>

                <span className="hidden text-xs text-[#A09D96] sm:block">
                  VITTA
                </span>

              </div>

            )}


          {/* LOADING */}

          {carregando && (

            <div className="flex min-h-60 items-center justify-center">

              <div className="text-center">

                <div className="mx-auto mb-5 h-8 w-8 animate-spin rounded-full border-2 border-[#DDDAD3] border-t-[#292825]" />

                <p className="text-sm text-[#77746E]">
                  Carregando imóveis...
                </p>

              </div>

            </div>

          )}


          {/* ERRO */}

          {!carregando && erro && (

            <div className="border border-[#DDD0CC] bg-white p-10 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center bg-[#F5EFEC]">

                <X
                  size={20}
                  strokeWidth={1.6}
                  className="text-[#8A625A]"
                />

              </div>

              <p className="mt-5 font-medium text-[#292825]">
                Não foi possível carregar os imóveis.
              </p>

              <p className="mt-2 text-sm text-[#77746E]">
                {erro}
              </p>

              <button
                type="button"
                onClick={carregarImoveis}
                className="
                  mt-6
                  bg-[#292825]
                  px-6 py-3
                  text-sm font-medium
                  text-white
                  transition
                  hover:bg-[#45433F]
                "
              >
                Tentar novamente
              </button>

            </div>

          )}


          {/* NENHUM RESULTADO */}

          {!carregando &&
            !erro &&
            imoveisFiltrados.length === 0 && (

              <div className="border border-[#E3E0D9] bg-white px-6 py-20 text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center bg-[#F7F5F0]">

                  <Search
                    size={27}
                    strokeWidth={1.4}
                    className="text-[#8A8883]"
                  />

                </div>

                <h2 className="mt-6 text-xl font-medium text-[#292825]">
                  Nenhum imóvel encontrado
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#77746E]">
                  Não encontramos imóveis disponíveis com os
                  filtros selecionados.
                </p>

                {filtrosAtivos && (

                  <button
                    type="button"
                    onClick={limparFiltros}
                    className="
                      mt-6
                      border border-[#292825]
                      px-6 py-3
                      text-sm font-medium
                      text-[#292825]
                      transition
                      hover:bg-[#292825]
                      hover:text-white
                    "
                  >
                    Limpar filtros
                  </button>

                )}

              </div>

            )}


          {/* =====================================================
              CARDS
          ====================================================== */}

          {!carregando &&
            !erro &&
            imoveisFiltrados.length > 0 && (

              <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">

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


      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="border-t border-[#E3E0D9] bg-[#F7F5F0]">

        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

          <div className="grid grid-cols-1 gap-12 md:grid-cols-4">


            {/* MARCA */}

            <div className="md:col-span-2">

              <button
                type="button"
                onClick={() => {
                  window.location.href = "/";
                }}
                className="text-left"
              >

                <span className="block text-2xl font-semibold tracking-[0.16em] text-[#292825]">
                  VITTA
                </span>

                <span className="mt-1 block text-[9px] font-medium tracking-[0.3em] text-[#8A8883]">
                  IMOBILIÁRIA
                </span>

              </button>

              <p className="mt-6 max-w-sm text-sm leading-7 text-[#77746E]">
                Encontre imóveis que combinam com você e descubra
                um lugar para chamar de lar.
              </p>

            </div>


            {/* NAVEGAÇÃO */}

            <div>

              <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#292825]">
                Navegação
              </h3>

              <div className="mt-5 flex flex-col gap-3">

                <a
                  href="/"
                  className="text-sm text-[#77746E] transition hover:text-[#292825]"
                >
                  Início
                </a>

                <a
                  href="/imoveis"
                  className="text-sm text-[#77746E] transition hover:text-[#292825]"
                >
                  Imóveis
                </a>

                <a
                  href="/login"
                  className="text-sm text-[#77746E] transition hover:text-[#292825]"
                >
                  Entrar
                </a>

              </div>

            </div>


            {/* ATENDIMENTO */}

            <div>

              <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#292825]">
                Atendimento
              </h3>

              <div className="mt-5 flex flex-col gap-3 text-sm text-[#77746E]">

                <span>
                  Segunda a sexta
                </span>

                <span>
                  08:00 às 18:00
                </span>

                <a
                  href="/atendimento"
                  className="transition hover:text-[#292825]"
                >
                  Fale conosco →
                </a>

              </div>

            </div>

          </div>


          {/* COPYRIGHT */}

          <div className="mt-14 flex flex-col justify-center gap-3 border-t border-[#E3E0D9] pt-6 sm:flex-row">

            <p className="text-xs text-[#A09D96]">
              © {new Date().getFullYear()} Vitta Imobiliária.
              Todos os direitos reservados.
            </p>


          </div>

        </div>

      </footer>

    </main>

  );
}
