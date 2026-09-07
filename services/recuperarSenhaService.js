import crypto from "crypto";
import bcrypt from "bcrypt";
import { enviarEmailRecuperacao } from "../config/email.js";
import RecuperarSenhaRepository from "../repositories/recuperarSenhaRepository.js";
import UsuarioRepository from "../repositories/usuarioRepository.js";

export default class RecuperarSenhaService {

    #recuperarRepository;
    #usuarioRepository;

    constructor() {
        this.#recuperarRepository = new RecuperarSenhaRepository();
        this.#usuarioRepository = new UsuarioRepository();
    }

   async solicitar(email) {

        if (!email) {
            throw new Error("Informe um e-mail.");
        }

        const usuario =
            await this.#usuarioRepository.buscarEmail(email);

        /*
        * Por segurança, não revelamos se o e-mail
        * está cadastrado ou não.
        */

        if (!usuario) {
            return;
        }

        const token =
            crypto.randomBytes(32).toString("hex");

        const expiraEm =
            new Date(Date.now() + 30 * 60 * 1000);

        await this.#recuperarRepository.criar(usuario.id, token, expiraEm);

    const link =
        `${process.env.FRONTEND_URL}/redefinir-senha?token=${encodeURIComponent(token)}`;

    await enviarEmailRecuperacao(usuario.email, usuario.nome, link);
}

    async redefinirSenha(token, novaSenha) {

        if (!token || !novaSenha) {
            throw new Error("Dados inválidos.");
        }

        if (novaSenha.length < 6) {
            throw new Error(
                "A senha deve possuir pelo menos 6 caracteres."
            );
        }

        const recuperacao =
            await this.#recuperarRepository.buscarToken(token);

        if (!recuperacao) {
            throw new Error("Token inválido.");
        }

        const agora = new Date();

        const expirado =
            agora > new Date(recuperacao.rec_expira_em);

        if (expirado) {

            await this.#recuperarRepository.deletarToken(token);

            throw new Error("O token de recuperação expirou.");
        }

        const senhaCriptografada =
            await bcrypt.hash(novaSenha, 10);

        const alterado =
            await this.#usuarioRepository.alterarSenha(
                recuperacao.usu_id,
                senhaCriptografada
            );

        if (!alterado) {
            throw new Error(
                "Não foi possível alterar a senha."
            );
        }

        await this.#recuperarRepository.deletarToken(token);

        return true;
    }
}