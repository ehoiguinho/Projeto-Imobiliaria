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
        let sql = "insert into tb_imovel (imv_descricao, imv_cep, imv_endereco, imv_bairro, imv_cidade, imv_valor, imv_disponivel) VALUES ($1, $2, $3, $4, $5, $6, $7) returning imv_id";
        let valores = [entidade.descricao, entidade.cep, entidade.endereco, entidade.bairro, entidade.cidade, entidade.valor, entidade.disponivel];

        let result = await this.banco.ExecutaComandoLastInserted(sql, valores);

            entidade.id = result;

        return result;
    }

    async listar(){
        let sql = "select * from tb_imovel";
        const rows = await this.banco.ExecutaComando(sql);
        const imovel = [];

        for(let i = 0; i < rows.length; i++){
            const row = rows[i];
        imovel.push(Imovel.toMap(row));        }

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

    async listarDestaques() { 
        
        const sql = ` SELECT i.*, img.img_caminho, img.img_extensao FROM tb_imovel i LEFT JOIN LATERAL ( SELECT img_caminho, img_extensao FROM tb_imgimovel WHERE imv_id = i.imv_id ORDER BY img_id LIMIT 1 ) img ON true WHERE i.imv_disponivel = 'S' ORDER BY i.imv_id DESC LIMIT 3 `;

         const rows = await this.banco.ExecutaComando(sql);

        return rows.map((row) => ({
        ...Imovel.toMap(row).toJSON(), imagem: row.img_caminho ? { caminho: row.img_caminho, extensao: row.img_extensao }: null })); 
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

    async possuiContrato(id) {
        const sql = `
            SELECT 1
            FROM tb_contrato
            WHERE imv_id = $1
            LIMIT 1
        `;

        const rows = await this.banco.ExecutaComando(sql, [id]);

        return rows.length > 0;
}

    async deletar(id) {
    const sql = `
        DELETE FROM tb_imovel
        WHERE imv_id = $1
    `;

    return await this.banco.ExecutaComandoNonQuery(sql, [id]);
}

}