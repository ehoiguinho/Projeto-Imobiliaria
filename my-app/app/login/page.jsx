"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  LockKeyhole,
  Building2,
  ArrowLeft,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function fazerLogin(event) {
    event.preventDefault();

    setCarregando(true);
    setErro("");

    try {
      const resposta = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: email,
          senha: senha,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.msg || "Erro ao fazer login");
      }

      router.push("/imoveis");
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-80px)] bg-slate-50 px-4 py-12">
      <div className="mx-auto flex min-h-[calc(100vh-176px)] max-w-md items-center justify-center">
        <section className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">

          {/* Cabeçalho */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Building2 size={27} strokeWidth={1.8} />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Bem-vindo de volta
            </h1>

          </div>

          {/* Formulário */}
          <form onSubmit={fazerLogin} className="space-y-5">

            {/* E-mail */}
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
                  strokeWidth={1.8}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="seuemail@exemplo.com"
                  autoComplete="email"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-50"
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="senha"
                  className="block text-sm font-medium text-slate-700"
                >
                  Senha
                </label>

                <button
                  type="button"
                  onClick={() => router.push("/esqueci-senha")}
                  className="text-sm font-medium text-blue-600 transition hover:text-blue-700"
                >
                  Esqueci minha senha
                </button>
              </div>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  strokeWidth={1.8}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="senha"
                  type="password"
                  value={senha}
                  onChange={(event) => setSenha(event.target.value)}
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-50"
                />
              </div>
            </div>

            {/* Erro */}
            {erro && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm leading-5 text-red-700">
                  {erro}
                </p>
              </div>
            )}

            {/* Botão */}
            <button
              type="submit"
              disabled={carregando}
              className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {carregando ? "Entrando..." : "Entrar"}
            </button>
          </form>

          {/* Cadastro */}
          <div className="mt-7 border-t border-slate-100 pt-6 text-center">
            <p className="text-sm text-slate-500">
              Ainda não possui uma conta?
            </p>

            <button
              type="button"
              onClick={() => router.push("/cadastro")}
              className="mt-1 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
            >
              Criar conta
            </button>
          </div>

          {/* Voltar */}
          <button
            type="button"
            onClick={() => router.push("/")}
            className="mx-auto mt-6 flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Voltar para o início
          </button>
        </section>
      </div>
    </main>
  );
}
