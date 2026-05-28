import Link from "next/link";

export default function ImovelCard({ imovel }) {
  const imagem = imovel.imagem
    ? `http://localhost:3000${imovel.imagem}`
    : "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200&auto=format&fit=crop";

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <img
        src={imagem}
        alt={imovel.descricao}
        className="h-48 w-full object-cover"
      />

      <div className="p-6">
        <h2 className="text-xl font-bold text-slate-900">
          {imovel.descricao}
        </h2>

        <div className="mt-4 space-y-1 text-sm text-slate-600">
          <p>
            {imovel.endereco}, {imovel.bairro}
          </p>

          <p>{imovel.cidade}</p>

          <p>CEP: {imovel.cep}</p>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <strong className="text-2xl font-bold text-emerald-700">
            {Number(imovel.valor).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL"
            })}
          </strong>

          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            Disponível
          </span>
        </div>
      </div>
      <Link
        href={`/imoveis/${imovel.id}`}
        className="mt-5 block rounded-lg bg-blue-600 px-4 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
        >
        Ver detalhes
    </Link>
</article>
  );
}