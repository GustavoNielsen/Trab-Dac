import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { finalize } from 'rxjs';

import { GerenteService } from '../../../services/gerente-service';
import { DashboardResponseItem } from '../../../shared/models/dashboard-response.model';

interface GerenteDashboardView {
  gerente: {
    cpf: string;
    nome: string;
    email: string;
    tipo: string;
  };
  qtdClientes: number;
  saldoPositivo: number;
  saldoNegativo: number;
  clientes: {
    cliente: string;
    numero: string;
    saldo: number;
    limite: number;
    gerente: string;
    criacao: string;
  }[];
}

@Component({
  selector: 'app-tela-inicial-adm',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './tela-inicial-adm.html',
  styleUrl: './tela-inicial-adm.css'
})
export class TelaInicialAdm implements OnInit {
  gerentesDashboard: GerenteDashboardView[] = [];
  carregando = false;
  mensagemErro = '';

  constructor(private gerenteService: GerenteService) {}

  ngOnInit(): void {
    this.carregarDashboard();
  }

  carregarDashboard(): void {
    this.carregando = true;
    this.mensagemErro = '';

    this.gerenteService.listarDashboardAdm()
      .pipe(finalize(() => this.carregando = false))
      .subscribe({
        next: (dados: DashboardResponseItem[]) => {
          this.gerentesDashboard = dados
            .map((item) => ({
              gerente: item.gerente,
              qtdClientes: item.clientes?.length ?? 0,
              saldoPositivo: item.saldo_positivo ?? 0,
              saldoNegativo: item.saldo_negativo ?? 0,
              clientes: item.clientes ?? []
            }))
            .sort((a, b) => b.saldoPositivo - a.saldoPositivo);
        },
        error: (error) => {
          if (error.status === 403) {
            this.mensagemErro = 'Você não tem permissão para acessar o dashboard.';
            return;
          }

          this.mensagemErro = 'Não foi possível carregar o dashboard do administrador.';
        }
      });
  }
}
