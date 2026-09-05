"use client";

import { useEffect, useState } from "react";

export default function LocacoesPage() {
  const [contratos, setContratos] = useState([]);
  const [contratoSelecionado, setContratoSelecionado] = useState(null);
  const [alugueis, setAlugueis] = useState([]);

  const [carregandoContratos, setCarregandoContratos] = useState(true);
  const [carregandoAlugueis, setCarregandoAlugueis] = useState(false);
  const [pagandoAluguel, setPagandoAluguel] = useState(null);
  const [erro, setErro] = useState("");

  async function carregarContratos() {
    try {
      setCarregandoContratos(true);
      setErro("");

      const resposta = await fetch("http://localhost:3000/locacao/minhas", {
        method: "GET",
        credentials: "include"
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.msg || "Erro ao carregar contratos");
      }

      const contratosUnicos = dados.filter((contrato, index, array) => {
        return (
          array.findIndex((item) => item.id === contrato.id) === index
        );
      });

      setContratos(contratosUnicos);

      // Seleciona automaticamente o primeiro contrato
      if (contratosUnicos.length > 0) {
        carregarAlugueis(contratosUnicos[0].id);
      }
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregandoContratos(false);
    }
  }

  async function carregarAlugueis(contratoId) {
    try {
      setCarregandoAlugueis(true);
      setErro("");
      setContratoSelecionado(contratoId);
      setAlugueis([]);

      const resposta = await fetch(
        `http://localhost:3000/aluguel/contrato/${contratoId}`,
        {
          method: "GET",
          credentials: "include"
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.msg || "Erro ao carregar aluguéis");
      }

      setAlugueis(dados);
    } catch (error) {
      setErro(error.message);
      setAlugueis([]);
    } finally {
      setCarregandoAlugueis(false);
    }
  }

  async function pagarAluguel(aluguelId) {
    try {
      setPagandoAluguel(aluguelId);
      setErro("");

      const resposta = await fetch(
        `http://localhost:3000/aluguel/${aluguelId}`,
        {
          method: "PUT",
          credentials: "include"
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.msg || "Erro ao pagar aluguel");
      }

      if (contratoSelecionado) {
        await carregarAlugueis(contratoSelecionado);
      }
    } catch (error) {
      setErro(error.message);
    } finally {
      setPagandoAluguel(null);
    }
  }

  useEffect(() => {
    carregarContratos();
  }, []);

  const contratoAtual = contratos.find(
    (contrato) => contrato.id === contratoSelecionado
  );

  const totalAlugueis = alugueis.length;

  const alugueisPagos = alugueis.filter(
    (aluguel) => aluguel.status === "PAGO"
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
    .reduce((total, aluguel) => total + Number(aluguel.valor || 0), 0);

  function obterEstiloStatus(status) {
    switch (status) {
      case "PAGO":
        return {
          container: "bg-emerald-50 text-emerald-700 border-emerald-200",
          ponto: "bg-emerald-500",
          texto: "Pago"
        };

      case "ATRASADO":
        return {
          container: "bg-red-50 text-red-700 border-red-200",
          ponto: "bg-red-500",
          texto: "Atrasado"
        };

      case "CANCELADO":
        return {
          container: "bg-slate-100 text-slate-500 border-slate-200",
          ponto: "bg-slate-400",
          texto: "Cancelado"
        };

      default:
        return {
          container: "bg-amber-50 text-amber-700 border-amber-200",
          ponto: "bg-amber-500",
          texto: "Pendente"
        };
    }
  }

  return (
    <main className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">

      {/* Cabeçalho */}
      <header className="mb-8">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600">
            Área do cliente
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Minhas locações
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-500 sm:text-base">
            Acompanhe seus contratos, consulte os pagamentos e mantenha
            suas locações em dia.
          </p>
        </div>
      </header>

      {/* Erro */}
      {erro && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 font-bold">
            !
          </div>

          <div>
            <p className="font-semibold">Não foi possível concluir a operação</p>
            <p className="mt-1 text-sm text-red-600">{erro}</p>
          </div>
        </div>
      )}

      {/* Loading contratos */}
      {carregandoContratos ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 h-6 w-32 animate-pulse rounded bg-slate-200" />

            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-20 animate-pulse rounded-xl bg-slate-100"
                />
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="h-7 w-40 animate-pulse rounded bg-slate-200" />

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-24 animate-pulse rounded-xl bg-slate-100"
                />
              ))}
            </div>
          </div>

        </div>
      ) : contratos.length === 0 ? (

        /* Estado vazio */
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
            🏠
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            Nenhuma locação encontrada
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Você ainda não possui contratos de locação vinculados à sua
            conta.
          </p>
        </div>

      ) : (

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">

          {/* Lista de contratos */}
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

            <div className="mb-4 flex items-center justify-between px-1">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Contratos
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {contratos.length}{" "}
                  {contratos.length === 1
                    ? "contrato ativo"
                    : "contratos"}
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                🏠
              </div>
            </div>

            <div className="space-y-2">
              {contratos.map((contrato) => {
                const ativo = contratoSelecionado === contrato.id;

                return (
                  <button
                    key={contrato.id}
                    onClick={() => carregarAlugueis(contrato.id)}
                    className={`group w-full rounded-xl border p-4 text-left transition-all duration-200 ${
                      ativo
                        ? "border-blue-200 bg-blue-50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-2 w-2 rounded-full ${
                              ativo
                                ? "bg-blue-600"
                                : "bg-slate-300 group-hover:bg-slate-400"
                            }`}
                          />

                          <span
                            className={`text-sm font-bold ${
                              ativo
                                ? "text-blue-900"
                                : "text-slate-900"
                            }`}
                          >
                            Contrato #{contrato.id}
                          </span>
                        </div>

                        <p className="mt-2 truncate text-sm text-slate-500">
                          {contrato.imovel || "Imóvel vinculado"}
                        </p>
                      </div>

                      <span
                        className={`text-lg transition-transform ${
                          ativo
                            ? "translate-x-0 text-blue-600"
                            : "-translate-x-1 text-slate-300 group-hover:translate-x-0 group-hover:text-slate-500"
                        }`}
                      >
                        →
                      </span>

                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Conteúdo do contrato */}
          <section className="min-w-0">

            {/* Cabeçalho contrato */}
            {contratoAtual && (
              <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Contrato selecionado
                    </p>

                    <h2 className="mt-1 text-2xl font-bold text-slate-900">
                      Contrato #{contratoAtual.id}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {contratoAtual.imovel || "Imóvel vinculado"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Contrato ativo
                  </div>

                </div>
              </div>
            )}

            {/* Cards resumo */}
            {!carregandoAlugueis && contratoSelecionado && (
              <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm font-medium text-slate-500">
                    Total de aluguéis
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {totalAlugueis}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Neste contrato
                  </p>
                </div>

                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5 shadow-sm">
                  <p className="text-sm font-medium text-emerald-700">
                    Pagamentos realizados
                  </p>

                  <p className="mt-2 text-3xl font-bold text-emerald-700">
                    {alugueisPagos}
                  </p>

                  <p className="mt-1 text-xs text-emerald-600">
                    Pagamentos em dia
                  </p>
                </div>

                <div
                  className={`rounded-2xl border p-5 shadow-sm ${
                    alugueisPendentes > 0
                      ? "border-amber-100 bg-amber-50/50"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <p
                    className={`text-sm font-medium ${
                      alugueisPendentes > 0
                        ? "text-amber-700"
                        : "text-slate-500"
                    }`}
                  >
                    Em aberto
                  </p>

                  <p
                    className={`mt-2 text-2xl font-bold ${
                      alugueisPendentes > 0
                        ? "text-amber-700"
                        : "text-slate-900"
                    }`}
                  >
                    {totalPendente.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL"
                    })}
                  </p>

                  <p
                    className={`mt-1 text-xs ${
                      alugueisPendentes > 0
                        ? "text-amber-600"
                        : "text-slate-400"
                    }`}
                  >
                    {alugueisPendentes > 0
                      ? `${alugueisPendentes} pagamento(s) pendente(s)`
                      : "Tudo em dia"}
                  </p>
                </div>

              </div>
            )}

            {/* Lista de aluguéis */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
                <div className="flex items-center justify-between gap-4">

                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Histórico de pagamentos
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Consulte os vencimentos e a situação de cada aluguel.
                    </p>
                  </div>

                  {alugueis.length > 0 && (
                    <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 sm:block">
                      {alugueis.length} registros
                    </span>
                  )}

                </div>
              </div>

              <div className="p-4 sm:p-6">

                {/* Loading */}
                {carregandoAlugueis && (
                  <div className="space-y-3">

                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="animate-pulse rounded-xl border border-slate-100 p-5"
                      >
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                          <div className="h-10 rounded bg-slate-100" />
                          <div className="h-10 rounded bg-slate-100" />
                          <div className="h-10 rounded bg-slate-100" />
                          <div className="h-10 rounded bg-slate-100" />
                        </div>
                      </div>
                    ))}

                  </div>
                )}

                {/* Nenhum aluguel */}
                {!carregandoAlugueis &&
                  contratoSelecionado &&
                  alugueis.length === 0 && (
                    <div className="py-12 text-center">

                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-xl">
                        📄
                      </div>

                      <h3 className="mt-4 font-semibold text-slate-900">
                        Nenhum pagamento encontrado
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Não existem registros de aluguel para este contrato.
                      </p>

                    </div>
                  )}

                {/* Aluguéis */}
                {!carregandoAlugueis && alugueis.length > 0 && (
                  <div className="space-y-3">

                    {alugueis.map((aluguel) => {
                      const estilo = obterEstiloStatus(aluguel.status);

                      return (
                        <article
                          key={aluguel.id}
                          className="group rounded-xl border border-slate-200 p-4 transition-all hover:border-slate-300 hover:shadow-sm sm:p-5"
                        >

                          <div className="grid grid-cols-1 gap-5 md:grid-cols-[1fr_1fr_1fr_auto] md:items-center">

                            {/* Mês */}
                            <div>
                              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Referência
                              </span>

                              <strong className="mt-1 block text-base font-bold text-slate-900">
                                {aluguel.mes}
                              </strong>

                              <span className="mt-1 block text-xs text-slate-400">
                                Aluguel #{aluguel.id}
                              </span>
                            </div>

                            {/* Vencimento */}
                            <div>
                              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Vencimento
                              </span>

                              <strong className="mt-1 block text-sm font-semibold text-slate-800">
                                {new Date(
                                  aluguel.vencimento
                                ).toLocaleDateString("pt-BR")}
                              </strong>
                            </div>

                            {/* Valor */}
                            <div>
                              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Valor
                              </span>

                              <strong className="mt-1 block text-base font-bold text-slate-900">
                                {Number(
                                  aluguel.valor
                                ).toLocaleString("pt-BR", {
                                  style: "currency",
                                  currency: "BRL"
                                })}
                              </strong>
                            </div>

                            {/* Status / ação */}
                            <div className="flex flex-wrap items-center gap-3 md:justify-end">

                              <span
                                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${estilo.container}`}
                              >
                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${estilo.ponto}`}
                                />

                                {estilo.texto}
                              </span>

                              {(aluguel.status === "PENDENTE" ||
                                aluguel.status === "ATRASADO") && (
                                <button
                                  type="button"
                                  disabled={pagandoAluguel === aluguel.id}
                                  onClick={() =>
                                    pagarAluguel(aluguel.id)
                                  }
                                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  {pagandoAluguel === aluguel.id ? (
                                    <span className="flex items-center gap-2">
                                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                      Processando...
                                    </span>
                                  ) : (
                                    "Pagar aluguel"
                                  )}
                                </button>
                              )}

                            </div>

                          </div>

                        </article>
                      );
                    })}

                  </div>
                )}

              </div>
            </div>

          </section>
        </section>
      )}
    </main>
  );
}