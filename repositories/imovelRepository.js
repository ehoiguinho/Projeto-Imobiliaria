import Database from "../db/database.js";
import Imovel from "../entities/imovel.js";
import Repository from "./repository.js";


export default class ImovelRepository extends Repository{

     constructor(){
        super();
    }

    async obterId(id){
        let sql = "select * from tb_imovel where imv_id = ?"
        let params = [id];
        const rows = await this.banco.ExecutaComando(sql, params);
        if(rows.length > 0){
            const row = rows[0];
            const imovel = this.toMap(row);
            return imovel;
        }

        return null;
    }

    async gravar(entidade){
        let sql = "insert into tb_imovel (imv_descricao, imv_cep, imv_endereco, imv_bairro, imv_cidade, imv_valor, imv_disponivel) VALUES (?, ?, ?, ?, ?, ?, ?)";
        let valores = [entidade.descricao, entidade.cep, entidade.endereco, entidade.bairro, entidade.cidade, entidade.valor, entidade.disponivel];

        let result = await this.banco.ExecutaComandoNonQuery(sql, valores);
        entidade.id = result;

        return result;
    }

    async listar(){
        let sql = "select * from tb_imovel";
        const rows = await this.banco.ExecutaComando(sql);
        const imovel = [];

        for(let i = 0; i < rows.length; i++){
            const row = rows[i];
            imovel.push(this.toMap(row));
        }

        return imovel;
    }

    async alterar(entidade) {

        let sql = `update tb_imovel set imv_descricao = ?, 
                                        imv_endereco = ?, 
                                        imv_cep = ?, 
                                        imv_bairro = ?,
                                        imv_cidade = ?,
                                        imv_valor = ?, 
                                        imv_disponivel = ?
                    where imv_id = ?`;

        let valores = [entidade.descricao, entidade.endereco, entidade.cep,
            entidade.bairro, entidade.cidade, entidade.valor, 
            entidade.disponivel, entidade.id];
            
        let result = await this.banco.ExecutaComandoNonQuery(sql, valores);

        return result;
    }

    async deletar(id){
        let sql = "delete from tb_imovel where imv_id = ?";
        const params = [id];
        let result = await this.banco.ExecutaComandoNonQuery(sql, params);

        return result;
    }

    toMap(row){
        let imovel = new Imovel();
        imovel.id = row["imv_id"];
        imovel.descricao = row["imv_descricao"];
        imovel.cep = row["imv_cep"];
        imovel.endereco = row["imv_endereco"];
        imovel.bairro = row["imv_bairro"];
        imovel.cidade = row["imv_cidade"];
        imovel.valor = row["imv_valor"];
        imovel.disponivel = row["imv_disponivel"];

        return imovel;

    }
}