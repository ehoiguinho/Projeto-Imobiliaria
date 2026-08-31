export default class Contrato {
    #id;
    #imovel;
    #usuario;
    #alugueis;
    #status;

    constructor(id, imovel, usuario, alugueis = [], status = null) {
        this.#id = id;
        this.#imovel = imovel;
        this.#usuario = usuario;
        this.#alugueis = alugueis;
        this.#status = status;
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

    get alugueis() {
        return this.#alugueis;
    }

    set alugueis(value) {
        this.#alugueis = value;
    }

    get status() {
        return this.#status;
    }

    set status(value) {
        this.#status = value;
    }

    toJSON() {
        return {
            id: this.#id,
            imovel: this.#imovel.id,
            usuario: this.#usuario.id,
            status: this.#status,
            alugueis: this.#alugueis
        };
    }
}