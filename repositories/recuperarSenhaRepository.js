import Repository from "./repository.js";

export default class RecuperarSenhaRepository extends Repository {

    constructor() {
        super();
    }

    async criar(usuarioId, token, expiraEm) {

        const sql = `
            INSERT INTO tb_recuperar_senha
                (usu_id, rec_token, rec_expira_em)
            VALUES
                ($1, $2, $3)
            RETURNING rec_id
        `;

        const valores = [
            usuarioId,
            token,
            expiraEm
        ];

        const rows = await this.banco.ExecutaComando(sql, valores);

        return rows.length > 0 ? rows[0].rec_id : null;
    }

    async buscarToken(token) {

        const sql = `
            SELECT
                r.rec_id,
                r.usu_id,
                r.rec_token,
                r.rec_expira_em
            FROM tb_recuperar_senha r
            WHERE r.rec_token = $1
        `;

        const rows = await this.banco.ExecutaComando(sql, [token]);

        return rows.length > 0 ? rows[0] : null;
    }

    async deletarToken(token) {

        const sql = `
            DELETE FROM tb_recuperar_senha
            WHERE rec_token = $1
        `;

        await this.banco.ExecutaComando(sql, [token]);
    }
}