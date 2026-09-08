"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function LocarImovelPage() {
  const params = useParams();
  const router = useRouter();

  const [imovel, setImovel] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [locando, setLocando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  async function carregarImovel() {
    try {
      setCarregando(true);
      setErro("");

      const resposta = await fetch(
        `http://localhost:3000/imovel/${params.id}`,
        {
          method: "GET",
          credentials: "include"
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.msg || "Erro ao carregar imóvel");
      }

      setImovel(dados[0] || dados);
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }

  async function confirmarLocacao() {
    try {
      setLocando(true);
      setErro("");
      setSucesso("");

      const resposta = await fetch("http://localhost:3000/locacao", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          id: params.id
        })
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.msg || "Erro ao locar imóvel");
      }

      setSucesso(dados.msg || "Imóvel locado com sucesso!");

      setTimeout(() => {
        router.push("/imoveis");
      }, 1500);
    } catch (error) {
      setErro(error.message);
    } finally {
      setLocando(false);
    }
  }

  useEffect(() => {
    carregarImovel();
  }, [params.id]);


  if (carregando) {
    return (
      <main className="min-h-screen bg-zinc-50 px-6 py-12">
        <div className="mx-auto max-w-5xl animate-pulse">

          <div className="mb-6 h-5 w-28 rounded bg-zinc-200" />

          <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">

            <div className="h-56 bg-zinc-200" />

            <div className="space-y-6 p-8">

              <div className="h-8 w-2/3 rounded bg-zinc-200" />

              <div className="h-5 w-1/2 rounded bg-zinc-200" />

              <div className="h-28 rounded-2xl bg-zinc-100" />

              <div className="h-14 rounded-xl bg-zinc-200" />

            </div>

          </div>

        </div>
      </main>
    );
  }


  if (erro && !imovel) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6">

        <div className="w-full max-w-lg rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">

            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-7 w-7 text-red-600"
            >
              <circle cx="12" cy="12" r="9" />

              <path
                strokeLinecap="round"
                d="M12 8v4"
              />

              <path
                strokeLinecap="round"
                d="M12 16h.01"
              />
            </svg>

          </div>

          <h1 className="mt-5 text-xl font-semibold text-zinc-900">
            Não foi possível carregar o imóvel
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-zinc-500">
            {erro}
          </p>

          <button
            onClick={() => router.back()}
            className="mt-6 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            Voltar
          </button>

        </div>

      </main>
    );
  }

  if (!imovel) {
    return null;
  }

  const disponivel = imovel.disponivel === "S";

  return (
    <main className="min-h-screen bg-zinc-50">


      <div className="mx-auto max-w-5xl px-6 py-10 lg:px-8">


        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-zinc-900"
        >

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 18l-6-6 6-6"
            />
          </svg>

          Voltar para o imóvel

        </button>

        <section className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">

          {/* CABEÇALHO */}

          <div className="border-b border-zinc-200 px-6 py-7 sm:px-8">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

              <div>

                <div className="flex items-center gap-2">

                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5 text-blue-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m3 10 9-7 9 7"
                      />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 9.5V21h14V9.5"
                      />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 21v-6h6v6"
                      />
                    </svg>

                  </span>

                </div>

                <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
                  Realizar locação
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-500 sm:text-base">
                  Confira cuidadosamente os dados do imóvel antes de confirmar sua solicitação.
                </p>

              </div>

            </div>

          </div>

          <div className="p-6 sm:p-8">

            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 sm:p-7">

              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">

                <div className="max-w-2xl">

                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Imóvel selecionado
                  </p>

                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900">
                    {imovel.descricao}
                  </h2>

                  <div className="mt-4 flex items-start gap-2 text-sm text-zinc-500">

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="mt-0.5 h-5 w-5 shrink-0 text-zinc-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"
                      />

                      <circle
                        cx="12"
                        cy="10"
                        r="2.5"
                      />
                    </svg>

                    <span className="leading-relaxed">
                      {imovel.endereco}, {imovel.bairro} -{" "}
                      {imovel.cidade}
                    </span>

                  </div>

                  <p className="mt-2 text-sm text-zinc-500">
                    CEP: {imovel.cep}
                  </p>

                </div>

                <div className="shrink-0 sm:text-right">

                  <p className="text-sm font-medium text-zinc-500">
                    Valor mensal
                  </p>

                  <strong className="mt-1 block text-3xl font-bold tracking-tight text-black">
                    {Number(imovel.valor).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL"
                    })}
                  </strong>

                  <span className="text-sm text-zinc-400">
                    por mês
                  </span>

                </div>

              </div>

            </div>

            <div className="mt-8">

              <h2 className="text-lg font-semibold text-zinc-900">
                O que acontece ao confirmar?
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">


                <div className="rounded-2xl border border-zinc-200 bg-white p-5">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5 text-blue-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 3h9l3 3v15H6z"
                      />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12h6M9 16h6"
                      />

                    </svg>

                  </div>

                  <h3 className="mt-4 font-semibold text-zinc-900">
                    Contrato
                  </h3>

                  <p className="mt-1 text-sm leading-relaxed text-zinc-500">
                    Um contrato de locação será criado automaticamente.
                  </p>

                </div>

                {/* PARCELAS */}

                <div className="rounded-2xl border border-zinc-200 bg-white p-5">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5 text-emerald-600"
                    >
                      <rect
                        width="18"
                        height="14"
                        x="3"
                        y="5"
                        rx="2"
                      />

                      <path d="M3 10h18" />

                      <path
                        strokeLinecap="round"
                        d="M7 15h3"
                      />

                    </svg>

                  </div>

                  <h3 className="mt-4 font-semibold text-zinc-900">
                    12 parcelas
                  </h3>

                  <p className="mt-1 text-sm leading-relaxed text-zinc-500">
                    Serão geradas 12 parcelas referentes ao período da locação.
                  </p>

                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white p-5">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100">

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5 text-zinc-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20 6 9 17l-5-5"
                      />
                    </svg>

                  </div>

                  <h3 className="mt-4 font-semibold text-zinc-900">
                    Locação registrada
                  </h3>

                  <p className="mt-1 text-sm leading-relaxed text-zinc-500">
                    Após a confirmação, a locação será registrada no sistema.
                  </p>

                </div>

              </div>

            </div>

            <div className="mt-8 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="mt-0.5 h-5 w-5 shrink-0 text-amber-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v4"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 17h.01"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.3 3.8 2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z"
                />
              </svg>

              <div>

                <p className="text-sm font-semibold text-amber-800">
                  Antes de confirmar
                </p>

                <p className="mt-1 text-sm leading-relaxed text-amber-700">
                  Certifique-se de que os dados e o valor do imóvel estão corretos. A confirmação criará o contrato e as parcelas de aluguel.
                </p>

              </div>

            </div>

            {erro && (
              <div className="mt-6 flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="mt-0.5 h-5 w-5 shrink-0 text-red-600"
                >
                  <circle cx="12" cy="12" r="9" />

                  <path
                    strokeLinecap="round"
                    d="M12 8v4"
                  />

                  <path
                    strokeLinecap="round"
                    d="M12 16h.01"
                  />

                </svg>

                <p className="text-sm text-red-700">
                  {erro}
                </p>

              </div>
            )}

            {sucesso && (
              <div className="mt-6 flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600"
                >
                  <circle cx="12" cy="12" r="9" />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m8 12 2.5 2.5L16 9"
                  />

                </svg>

                <div>

                  <p className="text-sm font-semibold text-emerald-800">
                    Locação confirmada
                  </p>

                  <p className="mt-1 text-sm text-emerald-700">
                    {sucesso}
                  </p>

                </div>

              </div>
            )}

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

              <button
                onClick={() => router.back()}
                disabled={locando}
                className="rounded-xl border border-zinc-300 bg-white px-6 py-3.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                onClick={confirmarLocacao}
                disabled={locando || !disponivel}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >

                {locando ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />

                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>

                    Confirmando...

                  </>
                ) : (
                  <>
                    Confirmar

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 12h14"
                      />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m13 6 6 6-6 6"
                      />
                    </svg>
                  </>
                )}

              </button>

            </div>

            {!disponivel && (
              <p className="mt-3 text-center text-sm text-zinc-500">
                Este imóvel não está disponível para locação.
              </p>
            )}

          </div>

        </section>

      </div>


      <footer className="border-t border-zinc-200 bg-zinc-100">

        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">

          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">

            <div>

              <div className="flex items-center gap-2">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-white">

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                  >

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m3 10 9-7 9 7"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 9.5V21h14V9.5"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 21v-6h6v6"
                    />

                  </svg>

                </div>

                <span className="font-semibold text-zinc-900">
                  Sua Imobiliária
                </span>

              </div>

              <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-500">
                Encontre imóveis que combinam com você e encontre o lugar ideal para chamar de lar.
              </p>

            </div>

            <div>

              <h3 className="text-sm font-semibold text-zinc-900">
                Navegação
              </h3>

              <div className="mt-4 flex flex-col gap-3 text-sm">

                <a
                  href="/"
                  className="text-zinc-500 transition hover:text-zinc-900"
                >
                  Início
                </a>

                <a
                  href="/imoveis"
                  className="text-zinc-500 transition hover:text-zinc-900"
                >
                  Imóveis
                </a>

                <a
                  href="/login"
                  className="text-zinc-500 transition hover:text-zinc-900"
                >
                  Entrar
                </a>

              </div>

            </div>

            <div>

              <h3 className="text-sm font-semibold text-zinc-900">
                Atendimento
              </h3>

              <div className="mt-4 flex flex-col gap-3 text-sm text-zinc-500">

                <span>
                  Segunda a sexta
                </span>

                <span>
                  08:00 às 18:00
                </span>

                <span>
                  contato@suaimobiliaria.com
                </span>

              </div>

            </div>

          </div>

          <div className="mt-12 border-t border-zinc-200 pt-6">

            <p className="text-center text-sm text-zinc-400">
              © {new Date().getFullYear()} Sua Imobiliária. Todos os direitos reservados.
            </p>

          </div>

        </div>

      </footer>

    </main>
  );
}
