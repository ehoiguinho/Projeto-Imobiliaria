"use client";

import { useEffect, useState } from "react";

export default function LocacoesPage() {
  const [contratos, setContratos] = useState([]);
  const [contratoSelecionado, setContratoSelecionado] = useState(null);
  const [alugueis, setAlugueis] = useState([]);

  const [mostrarContratos, setMostrarContratos] = useState(false);

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
      setMostrarContratos(false);

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
    .reduce(
      (total, aluguel) => total + Number(aluguel.valor || 0),
      0
    );

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
    <main className="min-h-full bg-slate-50 px-4 py-5 sm:px-6 lg:px-10 lg:py-6">

      {/* Cabeçalho */}
      <header className="mb-6">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-600">
          Área do cliente
        </p>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Minhas locações
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Consulte seus contratos e acompanhe seus pagamentos.
        </p>
      </header>

      {/* Erro */}
      {erro && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <strong>Erro:</strong> {erro}
        </div>
      )}

      {/* Loading inicial */}
      {carregandoContratos ? (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />
          <div className="mt-3 h-12 animate-pulse rounded-lg bg-slate-100" />
        </div>
      ) : contratos.length === 0 ? (

        <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
            🏠
          </div>

          <h2 className="mt-4 font-bold text-slate-900">
            Nenhuma locação encontrada
          </h2>

          <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
            Você ainda não possui contratos de locação vinculados à sua conta.
          </p>
        </div>

      ) : (

        <section className="space-y-4">

          {/* Seletor de contratos */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">

            <button
              type="button"
              onClick={() => setMostrarContratos(!mostrarContratos)}
              className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition hover:bg-slate-50 sm:px-5"
            >
              <div className="flex min-w-0 items-center gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-lg">
                  🏠
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-slate-900">
                      Meus contratos
                    </h2>

                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                      {contratos.length}
                    </span>
                  </div>

                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    {contratoAtual
                      ? `Contrato #${contratoAtual.id} • ${
                          contratoAtual.imovel || "Imóvel vinculado"
                        }`
                      : "Selecione um contrato para consultar"}
                  </p>
                </div>
              </div>

              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm text-slate-500 transition-transform ${
                  mostrarContratos ? "rotate-180" : ""
                }`}
              >
                ↓
              </span>
            </button>

            {mostrarContratos && (
              <div className="border-t border-slate-100 p-3">
                <div className="space-y-1.5">

                  {contratos.map((contrato) => {
                    const ativo = contrato.id === contratoSelecionado;

                    return (
                      <button
                        key={contrato.id}
                        type="button"
                        onClick={() => carregarAlugueis(contrato.id)}
                        className={`flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-2.5 text-left transition ${
                          ativo
                            ? "border-blue-200 bg-blue-50"
                            : "border-transparent hover:border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex min-w-0 items-center gap-3">

                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm ${
                              ativo
                                ? "bg-blue-600 text-white"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            🏠
                          </div>

                          <div className="min-w-0">
                            <p
                              className={`text-sm font-semibold ${
                                ativo
                                  ? "text-blue-900"
                                  : "text-slate-900"
                              }`}
                            >
                              Contrato #{contrato.id}
                            </p>

                            <p className="truncate text-xs text-slate-500">
                              {contrato.imovel || "Imóvel vinculado"}
                            </p>
                          </div>
                        </div>

                        <span className="text-slate-400">
                          →
                        </span>
                      </button>
                    );
                  })}

                </div>
              </div>
            )}
          </div>

          {/* Sem contrato selecionado */}
          {!contratoSelecionado && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">

              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                📋
              </div>

              <h2 className="mt-3 text-sm font-bold text-slate-900">
                Selecione um contrato
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Abra "Meus contratos" para escolher uma locação.
              </p>

              <button
                type="button"
                onClick={() => setMostrarContratos(true)}
                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
              >
                Ver contratos
              </button>
            </div>
          )}

          {/* Contrato selecionado */}
          {contratoAtual && (
            <>          

              {/* Resumo compacto */}
              {!carregandoAlugueis && (
                <div className="grid grid-cols-3 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

                  <div className="px-3 py-3 sm:px-5">
                    <p className="text-[11px] font-medium text-slate-500">
                      Aluguéis
                    </p>

                    <p className="mt-1 text-xl font-bold text-slate-900">
                      {alugueis.length}
                    </p>
                  </div>

                  <div className="border-l border-slate-100 px-3 py-3 sm:px-5">
                    <p className="text-[11px] font-medium text-slate-500">
                      Pagos
                    </p>

                    <p className="mt-1 text-xl font-bold text-emerald-600">
                      {alugueisPagos}
                    </p>
                  </div>

                  <div className="border-l border-slate-100 px-3 py-3 sm:px-5">
                    <p className="text-[11px] font-medium text-slate-500">
                      Em aberto
                    </p>

                    <p className="mt-1 text-lg font-bold text-amber-600">
                      {totalPendente.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                      })}
                    </p>
                  </div>

                </div>
              )}

              {/* Histórico */}
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

                <div className="border-b border-slate-100 px-4 py-3 sm:px-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">
                        Histórico de pagamentos
                      </h2>

                      <p className="mt-0.5 text-xs text-slate-500">
                        Vencimentos e situação dos aluguéis.
                      </p>
                    </div>

                    {alugueis.length > 0 && (
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                        {alugueis.length}
                      </span>
                    )}
                  </div>
                </div>

                <div>

                  {/* Loading */}
                  {carregandoAlugueis && (
                    <div className="space-y-px">
                      {[1, 2, 3, 4].map((item) => (
                        <div
                          key={item}
                          className="h-14 animate-pulse border-b border-slate-100 bg-slate-50"
                        />
                      ))}
                    </div>
                  )}

                  {/* Nenhum aluguel */}
                  {!carregandoAlugueis &&
                    contratoSelecionado &&
                    alugueis.length === 0 && (
                      <div className="px-5 py-10 text-center">

                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                          📄
                        </div>

                        <h3 className="mt-3 text-sm font-semibold text-slate-900">
                          Nenhum pagamento encontrado
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                          Não existem registros para este contrato.
                        </p>

                      </div>
                    )}

                  {/* Desktop */}
                  {!carregandoAlugueis &&
                    alugueis.length > 0 && (
                      <>
                        <div className="hidden md:block">

                          {/* Cabeçalho da tabela */}
                          <div className="grid grid-cols-[1.2fr_1fr_1fr_1.2fr] border-b border-slate-100 bg-slate-50 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                            <span>Referência</span>
                            <span>Vencimento</span>
                            <span>Valor</span>
                            <span className="text-right">Situação</span>
                          </div>

                          {alugueis.map((aluguel) => {
                            const estilo = obterEstiloStatus(
                              aluguel.status
                            );

                            return (
                              <div
                                key={aluguel.id}
                                className="grid grid-cols-[1.2fr_1fr_1fr_1.2fr] items-center border-b border-slate-100 px-5 py-3 last:border-b-0 hover:bg-slate-50"
                              >
                                <div>
                                  <p className="text-sm font-semibold text-slate-900">
                                    {aluguel.mes}
                                  </p>

                                  <p className="text-[10px] text-slate-400">
                                    #{aluguel.id}
                                  </p>
                                </div>

                                <p className="text-sm text-slate-600">
                                  {new Date(
                                    aluguel.vencimento
                                  ).toLocaleDateString("pt-BR")}
                                </p>

                                <p className="text-sm font-semibold text-slate-900">
                                  {Number(
                                    aluguel.valor
                                  ).toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL"
                                  })}
                                </p>

                                <div className="flex items-center justify-end gap-2">
                                  <span
                                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${estilo.container}`}
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
                                      disabled={
                                        pagandoAluguel === aluguel.id
                                      }
                                      onClick={() =>
                                        pagarAluguel(aluguel.id)
                                      }
                                      className="rounded-md bg-blue-600 px-2.5 py-1.5 text-[10px] font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                      {pagandoAluguel === aluguel.id
                                        ? "..."
                                        : "Pagar"}
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Mobile */}
                        <div className="divide-y divide-slate-100 md:hidden">

                          {alugueis.map((aluguel) => {
                            const estilo = obterEstiloStatus(
                              aluguel.status
                            );

                            return (
                              <div
                                key={aluguel.id}
                                className="px-4 py-3"
                              >
                                <div className="flex items-center justify-between gap-3">

                                  <div>
                                    <p className="text-sm font-semibold text-slate-900">
                                      {aluguel.mes}
                                    </p>

                                    <p className="mt-0.5 text-xs text-slate-500">
                                      Vencimento:{" "}
                                      {new Date(
                                        aluguel.vencimento
                                      ).toLocaleDateString("pt-BR")}
                                    </p>
                                  </div>

                                  <span
                                    className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[10px] font-semibold ${estilo.container}`}
                                  >
                                    <span
                                      className={`h-1.5 w-1.5 rounded-full ${estilo.ponto}`}
                                    />

                                    {estilo.texto}
                                  </span>

                                </div>

                                <div className="mt-2 flex items-center justify-between">

                                  <strong className="text-sm text-slate-900">
                                    {Number(
                                      aluguel.valor
                                    ).toLocaleString("pt-BR", {
                                      style: "currency",
                                      currency: "BRL"
                                    })}
                                  </strong>

                                  {(aluguel.status === "PENDENTE" ||
                                    aluguel.status === "ATRASADO") && (
                                    <button
                                      type="button"
                                      disabled={
                                        pagandoAluguel === aluguel.id
                                      }
                                      onClick={() =>
                                        pagarAluguel(aluguel.id)
                                      }
                                      className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                                    >
                                      {pagandoAluguel === aluguel.id
                                        ? "Processando..."
                                        : "Pagar"}
                                    </button>
                                  )}

                                </div>
                              </div>
                            );
                          })}

                        </div>
                      </>
                    )}

                </div>
              </div>
            </>
          )}
        </section>
      )}
    </main>
  );
}