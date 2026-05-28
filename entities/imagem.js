import ImovelEntity from "./imovel.js";

export default class Imagem{

    #id;
    #imovel;
    #caminho;
    #extensao;


    constructor(id, imovel, caminho, extensao){
        this.#id = id;
        this.#imovel = imovel;
        this.#caminho = caminho;
        this.#extensao = extensao;
    }

    get id(){
        return this.#id;
    }
    set id(value){
        this.#id = value;
    }

    get imovel(){
        return this.#imovel;
    }
    set imovel(value){
        this.#imovel = value;
    }

    get caminho(){
        return this.#caminho;
    }
    set caminho(value){
        this.#caminho = value;
    }

    get extensao(){
        return this.#extensao;
    }
    set extensao(value){
        this.#extensao = value;
    }


    validar(){
        if(this.#extensao == 'jpg' || this.#extensao == 'jpeg' || this.#extensao == 'png') {
            return true;
        }
        return false;
    }

    static toMap(row) {
        return new Imagem(
            row["img_id"],
            new ImovelEntity(row["imo_id"]),
            row["img_caminho"],
            row["img_extensao"]
        );
    }

    toJSON() {
        return {
            id: this.#id,
            imovel: this.#imovel ? this.#imovel.id : null,
            caminho: this.#caminho,
            extensao: this.#extensao
        };
    }
}