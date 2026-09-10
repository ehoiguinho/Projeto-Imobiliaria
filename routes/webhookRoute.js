import express from "express";

import WebhookController from "../controllers/webhookController.js";

const router = express.Router();

const controller = new WebhookController();

router.post("/abacatepay", (req, res) => {

    console.log("");
    console.log("========================================");
    console.log("🚨🚨🚨 WEBHOOK CHEGOU NA ROTA 🚨🚨🚨");
    console.log("========================================");

    console.log("Método:", req.method);
    console.log("URL:", req.originalUrl);
    console.log("Headers recebidos:");
    console.log({
        "webhook-id": req.headers["webhook-id"],
        "webhook-timestamp": req.headers["webhook-timestamp"],
        "webhook-signature": req.headers["webhook-signature"]
            ? "[RECEBIDA]"
            : "[NÃO RECEBIDA]",
        "content-type": req.headers["content-type"]
    });

    console.log(
        "Body é Buffer:",
        Buffer.isBuffer(req.body)
    );

    console.log(
        "Tamanho do body:",
        req.body
            ? req.body.length
            : 0
    );

    console.log(
        "========================================"
    );

    //#swagger.tags = ['Webhook']
    //#swagger.summary = "Recebe eventos de pagamento da AbacatePay"

    console.log(
        "➡️ Chamando WebhookController.abacatePay..."
    );

    controller.abacatePay(req, res);

});
    
export default router;
