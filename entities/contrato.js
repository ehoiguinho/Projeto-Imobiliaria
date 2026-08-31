export default class Contrato {

    #id;
    #imovel;
    #usuario;
    #status;
    #alugueis;

    constructor(id, imovel, usuario, status, alugueis = []) {
        this.#id = id;
        this.#imovel = imovel;
        this.#usuario = usuario;
        this.#status = status;
        this.#alugueis = alugueis;
    }

    get id() {
        return this.#id;
    }

    set id(value) {
        this.#id = value;
    }

    get imovel() {
        return this.#imovel;
    }

    set imovel(value) {
        this.#imovel = value;
    }

    get usuario() {
        return this.#usuario;
    }

    set usuario(value) {
        this.#usuario = value;
    }

    get status() {
        return this.#status;
    }

    set status(value) {
        this.#status = value;
    }

    get alugueis() {
        return this.#alugueis;
    }

    set alugueis(value) {
        this.#alugueis = value;
    }

    toJSON() {
        return {
            id: this.#id,
            imovel: this.#imovel?.id,
            usuario: this.#usuario?.id,
            status: this.#status,
            alugueis: this.#alugueis
        };
    }
}