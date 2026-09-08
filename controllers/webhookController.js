import WebhookService from "../services/webhookService.js";

export default class WebhookController {

    #webhookService;

    constructor() {
        this.#webhookService = new WebhookService();
    }

    async abacatePay(req, res) {
    try {
        const assinatura = req.headers["webhook-signature"];
        const webhookId = req.headers["webhook-id"];
        const webhookTimestamp = req.headers["webhook-timestamp"];

        const body = req.body;

        const resultado =
            await this.#webhookService.processarAbacatePay(
                body,
                webhookId,
                webhookTimestamp,
                assinatura
            );

        return res.status(200).json(resultado);

    } catch (ex) {
        console.log(ex);

        return res
            .status(ex.status || 500)
            .json({ msg: ex.message });
    }
}
}
