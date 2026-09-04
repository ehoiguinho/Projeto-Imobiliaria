import Repository from "./repository.js";

export default class adminRepository extends Repository{

     constructor(){
        super();
    }

       async listarTodosImoveis() {

        const sql = `
            SELECT
                imv_id,
                imv_descricao,
                imv_cep,
                imv_endereco,
                imv_bairro,
                imv_cidade,
                imv_valor,
                imv_disponivel
            FROM tb_imovel
            ORDER BY imv_id DESC
        `;

        return await this.banco.ExecutaComando(sql);
    }


    // Lista todos os contratos, ativos e cancelados
    async listarTodosContratos() {

        const sql = `
            SELECT
                c.ctr_id,
                c.imv_id,
                c.usu_id,
                c.con_status,

                i.imv_descricao,
                i.imv_endereco,
                i.imv_bairro,
                i.imv_cidade,

                u.usu_nome,
                u.usu_email

            FROM tb_contrato c

            INNER JOIN tb_imovel i
                ON c.imv_id = i.imv_id

            INNER JOIN tb_usuario u
                ON c.usu_id = u.usu_id

            ORDER BY c.ctr_id DESC
        `;

        return await this.banco.ExecutaComando(sql);
    }


    // Lista os aluguéis de todos os contratos ATIVOS
    async listarAlugueisContratosAtivos() {

        const sql = `
            SELECT
                a.alu_id,
                a.alu_mes,
                a.alu_vencimento,
                a.alu_valor,
                a.alu_pago,
                a.alu_status,

                c.ctr_id,
                c.con_status,

                i.imv_id,
                i.imv_descricao,

                u.usu_id,
                u.usu_nome,
                u.usu_email

            FROM tb_aluguel a

            INNER JOIN tb_contrato c
                ON a.ctr_id = c.ctr_id

            INNER JOIN tb_imovel i
                ON c.imv_id = i.imv_id

            INNER JOIN tb_usuario u
                ON c.usu_id = u.usu_id

            WHERE c.con_status = 'ATIVO'

            ORDER BY
                c.ctr_id DESC,
                a.alu_vencimento ASC
        `;

        return await this.banco.ExecutaComando(sql);
    }
}
