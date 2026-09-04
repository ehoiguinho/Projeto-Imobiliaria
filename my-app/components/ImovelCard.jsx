import Link from "next/link";

export default function ImovelCard({ imovel }) {
  const imagem = imovel.imagem
    ? `http://localhost:3000${imovel.imagem}`
    : "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200&auto=format&fit=crop";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      
      {/* Imagem */}
      <div className="relative overflow-hidden">
        <img
          src={imagem}
          alt={`Imagem do imóvel: ${imovel.descricao}`}
          className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
        />

        {/* Status */}
        <span className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-emerald-700 shadow-sm backdrop-blur-sm">
          Disponível
        </span>
      </div>

      {/* Conteúdo */}
      <div className="flex flex-1 flex-col p-6">

        {/* Descrição */}
        <h2 className="line-clamp-2 text-xl font-bold leading-tight text-slate-900">
          {imovel.descricao}
        </h2>

        {/* Localização */}
        <div className="mt-4 space-y-2 text-sm text-slate-600">
          <p className="flex items-start gap-2">
            <span className="mt-0.5">📍</span>
            <span>
              {imovel.endereco}, {imovel.bairro}
            </span>
          </p>

          <p className="pl-6">
            {imovel.cidade}
          </p>

          <p className="pl-6 text-slate-500">
            CEP: {imovel.cep}
          </p>
        </div>

        {/* Preço */}
        <div className="mt-auto pt-6">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Aluguel mensal
          </p>

          <strong className="mt-1 block text-2xl font-bold text-emerald-700">
            {Number(imovel.valor).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL"
            })}
          </strong>
        </div>

        {/* Botão */}
        <Link
          href={`/imoveis/${imovel.id}`}
          className="mt-5 block rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
        >
          Ver detalhes
        </Link>
      </div>
    </article>
  );
}