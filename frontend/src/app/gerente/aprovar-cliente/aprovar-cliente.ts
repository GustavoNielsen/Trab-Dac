import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Cliente } from '../../../shared/models/cliente.model';
import { ClienteService } from '../../../services/cliente-service';


@Component({
  selector: 'app-aprovar-cliente',
  imports: [CommonModule, FormsModule],
  templateUrl: './aprovar-cliente.html',
  styleUrl: './aprovar-cliente.css'
})
export class AprovarCliente {
clientesTemp: any[] = [];
clientesPendentes: any[] = [];
mensagem: string = '';
sucesso: boolean = false;

constructor(private clienteService: ClienteService) {
    this.clientesTemp = this.clienteService.listarClientesLocalStorage();
    this.aplicarLimite();    
  }

calcularLimite(cliente: Cliente) {
  if(cliente.salario <= 2000.00){
    cliente.limite = cliente.salario/2;
  }else {
    cliente.limite = 0.0;
  }
}

aplicarLimite(){
  for(let cliente of this.clientesTemp){
    this.calcularLimite(cliente);
  }
}

criarSenha(cliente: Cliente){
    cliente.senha = "tads";
    this.clienteService.salvarClienteLocalStorage(cliente);
  }
  
  aprovar(cliente: Cliente & { aprovado?: boolean, conta?: string, limite?: number }) {
    const conta = Math.floor(1000 + Math.random() * 9000).toString();

    const senha = Math.random().toString(36).slice(-8);

    const limite = cliente.salario >= 2000 ? cliente.salario / 2 : 0;
    cliente.aprovado = true;
    cliente.senha = 'tads';
    cliente.conta = conta;
    cliente.limite = limite;

    console.log(`📧 Enviado e-mail para ${cliente.email} com a senha: ${senha}`);

    this.mensagem = `Cliente ${cliente.nome} aprovado! Conta: ${conta}, Limite: R$ ${limite.toFixed(2)}. Senha enviada por e-mail.`;
    this.sucesso = true;
  }
}