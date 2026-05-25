import express from 'express';
import LocacaoController from '../controllers/locacaoController.js';
import AuthMiddleware from '../middlewares/authMiddleware.js';
const router = express.Router();

let ctrl = new LocacaoController();
let authMiddleware = new AuthMiddleware();

router.post("/", authMiddleware.validar, (req, res) => {
    /* #swagger.security = [{
            "jwt": []
    }] */
    //#swagger.tags = ['Locação']
    //#swagger.summary = "Inicia o processo de locação de imóvel"

    ctrl.locar(req, res);
})

router.get("/:id", authMiddleware.validar, (req, res) =>{
    /* #swagger.security = [{
            "jwt": []
    }] */
    //#swagger.tags = ['Locação']
    //#swagger.summary = "Faz uma busca do contrato de locação de um determinado usuário"

    ctrl.listar(req, res);

});

router.put("/:id", authMiddleware.validar, (req, res) => {
    /* #swagger.security = [{
            "jwt": []
    }] */
    //#swagger.tags = ['Locação']
    //#swagger.summary = "Cancela um contrato de locação ativo";

    ctrl.cancelar(req, res);

});

export default router;