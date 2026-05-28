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
    res.clearCookie("token");
    return res.status(200).json({ msg: "Logout realizado com sucesso!" });
});

export default router;