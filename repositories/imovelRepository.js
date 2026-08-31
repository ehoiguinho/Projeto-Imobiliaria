import Database from "../db/database.js";
import Imovel from "../entities/imovel.js";
import Repository from "./repository.js";


export default class ImovelRepository extends Repository{

     constructor(){
        super();
    }

  async obterId(id) {

        let sql = "select * from tb_imovel where imv_id = $1";
        let valores = [id];

        let rows = await this.banco.ExecutaComando(sql, valores);
        let lista = [];
        for(let i = 0; i < rows.length; i++) {
            let row = rows[i];
            lista.push(Imovel.toMap(row));
        }

        return lista;

    }

    async gravar(entidade){
        let sql = "insert into tb_imovel (imv_descricao, imv_cep, imv_endereco, imv_bairro, imv_cidade, imv_valor, imv_disponivel) VALUES ($1, $2, $3, $4, $5, $6, $7)";
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

    async listarDisponivel() {

        let sql = "select * from tb_imovel where imv_disponivel = 'S'";

        let rows = await this.banco.ExecutaComando(sql);
        let lista = [];
        for(let i = 0; i < rows.length; i++) {
            let row = rows[i];
            lista.push(Imovel.toMap(row));
        }

        return lista;

    }

    async alterar(entidade, client) {

    let sql = `
        update tb_imovel 
        set imv_descricao = $1, 
            imv_endereco = $2, 
            imv_cep = $3, 
            imv_bairro = $4,
            imv_cidade = $5,
            imv_valor = $6, 
            imv_disponivel = $7
        where imv_id = $8
    `;

    let valores = [
        entidade.descricao,
        entidade.endereco,
        entidade.cep,
        entidade.bairro,
        entidade.cidade,
        entidade.valor,
        entidade.disponivel,
        entidade.id
    ];

    return await this.banco.ExecutaComandoNonQuery(
        sql,
        valores,
        client
    );
}

    async deletar(id){
        let sql = "delete from tb_imovel where imv_id = $1";
        const params = [id];
        let result = await this.banco.ExecutaComandoNonQuery(sql, params);

        return result;
    }

    async liberar(id) {
    let sql = "update tb_imovel set imv_disponivel = 'S' where imv_id = $1 ";
    let valores = [id];

    let result = await this.banco.ExecutaComandoNonQuery(sql, valores);

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