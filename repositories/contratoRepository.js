import Database from "../db/database";


export default class ContratoRepository{

    #banco;

    constructor(){
        this.#banco = new Database();
    }

    async gravar(entidade){
        let sql = "insert into tb_contrato (imv_id, usu_id) VALUES (?, ?)";
        let valores = [entidade.imovel.id, entidade.usuario.id];
        
        const result = await this.#banco.ExecutaComandoNonQuery(sql, valores);

        entidade.id = result;

        return result;
    }
}