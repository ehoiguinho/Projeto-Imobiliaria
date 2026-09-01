import Perfil from "../entities/perfil.js";
import Usuario from "../entities/usuario.js";
import UsuarioRepository from "../repositories/usuarioRepository.js";

export default class UsuarioService {

    #repositorio;

    constructor() {
        this.#repositorio = new UsuarioRepository();
    }

    async cadastrar(nome, email, ativo, senha, perfilId) {

        if (!nome || !email || !ativo || !senha || !perfilId) {
            throw new Error(
                "Erro ao cadastrar usuário, verifique os dados informados!"
            );
        }

        const entidade = new Usuario(
            0,
            nome,
            email,
            ativo,
            senha,
            new Perfil(perfilId)
        );

        const idUsuario = await this.#repositorio.cadastrar(entidade);

        if (!idUsuario) {
            throw new Error("Erro ao cadastrar usuário.");
        }

        entidade.id = idUsuario;

        return entidade;
    }

    async alterar(id, nome, email, ativo, senha, perfilId) {

        if (!id || !nome || !email || !senha || !perfilId) {
            throw new Error(
                "Dados inválidos para alteração do usuário."
            );
        }

        const usuario = await this.#repositorio.buscarId(id);

        if (!usuario) {
            const erro = new Error(
                "Não foi possível encontrar o usuário para alteração."
            );

            erro.status = 404;

            throw erro;
        }

        const entidade = new Usuario(
            id,
            nome,
            email,
            ativo,
            senha,
            new Perfil(perfilId)
        );

        if (!await this.#repositorio.alterar(entidade)) {
            throw new Error("Erro ao alterar dados do usuário.");
        }

        return {
            msg: "Usuário alterado com sucesso!"
        };
    }

    async listar() {

        const lista = await this.#repositorio.listar();

        if (lista.length === 0) {
            const erro = new Error(
                "Nenhum usuário encontrado para listagem!"
            );

            erro.status = 404;

            throw erro;
        }

        return lista;
    }

    async deletar(id) {

        if (!id) {
            throw new Error("O id do usuário não foi informado.");
        }

        const usuario = await this.#repositorio.buscarId(id);

        if (!usuario) {
            const erro = new Error(
                "Usuário não encontrado para a deleção!"
            );

            erro.status = 404;

            throw erro;
        }

        if (!await this.#repositorio.deletar(id)) {
            throw new Error(
                "Erro ao deletar usuário do banco de dados."
            );
        }

        return {
            msg: "Usuário deletado com sucesso!"
        };
    }

    async obterUsuario(id) {

        if (!id) {
            throw new Error("O id do usuário não foi informado.");
        }

        const usuario = await this.#repositorio.buscarId(id);

        if (!usuario) {
            const erro = new Error(
                "Nenhum usuário encontrado!"
            );

            erro.status = 404;

            throw erro;
        }

        return usuario;
    }
}