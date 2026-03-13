export class Pessoa {
    cpf: string;
    nome: string;
    email: string;
    telefone: string;

    constructor(cpf: string = '', nome: string = '', email: string = '', telefone: string = '') {
        this.cpf = cpf;
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
    }
}