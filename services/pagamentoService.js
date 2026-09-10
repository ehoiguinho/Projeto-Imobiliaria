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

        this.#abacatePay = AbacatePay({secret: process.env.ABACATEPAY_API_KEY});
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

        /*
         * Verifica se o aluguel já foi pago.
         */
        if (
            aluguel.pago === "S" ||
            aluguel.status === "PAGO"
        ) {

            throw new Error(
                "Este aluguel já foi pago!"
            );
        }

        /*
         * Aluguel cancelado não pode ser pago.
         */
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
            ultimoPagamento[0].status === "PENDENTE" &&
            ultimoPagamento[0].url
        ) {

            return {

                msg:
                    "Já existe um pagamento pendente para este aluguel.",

                pagamentoId:
                    ultimoPagamento[0].id,

                url:
                    ultimoPagamento[0].url
            };
        }

      
        const externalId =
            `ALUGUEL-${aluguelId}`;

        let produto;

        try {

            const respostaProduto =
                await this.#abacatePay.products.get({
                    externalId: externalId
                });

            if (
                respostaProduto &&
                respostaProduto.success &&
                respostaProduto.data &&
                respostaProduto.data.id
            ) {

                produto = respostaProduto.data;
            }

        } catch (erro) {
            console.log(
                "Mensagem:",
                erro.message
            );
        }

      
        if (!produto) {

            const respostaProduto =
                await this.#abacatePay.products.create({

                    externalId: externalId,

                    name:
                        `Aluguel - parcela ${aluguel.mes}`,

                    description:
                        `Pagamento do aluguel referente à parcela ${aluguel.mes}`,

                    price:
                        Math.round(
                            Number(aluguel.valor) * 100
                        ),

                    currency:
                        "BRL"
                });

            /*
             * Produto criado normalmente.
             */
            if (
                respostaProduto &&
                respostaProduto.success &&
                respostaProduto.data &&
                respostaProduto.data.id
            ) {

                produto =
                    respostaProduto.data;

            } else {
                console.log(
                    "Resposta produto:",
                    respostaProduto
                );

                try {

                    const produtoExistente =
                        await this.#abacatePay.products.get({
                            externalId: externalId
                        });

                    if (
                        produtoExistente &&
                        produtoExistente.success &&
                        produtoExistente.data &&
                        produtoExistente.data.id
                    ) {

                        produto =
                            produtoExistente.data;
                    }

                } catch (erroRecuperacao) {

                    console.log(
                        "Mensagem:",
                        erroRecuperacao.message
                    );
                }
            }
        }

        if (
            !produto ||
            !produto.id
        ) {

            throw new Error(
                "Não foi possível obter o produto na AbacatePay."
            );
        }

        
        let checkoutExistente = null;

        try {

            const respostaCheckouts =
                await this.#abacatePay.checkouts.list({
                    page: 1,
                    limit: 100
                });

            if (
                respostaCheckouts &&
                respostaCheckouts.success &&
                respostaCheckouts.data
            ) {

                
                let checkouts =
                    Array.isArray(respostaCheckouts.data)
                        ? respostaCheckouts.data
                        : respostaCheckouts.data.data;

                if (Array.isArray(checkouts)) {

                    checkoutExistente =
                        checkouts.find(
                            checkout =>
                                checkout.externalId === externalId
                        );
                }
            }

            if (checkoutExistente) {

                console.log(
                    "Status:",
                    checkoutExistente.status
                );
            }

        } catch (erro) {

            console.log(
                "Mensagem:",
                erro.message
            );
        }

        let checkout;

        if (checkoutExistente) {

            checkout =
                checkoutExistente;

        } else {

            const respostaCheckout =
                await this.#abacatePay.checkouts.create({

                    items: [
                        {
                            id: produto.id,
                            quantity: 1
                        }
                    ],

                    methods: [
                        "PIX",
                        "CARD"
                    ],

                    externalId:
                        externalId,

                    returnUrl:
                        `${process.env.FRONTEND_URL}/locacoes`,

                    completionUrl:
                        `${process.env.FRONTEND_URL}/locacoes`
                });

            if (
                respostaCheckout &&
                respostaCheckout.success &&
                respostaCheckout.data &&
                respostaCheckout.data.id &&
                respostaCheckout.data.url
            ) {

                checkout =
                    respostaCheckout.data;

            } else {

                console.log(
                    "Resposta checkout:",
                    respostaCheckout
                );

                try {

                    const segundaConsulta =
                        await this.#abacatePay.checkouts.list({
                            page: 1,
                            limit: 100
                        });

                    if (
                        segundaConsulta &&
                        segundaConsulta.success &&
                        segundaConsulta.data
                    ) {

                        let checkouts =
                            Array.isArray(segundaConsulta.data)
                                ? segundaConsulta.data
                                : segundaConsulta.data.data;

                        if (Array.isArray(checkouts)) {

                            checkout =
                                checkouts.find(
                                    item =>
                                        item.externalId === externalId
                                );
                        }
                    }

                } catch (erroRecuperacao) {

                    console.log(
                        "Mensagem:",
                        erroRecuperacao.message
                    );
                }
            }
        }

        if (
            !checkout ||
            !checkout.id ||
            !checkout.url
        ) {

            throw new Error(
                "Não foi possível obter o checkout na AbacatePay."
            );
        }

      
        if (
            checkout.status === "PAID"
        ) {

            throw new Error(
                "Este checkout já foi pago."
            );
        }

      
        const pagamentoExistente =
            await this.#pagamentoRepository
                .obterPorExternalId(externalId);

        if (
            pagamentoExistente &&
            pagamentoExistente.length > 0
        ) {

            const pagamento =
                pagamentoExistente[0];

            if (
                pagamento.checkoutId !== checkout.id ||
                pagamento.url !== checkout.url
            ) {

                await this.#pagamentoRepository
                    .atualizarCheckout(
                        pagamento.id,
                        checkout.id,
                        checkout.url
                    );
            }

            return {

                msg:
                    "Pagamento já existente.",

                pagamentoId:
                    pagamento.id,

                url:
                    checkout.url
            };
        }

        
        const pagamento = {

            aluguelId:
                aluguelId,

            gateway:
                "ABACATEPAY",

            externalId:
                externalId,

            productId:
                produto.id,

            checkoutId:
                checkout.id,

            status:
                "PENDENTE",

            url:
                checkout.url
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

            msg:
                "Checkout criado com sucesso!",

            pagamentoId:
                pagamentoId,

            url:
                checkout.url
        };
    }
}