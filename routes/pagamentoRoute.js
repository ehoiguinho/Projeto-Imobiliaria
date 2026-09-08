import express from "express";

import PagamentoController from "../controllers/pagamentoController.js";
import AuthMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

const controller = new PagamentoController();
const authMiddleware = new AuthMiddleware();

router.post("/:id", authMiddleware.validar, (req, res) => {

    /* #swagger.security = [{
        "jwt": []
    }] */

    //#swagger.tags = ['Pagamento']
    //#swagger.summary = "Cria um checkout para pagamento de um aluguel"

    controller.criarCheckout(req, res);
});

export default router;
