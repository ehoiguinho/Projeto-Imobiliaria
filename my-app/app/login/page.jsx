"use client"

import {useState} from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {

    const router = useRouter();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function fazerLogin(event){
        evenet.preventDefault();

        setCarregando(true);
        setErro("");

         try {
      const resposta = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          email: email,
          senha: senha
        })
      });

    const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.msg || "Erro ao fazer login");
      }

      router.push("/");
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
    
}

   return (
  <main className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
    <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-slate-200">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Login</h1>
        <p className="mt-2 text-sm text-slate-500">
          Acesse sua conta para gerenciar os imóveis.
        </p>
      </div>

      <form onSubmit={fazerLogin} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            E-mail
          </label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Senha
          </label>
          <input
            type="password"
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        {erro && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {erro}
          </p>
        )}

        <button
          type="submit"
          disabled={carregando}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {carregando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </section>
  </main>
);
}