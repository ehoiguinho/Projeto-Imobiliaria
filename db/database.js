import pg from "pg";

const { Pool } = pg;

export default class Database {

    #conexao;

    get conexao() {
        return this.#conexao;
    }

    set conexao(conexao) {
        this.#conexao = conexao;
    }

    constructor() {

        this.#conexao = new Pool({
            host: "localhost",
            port: 5432,
            database: "imobiliaria",
            user: "postgres",
            password: "postgres",
            max: 50,
            idleTimeoutMillis: 30000
        });
    }

    async AbreTransacao() {

        const client = await this.#conexao.connect();

        try {

            await client.query("BEGIN");

            return client;

        } catch (error) {

            client.release();

            throw error;
        }
    }

    async Rollback(client) {

        if (client) {
            await client.query("ROLLBACK");
            client.release();
        }
    }

    async Commit(client) {

        if (client) {
            await client.query("COMMIT");
            client.release();
        }
    }

    async ExecutaComando(sql, valores = [], client = null) {

        console.log("SQL:", sql);
        console.log("VALORES:", valores);

        const conexao = client || this.#conexao;

        const result = await conexao.query(sql, valores);

        return result.rows;
    }

    async ExecutaComandoNonQuery(sql, valores = [], client = null) {

        const conexao = client || this.#conexao;

        const result = await conexao.query(sql, valores);

        if (result.rows.length > 0) {

            const primeiraLinha = result.rows[0];

            const chave = Object.keys(primeiraLinha)[0];

            return primeiraLinha[chave];
        }

        return result.rowCount > 0;
    }

    async ExecutaComandoLastInserted(sql, valores = [], client = null) {

        const conexao = client || this.#conexao;

        const result = await conexao.query(sql, valores);

        if (result.rows.length > 0) {

            const primeiraLinha = result.rows[0];

            const chave = Object.keys(primeiraLinha)[0];

            return primeiraLinha[chave];
        }

        return null;
    }
}