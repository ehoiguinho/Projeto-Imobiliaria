import Database from "../db/database.js";
import Aluguel from "../entities/aluguel.js";
import Contrato from "../entities/contrato.js";
import AluguelRepository from "../repositories/aluguelRepository.js";
import ContratoRepository from "../repositories/contratoRepository.js";
import ImovelRepository from "../repositories/imovelRepository.js";

export default class LocacaoController{

    #aluguelRepository;
    #contratoRepository;
    #imovelRepository;

    constructor(){
        this.#aluguelRepository = new AluguelRepository();
        this.#contratoRepository = new ContratoRepository();
        this.#imovelRepository = new ImovelRepository();
    }

    async locar(req, res){
    let banco = new Database();
    try{
        let {id} = req.body;

        this.#aluguelRepository.banco = banco;
        this.#contratoRepository.banco = banco;
        this.#imovelRepository.banco = banco;

        if(id){
            let imovel = await this.#imovelRepository.obterId(id);

            console.log(imovel.toJSON()); // melhor log

            if(imovel && imovel.disponivel === "S"){

                let contrato = new Contrato();
                contrato.imovel = imovel;
                contrato.usuario = req.usuarioLogado;

                await banco.AbreTransacao();

                if(await this.#contratoRepository.gravar(contrato)){

                    for(let i = 1; i <= 12; i++){
                        let aluguel = new Aluguel();

                        aluguel.valor = imovel.valor;
                        aluguel.contrato = contrato;
                        aluguel.pago = 'N';

                        let dataAtual = new Date();
                        dataAtual.setMonth(dataAtual.getMonth() + i);

                        let mes = dataAtual.getMonth() + 1;

                        aluguel.mes = mes;
                        aluguel.vencimento = dataAtual;

                        if(await this.#aluguelRepository.gravar(aluguel) == false){
                            throw new Error(`Erro ao processar aluguel do mês ${mes}`);
                        }
                    }

                    // marcar como indisponível
                    imovel.disponivel = "N";

                    if(await this.#imovelRepository.alterar(imovel)){
                        await banco.Commit();
                        return res.status(200).json({msg: "Imóvel locado com sucesso!"});
                    } else {
                        throw new Error("Erro ao atualizar imóvel");
                    }

                } else {
                    throw new Error("Erro ao gerar contrato no banco!");
                }

            } else {
                return res.status(400).json({msg: "Imóvel inválido para locação!"});
            }

        } else {
            return res.status(400).json({msg: "O Id do imóvel não foi enviado!"});
        }

    }
    catch(error){
        await banco.Rollback(); // IMPORTANTE
        console.error(error);
        return res.status(500).json({msg: "Erro ao processar requisição."});
    }
}

    async listar(req, res){
        try {
            let id = req.usuarioLogado.id;
            var lista = await this.#contratoRepository.listarPorUsuario(id);
            if(lista.length > 0)
                res.status(200).json(lista);
            else
                res.status(404).json("Não foi possível encontrar nenhum contrato de locação!");
        }
        catch(error) {
            await banco.Rollback();
            console.error(error);
            return res.status(500).json({msg: "Erro interno de servidor"})
        }
    }

}