import Database from "../db/database.js";
import Aluguel from "../entities/aluguel.js";
import Repository from "./repository.js";

export default class AluguelRepository extends Repository{ 

    
    constructor(){
        super();
    }


    async gravar(entidade){
        let sql = "insert into tb_aluguel (alu_mes, alu_vencimento, alu_valor, alu_pago, ctr_id) VALUES (?, ?, ?, ?, ?)";
        let valores = [entidade.mes, entidade.vencimento, entidade.valor, entidade.pago, entidade.contrato.id];

        let result = await this.banco.ExecutaComandoNonQuery(sql, valores);

        entidade.id = result;

        return result;
    }

    async listarPorUsuario(id){
        let sql = "select * from tb_aluguel a inner join tb_contrato c on a.ctr_id = c.ctr_id where c.ctr_id = ?";
        let valores = [id];

        const rows = await this.banco.ExecutaComando(sql, valores);

        let lista = [];
        for(let i = 0; i< rows.length; i++){
            lista.push(Aluguel.toMap(rows[i]))
        }

        return lista;
    }

    async obterPorId(id){
    let sql = "select  alu_id as id, alu_mes as mes, alu_pago as pago, alu_status as status, alu_valor as valor, alu_vencimento as vencimento, ctr_id as contratoId from tb_aluguel where alu_id = ? ";
    let valores = [id];

    return await this.banco.ExecutaComando(sql, valores);
}

    async marcarComoPago(id){
    let sql = "update tb_aluguel set alu_pago = 'S', alu_status = 'PAGO' where alu_id = ? and alu_pago = 'N' and alu_status = 'PENDENTE' ";
    let valores = [id];

    let result = await this.banco.ExecutaComandoNonQuery(sql, valores);

    return result;
}

    async cancelarPendentesPorContrato(contratoId) {
    let sql = " update tb_aluguel set alu_status = 'CANCELADO' where ctr_id = ? and alu_pago = 'N' ";

    let valores = [contratoId];

    let result = await this.banco.ExecutaComandoNonQuery(sql, valores);

    return result;
}

    async atualizarAtrasados(){
    let sql = "update tb_aluguel SET alu_status = 'ATRASADO' where alu_vencimento < CURDATE() and alu_pago = 'N' and alu_status = 'PENDENTE' ";

    let result = await this.banco.ExecutaComandoNonQuery(sql);

    return result;
}

async listarPorContrato(contratoId){
    let sql = "select alu_id as id, alu_mes as mes, alu_pago as pago, alu_status as status, alu_valor as valor, alu_vencimento as vencimento, ctr_id as contratoId from tb_aluguel where ctr_id = ? order by  alu_vencimento";
    let valores = [contratoId];

    let result = await this.banco.ExecutaComando(sql, valores);
    
    return result;
}

}