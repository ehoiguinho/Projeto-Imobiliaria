"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

export default function EsqueciSenhaPage() {

    const router = useRouter();

    const [email, setEmail] = useState("");
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function solicitarRecuperacao(event) {

        event.preventDefault();

        setErro("");
        setSucesso("");
        setCarregando(true);

        try {

            const resposta = await fetch(
                "http://localhost:3000/login/esqueci-senha",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        email
                    })
                }
            );

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(
                    dados.msg || "Não foi possível solicitar a recuperação da senha."
                );
            }

            setSucesso(
                "Se o e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha."
            );

            setEmail("");

        } catch (error) {

            console.error(
                "Erro ao solicitar recuperação de senha:",
                error
            );

            setErro(error.message);

        } finally {

            setCarregando(false);

        }
    }

    return (

        <main className="min-h-screen bg-slate-50 px-4 py-10">

            <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center justify-center">

                <section className="w-full">

                    {/* LOGO / IDENTIDADE */}

                    <div className="mb-8 text-center">

                        <button
                            type="button"
                            onClick={() => router.push("/")}
                            className="mx-auto mb-6 flex items-center gap-2"
                        >

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-white">

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="h-6 w-6"
                                >

                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m3 10 9-7 9 7"
                                    />

                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 9.5V21h14V9.5"
                                    />

                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 21v-6h6v6"
                                    />

                                </svg>

                            </div>

                            <span className="text-xl font-semibold tracking-tight text-zinc-900">
                                Sua Imobiliária
                            </span>

                        </button>

                    </div>


                    {/* CARD */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">

                        {/* CABEÇALHO */}

                        <div className="mb-7">

                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">

                                <Mail
                                    size={24}
                                    className="text-blue-600"
                                />

                            </div>

                            <h1 className="text-2xl font-bold text-slate-900">
                                Esqueceu sua senha?
                            </h1>

                            <p className="mt-2 text-sm leading-relaxed text-slate-500">
                                Informe o e-mail cadastrado na sua conta e
                                enviaremos as instruções para redefinir sua senha.
                            </p>

                        </div>


                        {/* SUCESSO */}

                        {sucesso && (

                            <div className="mb-5 flex gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3">

                                <CheckCircle
                                    size={20}
                                    className="mt-0.5 shrink-0 text-green-600"
                                />

                                <p className="text-sm leading-relaxed text-green-700">
                                    {sucesso}
                                </p>

                            </div>

                        )}


                        {/* ERRO */}

                        {erro && (

                            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">

                                <p className="text-sm text-red-700">
                                    {erro}
                                </p>

                            </div>

                        )}


                        {/* FORMULÁRIO */}

                        <form
                            onSubmit={solicitarRecuperacao}
                            className="space-y-5"
                        >

                            <div>

                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    E-mail
                                </label>

                                <div className="relative">

                                    <Mail
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(event.target.value)
                                        }
                                        placeholder="seu@email.com"
                                        required
                                        disabled={carregando}
                                        className="w-full rounded-lg border border-slate-300 py-3 pl-11 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                                    />

                                </div>

                            </div>


                            <button
                                type="submit"
                                disabled={carregando}
                                className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-70"
                            >

                                {carregando
                                    ? "Enviando..."
                                    : "Enviar instruções"
                                }

                            </button>

                        </form>


                        {/* VOLTAR */}

                        <div className="mt-6 border-t border-slate-100 pt-6">

                            <button
                                type="button"
                                onClick={() => router.push("/login")}
                                className="mx-auto flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600"
                            >

                                <ArrowLeft size={16} />

                                Voltar para o login

                            </button>

                        </div>

                    </div>

                </section>

            </div>

        </main>
    );
}