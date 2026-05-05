import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cliente } from '../shared/models/cliente.model';
import { GerenteService } from '../services/gerente-service';
import { ClienteService } from '../services/cliente-service';


@Component({
  selector: 'app-tela-inicial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tela-inicial-gerente.html',
  //styleUrl: './tela-inicial-gerente.css'
})
export class TelaInicialGerente implements OnInit {
  pedidos: Cliente[] = [];
  mensagem: string = '';

  constructor(
    private gerenteService: GerenteService,
    private clienteService: ClienteService
  ) {}

  ngOnInit(): void {
    this.pedidos = this.gerenteService.listarPendentes();
  }

  aprovar(cliente: Cliente) {
    this.gerenteService.aprovarCliente(cliente);
    this.pedidos = this.gerenteService.listarPendentes();
    this.mensagem = `✅ Cliente ${cliente.nome} aprovado! Conta: ${cliente.conta}, Limite: R$ ${cliente.limite?.toFixed(2)}.`;
  }

  abrirModalRecusar(cliente: Cliente): void {
    const motivoRejeicao = window.prompt(`Motivo da rejeição de ${cliente.nome}:`, '');
    if (!motivoRejeicao || !motivoRejeicao.trim()) {
      return;
    }
    this.gerenteService.rejeitarCliente(cliente, motivoRejeicao);
    this.pedidos = this.gerenteService.listarPendentes();
    this.mensagem = `❌ Cliente ${cliente.nome} rejeitado. Motivo: ${motivoRejeicao}`;
  }

}
