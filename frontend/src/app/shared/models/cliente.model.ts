import { Pessoa } from './pessoa.model';

export class Cliente extends Pessoa {

    // public status?: 'Aprovado' | 'Rejeitado';
    // public motivoRecusa?: string;
    // public dataRejeicao?: string;
    // public papel?: 'cliente' | 'gerente' | 'admin';
    // public senha?: string;
    // public conta?: string;
       
    // constructor(
    //     cpf: string,
    //     nome: string,
    //     email: string,
    //     telefone: string,
    //     public salario: number,
    //     public endereco: string,
    //     public cep: string,
    //     public complemento: string,
    //     public numero: string,
    //     public bairro: string,
    //     public cidade: string,
    //     public uf: string,
    //     public saldo: number,
    //     public limite: number,
    //     senha?: string,
    //     papel?: 'cliente' | 'gerente' | 'admin'
        
    // ) {
    //     super(); 
    //     this.saldo = saldo ?? 0;
    //     this.limite = limite ?? 0;
    //     this.senha = senha;
    //     this.papel = papel ?? 'cliente'; 
        
    // }

    
    salario: number;
    endereco: string;
    cep: string;
    complemento: string;
    numero: string;
    bairro: string;
    cidade: string;
    uf: string;
    saldo: number;
    limite: number;
    papel: 'cliente' | 'gerente' | 'admin';
    senha: string; // validar lógica

    constructor(
        cpf: string = '',
        nome: string = '',
        email: string = '',
        telefone: string = '',
        salario: number = 0,
        endereco: string = '',
        cep: string = '',
        complemento: string = '',
        numero: string = '',
        bairro: string = '',
        cidade: string = '',
        uf: string = '',
        saldo: number = 0,
        limite: number = 0,
        papel: 'cliente' | 'gerente' | 'admin' = 'cliente',
        senha: string = '' // validar lógica
    ) {
        super(cpf, nome, email, telefone); // Inicializa as propriedades de Pessoa
        this.salario = salario;
        this.endereco = endereco;
        this.cep = cep;
        this.complemento = complemento;
        this.numero = numero;
        this.bairro = bairro;
        this.cidade = cidade;
        this.uf = uf;
        this.saldo = saldo;
        this.limite = limite;
        this.papel = papel;
        this.senha = senha; // validar lógica
    }
}
