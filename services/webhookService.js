import crypto from "node:crypto";
import Database from "../db/database.js";
import PagamentoRepository from "../repositories/pagamentoRepository.js";
import AluguelRepository from "../repositories/aluguelRepository.js";

export default class WebhookService {

    #pagamentoRepository;
    #aluguelRepository;

    constructor() {

        this.#pagamentoRepository = new PagamentoRepository();
        this.#aluguelRepository = new AluguelRepository();

    }

    async processarAbacatePay(
        rawBody,
        webhookId,
        webhookTimestamp,
        webhookSignature
    ) {

        console.log("\n");
        console.log("==================================================");
        console.log("          INÍCIO DO PROCESSAMENTO WEBHOOK");
        console.log("==================================================");

        // ==================================================
        // 1. VALIDAR HEADERS
        // ==================================================

        console.log("\n========== VALIDANDO HEADERS ==========");

        if (!webhookId) {
            console.log("❌ webhook-id não enviado.");

            const erro = new Error(
                "Header webhook-id não enviado."
            );

            erro.status = 401;
            throw erro;
        }

        if (!webhookTimestamp) {
            console.log("❌ webhook-timestamp não enviado.");

            const erro = new Error(
                "Header webhook-timestamp não enviado."
            );

            erro.status = 401;
            throw erro;
        }

        if (!webhookSignature) {
            console.log("❌ webhook-signature não enviado.");

            const erro = new Error(
                "Header webhook-signature não enviado."
            );

            erro.status = 401;
            throw erro;
        }

        console.log("webhook-id:", webhookId);
        console.log("webhook-timestamp:", webhookTimestamp);
        console.log("webhook-signature: recebida");
        console.log("======================================");

        // ==================================================
        // 2. VALIDAR SECRET
        // ==================================================

        console.log("\n========== VALIDANDO SECRET ==========");

        const webhookSecret =
            process.env.ABACATEPAY_WEBHOOK_SECRET;

        if (!webhookSecret) {

            console.log(
                "❌ ABACATEPAY_WEBHOOK_SECRET não configurada."
            );

            const erro = new Error(
                "ABACATEPAY_WEBHOOK_SECRET não configurada."
            );

            erro.status = 500;
            throw erro;
        }

        console.log("Webhook secret configurada: SIM");
        console.log("=====================================");

        // ==================================================
        // 3. VALIDAR TIMESTAMP
        // ==================================================

        console.log("\n========== VALIDANDO TIMESTAMP ==========");

        const timestamp = Number(webhookTimestamp);

        if (!Number.isInteger(timestamp)) {

            console.log("❌ Timestamp inválido.");

            const erro = new Error(
                "webhook-timestamp inválido."
            );

            erro.status = 401;
            throw erro;
        }

        const agora =
            Math.floor(Date.now() / 1000);

        const diferenca =
            Math.abs(agora - timestamp);

        console.log("Timestamp recebido:", timestamp);
        console.log("Timestamp atual:", agora);
        console.log("Diferença:", diferenca, "segundos");

        if (diferenca > 300) {

            console.log("❌ Webhook expirado.");

            const erro = new Error(
                "Webhook expirado."
            );

            erro.status = 401;
            throw erro;
        }

        console.log("✅ Timestamp válido.");
        console.log("========================================");

        // ==================================================
        // 4. VALIDAR ASSINATURA
        // ==================================================

        console.log("\n========== VALIDANDO ASSINATURA ==========");

        const assinaturaValida =
            this.#validarAssinatura(
                rawBody,
                webhookId,
                webhookTimestamp,
                webhookSignature,
                webhookSecret
            );

        if (!assinaturaValida) {

            console.log("❌ Assinatura inválida.");

            const erro = new Error(
                "Assinatura do webhook inválida."
            );

            erro.status = 401;
            throw erro;
        }

        console.log("✅ Assinatura válida.");
        console.log("==========================================");

        // ==================================================
        // 5. CONVERTER BODY
        // ==================================================

        console.log("\n========== CONVERTENDO PAYLOAD ==========");

        let payload;

