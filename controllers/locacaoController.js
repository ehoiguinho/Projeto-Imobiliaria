import Database from "../db/database.js";
import AluguelEntity from "../entities/aluguel.js";
import ContratoEntity from "../entities/contrato.js";
import AluguelRepository from "../repositories/aluguelRepository.js";
import ContratoRepository from "../repositories/contratoRepository.js";
import ImovelRepository from "../repositories/imovelRepository.js";
import Repository from "../repositories/repository.js";


export default class LocacaoController {

    #imovelRepository;
    #contratoRepository;
    #aluguelRepository;

   constructor(){
        this.#imovelRepository = new ImovelRepository();
        this.#contratoRepository = new ContratoRepository();
        this.#aluguelRepository = new AluguelRepository();
   }

    async locar(req, res) {

    let banco = new Database();
    let client = null;

    try {

        let { id } = req.body;

        this.#imovelRepository.banco = banco;
        this.#contratoRepository.banco = banco;
        this.#aluguelRepository.banco = banco;

        if (!id) {
            return res.status(400).json({
                msg: "O Id do imóvel não foi enviado!"
            });
        }

        let imovel = await this.#imovelRepository.obterId(id);
        console.log("IMOVEL RETORNADO:", imovel);
console.log("ID:", imovel[0]?.id);
console.log("DISPONIVEL:", imovel[0]?.disponivel);
console.log("TIPO DISPONIVEL:", typeof imovel[0]?.disponivel);

        if (imovel.length === 0 || imovel[0].disponivel !== "S") {
                console.log("IMOVEL INVALIDO OU INDISPONIVEL");

            return res.status(400).json({
                msg: "Imóvel inválido para locação!"
            });
        }

        imovel = imovel[0];

        console.log("IMOVEL VALIDADO:", imovel);


        let contrato = new ContratoEntity();

        contrato.imovel = imovel;
        contrato.usuario = req.usuarioLogado;

        console.log("CONTRATO MONTADO:", contrato);


        // INICIA A TRANSAÇÃO
        client = await banco.AbreTransacao();

        console.log("TRANSAÇÃO ABERTA");
        console.log("VAI GRAVAR CONTRATO");


        // GRAVA CONTRATO
        if (!await this.#contratoRepository.gravar(contrato, client)) {
            throw new Error("Erro ao gerar contrato no banco!");
        }
        console.log("CONTRATO GRAVADO:", contrato.id);

        // GERA OS 12 ALUGUÉIS
        for (let i = 1; i <= 12; i++) {

            let aluguel = new AluguelEntity();

            aluguel.valor = imovel.valor;
            aluguel.contrato = contrato;
            aluguel.pago = "N";
            aluguel.status = "PENDENTE";

          let dataAtual = new Date();

            let ano = dataAtual.getFullYear();
            let mes = dataAtual.getMonth() + i;

            let vencimento = new Date(ano, mes, 1);

            aluguel.mes = vencimento.getMonth() + 1;
            aluguel.vencimento = vencimento;

            if (!await this.#aluguelRepository.gravar(aluguel, client)) {
                throw new Error(
                    `Erro ao gerar o aluguel do mês ${aluguel.mes}`
                );
            }
        }

        // MARCA IMÓVEL COMO INDISPONÍVEL
        imovel.disponivel = "N";

        if (!await this.#imovelRepository.alterar(imovel, client)) {
            throw new Error("Erro ao atualizar situação do imóvel");
        }

        // TUDO DEU CERTO
        await banco.Commit(client);
        client = null;

        return res.status(200).json({
            msg: "Imóvel locado com sucesso!"
        });

    } catch (ex) {

        console.log(ex);

        if (client) {
            await banco.Rollback(client);
        }

        return res.status(500).json({
            msg: "Erro durante o processo de locação"
        });
    }
}

    async listar(req, res) {
        try {
            let usuarioId = req.usuarioLogado.id;
            var lista = await this.#contratoRepository.listarPorUsuario(usuarioId);
            if(lista.length > 0)
                res.status(200).json(lista);
            else
                res.status(404).json("Nenhum contrato de locação encontrado!");
        }
        catch(ex) {
            
            console.log(ex);
            return res.status(500).json({msg: "Erro interno de servidor"})
        }
    }

