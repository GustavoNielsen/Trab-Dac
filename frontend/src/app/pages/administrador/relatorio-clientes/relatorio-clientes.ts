import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface ClienteRelatorio {
  cpf: string;
  nome: string;
  email: string;
  salario: number;
  numeroConta: string;
  saldo: number;
  limite: number;
  cpfGerente: string;
  nomeGerente: string;
}

@Component({
  selector: 'app-relatorio-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe],
  templateUrl: './relatorio-clientes.html',
})
export class RelatorioClientes implements OnInit {

  clientes: ClienteRelatorio[] = [];
  carregando = false;
  erro = '';
  today = new Date();

  private readonly API = 'http://localhost:3000';

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.carregarClientes();
  }

  carregarClientes(): void {
    this.carregando = true;
    this.erro = '';

    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<ClienteRelatorio[]>(`${this.API}/gerente/relatorio-clientes`, { headers })
      .subscribe({
        next: (data) => {
          // Ordenar por nome crescente conforme R12
          this.clientes = data.sort((a, b) => a.nome.localeCompare(b.nome));
          this.carregando = false;
        },
        error: () => {
          // Dados mock para desenvolvimento
          this.clientes = [
            { cpf: '12912861012', nome: 'Catharyna',   email: 'cli1@bantads.com.br', salario: 10000, numeroConta: '1291', saldo: 800,     limite: 5000,  cpfGerente: '98574307084', nomeGerente: 'Geniéve'    },
            { cpf: '09506382000', nome: 'Cleuddônio',  email: 'cli2@bantads.com.br', salario: 20000, numeroConta: '0950', saldo: -10000,  limite: 10000, cpfGerente: '64065268052', nomeGerente: 'Godophredo' },
            { cpf: '85733854057', nome: 'Catianna',    email: 'cli3@bantads.com.br', salario: 3000,  numeroConta: '8573', saldo: -1000,   limite: 1500,  cpfGerente: '23862179060', nomeGerente: 'Gyândula'   },
            { cpf: '58872160006', nome: 'Cutardo',     email: 'cli4@bantads.com.br', salario: 500,   numeroConta: '5887', saldo: 150000,  limite: 0,     cpfGerente: '98574307084', nomeGerente: 'Geniéve'    },
            { cpf: '76179646090', nome: 'Coândrya',    email: 'cli5@bantads.com.br', salario: 1500,  numeroConta: '7617', saldo: 1500,    limite: 0,     cpfGerente: '64065268052', nomeGerente: 'Godophredo' },
          ].sort((a, b) => a.nome.localeCompare(b.nome));
          this.carregando = false;
        }
      });
  }

  voltar(): void {
    this.router.navigate(['/gerente']);
  }

  gerarPDF(): void {
    // Abre a janela de impressão do browser — gera PDF sem dependências externas
    window.print();
  }
}
