import Database from "../db/database.js";


export default class Repository {

    #banco;

    get banco() {
        return this.#banco;
    }

    set banco(value) {
        this.#banco = value;
    }

    constructor() {
        this.#banco = new Database();
    }
}