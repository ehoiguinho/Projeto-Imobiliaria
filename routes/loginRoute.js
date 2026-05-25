import express from 'express';
import LoginController from '../controllers/loginController.js';
import AuthMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

let controller = new LoginController();
let auth = new AuthMiddleware();
router.post("/", (req, res) => {

    // #swagger.tags = ['Login']
    // #swagger.summary = 'Gerar token de autenticação'
    controller.token(req, res);
})
router.get("/usuario", auth.validar, (req, res) => {

    // #swagger.tags = ['Login']
    // #swagger.summary = 'Retorna o usuário logado através da cookie'

    controller.usuario(req, res);
})

export default router;