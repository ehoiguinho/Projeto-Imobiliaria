import Database from "../db/database.js";
import Aluguel from "../entities/aluguel.js";
import Contrato from "../entities/contrato.js";
import AluguelRepository from "../repositories/aluguelRepository";
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
            
        }
        catch(error){
            console.error(error);
            return res.status(500).json({msg: "Erro ao processar requisição."});
        }
    }

    async listar(req, res){

    }

}