        try {

            const textoBody =
                Buffer.isBuffer(rawBody)
                    ? rawBody.toString("utf8")
                    : String(rawBody);

            payload =
                JSON.parse(textoBody);

            console.log("Tipo:", typeof payload);
            console.log(
                "Chaves:",
                Object.keys(payload || {})
            );

            console.log(
                "Tipo do evento:",
                payload?.type
            );

            console.log(
                "API Version:",
                payload?.apiVersion
            );

            console.log(
                "Dev Mode:",
                payload?.devMode
            );

            console.log("=========================================");

        } catch (ex) {

            console.log(
                "❌ Erro ao converter payload:",
                ex.message
            );

            const erro = new Error(
                "Payload do webhook inválido."
            );

            erro.status = 400;
            throw erro;
        }

        // ==================================================
        // 6. VALIDAR PAYLOAD
        // ==================================================

        console.log("\n========== VALIDANDO PAYLOAD ==========");

        if (
            !payload ||
            typeof payload !== "object" ||
            !payload.type
        ) {

            console.log(
                "❌ Payload sem propriedade 'type'."
            );

            console.log(
                "Payload recebido:",
                payload
            );

            const erro = new Error(
                "Payload do webhook incompleto."
            );

            erro.status = 400;
            throw erro;
        }

        console.log(
            "Evento recebido:",
            payload.type
        );

        console.log("✅ Payload válido.");
        console.log("========================================");

        // ==================================================
        // 7. VALIDAR API VERSION
        // ==================================================

        console.log("\n========== VALIDANDO API VERSION ==========");

        if (
            payload.apiVersion &&
            payload.apiVersion !== 2
        ) {

            console.log(
                "⚠️ Evento ignorado."
            );

            console.log(
                "API Version recebida:",
                payload.apiVersion
            );

            return {
                ok: true,
                msg: "Evento ignorado: versão de API não suportada."
            };
        }

        console.log("API Version:", payload.apiVersion);
        console.log("✅ API Version aceita.");
        console.log("===========================================");

        // ==================================================
        // 8. CONECTAR AO BANCO
        // ==================================================

        console.log("\n========== CONECTANDO AO BANCO ==========");

        const banco =
            new Database();

        this.#pagamentoRepository.banco =
            banco;

        this.#aluguelRepository.banco =
            banco;

        console.log("✅ Repositories configurados.");
        console.log("=========================================");

        // ==================================================
        // 9. IDEMPOTÊNCIA
        // ==================================================

        console.log("\n========== VERIFICANDO IDEMPOTÊNCIA ==========");

        const eventoId =
            webhookId;

        console.log(
            "Evento ID:",
            eventoId
        );

