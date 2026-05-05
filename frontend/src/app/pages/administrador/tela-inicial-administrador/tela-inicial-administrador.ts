import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tela-inicial-administrador',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tela-inicial-administrador.html',
  styleUrl: './tela-inicial-administrador.css',
})
export class TelaInicialAdministrador {
  carregando = false;
  erro = '';

  gerentes: Array<{
    nome: string;
    cpf: string;
    email: string;
    totalClientes: number;
    totalSaldoPositivo: number;
    totalSaldoNegativo: number;
  }> = [];

  constructor(private router: Router) {
    this.carregarDashboard();
  }

  get totalGerentes(): number {
    return this.gerentes.length;
  }

  get totalClientes(): number {
    return this.gerentes.reduce((acc, g) => acc + (g.totalClientes || 0), 0);
  }

  get totalPositivo(): number {
    return this.gerentes.reduce((acc, g) => acc + (g.totalSaldoPositivo || 0), 0);
  }

  get totalNegativo(): number {
    return this.gerentes.reduce((acc, g) => acc + (g.totalSaldoNegativo || 0), 0);
  }

  carregarDashboard(): void {
    this.carregando = true;
    this.erro = '';
    try {
      const mock = [
        { nome: 'Ana Souza', cpf: '111.111.111-11', email: 'ana@bantads.com', totalClientes: 18, totalSaldoPositivo: 224500, totalSaldoNegativo: 5100 },
        { nome: 'Bruno Lima', cpf: '222.222.222-22', email: 'bruno@bantads.com', totalClientes: 14, totalSaldoPositivo: 198120, totalSaldoNegativo: 8420 },
        { nome: 'Carla Dias', cpf: '333.333.333-33', email: 'carla@bantads.com', totalClientes: 21, totalSaldoPositivo: 175330, totalSaldoNegativo: 12040 },
      ];
      this.gerentes = mock.sort((a, b) => b.totalSaldoPositivo - a.totalSaldoPositivo);
    } catch {
      this.erro = 'Falha ao carregar dados do dashboard.';
      this.gerentes = [];
    } finally {
      this.carregando = false;
    }
  }

  navegarPara(rota: string): void {
    this.router.navigate([rota]);
  }

  logout(): void {
    this.router.navigate(['/login']);
  }
}