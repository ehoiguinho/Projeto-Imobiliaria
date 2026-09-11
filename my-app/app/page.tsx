"use client";

import { MapPin, Building2, CircleDollarSign, Search, ChevronDown, Settings } from "lucide-react";

import { API_URL } from "@/lib/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Home() {

    const router = useRouter();

    const [cidade, setCidade] = useState("");
    const [bairro, setBairro] = useState("");
    const [valorMin, setValorMin] = useState("");
    const [valorMax, setValorMax] = useState("");

    const [menuAjudaAberto, setMenuAjudaAberto] = useState(false);
    const [menuUsuarioAberto, setMenuUsuarioAberto] = useState(false);

    const [animacaoEstatisticas, setAnimacaoEstatisticas] = useState(false);
    const [numeroImoveis, setNumeroImoveis] = useState(0);
    const [numeroAtendimento, setNumeroAtendimento] = useState(0);
    const [numeroTransparencia, setNumeroTransparencia] = useState(0);

    const [usuario, setUsuario] = useState<{
        id: number;
        nome: string;
        email: string;
        ativo: string;
        perfil: number;
} | null>(null);    const [carregandoUsuario, setCarregandoUsuario] = useState(true);

    const [imoveisDestaque, setImoveisDestaque] = useState<
    {
        id: number;
        descricao: string;
        bairro: string;
        cidade: string;
        endereco: string;
        valor: number;
        imagem?: {
            caminho: string;
        } | null;
    }[]
