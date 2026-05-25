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
        try{
            
            let {id} = req.body;
            //unificando as conexões de banco para utilizar a conexão em transação
            this.#imovelRepository.banco = banco;
            this.#contratoRepository.banco = banco;
            this.#aluguelRepository.banco = banco;
            if(id) {
                let imovel = await this.#imovelRepository.obterId(id);
                if(imovel.length > 0 && imovel[0].disponivel === "S") {
                    imovel = imovel[0];
                    //iniciar processo de locação;
                    let contrato = new ContratoEntity();
                    contrato.imovel = imovel;
                    //utiliza o usuário criado pelo middleware através do JWT
                    contrato.usuario = req.usuarioLogado;
                    
                    await banco.AbreTransacao();
                    if(await this.#contratoRepository.gravar(contrato)) {
                        //iniciar a geração do aluguel
                        //contrato terá duração de 1 ano
                        //gerar 12 meses de aluguel
                        for(let i =1; i<=12; i++) {
                            let aluguel = new AluguelEntity();
                            aluguel.valor = imovel.valor;
                            aluguel.contrato = contrato;
                            aluguel.pago = "N";
                            aluguel.status = "PENDENTE";
                            let dataAtual = new Date();
                            dataAtual.setMonth(dataAtual.getMonth() + i);
                            let mes = dataAtual.getMonth() + 1;
                            aluguel.mes = mes;
                            aluguel.vencimento = dataAtual;

                            if(await this.#aluguelRepository.gravar(aluguel) == false)
                                throw new Error(`Erro ao gerar o aluguel do mês ${mes}`);
                        }
                        
                        //marcar o imóvel como indisponível
                        imovel.disponivel = "N";
                        if(await this.#imovelRepository.alterar(imovel)) {
                            await banco.Commit();
                            res.status(200).json({msg: "Imóvel locado com sucesso!"});
                        }
                        else
                            throw new Error("Erro ao atualizar situação do imóvel");
                    }
                    else
                        throw new Error("Erro ao gerar contrato no banco!");
                }
                else{
                    return res.status(400).json({msg: "Imóvel inválido para locação!"})
                }
            }
            else{
                return res.status(400).json({msg: "O Id do imóvel não foi enviado!"})
            }

        }
        catch(ex) {
            await banco.Rollback();
            console.log(ex);
            return res.status(500).json({msg: "Erro durante o processo de locação"})
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
            await banco.Rollback();
            console.log(ex);
            return res.status(500).json({msg: "Erro interno de servidor"})
        }
    }

    async cancelar(req, res) {
    let banco = new Database();

    try {
        let { id } = req.params;

        this.#contratoRepository.banco = banco;
        this.#aluguelRepository.banco = banco;
        this.#imovelRepository.banco = banco;

        if (!id) {
            return res.status(400).json({ msg: "O id do contrato não foi enviado!" });
        }

        let contrato = await this.#contratoRepository.obterPorId(id);

        if (!contrato || contrato.length === 0) {
            return res.status(404).json({ msg: "Contrato não encontrado!" });
        }

        contrato = contrato[0];

        if (contrato.usu_id !== req.usuarioLogado.id) {
            return res.status(403).json({ msg: "Você não tem permissão para cancelar este contrato!" });
        }

        if (contrato.con_status === "CANCELADO") {
            return res.status(400).json({ msg: "Este contrato já está cancelado!" });
        }

        await banco.AbreTransacao();

        if (await this.#contratoRepository.cancelar(id)) {

            await this.#aluguelRepository.cancelarPendentesPorContrato(id);

            if (await this.#imovelRepository.liberar(contrato.imv_id)) {
                await banco.Commit();

                return res.status(200).json({
                    msg: "Contrato cancelado com sucesso!"
                });
            } else {
                throw new Error("Erro ao liberar imóvel");
            }

        } else {
            throw new Error("Erro ao cancelar contrato");
        }

    } catch (ex) {
        await banco.Rollback();
        console.log(ex);

        return res.status(500).json({
            msg: "Erro durante o cancelamento do contrato"
        });
    }
}

    async pagarAluguel(req, res){
    try{
        let { id } = req.params;

        this.#aluguelRepository.banco = new Database();

        if(!id){
            return res.status(400).json({ msg: "O id do aluguel não foi enviado!" });
        }

        let aluguel = await this.#aluguelRepository.obterPorId(id);

        if(!aluguel || aluguel.length === 0){
            return res.status(404).json({ msg: "Aluguel não encontrado!" });
        }

        aluguel = aluguel[0];

        if(aluguel.pago === "S" || aluguel.status === "PAGO"){
            return res.status(400).json({ msg: "Este aluguel já foi pago!" });
        }

        if(aluguel.status === "CANCELADO"){
            return res.status(400).json({ msg: "Este aluguel está cancelado!" });
        }

        if(await this.#aluguelRepository.marcarComoPago(id)){
            return res.status(200).json({ msg: "Aluguel pago com sucesso!" });
        }

        return res.status(400).json({ msg: "Não foi possível pagar este aluguel!" });

    }catch(ex){
        console.log(ex);
        return res.status(500).json({ msg: "Erro interno ao pagar aluguel!" });
    }
}
}