"use client";

import { API_URL } from "@/lib/api";
import { useEffect ,useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function CadastroPage() {
    const router = useRouter();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [textoTitulo, setTextoTitulo] = useState("");
    const [textoDescricao, setTextoDescricao] = useState("");

    async function cadastrar(e) {
        e.preventDefault();

        setErro("");

        if (!nome || !email || !senha || !confirmarSenha) {
            setErro("Preencha todos os campos.");
            return;
        }

        if (senha !== confirmarSenha) {
            setErro("As senhas não coincidem.");
            return;
        }

        if (senha.length < 6) {
            setErro("A senha deve possuir pelo menos 6 caracteres.");
            return;
        }

        setCarregando(true);

        const loadingToast = toast.loading("Criando sua conta...");

        try {
            const resposta = await fetch(`${API_URL}/usuario/cadastro`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        nome,
                        email,
                        senha,
                    }),
                }
            );

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(
                    dados.mensagem || "Não foi possível criar sua conta."
                );
            }

            toast.success("Conta criada com sucesso!", {
                id: loadingToast,
            });

            setTimeout(() => {
                router.push("/login");
            }, 1500);
        } catch (error) {
            toast.error(
                error.message || "Erro ao criar a conta.",
                {
                    id: loadingToast,
                }
            );

            setErro(
                error.message || "Não foi possível criar sua conta."
            );
        } finally {
            setCarregando(false);
        }

    }

    const tituloCompleto = "Seu próximo lugar começa aqui.";
    const descricaoCompleta = "Cadastre-se para encontrar imóveis, acompanhar suas locações e ter acesso aos serviços da Vitta.";

    useEffect(() => {
    let tituloIndex = 0;
    let descricaoIndex = 0;
    let descricaoIniciada = false;

    const intervalo = setInterval(() => {
        if (tituloIndex < tituloCompleto.length) {
            setTextoTitulo(
                tituloCompleto.slice(0, tituloIndex + 1)
            );

            tituloIndex++;
            return;
        }

        if (!descricaoIniciada) {
            descricaoIniciada = true;
        }

        if (descricaoIndex < descricaoCompleta.length) {
            setTextoDescricao(
                descricaoCompleta.slice(0, descricaoIndex + 1)
            );

            descricaoIndex++;
            return;
        }

        clearInterval(intervalo);
    }, 45);

    return () => clearInterval(intervalo);

}, []);

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#171614]">

            {/* Imagem de fundo */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: "url('/images/login.jpg')",
                }}
            />

            {/* Overlay principal */}
            <div className="absolute inset-0 bg-[#171614]/35" />

            {/* Gradiente para dar profundidade à composição */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "linear-gradient(90deg, rgba(23,22,20,0.62) 0%, rgba(23,22,20,0.25) 45%, rgba(23,22,20,0.38) 100%)",
                }}
            />

            {/* Conteúdo */}
            <div className="relative z-10 flex min-h-screen flex-col">

                {/* Logo */}
                <header className="px-8 py-7 sm:px-12 sm:py-9">
                    <button
                        type="button"
                        onClick={() => router.push("/")}
                        className="cursor-pointer text-left transition-opacity hover:opacity-70"
                    >
                        <div className="text-[25px] font-semibold tracking-[0.18em] text-white">
                            VITTA
                        </div>

                        <div className="mt-0.5 text-[8px] font-medium tracking-[0.42em] text-white/65">
                            IMOBILIÁRIA
                        </div>
                    </button>
                </header>

                {/* Conteúdo principal */}
                <div className="flex flex-1 items-center px-6 py-8 sm:px-10 lg:px-16 xl:px-24">

                    <div className="flex w-full items-center justify-between gap-12">

                        {/* Texto institucional */}
                        <div className="hidden max-w-[550px] -translate-y-48 text-white lg:block">

                            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/60">
                                Comece sua jornada
                            </p>

                            <h1 className="mt-5 min-h-[130px] max-w-[500px] text-5xl font-medium leading-[1.02] tracking-[-0.045em] text-white xl:min-h-[135px] xl:text-[64px]">
                                {textoTitulo}
                                <span className="ml-1 inline-block h-[0.85em] w-px animate-pulse bg-white/70 align-middle" />
                            </h1>

                            <p className="mt-7 min-h-[84px] max-w-[460px] text-sm leading-7 text-white/65">
                                {textoDescricao}
                            </p>
                            
                        </div>

                        {/* Formulário */}
                        <section className="w-full max-w-[500px] -translate-y-10 border border-white/30 bg-white p-8 shadow-2xl backdrop-blur-xl sm:p-10 lg:mr-[3vw]">

                            {/* Identificação */}
                            <div className="mb-8">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#77746E]">
                                    Nova conta
                                </p>

                                <h2 className="mt-3 text-4xl font-medium leading-[1.05] tracking-[-0.04em] text-[#292825] sm:text-[48px]">
                                    Crie sua conta.
                                </h2>
                                
                            </div>

                            <form
                                onSubmit={cadastrar}
                                className="space-y-5"
                            >

                                {/* Nome */}
                                <div>
                                    <label
                                        htmlFor="nome"
                                        className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#77746E]"
                                    >
                                        Nome
                                    </label>

                                    <input
                                        id="nome"
                                        type="text"
                                        value={nome}
                                        onChange={(e) =>
                                            setNome(e.target.value)
                                        }
                                        placeholder="Seu nome completo"
                                        className="w-full border-b border-[#CFCBC3] bg-transparent px-0 py-3 text-sm text-[#292825] outline-none transition-colors placeholder:text-[#A19E98] focus:border-[#292825]"
                                    />
                                </div>

                                {/* E-mail */}
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#77746E]"
                                    >
                                        E-mail
                                    </label>

                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        placeholder="seu@email.com"
                                        className="w-full border-b border-[#CFCBC3] bg-transparent px-0 py-3 text-sm text-[#292825] outline-none transition-colors placeholder:text-[#A19E98] focus:border-[#292825]"
                                    />
                                </div>

                                {/* Senha */}
                                <div>
                                    <label
                                        htmlFor="senha"
                                        className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#77746E]"
                                    >
                                        Senha
                                    </label>

                                    <input
                                        id="senha"
                                        type="password"
                                        value={senha}
                                        onChange={(e) =>
                                            setSenha(e.target.value)
                                        }
                                        placeholder="Mínimo de 6 caracteres"
                                        className="w-full border-b border-[#CFCBC3] bg-transparent px-0 py-3 text-sm text-[#292825] outline-none transition-colors placeholder:text-[#A19E98] focus:border-[#292825]"
                                    />
                                </div>

                                {/* Confirmar senha */}
                                <div>
                                    <label
                                        htmlFor="confirmarSenha"
                                        className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#77746E]"
                                    >
                                        Confirmar senha
                                    </label>

                                    <input
                                        id="confirmarSenha"
                                        type="password"
                                        value={confirmarSenha}
                                        onChange={(e) =>
                                            setConfirmarSenha(e.target.value)
                                        }
                                        placeholder="Digite a senha novamente"
                                        className="w-full border-b border-[#CFCBC3] bg-transparent px-0 py-3 text-sm text-[#292825] outline-none transition-colors placeholder:text-[#A19E98] focus:border-[#292825]"
                                    />
                                </div>

                                {/* Erro */}
                                {erro && (
                                    <div className="border border-[#D5D1C9] bg-[#F1F0ED]/80 px-4 py-3 text-xs leading-5 text-[#55534E]">
                                        {erro}
                                    </div>
                                )}

                                {/* Segurança */}
                                <div className="flex items-start gap-3 pt-1">
                                    <ShieldCheck
                                        size={18}
                                        strokeWidth={1.5}
                                        className="mt-0.5 shrink-0 text-[#77746E]"
                                    />

                                    <p className="text-[11px] leading-5 text-[#8A8883]">
                                        Seus dados são protegidos e utilizados
                                        exclusivamente para os serviços da Vitta.
                                    </p>
                                </div>

                                {/* Botão */}
                                <button
                                    type="submit"
                                    disabled={carregando}
                                    className="group flex w-full cursor-pointer items-center justify-between bg-[#292825] px-6 py-4 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#171614] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <span>
                                        {carregando
                                            ? "Criando conta..."
                                            : "Criar minha conta"}
                                    </span>

                                    {!carregando && (
                                        <span className="transition-transform duration-300 group-hover:translate-x-1">
                                            →
                                        </span>
                                    )}
                                </button>
                            </form>

                            {/* Login */}
                            <div className="mt-7 flex items-center justify-between border-t border-[#DAD7D0] pt-6">
                                <p className="text-xs text-[#8A8883]">
                                    Já possui uma conta?
                                </p>

                                <button
                                    type="button"
                                    onClick={() => router.push("/login")}
                                    className="cursor-pointer text-xs font-semibold text-[#292825] transition-opacity hover:opacity-60"
                                >
                                    Entrar
                                </button>
                            </div>

                            {/* Voltar */}
                            <button
                                type="button"
                                onClick={() => router.push("/")}
                                className="mt-6 flex cursor-pointer items-center gap-2 text-xs text-[#8A8883] transition-colors hover:text-[#292825]"
                            >
                                <ArrowLeft
                                    size={14}
                                    strokeWidth={1.7}
                                />
                                Voltar para o início
                            </button>
                        </section>
                    </div>
                </div>

                {/* Rodapé */}
                <footer className="flex items-center justify-between border-t border-white/10 px-8 py-5 sm:px-12">

                    <p className="text-[9px] text-white/40">
                        © 2026 Vitta Imobiliária
                    </p>

                </footer>
            </div>
        </main>
    );
}
