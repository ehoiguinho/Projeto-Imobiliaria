"use client";

import toast from "react-hot-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Building2, Camera, Check, ChevronDown, MapPin, Upload } from "lucide-react";

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

        const toastId = toast.loading(
            "Cadastrando imóvel..."
        );

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

            const resposta = await fetch(
                "http://localhost:3000/imovel",
                {
                    method: "POST",
                    credentials: "include",
                    body: formData
                }
            );

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(
                    dados.msg || "Erro ao cadastrar imóvel"
                );
            }

            toast.success(
                "Imóvel cadastrado com sucesso!",
                {
                    id: toastId
                }
            );

            router.push("/imoveis");

        } catch (error) {

            setErro(error.message);

            toast.error(
                error.message,
                {
                    id: toastId
                }
            );

        } finally {

            setCarregando(false);

        }

    }


    function selecionarImagens(event) {

        const arquivos = Array.from(
            event.target.files || []
        );

        if (arquivos.length > 5) {

            toast.error(
                "Você pode selecionar no máximo 5 imagens."
            );

            setImagens(arquivos.slice(0, 5));

            return;
        }

        setImagens(arquivos);

    }


    return (

        <main className="min-h-screen bg-white text-[#292825]">

            <div className="mx-auto max-w-5xl px-6 py-10 lg:px-8">


                {/* =====================================================
                    CABEÇALHO
                ====================================================== */}

                <header className="mb-10">

                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="group mb-6 inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-[#8A8883] transition hover:text-[#292825]"
                    >

                        <ArrowLeft
                            size={16}
                            strokeWidth={1.7}
                            className="transition-transform duration-300 group-hover:-translate-x-1"
                        />

                        Voltar

                    </button>


                    <div className="flex items-start gap-4">

                        <div>

                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8A8883]">
                                Administração
                            </p>

                            <h1 className="mt-2 text-3xl font-medium tracking-[-0.03em] text-[#292825] sm:text-4xl">
                                Cadastrar imóvel
                            </h1>

                        </div>

                    </div>

                </header>


                {/* =====================================================
                    FORMULÁRIO
                ====================================================== */}

                <form onSubmit={cadastrarImovel}>

                    <div className="overflow-hidden border border-[#E3E0D9] bg-white">


                        {/* =================================================
                            INFORMAÇÕES PRINCIPAIS
                        ================================================== */}

                        <section className="p-6 sm:p-8">

                            <div className="mb-7">

                                <h2 className="mt-2 text-lg font-semibold text-[#292825]">
                                    Informações do imóvel
                                </h2>

                            </div>


                            <div className="space-y-6">


                                {/* DESCRIÇÃO */}

                                <div>

                                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#55534E]">
                                        Descrição
                                    </label>

                                    <textarea
                                        value={descricao}
                                        onChange={(event) =>
                                            setDescricao(event.target.value)
                                        }
                                        placeholder="Descreva o imóvel, suas características e diferenciais."
                                        required
                                        rows={5}
                                        className="w-full resize-none border border-[#DAD7D0] bg-white px-4 py-3 text-sm text-[#292825] outline-none transition placeholder:text-[#A19E98] focus:border-[#77746E]"
                                    />

                                </div>


                                {/* VALOR + DISPONIBILIDADE */}

                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">


                                    <div>

                                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#55534E]">
                                            Valor do aluguel
                                        </label>

                                        <div className="relative">

                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[#8A8883]">
                                                R$
                                            </span>

                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={valor}
                                                onChange={(event) =>
                                                    setValor(event.target.value)
                                                }
                                                placeholder="2.500,00"
                                                required
                                                className="w-full border border-[#DAD7D0] bg-white py-3 pl-11 pr-4 text-sm text-[#292825] outline-none transition placeholder:text-[#A19E98] focus:border-[#77746E]"
                                            />

                                        </div>

                                    </div>


                                    <div>

                                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#55534E]">
                                            Disponibilidade
                                        </label>

                                        <div className="relative">

                                            <select
                                                value={disponivel}
                                                onChange={(event) =>
                                                    setDisponivel(event.target.value)
                                                }
                                                className="w-full cursor-pointer appearance-none border border-[#DAD7D0] bg-white px-4 py-3 text-sm text-[#292825] outline-none transition focus:border-[#77746E]"
                                            >

                                                <option value="S">
                                                    Disponível
                                                </option>

                                                <option value="N">
                                                    Indisponível
                                                </option>

                                            </select>

                                            <ChevronDown
                                                size={16}
                                                strokeWidth={1.7}
                                                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#8A8883]"
                                            />

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </section>


                        <div className="border-t border-[#E3E0D9]" />


                        {/* =================================================
                            LOCALIZAÇÃO
                        ================================================== */}

                        <section className="p-6 sm:p-8">

                            <div className="mb-7">

                                <div className="mt-2 flex items-center gap-3">

                                    <h2 className="text-lg font-semibold text-[#292825]">
                                        Localização
                                    </h2>

                                    <MapPin
                                        size={17}
                                        strokeWidth={1.6}
                                        className="text-[#8A8883]"
                                    />

                                </div>

                                <p className="mt-1 text-sm text-[#8A8883]">
                                    Informe o endereço completo do imóvel.
                                </p>

                            </div>


                            <div className="space-y-6">


                                {/* CEP + ENDEREÇO */}

                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-[160px_1fr]">


                                    <div>

                                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#55534E]">
                                            CEP
                                        </label>

                                        <input
                                            value={cep}
                                            onChange={(event) =>
                                                setCep(event.target.value)
                                            }
                                            placeholder="00000-000"
                                            inputMode="numeric"
                                            autoComplete="postal-code"
                                            required
                                            className="w-full border border-[#DAD7D0] bg-white px-4 py-3 text-sm text-[#292825] outline-none transition placeholder:text-[#A19E98] focus:border-[#77746E]"
                                        />

                                    </div>


                                    <div>

                                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#55534E]">
                                            Endereço
                                        </label>

                                        <input
                                            value={endereco}
                                            onChange={(event) =>
                                                setEndereco(event.target.value)
                                            }
                                            placeholder="Rua Exemplo, 123"
                                            autoComplete="street-address"
                                            required
                                            className="w-full border border-[#DAD7D0] bg-white px-4 py-3 text-sm text-[#292825] outline-none transition placeholder:text-[#A19E98] focus:border-[#77746E]"
                                        />

                                    </div>

                                </div>


                                {/* BAIRRO + CIDADE */}

                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">


                                    <div>

                                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#55534E]">
                                            Bairro
                                        </label>

                                        <input
                                            value={bairro}
                                            onChange={(event) =>
                                                setBairro(event.target.value)
                                            }
                                            placeholder="Ex.: Centro"
                                            required
                                            className="w-full border border-[#DAD7D0] bg-white px-4 py-3 text-sm text-[#292825] outline-none transition placeholder:text-[#A19E98] focus:border-[#77746E]"
                                        />

                                    </div>


                                    <div>

                                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#55534E]">
                                            Cidade
                                        </label>

                                        <input
                                            value={cidade}
                                            onChange={(event) =>
                                                setCidade(event.target.value)
                                            }
                                            placeholder="Ex.: Santo André"
                                            autoComplete="address-level2"
                                            required
                                            className="w-full border border-[#DAD7D0] bg-white px-4 py-3 text-sm text-[#292825] outline-none transition placeholder:text-[#A19E98] focus:border-[#77746E]"
                                        />

                                    </div>

                                </div>

                            </div>

                        </section>


                        <div className="border-t border-[#E3E0D9]" />


                        {/* =================================================
                            FOTOS
                        ================================================== */}

                        <section className="p-6 sm:p-8">

                            <div className="mb-7">

                                <div className="mt-2 flex items-center gap-3">

                                    <h2 className="text-lg font-semibold text-[#292825]">
                                        Fotos do imóvel
                                    </h2>

                                    <Camera
                                        size={17}
                                        strokeWidth={1.6}
                                        className="text-[#8A8883]"
                                    />

                                </div>

                                <p className="mt-1 text-sm text-[#8A8883]">
                                    Adicione até 5 imagens para apresentar
                                    o imóvel.
                                </p>

                            </div>


                            {/* UPLOAD */}

                            <label className="group flex cursor-pointer flex-col items-center justify-center border border-dashed border-[#CFCBC3] bg-[#FCFBF8] px-6 py-12 text-center transition hover:border-[#8A8883] hover:bg-[#F7F5F0]">

                                <div className="flex h-12 w-12 items-center justify-center text-[#77746E] transition-transform duration-300 group-hover:-translate-y-1">

                                    <Upload
                                        size={24}
                                        strokeWidth={1.4}
                                    />

                                </div>

                                <p className="mt-4 text-sm font-semibold text-[#292825]">
                                    Selecionar imagens
                                </p>

                                <p className="mt-1 text-xs text-[#A19E98]">
                                    PNG ou JPEG · máximo de 5 imagens
                                </p>

                                <input
                                    type="file"
                                    accept="image/png, image/jpeg, image/jpg"
                                    multiple
                                    onChange={selecionarImagens}
                                    className="hidden"
                                />

                            </label>


                            {/* IMAGENS SELECIONADAS */}

                            {imagens.length > 0 && (

                                <div className="mt-5 border border-[#E3E0D9] bg-[#FCFBF8]">

                                    <div className="flex items-center justify-between border-b border-[#E3E0D9] px-4 py-3">

                                        <div className="flex items-center gap-2">

                                            <Check
                                                size={15}
                                                strokeWidth={1.8}
                                                className="text-[#55534E]"
                                            />

                                            <p className="text-sm font-semibold text-[#292825]">

                                                {imagens.length}{" "}

                                                {imagens.length === 1
                                                    ? "imagem selecionada"
                                                    : "imagens selecionadas"}

                                            </p>

                                        </div>

                                        <span className="text-xs text-[#A19E98]">
                                            {imagens.length}/5
                                        </span>

                                    </div>


                                    <div className="space-y-2 px-4 py-4">

                                        {Array.from(imagens).map(
                                            (imagem, index) => (

                                                <div
                                                    key={`${imagem.name}-${index}`}
                                                    className="flex items-center gap-3"
                                                >

                                                    <Camera
                                                        size={14}
                                                        strokeWidth={1.5}
                                                        className="shrink-0 text-[#A19E98]"
                                                    />

                                                    <p className="truncate text-xs text-[#77746E]">
                                                        {imagem.name}
                                                    </p>

                                                </div>

                                            )
                                        )}

                                    </div>

                                </div>

                            )}

                        </section>


                        {/* =================================================
                            ERRO
                        ================================================== */}

                        {erro && (

                            <div className="mx-6 mb-6 border border-[#D6D2CA] bg-[#F7F5F0] px-4 py-4 sm:mx-8">

                                <p className="text-sm font-medium text-[#55534E]">
                                    {erro}
                                </p>

                            </div>

                        )}


                        {/* =================================================
                            AÇÕES
                        ================================================== */}

                        <footer className="flex flex-col-reverse gap-3 border-t border-[#E3E0D9] bg-white px-6 py-5 sm:flex-row sm:justify-end sm:px-8">

                            <button
                                type="button"
                                onClick={() => router.back()}
                                disabled={carregando}
                                className="cursor-pointer border border-[#D5D1C9] bg-white px-6 py-3 text-sm font-semibold text-[#55534E] transition hover:bg-[#F1F0ED] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Cancelar
                            </button>


                            <button
                                type="submit"
                                disabled={carregando}
                                className="group inline-flex cursor-pointer items-center justify-center gap-2 bg-[#292825] px-7 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#171614] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                            >

                                {carregando
                                    ? "Cadastrando imóvel..."
                                    : "Cadastrar imóvel"
                                }

                                {!carregando && (

                                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                                        →
                                    </span>

                                )}

                            </button>

                        </footer>

                    </div>

                </form>


                {/* =====================================================
                    RODAPÉ DISCRETO
                ====================================================== */}

                <div className="mt-8 flex items-center justify-between border-t border-[#E3E0D9] pt-5">

                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A19E98]">
                        VITTA IMOBILIÁRIA
                    </p>

                    <p className="text-xs text-[#A19E98]">
                        Área administrativa
                    </p>

                </div>

            </div>

        </main>

    );

}
