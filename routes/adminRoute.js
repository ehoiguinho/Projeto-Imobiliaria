import express from "express";
import AuthMiddleware from "../middlewares/authMiddleware.js";
import adminController from "../controllers/adminController.js";

const router = express.Router();
let authMiddleware = new AuthMiddleware();
let ctrl = new adminController();

router.get("/imoveis", authMiddleware.validar, authMiddleware.validarAdmin, (req, res) =>
    /* #swagger.security = [{
            "jwt": []
    }] */
    // #swagger.tags = ['Administrador']
    // #swagger.summary = "Lista todos os imóveis cadastrados no sistema"

     ctrl.listarImoveis(req, res)
);

router.get("/contratos", authMiddleware.validar, authMiddleware.validarAdmin,(req, res) => 
    /* #swagger.security = [{
            "jwt": []
    }] */
    // #swagger.tags = ['Administrador']
    // #swagger.summary = "Retorna todos os contratos do sistema"

    ctrl.listarContratos(req, res)
);

router.get("/alugueis", authMiddleware.validar, authMiddleware.validarAdmin,(req, res) => 
    /* #swagger.security = [{
            "jwt": []
    }] */
    // #swagger.tags = ['Administrador']
    // #swagger.summary = "Lista todos os aluguéis de contratos ativos do sistema"

    ctrl.listarAlugueis(req, res)
);

export default router;