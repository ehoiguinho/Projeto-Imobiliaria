import LocacaoService from "../services/locacaoService.js";

export default class LocacaoController {

    #locacaoService;

    constructor() {
        this.#locacaoService = new LocacaoService();
    }

    async locar(req, res) {

        try {

            const { id } = req.body;
            const usuario = req.usuarioLogado;

            const resultado = await this.#locacaoService.locar(
                id,
                usuario
            );

            return res.status(200).json(resultado);

        } catch (ex) {

            console.log(ex);

            return res.status(ex.status || 500).json({
                msg: ex.message
            });
        }
    }

    async listar(req, res) {

    try {

        const contratoId = req.params.id;
        const usuarioId = req.usuarioLogado.id;

        const contrato = await this.#locacaoService.listar(
            contratoId,
            usuarioId
        );

        return res.status(200).json(contrato);

    } catch (ex) {

        console.log(ex.message);

        return res.status(404).json({
            msg: ex.message
        });
    }
}

async listarPorUsuario(req, res) {
    try {
        const usuarioId = req.usuarioLogado.id;

        const lista = await this.#locacaoService.listarPorUsuario(usuarioId);

        return res.status(200).json(lista);
    } catch (ex) {
        console.log(ex);
        return res.status(ex.status || 404).json({
            msg: ex.message
        });
    }
}

    async cancelar(req, res) {

        try {

            const { id } = req.params;
            const usuarioId = req.usuarioLogado.id;

            const resultado = await this.#locacaoService.cancelar(
                id,
                usuarioId
            );

            return res.status(200).json(resultado);

        } catch (ex) {

            console.log(ex);

            return res.status(ex.status || 500).json({
                msg: ex.message
            });
        }
    }

    async pagarAluguel(req, res) {

        try {

            const { id } = req.params;
            const usuarioId = req.usuarioLogado.id;

            const resultado = await this.#locacaoService.pagarAluguel(
                id,
                usuarioId
            );

            return res.status(200).json(resultado);

        } catch (ex) {

            console.log(ex.message);

            return res.status(ex.status || 500).json({
                msg: ex.message
            });
        }
    }

    async listarAlugueis(req, res) {

        try {

            const { id } = req.params;
            const usuarioId = req.usuarioLogado.id;

            const lista = await this.#locacaoService.listarAlugueis(
                id,
                usuarioId
            );

            return res.status(200).json(lista);

        } catch (ex) {

            console.log(ex);

            return res.status(ex.status || 500).json({
                msg: ex.message
            });
        }
    }
}