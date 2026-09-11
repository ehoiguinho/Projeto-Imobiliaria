"use client";

import { API_URL } from "@/lib/api";
import toast from "react-hot-toast";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, LockKeyhole, ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";

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

    const toastId = toast.loading("Entrando...");

    try {
      const resposta = await fetch(`${API_URL}/login`, {
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

      toast.success("Login realizado com sucesso!", {
        id: toastId,
      });

      router.push("/imoveis");
    } catch (error) {
      setErro(error.message);

      toast.error(error.message, {
        id: toastId,
      });
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="min-h-screen bg-white/95 text-[#292825]">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">

        {/* =========================================================
            LADO INSTITUCIONAL
        ========================================================= */}
        <section className="relative hidden overflow-hidden bg-[#292825] lg:flex">

          {/* Imagem */}
          <div
            className="absolute inset-0 bg-cover bg-[center_80%]"
            style={{
              backgroundImage: "url('/images/login.jpg')",
            }}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-[#171614]/75" />

          {/* Conteúdo */}
          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">

            {/* Logo */}
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

            {/* Mensagem */}
            <div className="max-w-xl -translate-y-28">

              <span className="mb-6 block text-[10px] font-semibold uppercase tracking-[0.3em] text-[#CFCBC3]">
                Seu próximo endereço
              </span>

              <h1 className="t-5 min-h-[130px] max-w-[500px] text-5xl font-medium leading-[1.02] tracking-[-0.045em] text-white xl:min-h-[135px] xl:text-[64px]">
                Encontre um lugar
                <br />
                para chamar de seu.
              </h1>

              <p className="mt-6 max-w-md text-sm leading-7 text-[#D5D1C9]">
                A Vitta conecta você aos imóveis certos para o seu momento,
                com segurança, transparência e uma experiência simples.
              </p>

              <div className="mt-8 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.16em] text-[#CFCBC3]">
                <span className="h-px w-8 bg-[#77746E]" />
                Vitta Imobiliária
              </div>
            </div>

            {/* Rodapé */}
            <div className="flex translate-y-5 items-center justify-between border-t border-white/10 pt-6">
              <p className="text-[11px] text-[#A19E98]">
                © 2026 Vitta Imobiliária
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================
            LADO DO LOGIN
        ========================================================= */}
        <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10 lg:px-16">

          <div className="w-full max-w-x1 p-25 border border-[#292825]/15 bg-white/95 p-5 backdrop-blur-sm">


            {/* Logo mobile */}
            <div className="mb-14 lg:hidden">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="cursor-pointer text-left transition-opacity hover:opacity-70"
              >
                <div className="text-2xl font-semibold tracking-[0.18em] text-[#292825]">
                  VITTA
                </div>

                <div className="mt-1 text-[8px] font-medium tracking-[0.4em] text-[#8A8883]">
                  IMOBILIÁRIA
                </div>
              </button>
            </div>

            {/* Cabeçalho */}
            <div className="mb-10">

              <h2 className="text-4xl font-medium leading-tight tracking-[-0.03em] text-[#292825] sm:text-5xl">
                Bem-vindo de volta.
              </h2>

            </div>

            {/* Formulário */}
            <form onSubmit={fazerLogin} className="space-y-6">

              {/* E-mail */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#55534E]"
                >
                  E-mail
                </label>

                <div className="relative">
                  <Mail
                    size={17}
                    strokeWidth={1.6}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8A8883]"
                  />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="seuemail@exemplo.com"
                    autoComplete="email"
                    required
                    className="w-full border border-[#DAD7D0] bg-white py-3.5 pl-11 pr-4 text-sm text-[#292825] outline-none transition-all duration-300 placeholder:text-[#A19E98] focus:border-[#77746E] focus:bg-[#FCFBF9]"
                  />
                </div>
              </div>

              {/* Senha */}
              <div>
                <div className="mb-2 flex items-center justify-between">

                  <label
                    htmlFor="senha"
                    className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#55534E]"
                  >
                    Senha
                  </label>

                  <button
                    type="button"
                    onClick={() => router.push("/esqueci-senha")}
                    className="cursor-pointer text-xs font-medium text-[#77746E] transition-colors hover:text-[#292825]"
                  >
                    Esqueci minha senha
                  </button>
                </div>

                <div className="relative">
                  <LockKeyhole
                    size={17}
                    strokeWidth={1.6}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8A8883]"
                  />

                  <input
                    id="senha"
                    type="password"
                    value={senha}
                    onChange={(event) => setSenha(event.target.value)}
                    placeholder="Digite sua senha"
                    autoComplete="current-password"
                    required
                    className="w-full border border-[#DAD7D0] bg-white py-3.5 pl-11 pr-4 text-sm text-[#292825] outline-none transition-all duration-300 placeholder:text-[#A19E98] focus:border-[#77746E] focus:bg-[#FCFBF9]"
                  />
                </div>
              </div>

              {/* Erro */}
              {erro && (
                <div className="border border-[#D5D1C9] bg-[#EEEDE9] px-4 py-3.5">
                  <p className="text-sm leading-5 text-[#55534E]">
                    {erro}
                  </p>
                </div>
              )}

              {/* Botão */}
              <button
                type="submit"
                disabled={carregando}
                className="group flex w-full cursor-pointer items-center justify-center gap-3 bg-[#292825] px-5 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#171614] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {carregando ? (
                  "Entrando..."
                ) : (
                  <>
                    Entrar
                    <ArrowRight
                      size={17}
                      strokeWidth={1.7}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            {/* Segurança */}
            <div className="mt-8 flex items-start gap-3 border-t border-[#E3E0D9] pt-6">
              <ShieldCheck
                size={17}
                strokeWidth={1.6}
                className="mt-0.5 shrink-0 text-[#77746E]"
              />

              <p className="text-xs leading-5 text-[#8A8883]">
                Seus dados são protegidos e utilizados exclusivamente para
                gerenciamento da sua conta e das suas locações.
              </p>
            </div>

            {/* Cadastro */}
            <div className="mt-8 border-t border-[#E3E0D9] pt-7 text-center">

              <p className="text-sm text-[#77746E]">
                Ainda não possui uma conta?
              </p>

              <button
                type="button"
                onClick={() => router.push("/cadastro")}
                className="mt-2 cursor-pointer text-sm font-semibold text-[#292825] transition-opacity hover:opacity-60"
              >
                Criar minha conta
              </button>
            </div>

            {/* Voltar */}
            <button
              type="button"
              onClick={() => router.push("/")}
              className="mx-auto mt-8 flex cursor-pointer items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] text-[#8A8883] transition-colors hover:text-[#292825]"
            >
              <ArrowLeft size={15} strokeWidth={1.6} />
              Voltar para o início
            </button>

          </div>
        </section>
      </div>
    </main>
  );
}
