import AuthMiddleware from "../middlewares/authMiddleware.js";
import UsuarioRepository from "../repositories/usuarioRepository.js";


export default class AutenticaoController{


    #repositorio;

    constructor(){
        this.#repositorio = new UsuarioRepository();
    }

    async usuario(req, res){
        try{
            if(req.usuarioLogado)
                return res.status(200).json(req.usuarioLogado);
            else
                throw new Error("Não foi possivel obter o usuário.");

        }catch(exception){
            console.log(exception);
            return res.status(500).json({msg: "Erro ao gerar o token de acesso!"});
            
        }

    }

    async token(req, res){
        try{
        let {email, senha} = req.body;
        if(email && senha){
            let usuario = await this.#repositorio.validarAcesso(email, senha);
            if(usuario){
                let auth = new AuthMiddleware();
                let token = await auth.gerarToken(usuario.id, usuario.nome, usuario.email, usuario.perfil.id);
                res.cookie("token", token, {
                    httpOnly: true,
                })
                return res.status(200).json({token: token});
            }
            else{
                return res.status(404).json({msg: "Usuário não encontrado."});
            }
        }
        else{
            return res.status(400).json({msg: "Informe um e-mail e senha válidos para gerar o token!"});
        }

    }catch(exception){
        console.log(exception);
        return res.status(500).json({msg: "Erro ao gerar token de acesso"})
    }
    }
}