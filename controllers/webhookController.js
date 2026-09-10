import WebhookService from "../services/webhookService.js";

export default class WebhookController {

    #webhookService;

    constructor() {
        this.#webhookService =
            new WebhookService();
    }

    async abacatePay(req, res) {

        try {

            const webhookSecret = req.query.webhookSecret;

            const webhookSignature = req.headers["x-webhook-signature"];

            const body = req.body;
        
            const resultado = await this.#webhookService.processarAbacatePay(body, webhookSecret, webhookSignature);


            return res.status(200).json(resultado);


        } catch (ex) {

            return res.status(ex.status || 500).json({msg: ex.message});
        }
    }
}