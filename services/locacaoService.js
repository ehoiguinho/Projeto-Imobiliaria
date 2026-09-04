import Database from "../db/database.js";
import AluguelEntity from "../entities/aluguel.js";
import ContratoEntity from "../entities/contrato.js";
import AluguelRepository from "../repositories/aluguelRepository.js";
import ContratoRepository from "../repositories/contratoRepository.js";
import ImovelRepository from "../repositories/imovelRepository.js";

export default class LocacaoService {

    #imovelRepository;
    #contratoRepository;
    #aluguelRepository;

    constructor() {
        this.#imovelRepository = new ImovelRepository();
        this.#contratoRepository = new ContratoRepository();
        this.#aluguelRepository = new AluguelRepository();
    }

    async locar(id, usuario) {

        const banco = new Database();
        let client = null;

        try {

            this.#imovelRepository.banco = banco;
            this.#contratoRepository.banco = banco;
            this.#aluguelRepository.banco = banco;

            if (!id) {
                throw new Error("O Id do imóvel não foi enviado!");
            }

            const resultado = await this.#imovelRepository.obterId(id);

            if (resultado.length === 0 || resultado[0].disponivel !== "S") {
                throw new Error("Imóvel inválido para locação!");
            }

            const imovel = resultado[0];

            const contrato = new ContratoEntity();

            contrato.imovel = imovel;
            contrato.usuario = usuario;

            client = await banco.AbreTransacao();

            // Grava contrato
            if (!await this.#contratoRepository.gravar(contrato, client)) {
                throw new Error("Erro ao gerar contrato no banco!");
            }

            // Gera os 12 aluguéis
            for (let i = 1; i <= 12; i++) {

                const aluguel = new AluguelEntity();

                aluguel.valor = imovel.valor;
                aluguel.contrato = contrato;
                aluguel.pago = "N";
                aluguel.status = "PENDENTE";

                const dataAtual = new Date();

                const ano = dataAtual.getFullYear();
                const mes = dataAtual.getMonth() + i;

                const vencimento = new Date(ano, mes, 1);

                aluguel.mes = vencimento.getMonth() + 1;
                aluguel.vencimento = vencimento;

                if (!await this.#aluguelRepository.gravar(aluguel, client)) {
                    throw new Error(
                        `Erro ao gerar o aluguel do mês ${aluguel.mes}`
                    );
                }
            }

            // Marca imóvel como indisponível
            imovel.disponivel = "N";

            if (!await this.#imovelRepository.alterar(imovel, client)) {
                throw new Error("Erro ao atualizar situação do imóvel");
            }

            await banco.Commit(client);
            client = null;

            return {
                msg: "Imóvel locado com sucesso!"
            };

        } catch (ex) {

            if (client) {
                await banco.Rollback(client);
            }

            throw ex;
        }
    }

    async listar(contratoId, usuarioId) {

    const banco = new Database();

    this.#contratoRepository.banco = banco;

    if (!contratoId) {
        throw new Error("O id do contrato não foi enviado!");
    }

    const contrato =
        await this.#contratoRepository.obterPorIdUsuario(
            contratoId,
            usuarioId
        );

    if (!contrato || contrato.length === 0) {
        throw new Error("Contrato não encontrado!");
    }

    return contrato;
}

async listarPorUsuario(usuarioId) {
    const banco = new Database();

    this.#contratoRepository.banco = banco;

    const lista = await this.#contratoRepository.listarPorUsuario(usuarioId);

    if (!lista || lista.length === 0) {
        throw new Error("Nenhuma locação encontrada!");
    }

    return lista;
}

    async cancelar(id, usuarioId) {

    const banco = new Database();
    let client = null;

    try {

        this.#contratoRepository.banco = banco;
        this.#aluguelRepository.banco = banco;
        this.#imovelRepository.banco = banco;

        if (!id) {
            throw new Error("O id do contrato não foi enviado!");
        }

        // Busca o contrato
        let contrato = await this.#contratoRepository.obterPorId(id);

        if (!contrato || contrato.length === 0) {
            throw new Error("Contrato não encontrado!");
        }

        contrato = contrato[0];

        // Verifica se o contrato pertence ao usuário
        if (contrato.usu_id !== usuarioId) {
            const erro = new Error(
                "Você não tem permissão para cancelar este contrato!"
            );

            erro.status = 403;

            throw erro;
        }

        // Verifica se já está cancelado
        if (contrato.con_status === "CANCELADO") {
            throw new Error("Este contrato já está cancelado!");
        }

        // Inicia transação
        client = await banco.AbreTransacao();

        // Cancela contrato
        if (!await this.#contratoRepository.cancelar(id, client)) {
            throw new Error("Erro ao cancelar contrato");
        }

        // Cancela aluguéis pendentes
        if (
            !await this.#aluguelRepository.cancelarPendentesPorContrato(
                id,
                client
            )
        ) {
            throw new Error("Erro ao cancelar aluguéis");
        }

        // Libera imóvel
        if (
            !await this.#imovelRepository.liberar(
                contrato.imv_id,
                client
            )
        ) {
            throw new Error("Erro ao liberar imóvel");
        }

        // Confirma transação
        await banco.Commit(client);
        client = null;

        return {
            msg: "Contrato cancelado com sucesso!"
        };

    } catch (ex) {

        if (client) {
            await banco.Rollback(client);
        }

        throw ex;
    }
}

    async pagarAluguel(id, usuarioId) {

    const banco = new Database();

    this.#aluguelRepository.banco = banco;

    if (!id) {
        throw new Error("O id do aluguel não foi enviado!");
    }

    await this.#aluguelRepository.atualizarAtrasados();

    let aluguel = await this.#aluguelRepository.obterPorIdUsuario(
        id,
        usuarioId
    );

    if (!aluguel || aluguel.length === 0) {
        throw new Error("Aluguel não encontrado!");
    }

    aluguel = aluguel[0];

    if (aluguel.status === "CANCELADO") {
        throw new Error("Este aluguel está cancelado!");
    }

    if (aluguel.pago === "S" || aluguel.status === "PAGO") {
        throw new Error("Este aluguel já foi pago!");
    }

    if (
        aluguel.status !== "PENDENTE" &&
        aluguel.status !== "ATRASADO"
    ) {
        throw new Error("Este aluguel não pode ser pago!");
    }

    if (!await this.#aluguelRepository.marcarComoPago(id)) {
        throw new Error("Não foi possível pagar este aluguel!");
    }

    return {
        msg: "Aluguel pago com sucesso!"
    };
}

    async listarAlugueis(contratoId, usuarioId) {

    const banco = new Database();

    this.#aluguelRepository.banco = banco;

    if (!contratoId) {
        throw new Error("O id do contrato não foi enviado!");
    }

    // Atualiza automaticamente os aluguéis atrasados
    await this.#aluguelRepository.atualizarAtrasados();

    const lista = await this.#aluguelRepository.listarPorContrato(
        contratoId,
        usuarioId
    );

    if (lista.length === 0) {
        throw new Error("Nenhum aluguel encontrado!");
    }

    return lista;
}


}