import Aluguel from "../entities/aluguel.js";
import Repository from "./repository.js";

export default class AluguelRepository extends Repository {

    constructor() {
        super();
    }

        async gravar(entidade, client) {

    let sql = `
        INSERT INTO tb_aluguel
            (alu_mes, alu_vencimento, alu_valor, alu_pago, alu_status, ctr_id)
        VALUES
            ($1, $2, $3, $4, $5, $6)
        RETURNING alu_id
    `;

    let valores = [
        entidade.mes,
        entidade.vencimento,
        entidade.valor,
        entidade.pago,
        entidade.status,
        entidade.contrato.id
    ];

    let result = await this.banco.ExecutaComandoLastInserted(
        sql,
        valores,
        client
    );

    entidade.id = result;

    return result;
}

    async listarPorUsuario(id) {

        const sql = `
            SELECT *
            FROM tb_aluguel a
            INNER JOIN tb_contrato c
                ON a.ctr_id = c.ctr_id
            WHERE c.usu_id = $1
        `;

        const valores = [id];

        const rows = await this.banco.ExecutaComando(sql, valores);

        const lista = [];

        for (const row of rows) {
            lista.push(Aluguel.toMap(row));
        }

        return lista;
    }

   async obterPorId(id) {

    const sql = `
        SELECT
            a.alu_id AS id,
            a.alu_mes AS mes,
            a.alu_pago AS pago,
            a.alu_status AS status,
            a.alu_valor AS valor,
            a.alu_vencimento AS vencimento,
            a.ctr_id AS contratoId,
            c.usu_id AS usuarioId
        FROM tb_aluguel a
        INNER JOIN tb_contrato c
            ON a.ctr_id = c.ctr_id
        WHERE a.alu_id = $1
    `;

    const valores = [id];

    return await this.banco.ExecutaComando(sql, valores);
}

    async marcarComoPago(id) {

    const sql = `
        UPDATE tb_aluguel
        SET
            alu_pago = 'S',
            alu_status = 'PAGO'
        WHERE
            alu_id = $1
            AND alu_pago = 'N'
            AND alu_status IN ('PENDENTE', 'ATRASADO')
    `;

    const valores = [id];

    return await this.banco.ExecutaComandoNonQuery(sql, valores);
}

    async cancelarPendentesPorContrato(contratoId, client) {

        const sql = `
            UPDATE tb_aluguel
            SET alu_status = 'CANCELADO'
            WHERE
                ctr_id = $1
                AND alu_pago = 'N'
        `;

        const valores = [contratoId];

        return await this.banco.ExecutaComandoNonQuery(sql, valores, client);
    }

    async atualizarAtrasados() {

        const sql = `
            UPDATE tb_aluguel
            SET alu_status = 'ATRASADO'
            WHERE
                alu_vencimento < CURRENT_DATE
                AND alu_pago = 'N'
                AND alu_status = 'PENDENTE'
        `;

        return await this.banco.ExecutaComandoNonQuery(sql);
    }

    async obterPorIdUsuario(id, usuarioId) {

    const sql = `
        SELECT
            a.alu_id AS id,
            a.alu_mes AS mes,
            a.alu_pago AS pago,
            a.alu_status AS status,
            a.alu_valor AS valor,
            a.alu_vencimento AS vencimento,
            a.ctr_id AS contratoId
        FROM tb_aluguel a
        INNER JOIN tb_contrato c
            ON a.ctr_id = c.ctr_id
        WHERE a.alu_id = $1
        AND c.usu_id = $2
    `;

    const valores = [id, usuarioId];

    return await this.banco.ExecutaComando(sql, valores);
}

 async listarPorContrato(contratoId, usuarioId) {

    const sql = `
        SELECT
            a.alu_id AS id,
            a.alu_mes AS mes,
            a.alu_pago AS pago,
            a.alu_status AS status,
            a.alu_valor AS valor,
            a.alu_vencimento AS vencimento,
            a.ctr_id AS contratoId
        FROM tb_aluguel a
        INNER JOIN tb_contrato c
            ON a.ctr_id = c.ctr_id
        WHERE a.ctr_id = $1
        AND c.usu_id = $2
        ORDER BY a.alu_vencimento
    `;

    const valores = [contratoId, usuarioId];

    return await this.banco.ExecutaComando(sql, valores);
}
}