"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function DetalheImovelPage() {
  const params = useParams();
  const router = useRouter();

  const [imovel, setImovel] = useState(null);
  const [imagens, setImagens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  async function carregarDetalhes() {
    try {
      setCarregando(true);
      setErro("");

      const respostaImovel = await fetch(
        `http://localhost:3000/imovel/${params.id}`,
        {
          method: "GET",
          credentials: "include"
        }
      );

      const dadosImovel = await respostaImovel.json();

      if (!respostaImovel.ok) {
        throw new Error(dadosImovel.msg || "Erro ao carregar imóvel");
      }

      setImovel(dadosImovel[0] || dadosImovel);

      const respostaImagens = await fetch(
        `http://localhost:3000/imovel/${params.id}/imagem`,
        {
          method: "GET",
          credentials: "include"
        }
      );

      if (respostaImagens.ok) {
        const dadosImagens = await respostaImagens.json();
        setImagens(dadosImagens);
      }
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDetalhes();
  }, [params.id]);

  /* =========================
     CARREGANDO
  ========================= */

  if (carregando) {
    return (
      <main className="min-h-screen bg-zinc-50 px-6 py-12">
        <div className="mx-auto max-w-6xl animate-pulse">

          <div className="mb-6 h-5 w-24 rounded bg-zinc-200" />

          <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
            <div className="h-[420px] bg-zinc-200" />

            <div className="space-y-6 p-8">
              <div className="h-8 w-2/3 rounded bg-zinc-200" />
              <div className="h-5 w-1/2 rounded bg-zinc-200" />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="h-24 rounded-2xl bg-zinc-100" />
                <div className="h-24 rounded-2xl bg-zinc-100" />
                <div className="h-24 rounded-2xl bg-zinc-100" />
              </div>
            </div>
          </div>

        </div>
      </main>
    );
  }

  /* =========================
     ERRO
  ========================= */

  if (erro) {
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

  /* =========================
     NÃO ENCONTRADO
  ========================= */

  if (!imovel) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6">
        <div className="w-full max-w-lg rounded-3xl border border-zinc-200 bg-white p-8 text-center shadow-sm">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-7 w-7 text-zinc-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 10.5 12 3l9 7.5"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 9.5V21h14V9.5"
              />
            </svg>
          </div>

          <h1 className="mt-5 text-xl font-semibold text-zinc-900">
            Imóvel não encontrado
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            O imóvel que você está procurando não está disponível.
          </p>

          <Link
            href="/imoveis"
            className="mt-6 inline-flex rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            Ver imóveis
          </Link>

        </div>
      </main>
    );
  }

  const imagemPrincipal =
    imagens.length > 0
      ? `http://localhost:3000${imagens[0].caminho}`
      : null;

  const disponivel = imovel.disponivel === "S";

  return (
    <main className="min-h-screen bg-zinc-50">

      {/* =========================
          CONTEÚDO PRINCIPAL
      ========================= */}

      <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8">

        {/* VOLTAR */}

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

          Voltar para imóveis
        </button>

        {/* =========================
            CARD PRINCIPAL
        ========================= */}

        <section className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">

          {/* IMAGEM PRINCIPAL */}

          <div className="relative h-[300px] overflow-hidden sm:h-[400px] lg:h-[480px]">

            {imagemPrincipal ? (
              <img
                src={imagemPrincipal}
                alt={imovel.descricao}
                className="h-full w-full object-cover transition duration-500 hover:scale-[1.01]"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-zinc-100">

                <div className="text-center">

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="mx-auto h-12 w-12 text-zinc-400"
                  >
                    <rect
                      width="18"
                      height="18"
                      x="3"
                      y="3"
                      rx="2"
                    />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="m21 15-5-5L5 21" />
                  </svg>

                  <p className="mt-3 text-sm text-zinc-500">
                    Sem imagem cadastrada
                  </p>

                </div>

              </div>
            )}


          </div>

          {/* =========================
              INFORMAÇÕES
          ========================= */}

          <div className="p-6 sm:p-8 lg:p-10">

            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">

              {/* DESCRIÇÃO */}

              <div className="max-w-2xl">

                <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                  Imóvel para locação
                </p>

                <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
                  {imovel.descricao}
                </h1>

                <div className="mt-4 flex items-start gap-2 text-zinc-500">

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

                  <p className="text-sm leading-relaxed sm:text-base">
                    {imovel.endereco}, {imovel.bairro} - {imovel.cidade}
                  </p>

                </div>

              </div>

              {/* PREÇO */}

              <div className="shrink-0 lg:text-right">

                <p className="text-sm font-medium text-zinc-500">
                  Valor mensal
                </p>

                <strong className="mt-1 block text-3xl font-bold tracking-tight text-black sm:text-4xl">
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

            {/* DIVISOR */}

            <div className="my-8 h-px bg-zinc-200" />

            {/* CARACTERÍSTICAS */}

            <div>

              <h2 className="text-lg font-semibold text-zinc-900">
                Informações do imóvel
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">

                {/* CEP */}

                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5 text-zinc-600"
                    >
                      <rect
                        width="18"
                        height="14"
                        x="3"
                        y="5"
                        rx="2"
                      />
                      <path d="M3 10h18" />
                    </svg>

                  </div>

                  <p className="mt-4 text-xs font-medium uppercase tracking-wide text-zinc-400">
                    CEP
                  </p>

                  <p className="mt-1 font-semibold text-zinc-900">
                    {imovel.cep}
                  </p>

                </div>

                {/* CIDADE */}

                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">

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
                        d="M3 21h18"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 21V5l7-3v19"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 21V8l7-3v16"
                      />
                    </svg>

                  </div>

                  <p className="mt-4 text-xs font-medium uppercase tracking-wide text-zinc-400">
                    Cidade
                  </p>

                  <p className="mt-1 font-semibold text-zinc-900">
                    {imovel.cidade}
                  </p>

                </div>

                {/* DISPONIBILIDADE */}

                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5 text-emerald-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20 6 9 17l-5-5"
                      />
                    </svg>

                  </div>

                  <p className="mt-4 text-xs font-medium uppercase tracking-wide text-zinc-400">
                    Status
                  </p>

                  <p
                    className={`mt-1 font-semibold ${
                      disponivel
                        ? "text-emerald-700"
                        : "text-zinc-600"
                    }`}
                  >
                    {disponivel
                      ? "Disponível"
                      : "Indisponível"}
                  </p>

                </div>

              </div>

            </div>

            {/* =========================
                GALERIA
            ========================= */}

            {imagens.length > 1 && (
              <div className="mt-10">

                <div className="flex items-center justify-between">

                  <div>
                    <h2 className="text-lg font-semibold text-zinc-900">
                      Galeria de imagens
                    </h2>

                    <p className="mt-1 text-sm text-zinc-500">
                      Confira outros detalhes do imóvel.
                    </p>
                  </div>

                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">

                  {imagens.slice(1).map((imagem) => (
                    <div
                      key={imagem.id}
                      className="group relative overflow-hidden rounded-2xl bg-zinc-100"
                    >

                      <img
                        src={`http://localhost:3000${imagem.caminho}`}
                        alt="Imagem do imóvel"
                        className="h-36 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-40"
                      />

                    </div>
                  ))}

                </div>

              </div>
            )}

            {/* =========================
                CTA
            ========================= */}

            <div className="mt-10 rounded-2xl border border-blue-100 bg-blue-50/60 p-5 sm:p-6">

              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <h2 className="font-semibold text-zinc-900">
                    Gostou deste imóvel?
                  </h2>

                  <p className="mt-1 text-sm leading-relaxed text-zinc-500">
                    Faça sua solicitação de locação e dê o próximo passo para encontrar seu novo lar.
                  </p>

                </div>

                {disponivel ? (
                  <Link
                    href={`/imoveis/${imovel.id}/locar`}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
                  >
                    Locar este imóvel

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

                  </Link>
                ) : (
                  <span className="inline-flex shrink-0 items-center justify-center rounded-xl bg-zinc-200 px-6 py-3.5 text-sm font-semibold text-zinc-500">
                    Imóvel indisponível
                  </span>
                )}

              </div>

            </div>

          </div>

        </section>

      </div>

      {/* =========================
          FOOTER
      ========================= */}

      <footer className="border-t border-zinc-200 bg-zinc-100">

        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">

          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">

            {/* EMPRESA */}

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

            {/* NAVEGAÇÃO */}

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

            {/* ATENDIMENTO */}

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
