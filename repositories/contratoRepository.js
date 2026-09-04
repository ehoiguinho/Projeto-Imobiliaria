import Database from "../db/database.js";
import Aluguel from "../entities/aluguel.js";
import Contrato from "../entities/contrato.js";
import Imovel from "../entities/imovel.js";
import Usuario from "../entities/usuario.js";
import Repository from "./repository.js";


export default class ContratoRepository extends Repository{

     constructor(){
        super();
    }


    async listarPorUsuario(id) {

    let sql = `
        SELECT
            c.ctr_id,
            c.imv_id,
            c.usu_id,
            c.con_status,

            i.imv_descricao,
            i.imv_endereco,

            a.alu_id,
            a.alu_mes,
            a.alu_vencimento,
            a.alu_valor,
            a.alu_pago,
            a.alu_status

        FROM tb_contrato c
        INNER JOIN tb_imovel i
            ON c.imv_id = i.imv_id
        INNER JOIN tb_aluguel a
            ON c.ctr_id = a.ctr_id
        WHERE c.usu_id = $1
        ORDER BY c.ctr_id ASC, a.alu_vencimento ASC
    `;

    let rows = await this.banco.ExecutaComando(sql, [id]);

    let lista = [];

    for (let row of rows) {

        let contrato = lista.find(
            c => c.id === row["ctr_id"]
        );

        if (!contrato) {

            contrato = new Contrato(
                row["ctr_id"],
                new Imovel(
                    row["imv_id"],
                    row["imv_descricao"],
                    row["imv_endereco"]
                ),
                new Usuario(row["usu_id"]),
                row["con_status"],
                []
            );

            lista.push(contrato);
        }

        contrato.alugueis.push(
            new Aluguel(
                row["alu_id"],
                row["alu_mes"],
                row["alu_vencimento"],
                row["alu_valor"],
                row["alu_pago"],
                row["alu_status"]
            )
        );
    }

    return lista;
}


async obterPorIdUsuario(contratoId, usuarioId) {

    const sql = `
        SELECT
            c.ctr_id,
            c.imv_id,
            c.usu_id,
            c.con_status,

            i.imv_descricao,
            i.imv_cep,
            i.imv_endereco,
            i.imv_bairro,
            i.imv_cidade,
            i.imv_valor,
            i.imv_disponivel,

            a.alu_id,
            a.alu_mes,
            a.alu_vencimento,
            a.alu_valor,
            a.alu_pago,
            a.alu_status

        FROM tb_contrato c

        INNER JOIN tb_imovel i
            ON c.imv_id = i.imv_id

        LEFT JOIN tb_aluguel a
            ON c.ctr_id = a.ctr_id

        WHERE c.ctr_id = $1
        AND c.usu_id = $2

        ORDER BY a.alu_vencimento
    `;

    const valores = [contratoId, usuarioId];

    const rows = await this.banco.ExecutaComando(sql, valores);

    if (rows.length === 0) {
        return null;
    }

    const row = rows[0];

    const imovel = new Imovel(
        row.imv_id,
        row.imv_descricao,
        row.imv_cep,
        row.imv_endereco,
        row.imv_bairro,
        row.imv_cidade,
        row.imv_valor,
        row.imv_disponivel
    );

    const usuario = new Usuario();

    usuario.id = row.usu_id;

    const alugueis = [];

    for (const row of rows) {

        if (row.alu_id) {

            const aluguel = new Aluguel(
                row.alu_id,
                row.alu_mes,
                row.alu_vencimento,
                row.alu_valor,
                row.alu_pago,
                null,
                row.alu_status
            );

            alugueis.push(aluguel);
        }
    }

    const contrato = new Contrato(
        row.ctr_id,
        imovel,
        usuario,
        row.con_status,
        alugueis
    );

    return contrato;
}

async gravar(entidade, client) {

    let sql = `
        insert into tb_contrato (imv_id, usu_id)
        VALUES ($1, $2)
        returning ctr_id
    `;

    let valores = [
        entidade.imovel.id,
        entidade.usuario.id
    ];

    const result = await this.banco.ExecutaComando(
        sql,
        valores,
        client
    );

    if (result.length > 0) {
        entidade.id = result[0].ctr_id;
        return true;
    }

    return false;
}

    async obterPorId(id) {
    let sql = "select c.ctr_id, c.imv_id, c.usu_id, c.con_status from tb_contrato c where c.ctr_id = $1";
    let valores = [id];

    let rows = await this.banco.ExecutaComando(sql, valores);

    return rows;
}

async cancelar(id, client) {
    let sql = "update tb_contrato SET con_status = 'CANCELADO' where ctr_id = $1";
    let valores = [id];

    let result = await this.banco.ExecutaComandoNonQuery(sql, valores, client);

    return result;
}
}