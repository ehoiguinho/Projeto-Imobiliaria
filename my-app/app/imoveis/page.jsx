"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ImovelCard from "../../components/ImovelCard";

export default function ImoveisPage() {
    const [imoveis, setImoveis] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    async function carregarImoveis() {
        try{
            setCarregando(true);
            setErro("");

            const resposta = await fetch ("http://localhost:3000/imovel/disponivel", {
                method: "GET",
                credentials: "include"
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(dados.msg || "Erro ao carregar imóveis");
            }

            setImoveis(dados);
        }
        catch (error) {
            setErro(error.message);
        }
        finally {
            setCarregando(false);
        }
    
    }
    useEffect(() => {
        carregarImoveis();
    }, []);

    return (
  <main className="min-h-screen bg-slate-100 px-6 py-10">
    <header className="mx-auto mb-8 max-w-6xl">
      <h1 className="text-4xl font-bold text-slate-900">
        Imóveis disponíveis
      </h1>
      <p className="mt-2 text-slate-500">
        Confira os imóveis cadastrados para locação.
      </p>
    </header>

    {carregando && (
      <p className="mx-auto max-w-6xl rounded-xl bg-white p-5 text-slate-500 shadow-sm">
        Carregando imóveis...
      </p>
    )}

    {erro && (
      <p className="mx-auto max-w-6xl rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
        {erro}
      </p>
    )}

    {!carregando && imoveis.length === 0 && (
      <p className="mx-auto max-w-6xl rounded-xl bg-white p-5 text-slate-500 shadow-sm">
        Nenhum imóvel encontrado.
      </p>
    )}

    <section className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {imoveis.map((imovel) => (
  <ImovelCard key={imovel.id} imovel={imovel} />
))}
    </section>
  </main>
);
}