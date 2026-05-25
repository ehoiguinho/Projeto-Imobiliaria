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


    async listarPorUsuario(id){
        let sql = "select * from tb_contrato c inner join tb_imovel i on c.imv_id = i.imv_id inner join tb_aluguel a on c.ctr_id = a.ctr_id where c.usu_id = ?";
        let rows = await this.banco.ExecutaComando(sql, [id]);

        let lista = [];
        
        for(let i = 0;i < rows.length; i++){
            let row = rows[i];
            let id = row["ctr_id"];
            let listaAlugueis = [];

            for(let j =0;j< rows.length; j++){
                if(id == rows[j]["ctr_id"]){
                    j++;
                    listaAlugueis.push(new Aluguel(rows[j]["alu_id"],
                        rows[j]["alu_mes"], rows[j]["alu_vencimento"],
                        rows[j]["alu_valor"], rows[j]["alu_pago"]));
                }
            }
                lista.push(new Contrato(row["ctr_id"],
                    new Imovel(row["imv_id"], row["imv_descricao"],
                        row["imv_endereco"]),
                    new Usuario(row["usu_id"], listaAlugueis))
                )
            
        }

        return lista;

    }

    async gravar(entidade){
        let sql = "insert into tb_contrato (imv_id, usu_id) VALUES (?, ?)";
        let valores = [entidade.imovel.id, entidade.usuario.id];
        const result = await this.banco.ExecutaComandoLastInserted(sql, valores);

           if(result) {
            entidade.id = result;

            return true;
        }

        return result;
    }

    async obterPorId(id) {
    let sql = "select c.ctr_id, c.imv_id, c.usu_id, c.con_status from tb_contrato c where c.ctr_id = ?";
    let valores = [id];

    let rows = await this.banco.ExecutaComando(sql, valores);

    return rows;
}

async cancelar(id) {
    let sql = "update tb_contrato SET con_status = 'CANCELADO' where ctr_id = ?";
    let valores = [id];

    let result = await this.banco.ExecutaComandoNonQuery(sql, valores);

    return result;
}
}