>([]);    
    
    const [carregandoDestaques, setCarregandoDestaques] = useState(true);

    const [textoTitulo, setTextoTitulo] = useState("");

    const tituloCompleto = "Seu próximo imóvel começa aqui.";

    /*
     * Referências dos dropdowns.
     * Usadas para detectar cliques fora dos menus.
     */
    const menuAjudaRef = useRef<HTMLDivElement | null>(null);
    const menuUsuarioRef = useRef<HTMLDivElement | null>(null);


    /*
     * ============================================================
     * EFEITO DE DIGITAÇÃO
     * ============================================================
     */
    useEffect(() => {

        let index = 0;

        const intervalo = setInterval(() => {

            if (index < tituloCompleto.length) {

                setTextoTitulo(
                    tituloCompleto.slice(0, index + 1)
                );

                index++;

            } else {

                clearInterval(intervalo);

            }

        }, 55);

        return () => clearInterval(intervalo);

    }, []);


    /*
     * ============================================================
     * CARREGAR USUÁRIO
     * ============================================================
     */
    useEffect(() => {

        async function carregarUsuario() {

            try {

                const resposta = await fetch(`${API_URL}/login/usuario`,
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
     * ============================================================
     * FECHAR MENUS AO CLICAR FORA
     * ============================================================
     */
    useEffect(() => {

        function fecharMenusAoClicarFora(event: MouseEvent) {

        if (
            menuAjudaRef.current &&
            !menuAjudaRef.current.contains(event.target as Node)
        ) {

            setMenuAjudaAberto(false);

        }

        
        if (
            menuUsuarioRef.current &&
            !menuUsuarioRef.current.contains(event.target as Node)
        ) {

            setMenuUsuarioAberto(false);

        }

    }

        document.addEventListener(
            "mousedown",
            fecharMenusAoClicarFora
        );

        return () => {

            document.removeEventListener(
                "mousedown",
                fecharMenusAoClicarFora
            );

        };

    }, []);


    /*
     * ============================================================
     * CARREGAR IMÓVEIS EM DESTAQUE
     * ============================================================
     */
    useEffect(() => {

        async function carregarDestaques() {

            try {

                const response = await fetch(`${API_URL}/imovel/destaques`
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
     * ============================================================
     * OBSERVAR ESTATÍSTICAS
     * ============================================================
     */
    useEffect(() => {

        const elemento = document.getElementById(
            "estatisticas-vitta"
        );

        if (!elemento) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {

                if (entry.isIntersecting) {

                    setAnimacaoEstatisticas(true);

                    observer.disconnect();

                }

            },
            {
                threshold: 0.35
            }
        );

        observer.observe(elemento);

        return () => {
            observer.disconnect();
        };

    }, []);


    useEffect(() => {

        if (!animacaoEstatisticas) {
            return;
        }

        const duracao = 1400;
        const inicio = performance.now();

      function animar(tempoAtual: number) {

        const progresso = Math.min(
            (tempoAtual - inicio) / duracao,
            1
        );

        const suavizado =
            1 - Math.pow(1 - progresso, 3);

        setNumeroImoveis(
            Math.floor(100 * suavizado)
        );

        setNumeroAtendimento(
            Math.floor(24 * suavizado)
        );

        setNumeroTransparencia(
            Math.floor(100 * suavizado)
        );

        if (progresso < 1) {

            requestAnimationFrame(animar);

        } else {

            setNumeroImoveis(100);
            setNumeroAtendimento(24);
            setNumeroTransparencia(100);

        }

}

        const animationFrame =
            requestAnimationFrame(animar);

        return () => {
            cancelAnimationFrame(animationFrame);
        };

    }, [animacaoEstatisticas]);


    /*
     * ============================================================
     * BUSCA
     * ============================================================
     */
        function buscarImoveis(e: React.FormEvent<HTMLFormElement>) {

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
     * ============================================================
     * LOGOUT
     * ============================================================
     */
    async function logout() {

        try {

            const resposta = await fetch(`${API_URL}/login/logout`,
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
            setMenuUsuarioAberto(false);

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
                                            <Image
                                                src="/images/logo.png"
                                                alt="Vitta Imobiliária"
                                                width={240}
                                                height={80}
                                                priority
                                                className="h-10 w-auto object-contain"
                                            />
                    
                                            <div className="leading-none text-left">
                    
                                                <span
                                                    className="
                                                        block
                                                        text-lg
                                                        font-semibold
                                                        tracking-[0.18em]
                                                        text-white
                                                    "
                                                >
                                                    VITTA
                                                </span>
                    
                                                <span
                                                    className="
                                                        mt-1
                                                        block
                                                        text-[8px]
                                                        font-medium
                                                        tracking-[0.28em]
                                                        text-[#B8B5AF]
                                                    "
                                                >
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


                        {/* =================================================
                            AJUDA
                        ================================================== */}

                        <div
                            ref={menuAjudaRef}
                            className="relative"
                        >

                            <button
                                type="button"
                                onClick={() => {

                                    setMenuAjudaAberto(
                                        !menuAjudaAberto
                                    );

                                    setMenuUsuarioAberto(false);

                                }}
                                className="flex items-center gap-1.5 text-sm font-medium text-white/80 transition hover:text-white"
                            >

                                Ajuda

                                <ChevronDown
                                    size={15}
                                    strokeWidth={1.8}
                                    className={`transition-transform duration-200 ${
                                        menuAjudaAberto
                                            ? "rotate-180"
                                            : ""
                                    }`}
                                />

                            </button>


                            {/* DROPDOWN */}

                            {menuAjudaAberto && (

                                <div
                                    className="
                                        absolute right-0 top-9 z-50
                                        w-48 overflow-hidden
                                        rounded-xl
                                        border border-[#E3E0D9]
                                        bg-white py-1.5
                                        shadow-[0_12px_30px_rgba(23,22,20,0.08)]
                                    "
                                >

                                    <button
                                        type="button"
                                        onClick={() => {

                                            setMenuAjudaAberto(false);

                                            router.push("/sobrenos");

                                        }}
                                        className="
                                            flex w-full
                                            px-4 py-2.5
                                            text-left text-sm
                                            text-[#77746E]
                                            transition
                                            hover:bg-[#F7F5F0]
                                            hover:text-[#292825]
                                        "
                                    >
                                        Sobre nós
                                    </button>


                                    <button
                                        type="button"
                                        onClick={() => {

                                            setMenuAjudaAberto(false);

                                            router.push("/atendimento");

                                        }}
                                        className="
                                            flex w-full
                                            px-4 py-2.5
                                            text-left text-sm
                                            text-[#77746E]
                                            transition
                                            hover:bg-[#F7F5F0]
                                            hover:text-[#292825]
                                        "
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

                                {/* =================================================
                                    BOTÃO DO USUÁRIO
                                ================================================== */}

                                <div
                                    ref={menuUsuarioRef}
                                    className="relative"
                                >

                                    <button
                                        type="button"
                                        onClick={() => {

                                            setMenuUsuarioAberto(
                                                !menuUsuarioAberto
                                            );

                                            setMenuAjudaAberto(false);

                                        }}
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                            whitespace-nowrap
                                            text-sm
                                            font-medium
                                            text-white/90
                                            transition
                                            hover:text-white
                                        "
                                        aria-expanded={
                                            menuUsuarioAberto
                                        }
                                    >

                                        Olá, {usuario.nome}

                                        <ChevronDown
                                            size={15}
                                            strokeWidth={1.8}
                                            className={`
                                                transition-transform
                                                duration-200
                                                ${
                                                    menuUsuarioAberto
                                                        ? "rotate-180"
                                                        : ""
                                                }
                                            `}
                                        />

                                    </button>


                                    {/* =================================================
                                        DROPDOWN DO USUÁRIO
                                    ================================================== */}

                                    {menuUsuarioAberto && (

                                        <div
                                            className="
                                                absolute right-0 top-9 z-50
                                                w-48
                                                overflow-hidden
                                                rounded-xl
                                                border border-[#E3E0D9]
                                                bg-white
                                                py-1.5
                                                shadow-[0_12px_30px_rgba(23,22,20,0.08)]
                                            "
                                        >

                                            {/* MINHAS LOCAÇÕES */}

                                            <button
                                                type="button"
                                                onClick={() => {

                                                    setMenuUsuarioAberto(
                                                        false
                                                    );

                                                    router.push(
                                                        "/locacoes"
                                                    );

                                                }}
                                                className="
                                                    flex w-full
                                                    px-4 py-2.5
                                                    text-left text-sm
                                                    text-[#77746E]
                                                    transition
                                                    hover:bg-[#F7F5F0]
                                                    hover:text-[#292825]
                                                "
                                            >
                                                Minhas locações
                                            </button>


                                            {/* DIVISOR */}

                                            <div className="my-1 border-t border-[#F0EEE9]" />


                                            {/* SAIR */}

                                            <button
                                                type="button"
                                                onClick={logout}
                                                className="
                                                    flex w-full
                                                    px-4 py-2.5
                                                    text-left text-sm
                                                    text-[#77746E]
                                                    transition
                                                    hover:bg-[#F7F5F0]
                                                    hover:text-[#292825]
                                                "
                                            >
                                                Sair
                                            </button>

                                        </div>

                                    )}

                                </div>


                                {/* =================================================
                                    ADMIN
                                ================================================== */}

                                {usuario.perfil === 1 && (

                                    <button
                                        type="button"
                                        onClick={() =>
                                            router.push("/admin")
                                        }
                                        title="Painel administrativo"
                                        aria-label="Abrir painel administrativo"
                                        className="
                                            flex h-10 w-10
                                            cursor-pointer
                                            items-center justify-center
                                            text-white
                                            transition
                                            hover:opacity-70
                                        "
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

                            <h1 className="mt-5 min-h-[130px] max-w-[650px] text-5xl font-medium leading-[1.02] tracking-[-0.045em] text-white xl:min-h-[135px] xl:text-[64px]">
                                {textoTitulo}

                                <span className="ml-1 inline-block h-[0.85em] w-px animate-pulse bg-white/70 align-middle" />

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
                                className="w-full max-w-md bg-white/95 p-7 shadow-2xl sm:p-8"
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
                                            ? `${API_URL}${imovel.imagem.caminho}`
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
                ESTATÍSTICAS
            ====================================================== */}

            <section
                id="estatisticas-vitta"
                className="border-y border-[#E3E0D9] bg-white py-24"
            >

                <div className="mx-auto max-w-7xl px-6 lg:px-8">

                    <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:items-center">


                        {/* =================================================
                            TEXTO
                        ================================================== */}

                        <div
                            className={`max-w-xl transition-all duration-1000 ${
                                animacaoEstatisticas
                                    ? "translate-y-0 opacity-100"
                                    : "translate-y-8 opacity-0"
                            }`}
                        >

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

                                <span>
                                    →
                                </span>

                            </button>

                        </div>


                        {/* =================================================
                            ESTATÍSTICAS
                        ================================================== */}

                        <div
                            className={`grid grid-cols-2 border-t border-[#E3E0D9] transition-all duration-1000 delay-200 sm:grid-cols-3 lg:border-l lg:border-t-0 ${
                                animacaoEstatisticas
                                    ? "translate-y-0 opacity-100"
                                    : "translate-y-8 opacity-0"
                            }`}
                        >

                            <div className="border-b border-r border-[#E3E0D9] px-6 py-8 lg:border-b-0">

                                <p className="text-3xl font-medium tabular-nums text-[#292825]">
                                    {numeroImoveis}+
                                </p>

                                <p className="mt-2 text-xs uppercase tracking-wide text-[#8A8883]">
                                    Imóveis
                                </p>

                            </div>


                            <div className="border-b border-[#E3E0D9] px-6 py-8 lg:border-b-0">

                                <p className="text-3xl font-medium tabular-nums text-[#292825]">
                                    {numeroAtendimento}h
                                </p>

                                <p className="mt-2 text-xs uppercase tracking-wide text-[#8A8883]">
                                    Atendimento
                                </p>

                            </div>


                            <div className="col-span-2 px-6 py-8 sm:col-span-1">

                                <p className="text-3xl font-medium tabular-nums text-[#292825]">
                                    {numeroTransparencia}%
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
                        onClick={() => router.push("/imoveis")}
                        className="group shrink-0 cursor-pointer bg-white px-7 py-3.5 text-sm font-semibold text-[#292825] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#F1F0ED] hover:text-[#171614]"
                    >

                        <span className="inline-flex items-center gap-2">

                            Explorar imóveis

                            <span className="transition-transform duration-300 group-hover:translate-x-1">
                                →
                            </span>

                        </span>

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
