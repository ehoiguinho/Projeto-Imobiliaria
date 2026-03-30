import Imovel from "../entities/imovel.js";
import ImovelRepository from "../repositories/imovelRepository.js";


export default class ImovelController{

    #repo;

    constructor(){
        this.#repo = new ImovelRepository();
    }

    async cadastrar(req, res){
        try{
            let {descricao, cep, endereco, bairro, cidade, valor, disponivel} = req.body;

            if(!descricao || !cep || !endereco || !bairro || !cidade || valor == null || !disponivel){
                return res.status(400).json({msg: "Preencha os campos corretamente!"});
            }
              let entidade = new Imovel(0, descricao, cep, endereco, bairro, cidade, valor, disponivel);
              let inseriu = await this.#repo.gravar(entidade);
              if(inseriu == true){
                return res.status(200).json({msg: "Imóvel cadastrado com sucesso!"});
              }
              else{
                throw new Error("Erro ao cadastrar imóvel.");
              }
        }
        catch(error){
            console.error(error);
            return res.status(500).json({msg: "Erro ao processar requisição."});
        }

    }

    async listar(req, res){
        try{
            let lista = await this.#repo.listar();
            if(lista.length > 0){
                return res.status(200).json(lista);
            }
            else
                return res.status(400).json({msg: "Nenhum imóvel encontrado."});

        }catch(error){
        console.error(error);
        return res.status(500).json({msg: "Erro ao processar requisição"});
        }
        
    }

    async obterPeloId(req, res){
        try{
        let {id} = req.params;
        let imovel = await this.#repo.obterId(id);
        if(imovel){
            return res.status(200).json(imovel);
        }
        else
            return res.status(404).json({msg: "Não foi possível encontrar o imóvel com o ID inserido."});
    }catch(error){
        console.error(error);
        return res.status(500).json({msg: "Erro ao processar requisição."});
    }
    } 
    
    async deletar(req, res){
        try{
            let {id} = req.params;
            let imovel = await this.#repo.obterId(id);
            if(imovel){
                await this.#repo.deletar(id);
                return res.status(200).json({msg: "Imóvel deletado com sucesso."});
            }
            else{
                return res.status(404).json({msg: "Não foi possivel encontrar o imóvel para deleção"});
            }
        }
        catch(error){
            console.error(error);
            return res.status(500).json({msg: "Erro ao processar requisição."});
        }

    }
}