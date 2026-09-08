import crypto from "crypto";

import Database from "../db/database.js";
import AluguelRepository from "../repositories/aluguelRepository.js";
import PagamentoRepository from "../repositories/pagamentoRepository.js";

import { AbacatePay } from "@abacatepay/sdk";

export default class PagamentoService {

    #aluguelRepository;
    #pagamentoRepository;
    #abacatePay;

    constructor() {

        this.#aluguelRepository = new AluguelRepository();

        this.#pagamentoRepository = new PagamentoRepository();

        console.log(
        "ABACATEPAY_API_KEY configurada:",
        !!process.env.ABACATEPAY_API_KEY
    );

        this.#abacatePay = AbacatePay({
            secret: process.env.ABACATEPAY_API_KEY
        });
    }

    async criarCheckout(aluguelId, usuarioId) {

        const banco = new Database();

        this.#aluguelRepository.banco = banco;

        this.#pagamentoRepository.banco = banco;

        if (!aluguelId) {
            throw new Error(
                "O id do aluguel não foi enviado!"
            );
        }

        if (!usuarioId) {
            throw new Error(
                "Usuário não identificado!"
            );
        }

        await this.#aluguelRepository.atualizarAtrasados();

        let aluguel =
            await this.#aluguelRepository.obterPorIdUsuario(
                aluguelId,
                usuarioId
            );

        if (!aluguel || aluguel.length === 0) {

            throw new Error(
                "Aluguel não encontrado!"
            );
        }

        aluguel = aluguel[0];

        if (
            aluguel.pago === "S" ||
            aluguel.status === "PAGO"
        ) {

            throw new Error(
                "Este aluguel já foi pago!"
            );
        }

        if (aluguel.status === "CANCELADO") {

            throw new Error(
                "Este aluguel está cancelado!"
            );
        }

        if (
            aluguel.status !== "PENDENTE" &&
            aluguel.status !== "ATRASADO"
        ) {

            throw new Error(
                "Este aluguel não pode ser pago!"
            );
        }

        const ultimoPagamento =
            await this.#pagamentoRepository
                .obterUltimoPorAluguel(aluguelId);

        if (
            ultimoPagamento &&
            ultimoPagamento.length > 0 &&
            ultimoPagamento[0].status === "PENDENTE"
        ) {

            return {

                msg: "Já existe um pagamento pendente para este aluguel.",

                pagamentoId:
                    ultimoPagamento[0].id,

                url:
                    ultimoPagamento[0].url
            };
        }

        const valorCentavos = Math.round(
            Number(aluguel.valor) * 100
        );

        if (
            !valorCentavos ||
            valorCentavos <= 0
        ) {

            throw new Error(
                "Valor do aluguel inválido!"
            );
        }

        /*
         * Identificador único desta tentativa de pagamento.
         */
        const externalId =
            `ALUGUEL-${aluguelId}-${crypto.randomUUID()}`;

        /*
         * Criamos um produto avulso na AbacatePay.
         *
         * O preço deve ser enviado em centavos.
         */
        const produto =
            await this.#abacatePay.products.create({

                externalId: externalId,

                name:
                    `Aluguel - parcela ${aluguel.mes}`,

                description:
                    `Pagamento do aluguel referente à parcela ${aluguel.mes}`,

                price:
                    valorCentavos,

                currency: "BRL"
            });

        if (
            !produto ||
            !produto.data ||
            !produto.data.id
        ) {

            console.log("Resposta produto:", produto);

            throw new Error(
                "Não foi possível criar o produto na AbacatePay."
            );
        }


            const checkout =
        await this.#abacatePay.checkouts.create({
            items: [
                {
                    id: produto.data.id,
                    quantity: 1
                }
            ],
            methods: ["PIX", "CARD"],
            externalId: externalId,

            returnUrl:`${process.env.FRONTEND_URL}/locacoes`,

            completionUrl:`${process.env.FRONTEND_URL}/locacoes`
        });

        if (
            !checkout ||
            !checkout.data ||
            !checkout.data.id ||
            !checkout.data.url
        ) {

            console.log("Resposta checkout:", checkout);

            throw new Error(
                "Não foi possível criar o checkout na AbacatePay."
            );
        }

        const pagamento = {

            aluguelId: aluguelId,

            gateway: "ABACATEPAY",

            externalId: externalId,

            productId: produto.data.id,

            checkoutId: checkout.data.id,

            status: "PENDENTE",

            url: checkout.data.url
        };

        const pagamentoId =
            await this.#pagamentoRepository.criar(
                pagamento
            );

        if (!pagamentoId) {

            throw new Error(
                "Checkout criado, mas não foi possível registrar o pagamento no banco."
            );
        }

        return {

            msg: "Checkout criado com sucesso!",

            pagamentoId: pagamentoId,

            url: checkout.data.url
        };
    }
}
