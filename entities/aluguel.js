import Contrato from "./contrato.js";

export default class Aluguel{
    #id;
    #mes;
    #vencimento;
    #valor;
    #pago;
    #contrato;
    #status

    constructor(id, mes, vencimento, valor, pago, contrato, status){
        this.#id = id;
        this.#mes = mes;
        this.#vencimento = vencimento;
        this.#valor = valor;
        this.#pago = pago;
        this.#contrato = contrato;
        this.#status = status;
    }

    get id(){
        return this.#id;
    }
    set id(value){
        this.#id = value;
    }

    get mes(){
        return this.#mes;
    }
    set mes(value){
        this.#mes = value;
    }

    get vencimento(){
        return this.#vencimento;
    }
    set vencimento(value){
        this.#vencimento = value;
    }

    get valor(){
        return this.#valor;
    }
    set valor(value){
        this.#valor = value;
    }

    get pago(){
        return this.#pago;
    }
    set pago(value){
        this.#pago = value;
    }

    get contrato(){
        return this.#contrato;
    }
    set contrato(value){
        this.#contrato = value;
    }

    get status(){
        return this.#status;
    }

    set status(value){
        this.#status = value;
    }


    static toMap(row) {
        let aluguel = new Aluguel();
        aluguel.id = row["alu_id"];
        aluguel.mes = row["alu_mes"];
        aluguel.valor = row["alu_valor"];
        aluguel.pago = row["alu_pago"];
        aluguel.vencimento = row["alu_vencimento"];
        aluguel.contrato = new Contrato();
        aluguel.contrato.id = row["ctr_id"];
        aluguel.status = row["alu_status"];
        return aluguel;
    }

   toJSON() {
    return {
        id: this.#id,
        mes: this.#mes,
        vencimento: this.#vencimento,
        valor: this.#valor,
        pago: this.#pago,
        contrato: this.#contrato?.id,
        status: this.#status
    };
}
}