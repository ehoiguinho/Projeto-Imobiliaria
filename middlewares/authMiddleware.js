import jwt from 'jsonwebtoken';
import UsuarioRepository from '../repositories/usuarioRepository.js';

const secret = "segredo@"

export default class AuthMiddleware{


    async gerarToken(id, nome, email, perfil){

        let jsonwebtoken = jwt.sign(
            {
                id: id,
                nome: nome,
                email: email,
                perfil: perfil
            },
            secret,
            {
                expiresIn: 30000
            }
        )
        
        return jsonwebtoken;
    }

    async validarToken(req, res, next){
        if(req.cookies.token){
            let token = req.cookies.token;
        
        try{
            let payload = jwt.verify(token, secret);
            let usuarioRepository = new UsuarioRepository();
            let usuario = await usuarioRepository.buscarId(payload.id);
            if(usuario){
                if(usuario.ativo){
                    req.usuarioLogado = usuario;
                    next();
                }
                else {
                        return res.status(401).json({msg: "Usuário inativo"});
                    }
                }
                else {
                    return res.status(404).json({msg: "Usuário não encontrado"});
                }
            }
            catch(ex) {
                console.log(ex)
                return res.status(401).json({msg: "Token inválido!"});
            }
        }
        else {
            return res.status(401).json({msg: "Token não encontrado!"});
        }
    }
}