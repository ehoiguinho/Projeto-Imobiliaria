import Repository from "./repository.js";
import Imagem from "../entities/imagem.js";

export default class imgImovelRepository extends Repository {

    constructor() {
        super();
    }

    async gravar(entidade) {

        const sql = `
            INSERT INTO tb_imgimovel
                (imv_id, img_caminho, img_extensao)
            VALUES
                ($1, $2, $3)
            RETURNING img_id
        `;

        const valores = [
            entidade.imovel.id,
            entidade.caminho,
            entidade.extensao
        ];

        const result = await this.banco.ExecutaComando(sql, valores);

        const id = result[0].img_id;

        entidade.id = id;

        return id;
    }

    async deletar(id) {

        const sql = `
            DELETE FROM tb_imgimovel
            WHERE img_id = $1
        `;

        const valores = [id];

        return await this.banco.ExecutaComandoNonQuery(sql, valores);
    }

    async listarPorImovel(idImovel) {

        const sql = `
            SELECT *
            FROM tb_imgimovel
            WHERE imv_id = $1
        `;

        const valores = [idImovel];

        const rows = await this.banco.ExecutaComando(sql, valores);

        const lista = [];

        for (const row of rows) {
            lista.push(Imagem.toMap(row));
        }

        return lista;
    }

    async deletarPorImovel(idImovel) {

        const sql = `
            DELETE FROM tb_imgimovel
            WHERE imv_id = $1
        `;

        const valores = [idImovel];

        return await this.banco.ExecutaComandoNonQuery(sql, valores);
    }
}