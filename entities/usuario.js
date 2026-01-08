

export default class Usuario {
    #id;
    #nome;
    #email;
    #ativo;
    #senha;
    #perfil;

    constructor(id, nome, email, ativo, senha, perfil){
        this.#id = id;
        this.#nome = nome;
        this.#email = email;
        this.#ativo = ativo;
        this.#senha = senha;
        this.#perfil = perfil;
    }


    get id(){
        return this.#id;
    }
    set id(value){
        this.#id = value;
    }

    get nome(){
        return this.#nome;
    }
    set nome(value){
        this.#nome = value;
    }

    get email(){
        return this.#email;
    }
    set email(value){
        this.#email = value;
    }

    get ativo(){
        return this.#ativo;
    }
    set ativo(value){
        this.#ativo = value;
    }

    get senha(){
        return this.#senha;
    }
    set senha(value){
        this.#senha = value;
    }

    get perfil(){
        return this.#perfil;
    }
    set perfil(value){
        this.#perfil = value;
    }


    toJSON() {
    return {
        id: this.#id,
        nome: this.#nome,
        email: this.#email,
        ativo: this.#ativo,
        perfil: this.#perfil?.id
    };
}

}