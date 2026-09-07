"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, User, Mail, Lock, ArrowLeft, UserPlus } from "lucide-react";

export default function CadastroPage() {

    const router = useRouter();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function cadastrar(e) {
        e.preventDefault();

        setErro("");
        setSucesso("");

        if (!nome.trim() || !email.trim() || !senha || !confirmarSenha) {
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

        try {

            setCarregando(true);

            const resposta = await fetch(
                "http://localhost:3000/usuario/cadastro",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        nome: nome.trim(),
                        email: email.trim(),
                        senha,
                    }),
                }
            );

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(
                    dados.msg || "Não foi possível criar sua conta."
                );
            }

            setSucesso("Conta criada com sucesso! Redirecionando...");

            setTimeout(() => {
                router.push("/login");
            }, 1500);

        } catch (ex) {

            setErro(ex.message);

        } finally {

            setCarregando(false);

        }
    }

    return (
        <main className="min-h-screen bg-zinc-50">

            {/* Navbar */}

                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

                    <Link
                        href="/login"
                        className="flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-zinc-900"
                    >
                        <ArrowLeft size={17} />
                        Voltar para login
                    </Link>

                </div>
          

            {/* Cadastro */}

            <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-12">

                <div className="w-full max-w-md">

                    <div className="mb-8 text-center">

                        <h1 className="text-2xl font-bold text-zinc-900">
                            Crie sua conta
                        </h1>

                        <p className="mt-2 text-sm text-zinc-500">
                            Cadastre-se para encontrar seu próximo imóvel.
                        </p>

                    </div>

                    <div className="rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm">

                        <form
                            onSubmit={cadastrar}
                            className="space-y-5"
                        >

                            {/* Nome */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-zinc-700">
                                    Nome
                                </label>

                                <div className="relative">

                                    <User
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                                    />

                                    <input
                                        type="text"
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                        placeholder="Digite seu nome"
                                        className="w-full rounded-lg border border-zinc-300 bg-white py-2.5 pl-10 pr-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />

                                </div>

                            </div>

                            {/* E-mail */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-zinc-700">
                                    E-mail
                                </label>

                                <div className="relative">

                                    <Mail
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                                    />

                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Digite seu e-mail"
                                        className="w-full rounded-lg border border-zinc-300 bg-white py-2.5 pl-10 pr-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />

                                </div>

                            </div>

                            {/* Senha */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-zinc-700">
                                    Senha
                                </label>

                                <div className="relative">

                                    <Lock
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                                    />

                                    <input
                                        type="password"
                                        value={senha}
                                        onChange={(e) => setSenha(e.target.value)}
                                        placeholder="Digite sua senha"
                                        className="w-full rounded-lg border border-zinc-300 bg-white py-2.5 pl-10 pr-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />

                                </div>

                            </div>

                            {/* Confirmar senha */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-zinc-700">
                                    Confirmar senha
                                </label>

                                <div className="relative">

                                    <Lock
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                                    />

                                    <input
                                        type="password"
                                        value={confirmarSenha}
                                        onChange={(e) => setConfirmarSenha(e.target.value)}
                                        placeholder="Digite a senha novamente"
                                        className="w-full rounded-lg border border-zinc-300 bg-white py-2.5 pl-10 pr-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />

                                </div>

                            </div>

                            {/* Erro */}

                            {erro && (
                                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {erro}
                                </div>
                            )}

                            {/* Sucesso */}

                            {sucesso && (
                                <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                                    {sucesso}
                                </div>
                            )}

                            {/* Botão */}

                            <button
                                type="submit"
                                disabled={carregando}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {carregando ? (
                                    "Criando conta..."
                                ) : (
                                    <>
                                        <UserPlus size={18} />
                                        Cadastrar
                                    </>
                                )}
                            </button>

                        </form>

                        <div className="mt-6 border-t border-zinc-100 pt-6 text-center">

                            <p className="text-sm text-zinc-500">
                                Já possui uma conta?
                            </p>

                            <Link
                                href="/login"
                                className="mt-1 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700"
                            >
                                Entrar na minha conta
                            </Link>

                        </div>

                    </div>

                </div>

            </section>

        </main>
    );
}