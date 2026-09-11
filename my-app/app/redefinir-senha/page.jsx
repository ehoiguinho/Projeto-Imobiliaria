"use client";

import { API_URL } from "@/lib/api";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    LockKeyhole,
    ArrowLeft,
    CheckCircle
} from "lucide-react";

export default function RedefinirSenhaPage() {

    const router = useRouter();
    const searchParams = useSearchParams();

    const token = searchParams.get("token");

    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const [erro, setErro] = useState("");
    const [mensagem, setMensagem] = useState("");

    const [carregando, setCarregando] = useState(false);

    async function redefinirSenha(event) {

        event.preventDefault();

        setErro("");
        setMensagem("");

        if (!token) {
            setErro(
                "Token de recuperação não encontrado ou inválido."
            );
            return;
        }

        if (senha.length < 6) {
            setErro(
                "A senha deve possuir pelo menos 6 caracteres."
            );
            return;
        }

        if (senha !== confirmarSenha) {
            setErro(
                "As senhas não coincidem."
            );
            return;
        }

        setCarregando(true);

        try {

            const resposta = await fetch(`${API_URL}/login/redefinir-senha`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        token,
                        senha
                    })
                }
            );

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(
                    dados.msg ||
                    "Não foi possível alterar sua senha."
                );
            }

            setMensagem(
                dados.msg || "Senha alterada com sucesso!"
            );

            setSenha("");
            setConfirmarSenha("");

            setTimeout(() => {
                router.push("/login");
            }, 2000);

        } catch (error) {

            setErro(error.message);

        } finally {

            setCarregando(false);

        }
    }

    return (

        <main className="relative min-h-screen overflow-hidden text-[#292825]">

            {/* =====================================================
                BACKGROUND
            ====================================================== */}

            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: "url('/images/login.jpg')"
                }}
            />

            <div className="absolute inset-0 bg-[#171614]/70" />


            {/* =====================================================
                CONTEÚDO
            ====================================================== */}

            <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">

                <section className="w-full max-w-xl">

                    {/* =================================================
                        LOGO
                    ================================================== */}

                    <div className="mb-8 text-center">

                        <button
                            type="button"
                            onClick={() => router.push("/")}
                            className="cursor-pointer text-left transition-opacity duration-300 hover:opacity-70"
                        >

                            <span className="block text-2xl font-semibold tracking-[0.18em] text-white">
                                VITTA
                            </span>

                            <span className="mt-0.5 block text-[8px] font-semibold tracking-[0.35em] text-white/70">
                                IMOBILIÁRIA
                            </span>

                        </button>

                    </div>


                    {/* =================================================
                        CARD
                    ================================================== */}

                    <div className="border border-white/20 bg-white/95 p-8 shadow-2xl backdrop-blur-xl sm:p-10">


                        {/* =================================================
                            CABEÇALHO
                        ================================================== */}

                        <div className="mb-8">

                            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-[#E3E0D9] bg-white text-[#55534E]">

                                <LockKeyhole
                                    size={21}
                                    strokeWidth={1.5}
                                />

                            </div>


                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8A8883]">
                                Segurança da conta
                            </p>


                            <h1 className="mt-3 text-3xl font-medium tracking-[-0.035em] text-[#292825] sm:text-4xl">
                                Redefinir senha
                            </h1>


                            <p className="mt-3 max-w-md text-sm leading-6 text-[#77746E]">
                                Crie uma nova senha para continuar
                                acessando sua conta.
                            </p>

                        </div>


                        {/* =================================================
                            FORMULÁRIO
                        ================================================== */}

                        <form
                            onSubmit={redefinirSenha}
                            className="space-y-6"
                        >

                            {/* =================================================
                                NOVA SENHA
                            ================================================== */}

                            <div>

                                <label
                                    htmlFor="senha"
                                    className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#77746E]"
                                >
                                    Nova senha
                                </label>


                                <div className="relative">

                                    <LockKeyhole
                                        size={17}
                                        strokeWidth={1.5}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A19E98]"
                                    />


                                    <input
                                        id="senha"
                                        type="password"
                                        value={senha}
                                        onChange={(event) =>
                                            setSenha(event.target.value)
                                        }
                                        placeholder="Digite sua nova senha"
                                        required
                                        minLength={6}
                                        disabled={carregando || !!mensagem}
                                        className="w-full border border-[#DAD7D0] bg-white py-3.5 pl-11 pr-4 text-sm text-[#292825] outline-none transition placeholder:text-[#A19E98] focus:border-[#8A8883] disabled:cursor-not-allowed disabled:bg-[#F1F0ED]"
                                    />

                                </div>


                                <p className="mt-2 text-xs text-[#A19E98]">
                                    A senha deve possuir pelo menos 6 caracteres.
                                </p>

                            </div>


                            {/* =================================================
                                CONFIRMAR SENHA
                            ================================================== */}

                            <div>

                                <label
                                    htmlFor="confirmarSenha"
                                    className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#77746E]"
                                >
                                    Confirmar nova senha
                                </label>


                                <div className="relative">

                                    <LockKeyhole
                                        size={17}
                                        strokeWidth={1.5}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A19E98]"
                                    />


                                    <input
                                        id="confirmarSenha"
                                        type="password"
                                        value={confirmarSenha}
                                        onChange={(event) =>
                                            setConfirmarSenha(event.target.value)
                                        }
                                        placeholder="Digite novamente sua senha"
                                        required
                                        minLength={6}
                                        disabled={carregando || !!mensagem}
                                        className="w-full border border-[#DAD7D0] bg-white py-3.5 pl-11 pr-4 text-sm text-[#292825] outline-none transition placeholder:text-[#A19E98] focus:border-[#8A8883] disabled:cursor-not-allowed disabled:bg-[#F1F0ED]"
                                    />

                                </div>

                            </div>


                            {/* =================================================
                                ERRO
                            ================================================== */}

                            {erro && (

                                <div className="border border-[#D6D2CA] bg-white px-4 py-4">

                                    <p className="text-sm leading-6 text-[#55534E]">
                                        <span className="font-semibold">
                                            Erro:
                                        </span>{" "}
                                        {erro}
                                    </p>

                                </div>

                            )}


                            {/* =================================================
                                SUCESSO
                            ================================================== */}

                            {mensagem && (

                                <div className="flex gap-3 border border-[#D5D1C9] bg-white px-4 py-4">

                                    <CheckCircle
                                        size={19}
                                        strokeWidth={1.5}
                                        className="mt-0.5 shrink-0 text-[#55534E]"
                                    />

                                    <div>

                                        <p className="text-sm leading-6 text-[#55534E]">
                                            {mensagem}
                                        </p>

                                        <p className="mt-1 text-xs text-[#8A8883]">
                                            Redirecionando para o login...
                                        </p>

                                    </div>

                                </div>

                            )}


                            {/* =================================================
                                BOTÃO
                            ================================================== */}

                            <button
                                type="submit"
                                disabled={carregando || !!mensagem}
                                className="group flex w-full cursor-pointer items-center justify-center gap-2 bg-[#292825] px-5 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#171614] disabled:cursor-not-allowed disabled:opacity-60"
                            >

                                {carregando
                                    ? "Alterando senha..."
                                    : "Alterar senha"
                                }

                                {!carregando && !mensagem && (

                                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                                        →
                                    </span>

                                )}

                            </button>

                        </form>


                        {/* =================================================
                            VOLTAR
                        ================================================== */}

                        {!mensagem && (

                            <div className="mt-8 border-t border-[#E3E0D9] pt-6">

                                <button
                                    type="button"
                                    onClick={() => router.push("/login")}
                                    className="group mx-auto flex cursor-pointer items-center gap-2 text-sm font-medium text-[#8A8883] transition-colors duration-300 hover:text-[#292825]"
                                >

                                    <ArrowLeft
                                        size={16}
                                        strokeWidth={1.7}
                                        className="transition-transform duration-300 group-hover:-translate-x-1"
                                    />

                                    Voltar para o login

                                </button>

                            </div>

                        )}

                    </div>


                    {/* =================================================
                        COPYRIGHT
                    ================================================== */}

                    <p className="mt-6 text-center text-[10px] tracking-wide text-white/50">
                        © 2026 Vitta Imobiliária. Todos os direitos reservados.
                    </p>

                </section>

            </div>

        </main>
    );
}
