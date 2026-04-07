import { Component, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface Movimento {
  data: string;
  tipo: string;
  descricao: string;
  valor: number;
  saldoApos: number;
}

@Component({
  selector: 'app-consultar-extrato',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './consultar-extrato.html',
  styleUrl: './consultar-extrato.css',
})
export class ConsultarExtrato implements OnInit {

  dataInicio: string = '';
  dataFim: string = '';

  movimentos: Movimento[] = [];
  saldoAtual: number = 0;

  carregando = false;

  private API = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  consultar(): void {
    if (!this.dataInicio || !this.dataFim) {
      alert('Preencha as datas!');
      return;
    }

    this.carregando = true;

    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders(
      token ? { Authorization: `Bearer ${token}` } : {}
    );

    this.http.get<any>(`${this.API}/conta/extrato`, { headers })
      .subscribe({
        next: (data) => {
          const lista: Movimento[] = Array.isArray(data) ? data : [];

          // Filtrar pelo intervalo de datas
          const inicio = new Date(this.dataInicio);
          const fim = new Date(this.dataFim);
          fim.setHours(23, 59, 59, 999);

          this.movimentos = lista.filter(m => {
            const dataMov = new Date(m.data);
            return dataMov >= inicio && dataMov <= fim;
          });

          // Atualiza saldo (último movimento ou mock)
          if (this.movimentos.length > 0) {
            this.saldoAtual = this.movimentos[this.movimentos.length - 1].saldoApos;
          }

          this.carregando = false;
        },
        error: () => {
          // fallback mock (caso API falhe)
          this.mockDados();
          this.carregando = false;
        }
      });
  }

  private mockDados(): void {
    this.movimentos = [
      {
        data: new Date().toISOString(),
        tipo: 'Depósito',
        descricao: '-',
        valor: 500,
        saldoApos: 2000,
      },
      {
        data: new Date().toISOString(),
        tipo: 'Transferência',
        descricao: 'João Silva',
        valor: -200,
        saldoApos: 1800,
      },
      {
        data: new Date().toISOString(),
        tipo: 'Saque',
        descricao: '-',
        valor: -300,
        saldoApos: 1500,
      }
    ];

    this.saldoAtual = 1500;
  }

  classeValor(valor: number): string {
    if (valor > 0) return 'text-primary';
    if (valor < 0) return 'text-danger';
    return '';
  }
}