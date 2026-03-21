import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe, SlicePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tela-inicial-cliente',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, DecimalPipe, SlicePipe],
  templateUrl: './tela-inicial-cliente.html',
  styleUrl: './tela-inicial-cliente.css',
})
export class TelaInicialCliente implements OnInit {

  // Sidebar
  sidebarCollapsed = false;

  // Loading
  carregando = false;

  // Data atual para o topbar
  dataAtual = new Date();

  // Saldo
  saldoVisivel = true;
  saldoNegativo = false;
  saldoAbsoluto = 0;
  percentualLimite = 0;

  // Objetos principais
  cliente: any = null;
  conta: any = null;

  // Iniciais para avatares
  clienteIniciais = '';
  gerenteIniciais = '';

  // Primeiro nome para o header
  primeiroNome = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // TODO: carregar dados reais do cliente/conta
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  toggleSaldo(): void {
    this.saldoVisivel = !this.saldoVisivel;
  }

  navegarPara(rota: string): void {
    this.router.navigate([rota]);
  }

  logout(): void {
    this.router.navigate(['login']);
  }
}