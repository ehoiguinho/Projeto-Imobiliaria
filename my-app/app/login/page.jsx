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
        <main>
      <h1>Login</h1>

      <form onSubmit={fazerLogin}>
        <div>
          <label>E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div>
          <label>Senha</label>
          <input
            type="password"
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
            required
          />
        </div>

        {erro && <p>{erro}</p>}

        <button type="submit" disabled={carregando}>
          {carregando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
    
}