import Perfil from "../entities/perfil.js";
import Usuario from "../entities/usuario.js";
import UsuarioRepository from "../repositories/usuarioRepository.js";


export default class UsuarioController{

    #repositorio;

    constructor(){
        this.#repositorio = new UsuarioRepository();
        
    }

    async alterar(req, res){
     try{
        const { id } = req.params; // id vem da url
        let {nome, email, ativo, senha, perfil} = req.body;
        if(id, nome && email && senha && ativo !== 'undefined' && perfil !== 'undefined'){
            if(await this.#repositorio.buscarId(id)){
                let entidade = new Usuario(id, nome, email, ativo, senha, new Perfil(perfil.id));
                if(await this.#repositorio.alterar(entidade))
                res.status(200).json({msg: "Usuário alterado com sucesso!"});
                else
                    throw new Error("Erro ao alterar dados do usuário");
            }else{
                return res.status(404).json({msg: "Não foi possível encontrar o usuário para a alteração dos dados."});
            }
        }

     }catch(exception){
        console.log(exception);
        return res.status(500).json({msg: exception.message})
     } 
    }

    async cadastrar(req, res){
    console.log("BODY:", req.body);
        try{
        let {nome, email, ativo, senha, perfil} = req.body;

        if(nome && email && ativo && senha && perfil && perfil.id){

            let entidade = new Usuario(0, nome, email, ativo, senha, new Perfil(perfil.id));
            let inseriu = await this.#repositorio.cadastrar(entidade);
            if(inseriu == true){
                return res.status(200).json({msg: "Usuário cadastrado com sucesso!"});
            }
            else{
                throw new Error ("Erro ao cadastrar usuário.")
            }
            
        }
        else{
            return res.status(400).json({msg: "Erro ao cadastrar usuário, verifique as credenciais e insira os valores corretamente!"});
        }
            }
                catch(exception){
                    console.log(exception);
                    return res.status(500).json({msg: exception.message});

        }
        
    }

    async listar(req, res){
        try{
            let lista = await this.#repositorio.listar();
            if(lista.length > 0 ){
                return res.status(200).json(lista);
            }
            else{
                return res.status(404).json({msg: "Nenhum usuário encontrado para listagem!"});
            }
        }
        catch(exception){
            console.log(exception);
            return res.status(500).json({msg: exception.message})
        }
    }

    async deletar(req, res){
        try{
            let {id} = req.params;
            if(await this.#repositorio.buscarId(id)){
                if(await this.#repositorio.deletar(id))
                    return res.status(200).json({msg: "Usuário deletado com sucesso!"});
                else
                    throw new Error("Erro ao deletar usuário do banco de dados.");
            }
            else{
                return res.status(400).json({msg:"Usuário não encontrado para a deleção!"});
            }

        }
        catch(exception){
            console.log(exception);
            return res.status(500).json({msg: exception.message});
        }
    }


    
}