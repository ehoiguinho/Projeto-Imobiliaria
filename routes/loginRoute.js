import express from 'express';
import LoginController from '../controllers/loginController.js';
import AuthMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

let controller = new LoginController();
let authMiddleware = new AuthMiddleware();
router.post("/", (req, res) => {

    // #swagger.tags = ['Login']
    // #swagger.summary = 'Gerar token de autenticação'
    controller.token(req, res);
})
router.get("/usuario", authMiddleware.validar, (req, res) => {
     /* #swagger.security = [{
            "jwt": []
    }] */
    // #swagger.tags = ['Login']
    // #swagger.summary = 'Retorna o usuário logado através da cookie'

    controller.usuario(req, res);
})

router.post("/logout", (req, res) => {
     /* #swagger.security = [{
            "jwt": []
    }] */
    // #swagger.tags = ['Login']
    // #swagger.summary = 'Realiza o logout do usuário, removendo o cookie de autenticação'
    res.clearCookie("token");
    return res.status(200).json({ msg: "Logout realizado com sucesso!" });
});

router.post("/esqueci-senha", (req, res) => {
     /* #swagger.security = [{
            "jwt": []
    }] */
    // #swagger.tags = ['Login']
    // #swagger.summary = 'Realiza a solicitação de recuperação de senha do usuário'

    controller.esqueciSenha(req, res);
});

router.post("/redefinir-senha", (req, res) => {
     /* #swagger.security = [{
            "jwt": []
    }] */
    // #swagger.tags = ['Login']
    // #swagger.summary = 'Realiza a redefinição de senha do usuário através do token enviado por e-mail'
    controller.redefinirSenha(req, res);
});



export default router;