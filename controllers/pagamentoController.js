import PagamentoService from "../services/pagamentoService.js";

export default class PagamentoController {

    #pagamentoService;

    constructor() {
        this.#pagamentoService = new PagamentoService();
    }

    async criarCheckout(req, res) {

        try {

            const { id } = req.params;
            const usuarioId = req.usuarioLogado.id;

            const resultado =
                await this.#pagamentoService.criarCheckout(
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
}