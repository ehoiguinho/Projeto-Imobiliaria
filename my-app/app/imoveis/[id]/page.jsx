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
        `http://localhost:3000/imovel/imagens/${params.id}`,
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

  if (carregando) {
    return (
      <main className="min-h-screen bg-slate-100 px-6 py-10">
        <p className="mx-auto max-w-5xl rounded-xl bg-white p-5 text-slate-500 shadow-sm">
          Carregando detalhes do imóvel...
        </p>
      </main>
    );
  }

  if (erro) {
    return (
      <main className="min-h-screen bg-slate-100 px-6 py-10">
        <p className="mx-auto max-w-5xl rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
          {erro}
        </p>
      </main>
    );
  }

  if (!imovel) {
    return (
      <main className="min-h-screen bg-slate-100 px-6 py-10">
        <p className="mx-auto max-w-5xl rounded-xl bg-white p-5 text-slate-500 shadow-sm">
          Imóvel não encontrado.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <section className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {imagens.length > 0 ? (
          <img
            src={`http://localhost:3000${imagens[0].caminho}`}
            alt={imovel.descricao}
            className="h-80 w-full object-cover"
          />
        ) : (
          <div className="flex h-80 items-center justify-center bg-slate-200 text-slate-500">
            Sem imagem cadastrada
          </div>
        )}

        <div className="p-8">
          <button
            onClick={() => router.back()}
            className="mb-6 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Voltar
          </button>

          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {imovel.descricao}
              </h1>

              <p className="mt-2 text-slate-500">
                {imovel.endereco}, {imovel.bairro} - {imovel.cidade}
              </p>
            </div>

            <strong className="text-3xl font-bold text-emerald-700">
              {Number(imovel.valor).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
              })}
            </strong>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-4">
              <span className="text-sm text-slate-500">CEP</span>
              <p className="mt-1 font-semibold text-slate-900">
                {imovel.cep}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <span className="text-sm text-slate-500">Cidade</span>
              <p className="mt-1 font-semibold text-slate-900">
                {imovel.cidade}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <span className="text-sm text-slate-500">Disponibilidade</span>
              <p className="mt-1 font-semibold text-slate-900">
                {imovel.disponivel === "S" ? "Disponível" : "Indisponível"}
              </p>
            </div>
          </div>

          {imagens.length > 1 && (
            <div className="mt-8">
              <h2 className="mb-4 text-xl font-bold text-slate-900">
                Mais imagens
              </h2>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {imagens.slice(1).map((imagem) => (
                  <img
                    key={imagem.id}
                    src={`http://localhost:3000${imagem.caminho}`}
                    alt="Imagem do imóvel"
                    className="h-32 w-full rounded-xl object-cover"
                  />
                ))}
              </div>
            </div>
          )}
          <Link
            href={`/imoveis/${imovel.id}/locar`}
            className="mt-8 block rounded-lg bg-blue-600 px-4 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
            >
            Locar este imóvel
            </Link>
        </div>
      </section>
    </main>
  );
}