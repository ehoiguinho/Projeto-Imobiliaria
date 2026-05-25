import express from 'express'
const router = express.Router();

import LocacaoController from '../controllers/locacaoController.js';
import AuthMiddleware from '../middlewares/authMiddleware.js';

let ctrl = new LocacaoController();
let authMiddleware = new AuthMiddleware();

router.put("/:id", authMiddleware.validar.bind(authMiddleware), (req, res) => {
     /* #swagger.security = [{
            "jwt": []
    }] */
    //#swagger.tags = ['Aluguel']
    //#swagger.summary = "Realiza o pagamento de um aluguel específico pelo ID inserido"
    
    ctrl.pagarAluguel(req, res)
});

export default router;