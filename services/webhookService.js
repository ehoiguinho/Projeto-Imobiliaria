
import crypto from "node:crypto";
import Database from "../db/database.js";
import PagamentoRepository from "../repositories/pagamentoRepository.js";
import AluguelRepository from "../repositories/aluguelRepository.js";
const ABACATEPAY_SHARED_KEY = "t9dXRhHHo3yDEj5pVDYz0frf7q6bMKyMRmxxCPIPp3RCplBfXRxqlC6ZpiWmOqj4L63qEaeUOtrCI8P0VMUgo6iIga2ri9ogaHFs0WIIywSMg0q7RmBfybe1E5XJcfC4IW3alNqym0tXoAKkzvfEjZxV6bE0oG2zJrNNYmUCKZyV0KZ3JS8Votf9EAWWYdiDkMkpbMdPggfh1EqHlVkMiTady6jOR3hyzGEHrIz2Ret0xHKMbiqkr9HS1JhNHDX9";

export default class WebhookService {

    #pagamentoRepository;
    #aluguelRepository;

    constructor() {

        console.log("========================================");
        console.log("WEBHOOK SERVICE INICIADO");
        console.log("========================================");

        this.#pagamentoRepository = new PagamentoRepository();
        this.#aluguelRepository = new AluguelRepository();
    }

    async processarAbacatePay(
    rawBody,
    webhookSecretHeader,
    webhookSignature
) {

    console.log("\n");
    console.log("========================================");
    console.log("🚨 WEBHOOK ENTROU NO WEBHOOK SERVICE");
    console.log("========================================");

    console.log(
        "RawBody recebido:",
        !!rawBody
    );

    console.log(
        "Tipo do RawBody:",
        Buffer.isBuffer(rawBody)
            ? "Buffer"
            : typeof rawBody
    );

    console.log(
        "Tamanho do RawBody:",
        rawBody
            ? rawBody.length
            : 0
    );

    console.log(
        "x-webhook-secret recebido:",
        !!webhookSecretHeader
    );

    console.log(
        "x-webhook-signature recebido:",
        !!webhookSignature
    );

    console.log(
        "========================================"
    );


    // ========================================
    // 1. VALIDAR WEBHOOK
    // ========================================

    console.log(
        "1️⃣ Validando autenticação do webhook..."
    );

    const webhookSecret =
        process.env.ABACATEPAY_WEBHOOK_SECRET;

    console.log(
        "Secret configurada no .env:",
        !!webhookSecret
    );


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


    // ========================================
    // VALIDAR SECRET
    // ========================================

    console.log(
        "🔐 Validando x-webhook-secret..."
    );


    if (!webhookSecretHeader) {

        console.log(
            "❌ x-webhook-secret não recebido."
        );

        const erro = new Error(
            "Secret do webhook não enviada."
        );

        erro.status = 401;

        throw erro;
    }


    const secretRecebido =
        Buffer.from(webhookSecretHeader);

    const secretConfigurado =
        Buffer.from(webhookSecret);


    if (
        secretRecebido.length !==
        secretConfigurado.length
    ) {

        console.log(
            "❌ Secret do webhook inválida."
        );

        const erro = new Error(
            "Secret do webhook inválida."
        );

        erro.status = 401;

        throw erro;
    }


    const secretValido =
        crypto.timingSafeEqual(
            secretRecebido,
            secretConfigurado
        );


    if (!secretValido) {

        console.log(
            "❌ Secret do webhook inválida."
        );

        const erro = new Error(
            "Secret do webhook inválida."
        );

        erro.status = 401;

        throw erro;
    }


    console.log(
        "✅ Secret do webhook válida."
    );


    // ========================================
    // VALIDAR ASSINATURA HMAC
    // ========================================

    console.log(
        "2️⃣ Validando assinatura HMAC..."
    );


    if (!webhookSignature) {

        console.log(
            "❌ x-webhook-signature não recebida."
        );

        const erro = new Error(
            "Assinatura do webhook não enviada."
        );

        erro.status = 401;

        throw erro;
    }


    const assinaturaValida =
    this.#validarAssinatura(
        rawBody,
        webhookSignature
    );


