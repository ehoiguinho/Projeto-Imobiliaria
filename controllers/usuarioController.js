import UsuarioService from "../services/usuarioService.js";

export default class UsuarioController {

    #service;

    constructor() {
        this.#service = new UsuarioService();
    }

    async cadastrar(req, res) {

        try {

            const { nome, email, ativo, senha, perfil } = req.body;

            const usuario = await this.#service.cadastrar(
                nome,
                email,
                ativo,
                senha,
                perfil?.id
            );

            return res.status(201).json({
                msg: "Usuário cadastrado com sucesso!",
                id: usuario.id
            });

        } catch (ex) {

            console.log(ex.message);

            return res.status(ex.status || 400).json({
                msg: ex.message
            });
        }
    }

    async alterar(req, res) {

        try {

            const { id } = req.params;
            const { nome, email, ativo, senha, perfil } = req.body;

            const resultado = await this.#service.alterar(
                id,
                nome,
                email,
                ativo,
                senha,
                perfil?.id
            );

            return res.status(200).json(resultado);

        } catch (ex) {

            console.log(ex.message);

            return res.status(ex.status || 400).json({
                msg: ex.message
            });
        }
    }

    async listar(req, res) {

        try {

            const lista = await this.#service.listar();

            return res.status(200).json(lista);

        } catch (ex) {

            console.log(ex.message);

            return res.status(ex.status || 500).json({
                msg: ex.message
            });
        }
    }

    async deletar(req, res) {

        try {

            const { id } = req.params;

            const resultado = await this.#service.deletar(id);

            return res.status(200).json(resultado);

        } catch (ex) {

            console.log(ex.message);

            return res.status(ex.status || 400).json({
                msg: ex.message
            });
        }
    }

    async obterUsuario(req, res) {

        try {

            const { id } = req.params;

            const usuario = await this.#service.obterUsuario(id);

            return res.status(200).json(usuario);

        } catch (ex) {

            console.log(ex.message);

            return res.status(ex.status || 500).json({
                msg: ex.message
            });
        }
    }
}