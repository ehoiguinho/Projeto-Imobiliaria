import Link from "next/link";
import { Building2, MapPin } from "lucide-react";

export default function ImovelCard({ imovel }) {
  const imagem = imovel.imagem
    ? `http://localhost:3000${imovel.imagem}`
    : null;

  return (
    <Link
      href={`/imoveis/${imovel.id}`}
      className="group block bg-white text-left transition hover:-translate-y-1 cursor-pointer"
    >
      {/* Imagem */}
      <div className="relative h-[330px] overflow-hidden bg-[#E7E5E0]">
        {imagem ? (
          <img
            src={imagem}
            alt={imovel.descricao}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="text-center">
              <Building2
                size={42}
                strokeWidth={1.2}
                className="mx-auto text-[#B9B6AF]"
              />

              <p className="mt-3 text-xs uppercase tracking-wide text-[#9D9A93]">
                Imagem não disponível
              </p>
            </div>
          </div>
        )}

        {/* Status */}
        <div className="absolute left-4 top-4 bg-[#F7F5F0]/95 px-3 py-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#55534E]">
            Disponível
          </span>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-6">
        {/* Preço */}
        <p className="text-xl font-semibold tracking-tight text-[#292825]">
          R${" "}
          {Number(imovel.valor).toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>

        {/* Descrição */}
        <h3 className="mt-2 line-clamp-1 text-base font-semibold text-[#292825]">
          {imovel.descricao}
        </h3>

        {/* Localização */}
        <div className="mt-4 flex items-center gap-2 text-sm text-[#77746E]">
          <MapPin
            size={15}
            strokeWidth={1.7}
          />

          <span>
            {imovel.bairro}, {imovel.cidade}
          </span>
        </div>

        {/* Endereço */}
        <p className="mt-2 line-clamp-1 text-xs text-[#A09D96]">
          {imovel.endereco}
        </p>

        {/* Ação */}
        <div className="mt-5 flex items-center justify-between border-t border-[#ECEAE5] pt-4">
          <span className="text-xs font-semibold uppercase tracking-wide text-[#77746E]">
            Ver imóvel
          </span>

          <span className="text-lg text-[#55534E] transition-transform group-hover:translate-x-1">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
