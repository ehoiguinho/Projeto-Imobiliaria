"use client";

import { useEffect, useState } from "react";

export default function LocacoesPage() {
  const [contratos, setContratos] = useState([]);
  const [contratoSelecionado, setContratoSelecionado] = useState(null);
  const [alugueis, setAlugueis] = useState([]);

  const [carregandoContratos, setCarregandoContratos] = useState(true);
  const [carregandoAlugueis, setCarregandoAlugueis] = useState(false);
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
        return array.findIndex((item) => item.id === contrato.id) === index;
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
      setErro("");

      const resposta = await fetch(`http://localhost:3000/aluguel/${aluguelId}`, {
        method: "PUT",
        credentials: "include"
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.msg || "Erro ao pagar aluguel");
      }

      if (contratoSelecionado) {
        carregarAlugueis(contratoSelecionado);
      }
    } catch (error) {
      setErro(error.message);
    }
  }

  useEffect(() => {
    carregarContratos();
  }, []);

  return (
    <main className="px-8 py-10">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900">
          Minhas locações
        </h1>

        <p className="mt-2 text-slate-500">
          Consulte seus contratos e acompanhe os aluguéis.
        </p>
      </header>

      {erro && (
        <p className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {erro}
        </p>
      )}

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-slate-900">
            Contratos
          </h2>

          {carregandoContratos && (
            <p className="text-slate-500">Carregando contratos...</p>
          )}

          {!carregandoContratos && contratos.length === 0 && (
            <p className="text-slate-500">Nenhum contrato encontrado.</p>
          )}

          <div className="space-y-3">
            {contratos.map((contrato) => (
              <button
                key={contrato.id}
                onClick={() => carregarAlugueis(contrato.id)}
                className={`w-full rounded-xl border p-4 text-left transition ${
                  contratoSelecionado === contrato.id
                    ? "border-blue-600 bg-blue-50"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <strong className="block text-slate-900">
                  Contrato {contrato.id}
                </strong>

                <span className="mt-1 block text-sm text-slate-500">
                  Imóvel vinculado: {contrato.imovel}
                </span>
              </button>
            ))}
          </div>
        </aside>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-slate-900">
            Aluguéis
          </h2>

          {!contratoSelecionado && (
            <p className="text-slate-500">
              Selecione um contrato para ver os aluguéis.
            </p>
          )}

          {carregandoAlugueis && (
            <p className="text-slate-500">Carregando aluguéis...</p>
          )}

          {!carregandoAlugueis && contratoSelecionado && alugueis.length === 0 && (
            <p className="text-slate-500">
              Nenhum aluguel encontrado para este contrato.
            </p>
          )}

          <div className="space-y-3">
            {alugueis.map((aluguel) => (
              <article
                key={aluguel.id}
                className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 p-4 md:grid-cols-[1fr_1fr_1fr_auto]"
              >
                <div>
                  <span className="text-sm text-slate-500">Mês</span>
                  <strong className="block text-slate-900">
                    {aluguel.mes}
                  </strong>
                </div>

                <div>
                  <span className="text-sm text-slate-500">Vencimento</span>
                  <strong className="block text-slate-900">
                    {new Date(aluguel.vencimento).toLocaleDateString("pt-BR")}
                  </strong>
                </div>

                <div>
                  <span className="text-sm text-slate-500">Valor</span>
                  <strong className="block text-emerald-700">
                    {Number(aluguel.valor).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL"
                    })}
                  </strong>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      aluguel.status === "PAGO"
                        ? "bg-emerald-50 text-emerald-700"
                        : aluguel.status === "ATRASADO"
                          ? "bg-red-50 text-red-700"
                          : aluguel.status === "CANCELADO"
                            ? "bg-slate-100 text-slate-500"
                            : "bg-yellow-50 text-yellow-700"
                    }`}
                  >
                    {aluguel.status}
                  </span>

                  {(aluguel.status === "PENDENTE" || aluguel.status === "ATRASADO") && (
                    <button
                      onClick={() => pagarAluguel(aluguel.id)}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      Pagar
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}