"use client";

import {
    MapPin,
    Building2,
    CircleDollarSign,
    Search,
    ChevronDown,
    Settings
} from "lucide-react";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {

    const router = useRouter();

    const [cidade, setCidade] = useState("");
    const [bairro, setBairro] = useState("");
    const [valorMin, setValorMin] = useState("");
    const [valorMax, setValorMax] = useState("");

    const [menuAjudaAberto, setMenuAjudaAberto] = useState(false);

    /*
     * USUÁRIO AUTENTICADO
     */
    const [usuario, setUsuario] = useState(null);
    const [carregandoUsuario, setCarregandoUsuario] = useState(true);

    /*
     * IMÓVEIS EM DESTAQUE
     */
    const [imoveisDestaque, setImoveisDestaque] = useState([]);
    const [carregandoDestaques, setCarregandoDestaques] = useState(true);


    /*
     * ==========================================================
     * CARREGAR USUÁRIO LOGADO
     * ==========================================================
     */

    useEffect(() => {

        async function carregarUsuario() {

            try {

                const resposta = await fetch(
                    "http://localhost:3000/login/usuario",
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );

                if (!resposta.ok) {

                    setUsuario(null);

                    return;
                }

                const dados = await resposta.json();

                setUsuario(dados);

            } catch (error) {

                console.log(
                    "Usuário não autenticado."
                );

                setUsuario(null);

            } finally {

                setCarregandoUsuario(false);

            }
        }

        carregarUsuario();

    }, []);


    /*
     * ==========================================================
     * CARREGAR IMÓVEIS EM DESTAQUE
     * ==========================================================
     */

    useEffect(() => {

        async function carregarDestaques() {

            try {

                const response = await fetch(
                    "http://localhost:3000/imovel/destaques"
                );

                if (!response.ok) {

                    throw new Error(
                        "Erro ao carregar imóveis em destaque."
                    );

                }

                const data = await response.json();

                setImoveisDestaque(data);

            } catch (error) {

                console.error(
                    "Erro ao carregar imóveis em destaque:",
                    error
                );

            } finally {

                setCarregandoDestaques(false);

            }
        }

        carregarDestaques();

    }, []);


    /*
     * ==========================================================
     * BUSCA DE IMÓVEIS
     * ==========================================================
     */

    function buscarImoveis(e) {

        e.preventDefault();

        const params = new URLSearchParams();

        if (cidade.trim()) {
            params.set("cidade", cidade.trim());
        }

        if (bairro.trim()) {
            params.set("bairro", bairro.trim());
        }

        if (valorMin) {
            params.set("min", valorMin);
        }

        if (valorMax) {
            params.set("max", valorMax);
        }

        router.push(
            `/imoveis?${params.toString()}`
        );

    }


    /*
     * ==========================================================
     * LOGOUT
     * ==========================================================
     */

    async function logout() {

        try {

            const resposta = await fetch(
                "http://localhost:3000/login/logout",
                {
                    method: "POST",
                    credentials: "include"
                }
            );

            if (!resposta.ok) {

                console.log(
                    "Não foi possível realizar o logout."
                );

                return;
            }

            setUsuario(null);

            router.push("/");

        } catch (error) {

            console.error(
                "Erro ao realizar logout:",
                error
            );

        }

    }


    return (

        <main className="min-h-screen bg-[#F7F5F0] text-[#292825]">


            {/* =====================================================
                NAVBAR
            ====================================================== */}

            <header className="absolute left-0 right-0 top-0 z-50">

                <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6 lg:px-8">


                    {/* =================================================
                        LOGO
                    ================================================== */}

                    <button
                        type="button"
                        onClick={() => router.push("/")}
                        className="group flex items-center gap-3"
                    >

                        <div className="flex h-10 w-10 items-center justify-center border border-white/40 text-white transition group-hover:bg-white group-hover:text-[#292825]">

                            <span className="text-lg font-semibold tracking-[-0.08em]">
                                V
                            </span>

                        </div>


                        <div className="leading-none text-left">

                            <span className="block text-lg font-semibold tracking-[0.18em] text-white">
                                VITTA
                            </span>

                            <span className="mt-1 block text-[9px] font-medium tracking-[0.28em] text-white/70">
                                IMOBILIÁRIA
                            </span>

                        </div>

                    </button>



                    {/* =================================================
                        NAVEGAÇÃO
                    ================================================== */}

                    <nav className="hidden items-center gap-9 md:flex">


                        {/* INÍCIO */}

                        <button
                            type="button"
                            onClick={() => router.push("/")}
                            className="text-sm font-medium text-white transition hover:text-white/70"
                        >
                            Início
                        </button>


                        {/* IMÓVEIS */}

                        <button
                            type="button"
                            onClick={() => router.push("/imoveis")}
                            className="text-sm font-medium text-white/80 transition hover:text-white"
                        >
                            Imóveis
                        </button>


                        {/* AJUDA */}

                        <div className="relative">

                            <button
                                type="button"
                                onClick={() =>
                                    setMenuAjudaAberto(
                                        !menuAjudaAberto
                                    )
                                }
                                className="flex items-center gap-1.5 text-sm font-medium text-white/80 transition hover:text-white"
                            >

                                Ajuda

                                <ChevronDown
                                    size={15}
                                    strokeWidth={1.8}
                                    className={`transition-transform ${
                                        menuAjudaAberto
                                            ? "rotate-180"
                                            : ""
                                    }`}
                                />

                            </button>


                            {/* DROPDOWN */}

                            {menuAjudaAberto && (

                                <div className="absolute right-0 top-9 w-48 border border-[#E7E5E0] bg-white p-2 shadow-xl">

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMenuAjudaAberto(false);
                                            router.push("/sobrenos");
                                        }}
                                        className="block w-full px-4 py-3 text-left text-sm text-[#55534E] transition hover:bg-[#F7F5F0] hover:text-[#292825]"
                                    >
                                        Sobre nós
                                    </button>


                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMenuAjudaAberto(false);
                                            router.push("/atendimento");
                                        }}
                                        className="block w-full px-4 py-3 text-left text-sm text-[#55534E] transition hover:bg-[#F7F5F0] hover:text-[#292825]"
                                    >
                                        Atendimento
                                    </button>

                                </div>

                            )}

                        </div>

                    </nav>



                    {/* =================================================
                        ÁREA DO USUÁRIO
                    ================================================== */}

                    <div className="flex items-center gap-3">


                        {/* LOADING */}

                        {carregandoUsuario ? (

                            <div className="h-10 w-28 animate-pulse bg-white/10" />

                        ) : usuario ? (

                            <>

                                {/* NOME */}

                                <span className="hidden text-sm font-medium text-white/90 lg:block">
                                    Olá, {usuario.nome}
                                </span>


                                {/* SAIR */}

                                <button
                                    type="button"
                                    onClick={logout}
                                    className="border border-white/50 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white hover:text-[#292825]"
                                >
                                    Sair
                                </button>


                                {/* ADMIN */}

                                {usuario.perfil === 1 && (

                                    <button
                                        type="button"
                                        onClick={() =>
                                            router.push("/admin")
                                        }
                                        title="Painel administrativo"
                                        aria-label="Abrir painel administrativo"
                                        
                                        className="flex h-10 w-10 items-center justify-center text-white transition cursor-pointer"
                                    >

                                        <Settings
                                            size={18}
                                            strokeWidth={1.8}
                                        />

                                    </button>

                                )}

                            </>

                        ) : (

                            /* =================================================
                               USUÁRIO NÃO AUTENTICADO
                            ================================================== */

                            <button
                                type="button"
                                onClick={() =>
                                    router.push("/login")
                                }
                                className="border border-white/50 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white hover:text-[#292825]"
                            >
                                Entrar
                            </button>

                        )}

                    </div>

                </div>

            </header>



            {/* =====================================================
                HERO
            ====================================================== */}

            <section className="relative min-h-[760px] overflow-hidden">


                {/* IMAGEM */}

                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url('/images/home.jpg')"
                    }}
                />


                {/* OVERLAY */}

                <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-black/20" />


                {/* CONTEÚDO */}

                <div className="relative z-10 mx-auto flex min-h-[760px] max-w-7xl items-center px-6 pb-16 pt-32 lg:px-8">

                    <div className="grid w-full grid-cols-1 items-center gap-14 lg:grid-cols-2">


                        {/* TEXTO */}

                        <div className="max-w-2xl">

                            <p className="mb-6 text-xs font-medium uppercase tracking-[0.35em] text-white/70">
                                VITTA IMOBILIÁRIA
                            </p>

                            <h1 className="max-w-xl text-5xl font-medium leading-[1.05] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
                                Um lugar para viver o que realmente importa.
                            </h1>

                            <p className="mt-7 max-w-lg text-base leading-relaxed text-white/75 sm:text-lg">
                                Encontre imóveis que combinam com
                                seu momento, seu estilo e a vida que
                                você deseja construir.
                            </p>

                        </div>


                        {/* BUSCA */}

                        <div className="flex justify-end">

                            <form
                                onSubmit={buscarImoveis}
                                className="w-full max-w-md bg-white p-7 shadow-2xl sm:p-8"
                            >

                                <div className="mb-7">

                                    <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#8A8883]">
                                        Encontre seu imóvel
                                    </p>

                                    <h2 className="mt-2 text-2xl font-medium tracking-tight text-[#292825]">
                                        O espaço certo começa aqui.
                                    </h2>

                                </div>


                                <div className="space-y-4">


                                    {/* CIDADE */}

                                    <div>

                                        <label
                                            htmlFor="cidade"
                                            className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#6F6D68]"
                                        >
                                            Cidade
                                        </label>

                                        <div className="relative">

                                            <MapPin
                                                size={17}
                                                strokeWidth={1.7}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A8883]"
                                            />

                                            <input
                                                id="cidade"
                                                type="text"
                                                value={cidade}
                                                onChange={(e) =>
                                                    setCidade(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Busque por cidade"
                                                className="w-full border border-[#DAD8D2] bg-white py-3.5 pl-11 pr-4 text-sm text-[#292825] outline-none transition placeholder:text-[#AAA8A2] focus:border-[#55534E]"
                                            />

                                        </div>

                                    </div>


                                    {/* BAIRRO */}

                                    <div>

                                        <label
                                            htmlFor="bairro"
                                            className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#6F6D68]"
                                        >
                                            Bairro
                                        </label>

                                        <div className="relative">

                                            <Building2
                                                size={17}
                                                strokeWidth={1.7}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A8883]"
                                            />

                                            <input
                                                id="bairro"
                                                type="text"
                                                value={bairro}
                                                onChange={(e) =>
                                                    setBairro(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Busque por bairro"
                                                className="w-full border border-[#DAD8D2] bg-white py-3.5 pl-11 pr-4 text-sm text-[#292825] outline-none transition placeholder:text-[#AAA8A2] focus:border-[#55534E]"
                                            />

                                        </div>

                                    </div>


                                    {/* VALORES */}

                                    <div className="grid grid-cols-2 gap-3">

                                        <div>

                                            <label
                                                htmlFor="valorMin"
                                                className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#6F6D68]"
                                            >
                                                Valor mínimo
                                            </label>

                                            <div className="relative">

                                                <CircleDollarSign
                                                    size={16}
                                                    strokeWidth={1.7}
                                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8883]"
                                                />

                                                <input
                                                    id="valorMin"
                                                    type="number"
                                                    min="0"
                                                    value={valorMin}
                                                    onChange={(e) =>
                                                        setValorMin(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="R$ 0"
                                                    className="w-full border border-[#DAD8D2] bg-white py-3.5 pl-10 pr-3 text-sm text-[#292825] outline-none transition placeholder:text-[#AAA8A2] focus:border-[#55534E]"
                                                />

                                            </div>

                                        </div>


                                        <div>

                                            <label
                                                htmlFor="valorMax"
                                                className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#6F6D68]"
                                            >
                                                Valor máximo
                                            </label>

                                            <div className="relative">

                                                <CircleDollarSign
                                                    size={16}
                                                    strokeWidth={1.7}
                                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8883]"
                                                />

                                                <input
                                                    id="valorMax"
                                                    type="number"
                                                    min="0"
                                                    value={valorMax}
                                                    onChange={(e) =>
                                                        setValorMax(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="R$ 0"
                                                    className="w-full border border-[#DAD8D2] bg-white py-3.5 pl-10 pr-3 text-sm text-[#292825] outline-none transition placeholder:text-[#AAA8A2] focus:border-[#55534E]"
                                                />

                                            </div>

                                        </div>

                                    </div>


                                    {/* BOTÃO */}

                                    <button
                                        type="submit"
                                        className="mt-2 flex w-full items-center justify-center gap-2 bg-[#292825] py-4 text-sm font-semibold text-white transition hover:bg-[#45433F]"
                                    >

                                        <Search
                                            size={17}
                                            strokeWidth={1.8}
                                        />

                                        Buscar imóveis

                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                </div>


                {/* INDICADOR */}

                <div className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-white/60 md:flex">

                    <span>
                        Explore nossos imóveis
                    </span>

                    <div className="h-px w-10 bg-white/40" />

                </div>

            </section>



            {/* =====================================================
                DESTAQUES
            ====================================================== */}

            <section className="bg-[#F7F5F0] py-24 sm:py-28">

                <div className="mx-auto max-w-7xl px-6 lg:px-8">


                    <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">

                        <div>

                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8A8883]">
                                Nossa seleção
                            </p>

                            <h2 className="mt-3 text-4xl font-medium tracking-[-0.03em] text-[#292825]">
                                Imóveis em destaque
                            </h2>

                            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#77746E]">
                                Espaços selecionados para diferentes
                                momentos, estilos e formas de viver.
                            </p>

                        </div>


                        <button
                            type="button"
                            onClick={() => router.push("/imoveis")}
                            className="hidden text-sm font-semibold text-[#55534E] transition hover:text-[#292825] md:block"
                        >
                            Ver todos os imóveis →
                        </button>

                    </div>


                    {/* LOADING */}

                    {carregandoDestaques && (

                        <div className="grid grid-cols-1 gap-7 md:grid-cols-3">

                            {[1, 2, 3].map((item) => (

                                <div
                                    key={item}
                                    className="h-[450px] animate-pulse bg-[#E7E5E0]"
                                />

                            ))}

                        </div>

                    )}


                    {/* IMÓVEIS */}

                    {!carregandoDestaques &&
                        imoveisDestaque.length > 0 && (

                            <div className="grid grid-cols-1 gap-7 md:grid-cols-3">

                                {imoveisDestaque.map((imovel) => {

                                    const imagem =
                                        imovel.imagem?.caminho
                                            ? `http://localhost:3000${imovel.imagem.caminho}`
                                            : null;

                                    return (

                                        <button
                                            key={imovel.id}
                                            type="button"
                                            onClick={() =>
                                                router.push(
                                                    `/imoveis/${imovel.id}`
                                                )
                                            }
                                            className="group block bg-white text-left transition hover:-translate-y-1 cursor-pointer"
                                        >

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


                                                <div className="absolute left-4 top-4 bg-[#F7F5F0]/95 px-3 py-1.5">

                                                    <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#55534E]">
                                                        Destaque
                                                    </span>

                                                </div>

                                            </div>


                                            <div className="p-6">

                                                <p className="text-xl font-semibold tracking-tight text-[#292825]">

                                                    R${" "}

                                                    {Number(
                                                        imovel.valor
                                                    ).toLocaleString(
                                                        "pt-BR",
                                                        {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2
                                                        }
                                                    )}

                                                </p>


                                                <h3 className="mt-2 line-clamp-1 text-base font-semibold text-[#292825]">
                                                    {imovel.descricao}
                                                </h3>


                                                <div className="mt-4 flex items-center gap-2 text-sm text-[#77746E]">

                                                    <MapPin
                                                        size={15}
                                                        strokeWidth={1.7}
                                                    />

                                                    <span>
                                                        {imovel.bairro},{" "}
                                                        {imovel.cidade}
                                                    </span>

                                                </div>


                                                <p className="mt-2 line-clamp-1 text-xs text-[#A09D96]">
                                                    {imovel.endereco}
                                                </p>


                                                <div className="mt-5 flex items-center justify-between border-t border-[#ECEAE5] pt-4">

                                                    <span className="text-xs font-semibold uppercase tracking-wide text-[#77746E]">
                                                        Ver imóvel
                                                    </span>

                                                    <span className="text-lg text-[#55534E] transition-transform group-hover:translate-x-1">
                                                        →
                                                    </span>

                                                </div>

                                            </div>

                                        </button>

                                    );

                                })}

                            </div>

                        )}


                    {/* NENHUM IMÓVEL */}

                    {!carregandoDestaques &&
                        imoveisDestaque.length === 0 && (

                            <div className="border border-[#DDDAD3] bg-white p-12 text-center">

                                <Building2
                                    size={38}
                                    strokeWidth={1.2}
                                    className="mx-auto text-[#B5B2AB]"
                                />

                                <p className="mt-4 text-sm text-[#77746E]">
                                    Nenhum imóvel disponível no momento.
                                </p>

                            </div>

                        )}


                    {/* MOBILE */}

                    {!carregandoDestaques &&
                        imoveisDestaque.length > 0 && (

                            <div className="mt-10 flex justify-center md:hidden">

                                <button
                                    type="button"
                                    onClick={() =>
                                        router.push("/imoveis")
                                    }
                                    className="border border-[#292825] px-7 py-3 text-sm font-semibold text-[#292825] transition hover:bg-[#292825] hover:text-white"
                                >
                                    Ver todos os imóveis
                                </button>

                            </div>

                        )}

                </div>

            </section>



            {/* =====================================================
                SEÇÃO INSTITUCIONAL
            ====================================================== */}

            <section className="border-y border-[#E3E0D9] bg-white py-24">

                <div className="mx-auto max-w-7xl px-6 lg:px-8">

                    <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:items-center">


                        <div className="max-w-xl">

                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8A8883]">
                                VITTA
                            </p>

                            <h2 className="mt-4 text-4xl font-medium leading-tight tracking-[-0.03em] text-[#292825] sm:text-5xl">
                                Mais do que encontrar um imóvel.

                                <span className="block text-[#8A8883]">
                                    Encontrar seu lugar.
                                </span>
                            </h2>

                            <p className="mt-6 text-base leading-8 text-[#77746E]">
                                A Vitta nasceu para tornar a busca por
                                um novo lar mais simples, transparente
                                e próxima das pessoas.
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    router.push("/sobrenos")
                                }
                                className="mt-8 inline-flex items-center gap-3 border-b border-[#292825] pb-2 text-sm font-semibold text-[#292825] transition hover:border-[#8A8883] hover:text-[#77746E]"
                            >
                                Conheça a Vitta
                                <span>→</span>
                            </button>

                        </div>


                        <div className="grid grid-cols-2 border-t border-[#E3E0D9] sm:grid-cols-3 lg:border-l lg:border-t-0">

                            <div className="border-b border-r border-[#E3E0D9] px-6 py-8 lg:border-b-0">

                                <p className="text-3xl font-medium text-[#292825]">
                                    100+
                                </p>

                                <p className="mt-2 text-xs uppercase tracking-wide text-[#8A8883]">
                                    Imóveis
                                </p>

                            </div>


                            <div className="border-b border-[#E3E0D9] px-6 py-8 lg:border-b-0">

                                <p className="text-3xl font-medium text-[#292825]">
                                    24h
                                </p>

                                <p className="mt-2 text-xs uppercase tracking-wide text-[#8A8883]">
                                    Atendimento
                                </p>

                            </div>


                            <div className="col-span-2 px-6 py-8 sm:col-span-1">

                                <p className="text-3xl font-medium text-[#292825]">
                                    100%
                                </p>

                                <p className="mt-2 text-xs uppercase tracking-wide text-[#8A8883]">
                                    Transparência
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </section>



            {/* =====================================================
                CTA
            ====================================================== */}

            <section className="bg-[#292825] py-20">

                <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 md:flex-row md:items-center lg:px-8">

                    <div>

                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/45">
                            Encontre seu próximo endereço
                        </p>

                        <h2 className="mt-3 max-w-xl text-3xl font-medium tracking-[-0.03em] text-white sm:text-4xl">
                            Seu próximo capítulo pode começar aqui.
                        </h2>

                    </div>


                    <button
                        type="button"
                        onClick={() =>
                            router.push("/imoveis")
                        }
                        className="shrink-0 bg-white px-7 py-3.5 text-sm font-semibold text-[#292825] hover:bg-[#F5F4F1] cursor-pointer"
                    >
                        Explorar imóveis →
                    </button>

                </div>

            </section>



            {/* =====================================================
                FOOTER
            ====================================================== */}

            <footer className="bg-[#F7F5F0]">

                <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

                    <div className="grid grid-cols-1 gap-12 md:grid-cols-4">


                        <div className="md:col-span-2">

                            <button
                                type="button"
                                onClick={() =>
                                    router.push("/")
                                }
                                className="inline-block text-left"
                            >

                                <span className="block text-2xl font-semibold tracking-[0.16em] text-[#292825]">
                                    VITTA
                                </span>

                                <span className="mt-1 block text-[9px] font-medium tracking-[0.3em] text-[#8A8883]">
                                    IMOBILIÁRIA
                                </span>

                            </button>

                            <p className="mt-6 max-w-sm text-sm leading-7 text-[#77746E]">
                                Encontre imóveis que combinam com
                                você e descubra um lugar para chamar
                                de lar.
                            </p>

                        </div>


                        <div>

                            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#292825]">
                                Navegação
                            </h3>

                            <div className="mt-5 flex flex-col gap-3 cursor-pointer">

                                <button
                                    type="button"
                                    onClick={() =>
                                        router.push("/")
                                    }
                                    className="text-left text-sm text-[#77746E] transition hover:text-[#292825]"
                                >
                                    Início
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        router.push("/imoveis")
                                    }
                                    className="text-left text-sm text-[#77746E] transition hover:text-[#292825]"
                                >
                                    Imóveis
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        router.push("/sobrenos")
                                    }
                                    className="text-left text-sm text-[#77746E] transition hover:text-[#292825]"
                                >
                                    Sobre nós
                                </button>

                                {!usuario && (

                                    <button
                                        type="button"
                                        onClick={() =>
                                            router.push("/login")
                                        }
                                        className="text-left text-sm text-[#77746E] transition hover:text-[#292825]"
                                    >
                                        Entrar
                                    </button>

                                )}

                            </div>

                        </div>


                        <div>

                            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#292825]">
                                Atendimento
                            </h3>

                            <div className="mt-5 flex flex-col gap-3 text-sm text-[#77746E]">

                                <span>
                                    Segunda a sexta 08:00 às 18:00

                                </span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        router.push("/atendimento")
                                    }
                                    className="text-left transition hover:text-[#292825]"
                                >
                                    Fale conosco →
                                </button>

                            </div>

                        </div>

                    </div>


                       <div className="mt-12 border-t border-[#E7E5E0] pt-6">

                        <p className="text-center text-xs text-[#A19E98]">
                            © {new Date().getFullYear()} Vitta Imobiliária.
                            Todos os direitos reservados.
                        </p>

                    </div>

                </div>

            </footer>

        </main>
    );
}
