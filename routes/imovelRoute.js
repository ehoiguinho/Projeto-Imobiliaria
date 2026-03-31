import express from 'express';
import ImovelController from '../controllers/imovelController.js';
const router = express.Router();

let ctrl = new ImovelController();

router.post("/", (req, res) => {
    //#swagger.tags = ['Imóvel']
    //#swagger.summary = "Realiza o cadastro de um imóvel"

    ctrl.cadastrar(req, res);
})

router.get("/", (req, res) =>{
    //#swagger.tags = ['Imóvel']
    //#swagger.summary = "Realiza a listagem dos imóveis cadastrados"

    ctrl.listar(req, res);
})

router.get("/:id", (req, res) =>{
    //#swagger.tags = ['Imóvel']
    //#swagger.summary = "Realiza a busca de imóvel pelo ID inserido"

    ctrl.obterPeloId(req, res);
})
router.put("/", (req, res) => {
    // #swagger.tags = ['Imóvel']
    // #swagger.summary = "Altera um imóvel existente"
   
    ctrl.alterar(req, res);
})

router.delete("/:id", (req, res) =>{
    //#swagger.tags = ['Imóvel']
    //#swagger.summary = "Realiza a deleção de um imóvel pelo ID inserido"

    ctrl.deletar(req, res);
})

export default router;