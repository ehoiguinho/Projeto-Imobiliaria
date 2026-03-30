import Aluguel from "../entities/aluguel";
import Contrato from "../entities/contrato";
import AluguelRepository from "../repositories/aluguelRepository";

export default class AluguelController{

    #repo;
    constructor(){
        this.#repo = new AluguelRepository();

    }

    async gravar(req, res){
        try{
            let {mes, vencimento, valor, pago , contrato} = req.body;
            if(!mes || !vencimento || valor <= 0 || !pago || !contrato.id){
                return res.status(400).json({msg: "Preencha os campos corretamente!"});
            }
            let entidade = new Aluguel(0, mes, vencimento, valor, pago, new Contrato(contrato.id));
            let inseriu = await this.#repo.gravar(entidade);
            if(inseriu == true){
                return res.status(200).json({msg: "Aluguel gerado com sucesso!"});
            }
            else{
                throw new Error("Erro ao gerar aluguel.");
              }
        }
        catch(error){
            console.error(error);
            return res.status(500).json({msg: "Erro ao processar requisição."});
        }
    }

}