    async cancelar(req, res) {

    let banco = new Database();
    let client = null;

    try {

        let { id } = req.params;

        this.#contratoRepository.banco = banco;
        this.#aluguelRepository.banco = banco;
        this.#imovelRepository.banco = banco;

        if (!id) {
            return res.status(400).json({
                msg: "O id do contrato não foi enviado!"
            });
        }

        // Busca o contrato
        let contrato = await this.#contratoRepository.obterPorId(id);

        if (!contrato || contrato.length === 0) {
            return res.status(404).json({
                msg: "Contrato não encontrado!"
            });
        }

        contrato = contrato[0];

        // Verifica se o contrato pertence ao usuário logado
        if (contrato.usu_id !== req.usuarioLogado.id) {
            return res.status(403).json({
                msg: "Você não tem permissão para cancelar este contrato!"
            });
        }

        // Verifica se já está cancelado
        if (contrato.con_status === "CANCELADO") {
            return res.status(400).json({
                msg: "Este contrato já está cancelado!"
            });
        }

        // INICIA TRANSAÇÃO
        client = await banco.AbreTransacao();

        // Cancela contrato
        if (!await this.#contratoRepository.cancelar(id, client)) {
            throw new Error("Erro ao cancelar contrato");
        }

        // Cancela aluguéis pendentes
        if (!await this.#aluguelRepository.cancelarPendentesPorContrato(id, client)) {
            throw new Error("Erro ao cancelar aluguéis");
        }

        // Libera imóvel
        if (!await this.#imovelRepository.liberar(contrato.imv_id, client)) {
            throw new Error("Erro ao liberar imóvel");
        }

        // CONFIRMA TRANSAÇÃO
        await banco.Commit(client);
        client = null;

        return res.status(200).json({
            msg: "Contrato cancelado com sucesso!"
        });

    } catch (ex) {

        console.log(ex);

        if (client) {
            await banco.Rollback(client);
        }

        return res.status(500).json({
            msg: "Erro durante o cancelamento do contrato"
        });
    }
}

    async pagarAluguel(req, res) {

    try {

        let { id } = req.params;

        this.#aluguelRepository.banco = new Database();

        if (!id) {
            return res.status(400).json({
                msg: "O id do aluguel não foi enviado!"
            });
        }

        // Atualiza parcelas vencidas
        await this.#aluguelRepository.atualizarAtrasados();

        // Busca o aluguel garantindo que pertence ao usuário logado
        let aluguel = await this.#aluguelRepository.obterPorIdUsuario(
            id,
            req.usuarioLogado.id
        );

        // Não encontrou ou não pertence ao usuário
        if (!aluguel || aluguel.length === 0) {
            return res.status(403).json({
                msg: "Você não tem permissão para pagar este aluguel!"
            });
        }

        // Como veio em array, pegamos o primeiro registro
        aluguel = aluguel[0];

        // Verifica se está cancelado
        if (aluguel.status === "CANCELADO") {
            return res.status(400).json({
                msg: "Este aluguel está cancelado!"
            });
        }

        // Verifica se já foi pago
        if (aluguel.pago === "S" || aluguel.status === "PAGO") {
            return res.status(400).json({
                msg: "Este aluguel já foi pago!"
            });
        }

        // Só permite pagamento de PENDENTE ou ATRASADO
        if (
            aluguel.status !== "PENDENTE" &&
            aluguel.status !== "ATRASADO"
        ) {
            return res.status(400).json({
                msg: "Este aluguel não pode ser pago!"
            });
        }

        // Marca como pago
        if (await this.#aluguelRepository.marcarComoPago(id)) {

            return res.status(200).json({
                msg: "Aluguel pago com sucesso!"
            });
        }

        return res.status(400).json({
            msg: "Não foi possível pagar este aluguel!"
        });

    } catch (ex) {

        console.log(ex);

        return res.status(500).json({
            msg: "Erro interno ao pagar aluguel!"
        });
    }
}

    async listarAlugueis(req, res){
    try{

        let { id } = req.params;
        this.#aluguelRepository.banco = new Database();

        if(!id){
            return res.status(400).json({
                msg: "O id do contrato não foi enviado!"
            });
        }

        // atualiza automaticamente os atrasados
        await this.#aluguelRepository.atualizarAtrasados();

        let lista = await this.#aluguelRepository.listarPorContrato(
            id,
            req.usuarioLogado.id
        );
        if(lista.length > 0){
            return res.status(200).json(lista);
        }

        return res.status(404).json({msg: "Nenhum aluguel encontrado!"});

    }catch(ex){
        console.log(ex);

        return res.status(500).json({msg: "Erro ao listar aluguéis!"});
    }
}
}