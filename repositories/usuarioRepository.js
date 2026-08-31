import Perfil from "../entities/perfil.js";
import Usuario from "../entities/usuario.js";
import Repository from "./repository.js";

export default class UsuarioRepository extends Repository {

    constructor() {
        super();
    }

    async validarAcesso(email, senha) {

        const sql = `
            SELECT 
                u.*,
                p.per_descricao
            FROM tb_usuario u
            INNER JOIN tb_perfil p
                ON u.per_id = p.per_id
            WHERE u.usu_email = $1
            AND u.usu_senha = $2
        `;

        const valores = [email, senha];

        const rows = await this.banco.ExecutaComando(sql, valores);

        if (rows.length > 0) {
            return this.toMap(rows[0]);
        }

        return null;
    }

    async cadastrar(usuario) {

        const sql = `
            INSERT INTO tb_usuario
                (usu_nome, usu_email, usu_ativo, usu_senha, per_id)
            VALUES
                ($1, $2, $3, $4, $5)
            RETURNING usu_id
        `;

        const valores = [
            usuario.nome,
            usuario.email,
            usuario.ativo,
            usuario.senha,
            usuario.perfil.id
        ];

        const rows = await this.banco.ExecutaComando(sql, valores);

        return rows[0].usu_id;
    }

    async listar() {

        const sql = `
            SELECT
                u.*,
                p.per_descricao
            FROM tb_usuario u
            INNER JOIN tb_perfil p
                ON u.per_id = p.per_id
        `;

        const rows = await this.banco.ExecutaComando(sql);

        const usuarios = [];

        for (const row of rows) {
            usuarios.push(this.toMap(row));
        }

        return usuarios;
    }

    async deletar(id) {

        const sql = `
            DELETE FROM tb_usuario
            WHERE usu_id = $1
        `;

        const valores = [id];

        return await this.banco.ExecutaComandoNonQuery(sql, valores);
    }

    async alterar(entidadeAtualizada) {

        const sql = `
            UPDATE tb_usuario
            SET
                usu_nome = $1,
                usu_email = $2,
                usu_ativo = $3,
                usu_senha = $4,
                per_id = $5
            WHERE usu_id = $6
        `;

        const valores = [
            entidadeAtualizada.nome,
            entidadeAtualizada.email,
            entidadeAtualizada.ativo,
            entidadeAtualizada.senha,
            entidadeAtualizada.perfil.id,
            entidadeAtualizada.id
        ];

        return await this.banco.ExecutaComandoNonQuery(sql, valores);
    }

    async buscarId(id) {

        const sql = `
            SELECT
                u.*,
                p.per_descricao
            FROM tb_usuario u
            INNER JOIN tb_perfil p
                ON u.per_id = p.per_id
            WHERE u.usu_id = $1
        `;

        const valores = [id];

        const rows = await this.banco.ExecutaComando(sql, valores);

        if (rows.length > 0) {
            return this.toMap(rows[0]);
        }

        return null;
    }

    toMap(row) {

        const usuario = new Usuario();

        usuario.id = row["usu_id"];
        usuario.nome = row["usu_nome"];
        usuario.email = row["usu_email"];
        usuario.senha = row["usu_senha"];
        usuario.ativo = row["usu_ativo"];

        usuario.perfil = new Perfil(
            row["per_id"],
            row["per_descricao"]
        );

        return usuario;
    }
}