"use client";

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

      const resposta = await fetch(`http://localhost:3000/imovel/${params.id}`, {
        method: "GET",
        credentials: "include"
      });

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
      <main className="min-h-screen bg-slate-100 px-6 py-10">
        <p className="mx-auto max-w-3xl rounded-xl bg-white p-5 text-slate-500 shadow-sm">
          Carregando imóvel...
        </p>
      </main>
    );
  }

  if (erro && !imovel) {
    return (
      <main className="min-h-screen bg-slate-100 px-6 py-10">
        <p className="mx-auto max-w-3xl rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
          {erro}
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <section className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <button
          onClick={() => router.back()}
          className="mb-6 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Voltar
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Confirmar locação
          </h1>

          <p className="mt-2 text-slate-500">
            Confira os dados antes de confirmar a locação do imóvel.
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-6">
          <h2 className="text-2xl font-bold text-slate-900">
            {imovel.descricao}
          </h2>

          <p className="mt-3 text-slate-600">
            {imovel.endereco}, {imovel.bairro} - {imovel.cidade}
          </p>

          <p className="mt-1 text-slate-600">CEP: {imovel.cep}</p>

          <strong className="mt-5 block text-3xl font-bold text-emerald-700">
            {Number(imovel.valor).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL"
            })}
          </strong>

          <p className="mt-4 text-sm text-slate-500">
            Ao confirmar, o backend cria um contrato e gera 12 parcelas de aluguel.
          </p>
        </div>

        {erro && (
          <p className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {erro}
          </p>
        )}

        {sucesso && (
          <p className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {sucesso}
          </p>
        )}

        <button
          onClick={confirmarLocacao}
          disabled={locando || imovel.disponivel !== "S"}
          className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {locando ? "Confirmando..." : "Confirmar locação"}
        </button>

        {imovel.disponivel !== "S" && (
          <p className="mt-3 text-center text-sm text-slate-500">
            Este imóvel não está disponível para locação.
          </p>
        )}
      </section>
    </main>
  );
}