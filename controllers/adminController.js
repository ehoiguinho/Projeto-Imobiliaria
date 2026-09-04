import AdminRepository from "../repositories/adminRepository.js";
import Database from "../db/database.js";

export default class AdminController {

    #repositorio;

    constructor() {
        this.#repositorio = new AdminRepository();
    }


    async listarImoveis(req, res) {

        try {

            const imoveis = await this.#repositorio.listarTodosImoveis();

            return res.status(200).json(imoveis);

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                msg: "Erro ao listar imóveis."
            });
        }
    }


    async listarContratos(req, res) {

        try {

            const contratos = await this.#repositorio.listarTodosContratos();

            return res.status(200).json(contratos);

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                msg: "Erro ao listar contratos."
            });
        }
    }


    async listarAlugueis(req, res) {

        try {

            const alugueis =
                await this.#repositorio.listarAlugueisContratosAtivos();

            return res.status(200).json(alugueis);

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                msg: "Erro ao listar aluguéis."
            });
        }
    }

    async obterContrato(req, res) {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                msg: "O id do contrato não foi enviado."
            });
        }

        const contrato = await this.#repositorio.obterContrato(id);

        if (!contrato || contrato.length === 0) {
            return res.status(404).json({
                msg: "Contrato não encontrado."
            });
        }

        return res.status(200).json(contrato[0]);

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            msg: "Erro ao buscar contrato."
        });
    }
}

    async cancelarContrato(req, res) {
        const banco = new Database();
        let client = null;

    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                msg: "O id do contrato não foi enviado."
            });
        }

        // Verifica se o contrato existe
        const contrato = await this.#repositorio.obterContrato(id);

        if (!contrato || contrato.length === 0) {
            return res.status(404).json({
                msg: "Contrato não encontrado."
            });
        }

        const dadosContrato = contrato[0];

        // Verifica se o contrato está ativo
        if (dadosContrato.con_status !== "ATIVO") {
            return res.status(400).json({
                msg: "Somente contratos ativos podem ser cancelados."
            });
        }

        // Inicia transação
        client = await banco.AbreTransacao();

        // Cancela contrato
        if (!await this.#repositorio.cancelarContrato(id, client)) {
            throw new Error("Erro ao cancelar contrato.");
        }

        // Cancela mensalidades pendentes
        await this.#repositorio.cancelarAlugueisPendentes(id, client);

        // Libera imóvel
        if (
            !await this.#repositorio.liberarImovelContrato(
                id,
                client
            )
        ) {
            throw new Error("Erro ao liberar imóvel.");
        }

        // Confirma transação
        await banco.Commit(client);
        client = null;

        return res.status(200).json({
            msg: "Contrato cancelado com sucesso."
        });

    } catch (error) {

        if (client) {
            await banco.Rollback(client);
        }

        console.log(error);

        return res.status(500).json({
            msg: error.message || "Erro ao cancelar contrato."
        });
    }
}
}