import express from 'express';
import ImovelController from '../controllers/imovelController.js';
import AuthMiddleware from '../middlewares/authMiddleware.js';
import upload from "../config/multer.js";
const router = express.Router();

let ctrl = new ImovelController();
let authMiddleware = new AuthMiddleware();

router.post("/", authMiddleware.validar, upload.array("imagens", 5), (req, res) => {

        /* #swagger.security = [{
                "jwt": []
        }] */

        //#swagger.tags = ['Imóvel']
        //#swagger.summary = "Realiza o cadastro de um imóvel"

        /* #swagger.requestBody = {
                required: true,
                content: {
                    "multipart/form-data": {
                        schema: {
                            type: "object",
                            properties: {
                                descricao: {
                                    type: "string"
                                },
                                cep: {
                                    type: "string"
                                },
                                endereco: {
                                    type: "string"
                                },
                                bairro: {
                                    type: "string"
                                },
                                cidade: {
                                    type: "string"
                                },
                                valor: {
                                    type: "number"
                                },
                                disponivel: {
                                    type: "string"
                                },
                                imagens: {
                                    type: "array",
                                    items: {
                                        type: "string",
                                        format: "binary"
                                    }
                                }
                            }
                        }
                    }
                }
        } */

    ctrl.cadastrar(req, res);
})
router.get("/disponivel",  (req, res) => {
    // #swagger.tags = ['Imóvel']
    // #swagger.summary = "Lista todos os imóveis disponíveis para locação"
    ctrl.listarDisponivel(req, res);
});

router.get("/", (req, res) =>{
    //#swagger.tags = ['Imóvel']
    //#swagger.summary = "Realiza a listagem dos imóveis cadastrados"

    ctrl.listar(req, res);
})

router.get("/:id", authMiddleware.validar, (req, res) =>{
    /* #swagger.security = [{
            "jwt": []
    }] */
    //#swagger.tags = ['Imóvel']
    //#swagger.summary = "Realiza a busca de imóvel pelo ID inserido"

    ctrl.obterPeloId(req, res);
})
router.put("/:id", authMiddleware.validar, (req, res) => {
    /* #swagger.security = [{
            "jwt": []
    }] */
    // #swagger.tags = ['Imóvel']
    // #swagger.summary = "Altera um imóvel existente"
   
    ctrl.alterar(req, res);
})

router.delete("/:id", authMiddleware.validar, (req, res) =>{
    /* #swagger.security = [{
            "jwt": []
    }] */
    //#swagger.tags = ['Imóvel']
    //#swagger.summary = "Realiza a deleção de um imóvel pelo ID inserido"

    ctrl.deletar(req, res);
})

router.get("/:id/imagem", authMiddleware.validar, (req, res) => {
    ctrl.imagem(req, res);
});

router.post("/:id/imagem", authMiddleware.validar, upload.array("imagens", 5), (req, res) => {
   // #swagger.tags = ['Imóvel']
        // #swagger.summary = "Adiciona imagens a um imóvel"

        /* #swagger.requestBody = {
            required: true,
            content: {
                "multipart/form-data": {
                    schema: {
                        type: "object",
                        properties: {
                            imagens: {
                                type: "array",
                                items: {
                                    type: "string",
                                    format: "binary"
                                }
                            }
                        }
                    }
                }
            }
        } */
    ctrl.adicionarImagens(req, res);
});

router.delete("/imagem/:id", authMiddleware.validar, (req, res) => {
    ctrl.deletarImagem(req, res);
});

router.delete("/imagem/:id", authMiddleware.validar, (req, res) => {
    /* #swagger.security = [{
            "jwt": []
    }] */
    // #swagger.tags = ['Imóvel']
    // #swagger.summary = "Realiza a deleção de uma imagem pelo ID da imagem"
    ctrl.deletarImagem(req, res);
});

export default router;