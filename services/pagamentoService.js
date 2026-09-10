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

        /*
         * Somente aluguéis pendentes ou atrasados
         * podem gerar pagamento.
         */
        if (
            aluguel.status !== "PENDENTE" &&
            aluguel.status !== "ATRASADO"
        ) {

            throw new Error(
                "Este aluguel não pode ser pago!"
            );
        }

        /*
         * ============================================================
         * 1. VERIFICA PAGAMENTO PENDENTE NO BANCO
         * ============================================================
         *
         * Se já existe um checkout pendente registrado localmente,
         * simplesmente reutilizamos a URL.
         */
        const ultimoPagamento =
            await this.#pagamentoRepository
                .obterUltimoPorAluguel(aluguelId);

        if (
            ultimoPagamento &&
            ultimoPagamento.length > 0 &&
            ultimoPagamento[0].status === "PENDENTE" &&
            ultimoPagamento[0].url
        ) {

            console.log(
                "♻️ Pagamento pendente encontrado no banco."
            );

            return {

                msg:
                    "Já existe um pagamento pendente para este aluguel.",

                pagamentoId:
                    ultimoPagamento[0].id,

                url:
                    ultimoPagamento[0].url
            };
        }

        /*
         * ============================================================
         * 2. EXTERNAL ID DETERMINÍSTICO
         * ============================================================
         *
         * O mesmo aluguel sempre utiliza o mesmo externalId.
         *
         * Isso permite recuperar um produto/checkout que tenha sido
         * criado na AbacatePay mas cuja resposta não tenha sido salva
         * no banco.
         */
        const externalId =
            `ALUGUEL-${aluguelId}`;

        console.log("========================================");
        console.log("🆔 EXTERNAL ID DO PAGAMENTO");
        console.log("External ID:", externalId);
        console.log("========================================");

        /*
         * ============================================================
         * 3. PROCURA O PRODUTO NA ABACATEPAY
         * ============================================================
         */
        let produto;

        try {

            console.log(
                "🔎 Procurando produto existente na AbacatePay..."
            );

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

                console.log(
                    "♻️ Produto existente encontrado:",
                    produto.id
                );
            }

        } catch (erro) {

            /*
             * O produto não existir não é um erro fatal.
             *
             * Nesse caso simplesmente seguimos para products.create().
             */
            console.log(
                "ℹ️ Produto existente não encontrado."
            );

            console.log(
                "Mensagem:",
                erro.message
            );
        }

        /*
         * ============================================================
         * 4. CRIA O PRODUTO SE NECESSÁRIO
         * ============================================================
         */
        if (!produto) {

            console.log(
                "📦 Criando produto na AbacatePay..."
            );

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

                console.log(
                    "✅ Produto criado:",
                    produto.id
                );

            } else {

                /*
                 * Existe uma possibilidade importante:
                 *
                 * A API pode ter criado o produto, mas nossa aplicação
                 * pode ter perdido a resposta.
                 *
                 * Então fazemos uma segunda tentativa de recuperação
                 * pelo externalId antes de desistir.
                 */
                console.log(
                    "⚠️ Produto não retornou normalmente."
                );

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

                        console.log(
                            "♻️ Produto recuperado após tentativa de criação:",
                            produto.id
                        );
                    }

                } catch (erroRecuperacao) {

                    console.log(
                        "❌ Não foi possível recuperar o produto."
                    );

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

        /*
         * ============================================================
         * 5. PROCURA CHECKOUT EXISTENTE
         * ============================================================
         *
         * A API de listagem de checkouts não permite filtrar
         * diretamente por externalId.
         *
         * Por isso consultamos a listagem e procuramos localmente.
         */
        let checkoutExistente = null;

        try {

            console.log(
                "🔎 Procurando checkout existente..."
            );

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

                /*
                 * Dependendo da resposta da API, os dados podem
                 * estar diretamente em data ou dentro de data.data.
                 */
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
                    "♻️ Checkout existente encontrado:",
                    checkoutExistente.id
                );

                console.log(
                    "Status:",
                    checkoutExistente.status
                );
            }

        } catch (erro) {

            /*
             * Falha na consulta não impede a tentativa de criação.
             */
            console.log(
                "⚠️ Não foi possível consultar checkouts existentes."
            );

            console.log(
                "Mensagem:",
                erro.message
            );
        }

        /*
         * ============================================================
         * 6. SE NÃO EXISTE CHECKOUT, CRIA
         * ============================================================
         */
        let checkout;

        if (checkoutExistente) {

            checkout =
                checkoutExistente;

        } else {

            console.log(
                "💳 Criando checkout na AbacatePay..."
            );

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

                console.log(
                    "✅ Checkout criado:",
                    checkout.id
                );

            } else {

                /*
                 * Assim como no produto, fazemos uma última tentativa
                 * de encontrar o checkout caso a criação tenha ocorrido
                 * mas a resposta tenha sido perdida.
                 */
                console.log(
                    "⚠️ Checkout não retornou normalmente."
                );

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
                        "❌ Não foi possível recuperar o checkout."
                    );

                    console.log(
                        "Mensagem:",
                        erroRecuperacao.message
                    );
                }
            }
        }

        /*
         * ============================================================
         * 7. VALIDA CHECKOUT
         * ============================================================
         */
        if (
            !checkout ||
            !checkout.id ||
            !checkout.url
        ) {

            throw new Error(
                "Não foi possível obter o checkout na AbacatePay."
            );
        }

        /*
         * ============================================================
         * 8. VERIFICA SE O CHECKOUT JÁ ESTÁ PAGO
         * ============================================================
         *
         * Isso é uma proteção adicional.
         */
        if (
            checkout.status === "PAID"
        ) {

            throw new Error(
                "Este checkout já foi pago."
            );
        }

        /*
         * ============================================================
         * 9. VERIFICA NOVAMENTE O BANCO
         * ============================================================
         *
         * Evita duplicidade caso duas requisições tenham chegado
         * praticamente ao mesmo tempo.
         */
        const pagamentoExistente =
            await this.#pagamentoRepository
                .obterPorExternalId(externalId);

        if (
            pagamentoExistente &&
            pagamentoExistente.length > 0
        ) {

            const pagamento =
                pagamentoExistente[0];

            /*
             * Se o pagamento local já existe, atualizamos o checkout
             * caso necessário e reutilizamos o registro.
             */
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

        /*
         * ============================================================
         * 10. SALVA PAGAMENTO NO POSTGRESQL
         * ============================================================
         */
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

        console.log("========================================");
        console.log("✅ PAGAMENTO CRIADO");
        console.log("Pagamento ID:", pagamentoId);
        console.log("Aluguel ID:", aluguelId);
        console.log("Produto ID:", produto.id);
        console.log("Checkout ID:", checkout.id);
        console.log("========================================");

        /*
         * ============================================================
         * 11. RETORNO PARA O FRONTEND
         * ============================================================
         */
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