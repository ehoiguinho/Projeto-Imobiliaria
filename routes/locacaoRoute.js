import express from 'express';
import LocacaoController from '../controllers/locacaoController.js';
import AuthMiddleware from '../middlewares/authMiddleware.js';
const router = express.Router();

let ctrl = new LocacaoController();
let auth = new AuthMiddleware();

router.post("/", auth.validarToken.bind(auth), (req, res) => {
    //#swagger.tags = ['Locação']
    //#swagger.summary = "Inicia o processo de locação de imóvel"

    ctrl.locar(req, res);
})

router.get("/:id", auth.validarToken.bind(auth), (req, res) =>{
    //#swagger.tags = ['Locação']
    //#swagger.summary = "Faz uma busca do contrato de locação de um determinado usuário"

    ctrl.listar(req, res);

});

export default router;