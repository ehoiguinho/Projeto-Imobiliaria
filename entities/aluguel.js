
export default class Aluguel{
    #id;
    #mes;
    #vencimento;
    #valor;
    #pago;
    #contrato;

    constructor(id, mes, vencimento, valor, pago, contrato){
        this.#id = id;
        this.#mes = mes;
        this.#vencimento = vencimento;
        this.#valor = valor;
        this.#pago = pago;
        this.#contrato = contrato;
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


    toJSON(){
        return{
            id: this.#id,
            mes: this.#mes,
            vencimento: this.#vencimento,
            valor: this.#valor,
            pago: this.#pago,
            contrato: this.#contrato.id
        }
    }
}