import Repository from "./repository.js";

export default class PagamentoRepository extends Repository {

    constructor() {
        super();
    }

    async criar(entidade) {

        const sql = `
            INSERT INTO tb_pagamento (
                alu_id,
                pag_gateway,
                pag_external_id,
                pag_product_id,
                pag_checkout_id,
                pag_status,
                pag_url
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING pag_id
        `;

        const valores = [
            entidade.aluguelId,
            entidade.gateway,
            entidade.externalId,
            entidade.productId,
            entidade.checkoutId,
            entidade.status,
            entidade.url
        ];

        const result = await this.banco.ExecutaComandoLastInserted(
            sql,
            valores
        );

        entidade.id = result;

        return result;
    }

    async obterPorId(id) {

        const sql = `
            SELECT
                pag_id AS id,
                alu_id AS aluguelId,
                pag_gateway AS gateway,
                pag_external_id AS externalId,
                pag_product_id AS productId,
                pag_checkout_id AS checkoutId,
                pag_status AS status,
                pag_url AS url,
                pag_criado_em AS criadoEm,
                pag_pago_em AS pagoEm
            FROM tb_pagamento
            WHERE pag_id = $1
        `;

        const valores = [id];

        return await this.banco.ExecutaComando(sql, valores);
    }

    async obterPorExternalId(externalId) {

        const sql = `
            SELECT
                pag_id AS id,
                alu_id AS aluguelId,
                pag_gateway AS gateway,
                pag_external_id AS externalId,
                pag_product_id AS productId,
                pag_checkout_id AS checkoutId,
                pag_status AS status,
                pag_url AS url,
                pag_criado_em AS criadoEm,
                pag_pago_em AS pagoEm
            FROM tb_pagamento
            WHERE pag_external_id = $1
        `;

        const valores = [externalId];

        return await this.banco.ExecutaComando(sql, valores);
    }

    async obterPorCheckoutId(checkoutId) {

        const sql = `
            SELECT
                pag_id AS id,
                alu_id AS aluguelId,
                pag_gateway AS gateway,
                pag_external_id AS externalId,
                pag_product_id AS productId,
                pag_checkout_id AS checkoutId,
                pag_status AS status,
                pag_url AS url,
                pag_criado_em AS criadoEm,
                pag_pago_em AS pagoEm
            FROM tb_pagamento
            WHERE pag_checkout_id = $1
        `;

        const valores = [checkoutId];

        return await this.banco.ExecutaComando(sql, valores);
    }

    async atualizarCheckout(id, checkoutId, url) {

        const sql = `
            UPDATE tb_pagamento
            SET
                pag_checkout_id = $1,
                pag_url = $2
            WHERE pag_id = $3
        `;

        const valores = [
            checkoutId,
            url,
            id
        ];

        return await this.banco.ExecutaComandoNonQuery(
            sql,
            valores
        );
    }

    async atualizarStatus(id, status) {

        const sql = `
            UPDATE tb_pagamento
            SET
                pag_status = $1
            WHERE pag_id = $2
        `;

        const valores = [
            status,
            id
        ];

        return await this.banco.ExecutaComandoNonQuery(
            sql,
            valores
        );
    }

    async marcarComoPago(id) {

        const sql = `
            UPDATE tb_pagamento
            SET
                pag_status = 'PAGO',
                pag_pago_em = CURRENT_TIMESTAMP
            WHERE
                pag_id = $1
                AND pag_status <> 'PAGO'
        `;

        const valores = [id];

        return await this.banco.ExecutaComandoNonQuery(
            sql,
            valores
        );
    }

    async listarPorAluguel(aluguelId) {

        const sql = `
            SELECT
                pag_id AS id,
                alu_id AS aluguelId,
                pag_gateway AS gateway,
                pag_external_id AS externalId,
                pag_product_id AS productId,
                pag_checkout_id AS checkoutId,
                pag_status AS status,
                pag_url AS url,
                pag_criado_em AS criadoEm,
                pag_pago_em AS pagoEm
            FROM tb_pagamento
            WHERE alu_id = $1
            ORDER BY pag_criado_em DESC
        `;

        const valores = [aluguelId];

        return await this.banco.ExecutaComando(
            sql,
            valores
        );
    }

    async obterUltimoPorAluguel(aluguelId) {

        const sql = `
            SELECT
                pag_id AS id,
                alu_id AS aluguelId,
                pag_gateway AS gateway,
                pag_external_id AS externalId,
                pag_product_id AS productId,
                pag_checkout_id AS checkoutId,
                pag_status AS status,
                pag_url AS url,
                pag_criado_em AS criadoEm,
                pag_pago_em AS pagoEm
            FROM tb_pagamento
            WHERE alu_id = $1
            ORDER BY pag_criado_em DESC
            LIMIT 1
        `;

        const valores = [aluguelId];

        return await this.banco.ExecutaComando(
            sql,
            valores
        );
    }
}
