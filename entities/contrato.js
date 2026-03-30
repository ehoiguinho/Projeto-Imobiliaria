

export default class Contrato{
    #id;
    #imovel;
    #usuario;

    constructor(id, imovel, usuario){
        this.#id = id;
        this.#imovel = imovel;
        this.#usuario = usuario;
    }

    get id(){
        return this.#id;
    }
    set id(value){
        this.#id = value;
    }

    get imovel(){
        return this.#id;
    }
    set imovel(value){
        this.#imovel = value;
    }

    get usuario(){
        return this.#usuario;
    }
    set usuario(value){
        this.#usuario = value;
    }

    toJSON(){
        return{
            id: this.#id,
            imovel: this.#imovel.id,
            usuario: this.#usuario.id
        }
    }
}