        const eventoExistente =
            await this.#verificarEventoProcessado(
                banco,
                eventoId
            );

        if (eventoExistente) {

            console.log(
                "⚠️ Evento já processado."
            );

            console.log(
                "=================================================="
            );

            return {
                ok: true,
                msg: "Evento já processado."
            };
        }

        console.log(
            "✅ Evento ainda não foi processado."
        );

        console.log(
            "==============================================="
        );

        // ==================================================
        // 10. PROCESSAR EVENTO
        // ==================================================

        console.log("\n========== ANALISANDO EVENTO ==========");

        if (
            payload.type === "checkout.completed"
        ) {

            const checkout =
                payload?.data?.checkout;

            console.log(
                "Evento:",
                payload.type
            );

            console.log(
                "Checkout ID:",
                checkout?.id
            );

            console.log(
                "External ID:",
                checkout?.externalId
            );

            console.log(
                "Status:",
                checkout?.status
            );

            console.log(
                "Valor:",
                checkout?.amount
            );

            console.log(
                "Método:",
                payload?.data?.payerInformation?.method
            );

            console.log(
                "========================================"
            );

            console.log(
                "========== PROCESSANDO PAGAMENTO =========="
            );

            await this.#processarCheckoutConcluido(
                payload
            );

            console.log(
                "========== PAGAMENTO PROCESSADO =========="
            );

        } else {

            console.log(
                "⚠️ Evento não tratado:",
                payload.type
            );

            await this.#registrarEvento(
                banco,
                eventoId,
                payload.type
            );

            console.log(
                "✅ Evento ignorado registrado."
            );

            return {
                ok: true,
                msg: "Evento recebido e ignorado."
            };
        }

        // ==================================================
        // 11. REGISTRAR EVENTO
        // ==================================================

        console.log("\n========== REGISTRANDO WEBHOOK ==========");

        await this.#registrarEvento(
            banco,
            eventoId,
            payload.type
        );

        console.log(
            "✅ Webhook registrado na tb_webhook_evento."
        );

        console.log(
            "=================================================="
        );
        console.log(
            "       WEBHOOK PROCESSADO COM SUCESSO"
        );
        console.log(
            "=================================================="
        );

        return {
            ok: true,
            msg: "Webhook processado com sucesso."
        };
    }

    // ==================================================
    // VALIDAR ASSINATURA
    // ==================================================

    #validarAssinatura(
        rawBody,
        webhookId,
        webhookTimestamp,
        webhookSignature,
        webhookSecret
    ) {

        const body =
            Buffer.isBuffer(rawBody)
                ? rawBody.toString("utf8")
                : String(rawBody);

        const payloadAssinado =
            `${webhookId}.${webhookTimestamp}.${body}`;

        let chave;

        if (
            webhookSecret.startsWith("whsec_")
        ) {

            const secretBase64 =
                webhookSecret.substring(6);

            chave =
                Buffer.from(
                    secretBase64,
                    "base64"
                );

        } else {

            chave =
                Buffer.from(
                    webhookSecret,
                    "utf8"
                );
        }

        const assinaturaEsperada =
            crypto
                .createHmac(
                    "sha256",
                    chave
                )
                .update(
                    payloadAssinado,
                    "utf8"
                )
                .digest("base64");

        const assinaturas =
            webhookSignature.split(" ");

        for (
            const assinatura of assinaturas
        ) {

            const partes =
                assinatura.split(",");

            if (
                partes.length !== 2
            ) {
                continue;
            }

            const versao =
                partes[0];

            const valor =
                partes[1];

            if (
                versao !== "v1"
            ) {
                continue;
            }

            const A =
                Buffer.from(
                    assinaturaEsperada
                );

            const B =
                Buffer.from(valor);

            if (
                A.length !== B.length
            ) {
                continue;
            }

            if (
                crypto.timingSafeEqual(
                    A,
                    B
                )
            ) {

                return true;
            }
        }

        return false;
    }

    // ==================================================
    // PROCESSAR CHECKOUT CONCLUÍDO
    // ==================================================

    async #processarCheckoutConcluido(
        payload
    ) {

        console.log(
            "\n========== PROCESSANDO CHECKOUT =========="
        );

        const checkout =
            payload?.data?.checkout;

        if (!checkout) {

            console.log(
                "❌ Checkout não encontrado."
            );

            throw new Error(
                "Checkout não encontrado no payload."
            );
        }

        console.log(
            "Checkout ID:",
            checkout.id
        );

        console.log(
            "External ID:",
            checkout.externalId
        );

        console.log(
            "Status:",
            checkout.status
        );

        // ==================================================
        // VALIDAR STATUS
        // ==================================================

        if (
            checkout.status !== "PAID"
        ) {

            console.log(
                "❌ Checkout não está como PAID."
            );

            throw new Error(
                "Checkout recebido sem status PAID."
            );
        }

        console.log(
            "✅ Checkout confirmado como PAID."
        );

        const externalId =
            checkout.externalId;

        const checkoutId =
            checkout.id;

        if (
            !externalId &&
            !checkoutId
        ) {

            console.log(
                "❌ Nenhum identificador encontrado."
            );

            throw new Error(
                "Não foi possível identificar o pagamento."
            );
        }

        // ==================================================
        // BUSCAR PAGAMENTO
        // ==================================================

        console.log(
            "\n========== BUSCANDO PAGAMENTO =========="
        );

        let pagamento = null;

        if (externalId) {

            console.log(
                "Buscando pelo External ID:",
                externalId
            );

            pagamento =
                await this.#pagamentoRepository
                    .obterPorExternalId(
                        externalId
                    );

            console.log(
                "Resultado da busca por External ID:",
                pagamento
            );
        }

        if (
            (!pagamento ||
                pagamento.length === 0) &&
            checkoutId
        ) {

            console.log(
                "Pagamento não encontrado pelo External ID."
            );

            console.log(
                "Tentando pelo Checkout ID:",
                checkoutId
            );

            pagamento =
                await this.#pagamentoRepository
                    .obterPorCheckoutId(
                        checkoutId
                    );

            console.log(
                "Resultado da busca por Checkout ID:",
                pagamento
            );
        }

        if (
            !pagamento ||
            pagamento.length === 0
        ) {

            console.log(
                "❌ PAGAMENTO NÃO ENCONTRADO NO BANCO."
            );

            throw new Error(
                "Pagamento não encontrado no sistema."
            );
        }

        pagamento =
            pagamento[0];

        console.log(
            "\n========== PAGAMENTO ENCONTRADO =========="
        );

        console.log(
            "Pagamento ID:",
            pagamento.id
        );

        console.log(
            "Aluguel ID:",
            pagamento.aluguelId
        );

        console.log(
            "Gateway:",
            pagamento.gateway
        );

        console.log(
            "External ID:",
            pagamento.externalId
        );

        console.log(
            "Checkout ID:",
            pagamento.checkoutId
        );

        console.log(
            "Status atual:",
            pagamento.status
        );

        console.log(
            "=========================================="
        );

        // ==================================================
        // SE JÁ ESTIVER PAGO
        // ==================================================

        if (
            pagamento.status === "PAGO"
        ) {

            console.log(
                "⚠️ Pagamento já está marcado como PAGO."
            );

            return;
        }

        // ==================================================
        // MARCAR PAGAMENTO COMO PAGO
        // ==================================================

        console.log(
            "\n========== ATUALIZANDO TB_PAGAMENTO =========="
        );

        const pagamentoAtualizado =
            await this.#pagamentoRepository
                .marcarComoPago(
                    pagamento.id
                );

        console.log(
            "Resultado UPDATE tb_pagamento:",
            pagamentoAtualizado
        );

        if (!pagamentoAtualizado) {

            console.log(
                "⚠️ UPDATE tb_pagamento não afetou nenhuma linha."
            );

        } else {

            console.log(
                "✅ Pagamento marcado como PAGO."
            );
        }

        // ==================================================
        // MARCAR ALUGUEL COMO PAGO
        // ==================================================

        console.log(
            "\n========== ATUALIZANDO TB_ALUGUEL =========="
        );

        console.log(
            "Aluguel ID:",
            pagamento.aluguelId
        );

        const aluguelAtualizado =
            await this.#aluguelRepository
                .marcarComoPago(
                    pagamento.aluguelId
                );

        console.log(
            "Resultado UPDATE tb_aluguel:",
            aluguelAtualizado
        );

        if (!aluguelAtualizado) {

            console.log(
                "⚠️ UPDATE tb_aluguel não afetou nenhuma linha."
            );

        } else {

            console.log(
                "✅ Aluguel marcado como PAGO."
            );
        }

        console.log(
            "\n========== CHECKOUT CONCLUÍDO =========="
        );

        console.log(
            "Pagamento ID:",
            pagamento.id
        );

        console.log(
            "Aluguel ID:",
            pagamento.aluguelId
        );

        console.log(
            "Pagamento atualizado:",
            pagamentoAtualizado
        );

        console.log(
            "Aluguel atualizado:",
            aluguelAtualizado
        );

        console.log(
            "========================================"
        );
    }

    // ==================================================
    // VERIFICAR EVENTO PROCESSADO
    // ==================================================

    async #verificarEventoProcessado(
        banco,
        eventoId
    ) {

        const sql = `
            SELECT wbe_id
            FROM tb_webhook_evento
            WHERE wbe_evento_id = $1
            LIMIT 1
        `;

        const resultado =
            await banco.ExecutaComando(
                sql,
                [eventoId]
            );

        return (
            resultado &&
            resultado.length > 0
        );
    }

    // ==================================================
    // REGISTRAR EVENTO
    // ==================================================

    async #registrarEvento(
        banco,
        eventoId,
        evento
    ) {

        const sql = `
            INSERT INTO tb_webhook_evento (
                wbe_evento_id,
                wbe_evento
            )
            VALUES ($1, $2)
            ON CONFLICT (wbe_evento_id)
            DO NOTHING
        `;

        console.log(
            "Registrando evento:",
            evento
        );

        console.log(
            "Evento ID:",
            eventoId
        );

        await banco.ExecutaComandoNonQuery(
            sql,
            [
                eventoId,
                evento
            ]
        );

        console.log(
            "✅ Evento registrado."
        );
    }
}

