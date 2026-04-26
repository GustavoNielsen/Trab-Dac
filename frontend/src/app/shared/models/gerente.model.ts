import { Pessoa } from "./pessoa.model";

export class Gerente extends Pessoa {

    constructor(cpf: string = '', nome: string = '', email: string = '', telefone: string = '') {
        super(cpf, nome, email, telefone);
        this.cpf = cpf;
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
    }
}
