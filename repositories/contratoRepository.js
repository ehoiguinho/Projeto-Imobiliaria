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
        ORDER BY a.alu_vencimento
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
                new Usuario(
                    row["usu_id"]
                ),
                [],
                row["con_status"]
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

async cancelar(id) {
    let sql = "update tb_contrato SET con_status = 'CANCELADO' where ctr_id = $1";
    let valores = [id];

    let result = await this.banco.ExecutaComandoNonQuery(sql, valores);

    return result;
}
}