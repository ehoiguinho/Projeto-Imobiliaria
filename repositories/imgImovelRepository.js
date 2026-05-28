import Repository from "./repository.js";
import Imagem from "../entities/imagem.js";

export default class imgImovelRepository extends Repository{

     constructor(){
        super();
    }

    async gravar(entidade){
        let sql = "insert into tb_imgimovel (imv_id, img_caminho) values (?, ?)";
        let valores = [entidade.imovel.id, entidade.caminho];

        let result = await this.banco.ExecutaComandoNonQuery(sql, valores);
        entidade.id = result;

        return result;
    }

    async deletar(id) {
        let sql = "delete from tb_imgimovel where img_id = ?";
        let valores = [id];

        return await this.banco.ExecutaComandoNonQuery(sql, valores);
    }

    async listarPorImovel(idImovel) {
        let sql = "select * from tb_imgimovel where imv_id = ?";
        let valores = [idImovel];

        let rows = await this.banco.ExecutaComando(sql, valores);
        let lista = [];
        for(let row of rows) {
            lista.push(Imagem.toMap(row));
    }

    return lista;

}

    async deletarPorImovel(idImovel) {
        let sql = "delete from tb_imgimovel where imv_id = ?";
        let valores = [idImovel];

        return this.banco.ExecutaComandoNonQuery(sql, valores);
    }
}