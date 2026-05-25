import express from 'express';
import UsuarioController from '../controllers/usuarioController.js';
import AuthMiddleware from '../middlewares/authMiddleware.js';


const router = express.Router();

let ctrl = new UsuarioController();
let auth = new AuthMiddleware();

router.post('/', (req, res) => {
   /* #swagger.security = [{
        "bearerAuth": []
    }]
    */
    // #swagger.tags = ['Usuário']
    // #swagger.summary = 'Cadastra um novo usuário'
    /* #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    $ref: '#/components/schemas/usuario'
                }
            }
        }
    }
    */
    ctrl.cadastrar(req, res);
});

router.get('/', (req, res) => {
    // #swagger.tags = ['Usuário']
    // #swagger.summary = 'Listar todos os usuários cadastrados'


    /* #swagger.responses[404] = {
        description: 'Nenhum usuário encontrado na consulta',
        schema: { $ref: '#/components/schemas/erro' }
    }
    */

    ctrl.listar(req, res);
});

router.get("/:id", (req, res) =>{
    /* #swagger.security = [{
            "jwt": []
    }] */
    // #swagger.tags = ['Usuário']
    // #swagger.summary = 'Recupera um usuário através do Id inserido'

    ctrl.obterUsuario(req, res);
})

router.put("/:id", (req, res) => {
    // #swagger.tags = ['Usuário']
    // #swagger.summary = 'Altera um usuário existente'
    /* #swagger.security = [{
            "jwt": []
    }] */
    /* #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    $ref: '#/components/schemas/usuario'
                }
            }
        }
    } */

    ctrl.alterar(req, res);
});

router.delete("/:id", (req, res) =>{
    /* #swagger.security = [{
            "jwt": []
    }] */
    // #swagger.tags = ['Usuário']
    // #swagger.summary = 'Deleta permanentemente um usuário'
    ctrl.deletar(req, res);
});



export default router;