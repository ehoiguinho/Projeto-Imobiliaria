import Database from "../db/database.js";
import Perfil from "../entities/perfil.js";
import Repository from "./repository.js";


export default class PerfilRepository extends Repository{

    constructor(){
        super();
    }

    async listar(){
        let sql = "select * from tb_perfil";

        const rows = await this.banco.ExecutaComando(sql);
        const lista = [];

        for(const row of rows){
            lista.push(new Perfil(row["per_id"], row["per_descricao"]));
        }
        return lista;
    }
}