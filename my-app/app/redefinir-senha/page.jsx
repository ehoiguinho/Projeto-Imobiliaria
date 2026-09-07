"use client";

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

            const resposta = await fetch(
                "http://localhost:3000/login/redefinir-senha",
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

            /*
             * Depois de alterar a senha,
             * encaminha o usuário para o login.
             */
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
        <main className="min-h-screen bg-slate-100 px-4">

            <div className="flex min-h-screen items-center justify-center">

                <section className="w-full max-w-md">

                    {/* CARD */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">

                        {/* CABEÇALHO */}

                        <div className="mb-8">

                            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 text-white">

                                <LockKeyhole size={24} />

                            </div>

                            <h1 className="text-3xl font-bold text-slate-900">
                                Redefinir senha
                            </h1>

                            <p className="mt-2 text-sm leading-relaxed text-slate-500">
                                Crie uma nova senha para acessar
                                sua conta.
                            </p>

                        </div>

                        {/* FORMULÁRIO */}

                        <form
                            onSubmit={redefinirSenha}
                            className="space-y-5"
                        >

                            {/* NOVA SENHA */}

                            <div>

                                <label
                                    htmlFor="senha"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Nova senha
                                </label>

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
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                                />

                                <p className="mt-2 text-xs text-slate-400">
                                    A senha deve possuir pelo menos 6 caracteres.
                                </p>

                            </div>

                            {/* CONFIRMAR SENHA */}

                            <div>

                                <label
                                    htmlFor="confirmarSenha"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Confirmar nova senha
                                </label>

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
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                                />

                            </div>

                            {/* ERRO */}

                            {erro && (

                                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {erro}
                                </div>

                            )}

                            {/* SUCESSO */}

                            {mensagem && (

                                <div className="flex gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">

                                    <CheckCircle
                                        size={18}
                                        className="mt-0.5 shrink-0"
                                    />

                                    <div>
                                        <p>
                                            {mensagem}
                                        </p>

                                        <p className="mt-1 text-xs text-green-600">
                                            Redirecionando para o login...
                                        </p>
                                    </div>

                                </div>

                            )}

                            {/* BOTÃO */}

                            <button
                                type="submit"
                                disabled={carregando}
                                className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {carregando
                                    ? "Alterando senha..."
                                    : "Alterar senha"}
                            </button>

                        </form>

                        {/* VOLTAR */}

                        {!mensagem && (

                            <button
                                type="button"
                                onClick={() => router.push("/login")}
                                className="mt-6 flex w-full items-center justify-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
                            >

                                <ArrowLeft size={16} />

                                Voltar para o login

                            </button>

                        )}

                    </div>

                </section>

            </div>

        </main>
    );
}