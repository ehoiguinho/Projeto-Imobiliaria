
import crypto from "node:crypto";
import Database from "../db/database.js";
import PagamentoRepository from "../repositories/pagamentoRepository.js";
import AluguelRepository from "../repositories/aluguelRepository.js";
const ABACATEPAY_SHARED_KEY = "t9dXRhHHo3yDEj5pVDYz0frf7q6bMKyMRmxxCPIPp3RCplBfXRxqlC6ZpiWmOqj4L63qEaeUOtrCI8P0VMUgo6iIga2ri9ogaHFs0WIIywSMg0q7RmBfybe1E5XJcfC4IW3alNqym0tXoAKkzvfEjZxV6bE0oG2zJrNNYmUCKZyV0KZ3JS8Votf9EAWWYdiDkMkpbMdPggfh1EqHlVkMiTady6jOR3hyzGEHrIz2Ret0xHKMbiqkr9HS1JhNHDX9";

export default class WebhookService {

    #pagamentoRepository;
    #aluguelRepository;

    constructor() {

        this.#pagamentoRepository = new PagamentoRepository();
        this.#aluguelRepository = new AluguelRepository();
    }

    async processarAbacatePay(rawBody, webhookSecretHeader, webhookSignature) {

    const webhookSecret =
        process.env.ABACATEPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {

        const erro = new Error(
            "ABACATEPAY_WEBHOOK_SECRET não configurada."
        );

        erro.status = 500;

        throw erro;
    }

    if (!webhookSecretHeader) {

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

        const erro = new Error(
            "Secret do webhook inválida."
        );

        erro.status = 401;

        throw erro;
    }


    if (!webhookSignature) {

        const erro = new Error(
            "Assinatura do webhook não enviada."
        );

        erro.status = 401;

        throw erro;
    }


    const assinaturaValida = this.#validarAssinatura(rawBody, webhookSignature);

    if (!assinaturaValida) {

        const erro = new Error(
            "Assinatura do webhook inválida."
        );

        erro.status = 401;

        throw erro;
    }

    let payload;

    try {

        const textoBody = Buffer.isBuffer(rawBody) ? rawBody.toString("utf8") : String(rawBody);

        payload =
            JSON.parse(textoBody);

    } catch (ex) {

        const erro = new Error(
            "Payload do webhook inválido."
        );

        erro.status = 400;

        throw erro;
    }

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


    const tipoEvento = payload.event || payload.type;

    if (!tipoEvento) {

        const erro = new Error(
            "Payload do webhook incompleto."
        );

        erro.status = 400;

        throw erro;
    }

    if ( payload.apiVersion && Number(payload.apiVersion) !== 2) {

        return {
            ok: true,
            msg:
                "Evento ignorado: versão de API não suportada."
        };
    }


    const banco =
        new Database();


    this.#pagamentoRepository.banco = banco;
    this.#aluguelRepository.banco = banco;

    const eventoId =
        payload.id;


    if (!eventoId) {

        const erro = new Error(
            "ID do evento não encontrado."
        );

        erro.status = 400;

        throw erro;
    }

    const eventoExistente = await this.#verificarEventoProcessado(banco, eventoId);

    if (eventoExistente) {

        return {
            ok: true,
            msg:
                "Evento já processado."
        };
    }

    if (tipoEvento === "checkout.completed") {

        await this.#processarCheckoutConcluido(
            payload
        );

    } else {

        await this.#registrarEvento(banco, eventoId, tipoEvento);

        return {
            ok: true,
            msg:
                "Evento recebido e ignorado."
        };
    }


    await this.#registrarEvento(banco, eventoId, tipoEvento);

    return {
        ok: true,
        msg:
            "Webhook processado com sucesso."
    };
}

   #validarAssinatura(rawBody, webhookSignature) {

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

    async #processarCheckoutConcluido(payload) {

        const checkout =
            payload?.data?.checkout;

        if (!checkout) {

            throw new Error(
                "Checkout não encontrado no payload."
            );
        }

        if (
            checkout.status !== "PAID"
        ) {

            throw new Error(
                "Checkout recebido sem status PAID."
            );
        }

        const externalId = checkout.externalId;
        const checkoutId = checkout.id;

        let pagamento = null;


        if (externalId) {

            pagamento = await this.#pagamentoRepository.obterPorExternalId(externalId);
            
        }

        if (
            (!pagamento ||
                pagamento.length === 0) &&
            checkoutId
        ) {

            pagamento = await this.#pagamentoRepository.obterPorCheckoutId(checkoutId);

        }

        if (!pagamento || pagamento.length === 0) {
            throw new Error(
                "Pagamento não encontrado no sistema."
            );
        }

        pagamento = pagamento[0];


        if (pagamento.status === "PAGO") {

            return;
        }


        const pagamentoAtualizado = await this.#pagamentoRepository.marcarComoPago(pagamento.id);

        if (
            pagamentoAtualizado
        ) {

            console.log(
                "Pagamento marcado como PAGO."
            );

        } else {

            console.log(
                "Nenhuma linha atualizada em tb_pagamento."
            );
        }

        const aluguelAtualizado = await this.#aluguelRepository.marcarComoPago(pagamento.aluguelId);

        console.log(
            "Resultado UPDATE tb_aluguel:",
            aluguelAtualizado
        );

        if (aluguelAtualizado) {

            console.log(
                "Aluguel marcado como PAGO."
            );

        } else {

            console.log(
                "Nenhuma linha atualizada em tb_aluguel."
            );
        }


        
    }


  
    async #verificarEventoProcessado(banco, eventoId) {

        const sql = `
            SELECT wbe_id
            FROM tb_webhook_evento
            WHERE wbe_evento_id = $1
            LIMIT 1
        `;


        const resultado =await banco.ExecutaComando(sql, [eventoId]);

        return (resultado &&resultado.length > 0);
    }

    async #registrarEvento(banco, eventoId, evento) {

        const sql = `
            INSERT INTO tb_webhook_evento (
                wbe_evento_id,
                wbe_evento
            )
            VALUES ($1, $2)
            ON CONFLICT (wbe_evento_id)
            DO NOTHING
        `;


        await banco.ExecutaComandoNonQuery(sql, [eventoId,evento]);
    }
}

