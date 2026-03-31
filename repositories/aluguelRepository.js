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

        const rows = await this.banco.ExecutaComandoNonQuery(sql, valores);

        let lista = [];
        for(let i = 0; i< rows.length; i++){
            lista.push(Aluguel.toMap(rows[i]))
        }

        return lista;
    }

    async marcarComoPago(id){
        let sql = "update tb_aluguel set alu_pago = 'S' where alu_id = ?";
        let valores = [id];

        const result = await this.banco.ExecutaComandoNonQuery(sql, valores);

        return result;
    }
}