import ImovelService from "../services/imovelService.js";

export default class ImovelController {

    #service;

    constructor() {
        this.#service = new ImovelService();
    }

    async cadastrar(req, res) {

            console.log("🚨 CADASTRAR FOI CHAMADO");


    try {

        const resultado = await this.#service.cadastrar(
            req.body,
            req.files
        );

        return res.status(201).json(resultado);

    } catch (error) {

        if (error.status) {
            return res.status(error.status).json({
                msg: error.message
            });
        }

        console.error(error);

        return res.status(500).json({
            msg: "Erro interno do servidor."
        });
    }
}

    async listar(req, res) {

        try {

            const lista =
                await this.#service.listar();

            return res.status(200).json(lista);

        } catch (error) {

            console.error(error);

            return res.status(404).json({
                msg: error.message
            });
        }
    }

    async listarDisponivel(req, res) {

        try {

            const lista =
                await this.#service.listarDisponivel();

            return res.status(200).json(lista);

        } catch (error) {

            console.error(error);

            return res.status(404).json({
                msg: error.message
            });
        }
    }

    async obterPeloId(req, res) {

    try {

        const { id } = req.params;

        const imovel = await this.#service.obterPeloId(id);

        return res.status(200).json(imovel);

    } catch (error) {

        if (error.status) {
            return res.status(error.status).json({
                msg: error.message
            });
        }

        console.error(error);

        return res.status(500).json({
            msg: "Erro interno do servidor."
        });
    }
    
}

    async alterar(req, res) {

        try {

            const { id } = req.params;

            const resultado =
                await this.#service.alterar(
                    id,
                    req.body
                );

            return res.status(200).json(resultado);

        } catch (error) {

            console.error(error);

            return res.status(400).json({
                msg: error.message
            });
        }
    }

    async deletar(req, res) {
    try {
        const { id } = req.params;

        const resultado = await this.#service.deletar(id);

        return res.status(200).json(resultado);

    } catch (error) {

        console.error(error);

        if (error.status) {
            return res
                .status(error.status)
                .json({ msg: error.message });
        }

        return res
            .status(500)
            .json({ msg: "Erro interno do servidor." });
    }
}

    async imagem(req, res) {

        try {

            const { id } = req.params;

            const imagens =
                await this.#service.listarImagens(id);

            return res.status(200).json(imagens);

        } catch (error) {

            console.error(error);

            return res.status(404).json({
                msg: error.message
            });
        }
    }

    async adicionarImagens(req, res) {

        try {

            const { id } = req.params;

            const resultado =
                await this.#service.adicionarImagens(
                    id,
                    req.files
                );

            return res.status(200).json(resultado);

        } catch (error) {

            console.error(error);

            return res.status(400).json({
                msg: error.message
            });
        }
    }

    async deletarImagem(req, res) {

        try {

            const { id } = req.params;

            const resultado =
                await this.#service.deletarImagem(id);

            return res.status(200).json(resultado);

        } catch (error) {

            console.error(error);

            return res.status(404).json({
                msg: error.message
            });
        }
    }
}