import express from "express";

import WebhookController from "../controllers/webhookController.js";

const router = express.Router();

const controller = new WebhookController();

router.post("/abacatepay", (req, res) => {

    //#swagger.tags = ['Webhook']
    //#swagger.summary = "Recebe eventos de pagamento da AbacatePay"

    controller.abacatePay(req, res);
});

export default router;
