"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CadastroImovelPage() {
  const router = useRouter();

  const [descricao, setDescricao] = useState("");
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [valor, setValor] = useState("");
  const [disponivel, setDisponivel] = useState("S");
  const [imagens, setImagens] = useState([]);

  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function cadastrarImovel(event) {
    event.preventDefault();

    setErro("");
    setCarregando(true);

    try {
      const formData = new FormData();

      formData.append("descricao", descricao);
      formData.append("cep", cep);
      formData.append("endereco", endereco);
      formData.append("bairro", bairro);
      formData.append("cidade", cidade);
      formData.append("valor", valor);
      formData.append("disponivel", disponivel);

      for (const imagem of imagens) {
        formData.append("imagens", imagem);
      }

      const resposta = await fetch("http://localhost:3000/imovel", {
        method: "POST",
        credentials: "include",
        body: formData
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.msg || "Erro ao cadastrar imovel");
      }

      router.push("/imoveis");
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="px-8 py-10">
      <section className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Cadastrar imóvel
          </h1>

          <p className="mt-2 text-slate-500">
            Preencha os dados do imóvel e envie até 5 imagens.
          </p>
        </div>

        <form onSubmit={cadastrarImovel} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Descrição
            </label>

            <textarea
              value={descricao}
              onChange={(event) => setDescricao(event.target.value)}
              required
              className="min-h-28 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                CEP
              </label>

              <input
                value={cep}
                onChange={(event) => setCep(event.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Valor
              </label>

              <input
                type="number"
                value={valor}
                onChange={(event) => setValor(event.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Endereço
            </label>

            <input
              value={endereco}
              onChange={(event) => setEndereco(event.target.value)}
              placeholder="Rua Exemplo, 123"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Bairro
              </label>

              <input
                value={bairro}
                onChange={(event) => setBairro(event.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Cidade
              </label>

              <input
                value={cidade}
                onChange={(event) => setCidade(event.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Disponibilidade
            </label>

            <select
              value={disponivel}
              onChange={(event) => setDisponivel(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            >
              <option value="S">Disponível</option>
              <option value="N">Indisponível</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Imagens
            </label>

            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              multiple
              onChange={(event) => setImagens(event.target.files)}
              className="w-full rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-3"
            />
          </div>

          {erro && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {carregando ? "Cadastrando..." : "Cadastrar imóvel"}
          </button>
        </form>
      </section>
    </main>
  );
}