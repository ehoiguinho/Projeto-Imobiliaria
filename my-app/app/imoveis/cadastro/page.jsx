
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
        throw new Error(dados.msg || "Erro ao cadastrar imóvel");
      }

      router.push("/imoveis");
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">

        {/* Cabeçalho */}
        <header className="mb-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-5 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            ← Voltar
          </button>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Cadastrar imóvel
            </h1>

            <p className="mt-2 max-w-2xl text-slate-500">
              Adicione as informações do imóvel para disponibilizá-lo
              para locação.
            </p>
          </div>
        </header>

        <form onSubmit={cadastrarImovel}>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* Informações */}
            <section className="p-6 sm:p-8">
              <div className="mb-6 flex items-start gap-4">
               
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Informações do imóvel
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Informe os principais dados do imóvel.
                  </p>
                </div>
              </div>

              <div className="space-y-5">

                {/* Descrição */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Descrição
                  </label>

                  <textarea
                    value={descricao}
                    onChange={(event) => setDescricao(event.target.value)}
                    placeholder="Descreva o imóvel, suas características e diferenciais..."
                    required
                    rows={5}
                    className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />

                  <p className="mt-2 text-xs text-slate-400">
                    Uma boa descrição ajuda o cliente a conhecer melhor o imóvel.
                  </p>
                </div>

                {/* Valor + disponibilidade */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Valor do aluguel
                    </label>

                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                        R$
                      </span>

                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={valor}
                        onChange={(event) => setValor(event.target.value)}
                        placeholder="2.500,00"
                        required
                        className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Disponibilidade
                    </label>

                    <select
                      value={disponivel}
                      onChange={(event) => setDisponivel(event.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                    >
                      <option value="S">Disponível para locação</option>
                      <option value="N">Indisponível</option>
                    </select>
                  </div>

                </div>
              </div>
            </section>

            <div className="border-t border-slate-100" />

            {/* Localização */}
            <section className="p-6 sm:p-8">
              <div className="mb-6 flex items-start gap-4">

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Localização
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Informe o endereço completo do imóvel.
                  </p>
                </div>
              </div>

              <div className="space-y-5">

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-[180px_1fr]">

                  <div>
                    <label className="mb-2 block text-sm bg-white font-semibold text-slate-900">
                      CEP
                    </label>

                    <input
                      value={cep}
                      onChange={(event) => setCep(event.target.value)}
                      placeholder="00000-000"
                      inputMode="numeric"
                      autoComplete="postal-code"
                      required
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 text-black focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-900">
                      Endereço
                    </label>

                    <input
                      value={endereco}
                      onChange={(event) => setEndereco(event.target.value)}
                      placeholder="Rua Exemplo, 123"
                      autoComplete="street-address"
                      required
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 text-black focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                    />
                  </div>

                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-900">
                      Bairro
                    </label>

                    <input
                      value={bairro}
                      onChange={(event) => setBairro(event.target.value)}
                      placeholder="Ex.: Centro"
                      required
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 text-black focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Cidade
                    </label>

                    <input
                      value={cidade}
                      onChange={(event) => setCidade(event.target.value)}
                      placeholder="Ex.: Santo André"
                      autoComplete="address-level2"
                      required
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 text-black focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                    />
                  </div>

                </div>
              </div>
            </section>

            <div className="border-t border-slate-100" />

            {/* Imagens */}
            <section className="p-6 sm:p-8">
              <div className="mb-6 flex items-start gap-4">
              
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Fotos do imóvel
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Adicione até 5 imagens para apresentar o imóvel.
                  </p>
                </div>
              </div>

              <label className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition hover:border-blue-400 hover:bg-blue-50/40">

                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl shadow-sm">
                  📷
                </div>

                <p className="text-sm font-semibold text-slate-700">
                  Clique para selecionar as imagens
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  PNG ou JPEG · máximo de 5 imagens
                </p>

                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  multiple
                  onChange={(event) => setImagens(event.target.files)}
                  className="hidden"
                />
              </label>

              {imagens.length > 0 && (
                <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3">
                  <p className="text-sm font-medium text-slate-700">
                    {imagens.length}{" "}
                    {imagens.length === 1
                      ? "imagem selecionada"
                      : "imagens selecionadas"}
                  </p>

                  <div className="mt-2 space-y-1">
                    {Array.from(imagens).map((imagem, index) => (
                      <p
                        key={`${imagem.name}-${index}`}
                        className="truncate text-xs text-slate-500"
                      >
                        {imagem.name}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Erro */}
            {erro && (
              <div className="mx-6 mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 sm:mx-8">
                <p className="text-sm font-medium text-red-700">
                  {erro}
                </p>
              </div>
            )}

            {/* Ações */}
            <footer className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 px-6 py-5 sm:flex-row sm:justify-end sm:px-8">

              <button
                type="button"
                onClick={() => router.back()}
                disabled={carregando}
                className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={carregando}
                className="rounded-xl bg-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
              >
                {carregando ? "Cadastrando imóvel..." : "Cadastrar imóvel"}
              </button>

            </footer>

          </div>
        </form>
      </div>
    </main>
  );
}