    if (!assinaturaValida) {

        console.log(
            "❌ Assinatura HMAC inválida."
        );

        const erro = new Error(
            "Assinatura do webhook inválida."
        );

        erro.status = 401;

        throw erro;
    }


    console.log(
        "✅ Assinatura HMAC válida."
    );


    // ========================================
    // 2. CONVERTER PAYLOAD
    // ========================================

    console.log(
        "4️⃣ Convertendo payload JSON..."
    );


    let payload;


    try {

        const textoBody =
            Buffer.isBuffer(rawBody)
                ? rawBody.toString("utf8")
                : String(rawBody);


        payload =
            JSON.parse(textoBody);


        console.log(
            "✅ Payload convertido."
        );


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


    // ========================================
    // 3. VALIDAR PAYLOAD
    // ========================================

    console.log(
        "5️⃣ Validando payload..."
    );


    if (
        !payload ||
        typeof payload !== "object"
    ) {

        const erro = new Error(
            "Payload do webhook incompleto."
        );

        erro.status = 400;

        throw erro;
    }


    const tipoEvento =
        payload.event ||
        payload.type;


    console.log(
        "Evento recebido:",
        tipoEvento
    );


    console.log(
        "API Version:",
        payload.apiVersion
    );


    if (!tipoEvento) {

        const erro = new Error(
            "Payload do webhook incompleto."
        );

        erro.status = 400;

        throw erro;
    }


    if (
        payload.apiVersion &&
        Number(payload.apiVersion) !== 2
    ) {

        console.log(
            "⚠️ API Version não suportada."
        );


        return {
            ok: true,
            msg:
                "Evento ignorado: versão de API não suportada."
        };
    }


    // ========================================
    // 4. BANCO
    // ========================================

    console.log(
        "6️⃣ Configurando banco..."
    );


    const banco =
        new Database();


    this.#pagamentoRepository.banco =
        banco;


    this.#aluguelRepository.banco =
        banco;


    // ========================================
    // 5. EVENT ID
    // ========================================

    const eventoId =
        payload.id;


    console.log(
        "Evento ID:",
        eventoId
    );


    if (!eventoId) {

        const erro = new Error(
            "ID do evento não encontrado."
        );

        erro.status = 400;

        throw erro;
    }


    // ========================================
    // 6. IDEMPOTÊNCIA
    // ========================================

    console.log(
        "7️⃣ Verificando idempotência..."
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


        return {
            ok: true,
            msg:
                "Evento já processado."
        };
    }


    console.log(
        "✅ Evento ainda não processado."
    );


    // ========================================
    // 7. CHECKOUT COMPLETED
    // ========================================

    if (
        tipoEvento === "checkout.completed"
    ) {

        console.log(
            "========================================"
        );

        console.log(
            "✅ CHECKOUT.COMPLETED"
        );

        console.log(
            "========================================"
        );


        await this.#processarCheckoutConcluido(
            payload
        );


    } else {

        console.log(
            "⚠️ Evento não tratado:",
            tipoEvento
        );


        await this.#registrarEvento(
            banco,
            eventoId,
            tipoEvento
        );


