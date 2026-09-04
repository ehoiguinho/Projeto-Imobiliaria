import AdminRepository from "../repositories/adminRepository.js";

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
}