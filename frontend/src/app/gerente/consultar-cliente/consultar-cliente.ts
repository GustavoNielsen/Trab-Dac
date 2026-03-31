import { Component, OnInit } from '@angular/core';
import { Cliente } from '../../../shared/models/cliente.model';
import { GerenteService } from '../../../services/gerente-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../../services/cliente-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-consultar-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './consultar-cliente.html',
  styleUrl: './consultar-cliente.css'
})
export class ConsultarCliente implements OnInit{
  cpf: string = '';
  cliente?: Cliente;
  extrato: any[] = [];

constructor(
  private gerenteService: GerenteService,
  private clienteService: ClienteService,
  private route: ActivatedRoute
) {}

ngOnInit() {
  this.route.paramMap.subscribe(params => {
    const cpf = params.get('cpf');
    if (cpf) {
      this.cpf = cpf;
      this.consultar(); // já consulta ao carregar
    }
  });
}

  consultar() {
    const cpfNormalized = (this.cpf || '').replace(/\D/g, '');
    if (!cpfNormalized) {
      return;
    }

    // garante que o serviço procura por CPF normalizado
    this.cliente = this.gerenteService.consultarCliente(cpfNormalized);
    this.extrato = [];

    if (!this.cliente) {
      // mensagem já exibida no template também
      console.log('Cliente não encontrado para CPF:', cpfNormalized);
    }
  }

  verDetalhamento(cliente: Cliente) {
    if (!cliente) return;

    // se não tiver conta, não tenta buscar extrato
    if (!cliente.conta) {
      alert('Cliente ainda não possui conta (ainda não aprovado).');
      return;
    }

  
    const inicio = new Date(new Date().getFullYear(), 0, 1);
    const fim = new Date();

    this.extrato = this.clienteService.consultarExtratoPorConta(cliente.conta!, inicio, fim) || [];

    console.log('Extrato carregado:', this.extrato);
  }
}