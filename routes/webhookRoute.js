import express from "express";

import WebhookController from "../controllers/webhookController.js";

const router = express.Router();

const ctrl = new WebhookController();

router.post("/abacatepay", (req, res) => {
    //#swagger.tags = ['Webhook']
    //#swagger.summary = "Recebe eventos de pagamento da AbacatePay"

    ctrl.abacatePay(req, res);

});
    
export default router;
