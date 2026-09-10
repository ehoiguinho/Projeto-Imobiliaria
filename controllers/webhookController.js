import WebhookService from "../services/webhookService.js";

export default class WebhookController {

    #webhookService;

    constructor() {

        console.log("========================================");
        console.log("WEBHOOK CONTROLLER INICIADO");
        console.log("========================================");

        this.#webhookService =
            new WebhookService();
    }

    async abacatePay(req, res) {

        console.log("");
        console.log("========================================");
        console.log("🚨 WEBHOOK CHEGOU NO CONTROLLER");
        console.log("========================================");

        console.log(
            "Método:",
            req.method
        );

        console.log(
            "URL:",
            req.path
        );

        console.log(
            "x-webhook-secret:",
            req.headers["x-webhook-secret"]
                ? "[RECEBIDO]"
                : "[NÃO RECEBIDO]"
        );

        console.log(
            "x-webhook-signature:",
            req.headers["x-webhook-signature"]
                ? "[RECEBIDA]"
                : "[NÃO RECEBIDA]"
        );

        console.log(
            "Body é Buffer:",
            Buffer.isBuffer(req.body)
        );

        console.log(
            "Body existe:",
            !!req.body
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


        try {

            console.log(
                "➡️ Entrando no try do controller..."
            );


            const webhookSecret =
            req.query.webhookSecret;

            const webhookSignature =
            req.headers["x-webhook-signature"];

            const body =
                req.body;


            console.log(
                "Headers capturados."
            );

            console.log(
                "Secret recebido:",
                !!webhookSecret
            );

            console.log(
                "Assinatura recebida:",
                !!webhookSignature
            );

            console.log(
                "Tipo do body:",
                Buffer.isBuffer(body)
                    ? "Buffer"
                    : typeof body
            );

            console.log(
                "Tamanho do body:",
                body
                    ? body.length
                    : 0
            );


            console.log(
                "➡️ Chamando WebhookService.processarAbacatePay..."
            );


            const resultado =
                await this.#webhookService.processarAbacatePay(
                    body,
                    webhookSecret,
                    webhookSignature
                );


            console.log(
                "✅ WebhookService terminou."
            );

            console.log(
                "Resultado:",
                resultado
            );


            console.log(
                "➡️ Respondendo HTTP 200..."
            );


            return res
                .status(200)
                .json(resultado);


        } catch (ex) {

            console.log(
                "========================================"
            );

            console.log(
                "❌ ERRO NO WEBHOOK CONTROLLER"
            );

            console.log(
                "========================================"
            );

            console.log(
                "Mensagem:",
                ex.message
            );

            console.log(
                "Status:",
                ex.status
            );

            console.log(
                "Stack:",
                ex.stack
            );

            console.log(
                "========================================"
            );


            return res
                .status(ex.status || 500)
                .json({
                    msg: ex.message
                });
        }
    }
}