        return {
            ok: true,
            msg:
                "Evento recebido e ignorado."
        };
    }


    // ========================================
    // 8. REGISTRAR EVENTO
    // ========================================

    console.log(
        "8️⃣ Registrando evento..."
    );


    await this.#registrarEvento(
        banco,
        eventoId,
        tipoEvento
    );


    console.log(
        "========================================"
    );

    console.log(
        "🎉 WEBHOOK PROCESSADO COM SUCESSO"
    );

    console.log(
        "========================================"
    );


    return {
        ok: true,
        msg:
            "Webhook processado com sucesso."
    };
}


    // ========================================
    // ASSINATURA HMAC
    // ========================================

   #validarAssinatura(
    rawBody,
    webhookSignature
) {

    const bodyBuffer =
        Buffer.isBuffer(rawBody)
            ? rawBody
            : Buffer.from(
                String(rawBody),
                "utf8"
            );

    const assinaturaEsperada =
        crypto
            .createHmac(
                "sha256",
                ABACATEPAY_SHARED_KEY
            )
            .update(bodyBuffer)
            .digest("base64");

    const recebida =
        Buffer.from(
            webhookSignature
        );

    const esperada =
        Buffer.from(
            assinaturaEsperada
        );

    if (
        recebida.length !==
        esperada.length
    ) {
        return false;
    }

    return crypto.timingSafeEqual(
        recebida,
        esperada
    );
}


    // ========================================
    // PROCESSAR CHECKOUT
    // ========================================

    async #processarCheckoutConcluido(
        payload
    ) {

        console.log(
            "========================================"
        );

        console.log(
            "💰 PROCESSANDO CHECKOUT CONCLUÍDO"
        );

        console.log(
            "========================================"
        );


        const checkout =
            payload?.data?.checkout;


        if (!checkout) {

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


        if (
            checkout.status !== "PAID"
        ) {

            throw new Error(
                "Checkout recebido sem status PAID."
            );
        }


        const externalId =
            checkout.externalId;

        const checkoutId =
            checkout.id;


        let pagamento = null;


        // ========================================
        // BUSCAR EXTERNAL ID
        // ========================================

        if (externalId) {

            console.log(
                "🔎 Buscando pelo External ID..."
            );


            pagamento =
                await this.#pagamentoRepository
                    .obterPorExternalId(
                        externalId
                    );


            console.log(
                "Resultado:",
                pagamento
            );
        }


        // ========================================
        // BUSCAR CHECKOUT ID
        // ========================================

        if (
            (!pagamento ||
                pagamento.length === 0) &&
            checkoutId
        ) {

            console.log(
                "🔎 Buscando pelo Checkout ID..."
            );


            pagamento =
                await this.#pagamentoRepository
                    .obterPorCheckoutId(
                        checkoutId
                    );


            console.log(
                "Resultado:",
                pagamento
            );
        }


        // ========================================
        // PAGAMENTO NÃO ENCONTRADO
        // ========================================

        if (
            !pagamento ||
            pagamento.length === 0
        ) {

            console.log(
                "❌ Pagamento não encontrado."
            );

            throw new Error(
                "Pagamento não encontrado no sistema."
            );
        }


        pagamento =
            pagamento[0];


        console.log(
            "========================================"
        );

        console.log(
            "💳 PAGAMENTO ENCONTRADO"
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
            "Status atual:",
            pagamento.status
        );

        console.log(
            "========================================"
        );


        if (
            pagamento.status === "PAGO"
        ) {

            console.log(
                "⚠️ Pagamento já estava PAGO."
            );

            return;
        }


        // ========================================
        // ATUALIZAR PAGAMENTO
        // ========================================

        console.log(
            "💰 Atualizando tb_pagamento..."
        );


        const pagamentoAtualizado =
            await this.#pagamentoRepository
                .marcarComoPago(
                    pagamento.id
                );


        console.log(
            "Resultado UPDATE pagamento:",
            pagamentoAtualizado
        );


        if (
            pagamentoAtualizado
        ) {

            console.log(
                "✅ Pagamento marcado como PAGO."
            );

        } else {

            console.log(
                "⚠️ Nenhuma linha atualizada em tb_pagamento."
            );
        }


        // ========================================
        // ATUALIZAR ALUGUEL
        // ========================================

        console.log(
            "🏠 Atualizando tb_aluguel..."
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


        if (
            aluguelAtualizado
        ) {

            console.log(
                "✅ Aluguel marcado como PAGO."
            );

        } else {

            console.log(
                "⚠️ Nenhuma linha atualizada em tb_aluguel."
            );
        }


        console.log(
            "========================================"
        );

        console.log(
            "🏁 PAGAMENTO FINALIZADO"
        );

        console.log(
            "========================================"
        );
    }


    // ========================================
    // VERIFICAR EVENTO
    // ========================================

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


    // ========================================
    // REGISTRAR EVENTO
    // ========================================

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


        await banco.ExecutaComandoNonQuery(
            sql,
            [
                eventoId,
                evento
            ]
        );
    }
}

