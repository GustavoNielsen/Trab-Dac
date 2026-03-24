import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-saque',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, DatePipe],
  templateUrl: './saque.html',
  styleUrl: './saque.css',
})
export class Saque implements OnInit {

  carregando = false;
  enviando   = false;
  sucesso    = false;
  erro       = '';

  saldoNegativo   = false;
  valorStr        = '';
  valorConfirmado = 0;
  novoSaldo       = 0;
  dataHora: Date  = new Date();

  conta: any = null;

  // URL base do API Gateway — ajuste se necessário
  private readonly API = 'http://localhost:3000';

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.carregarConta();
  }

  /** Busca dados da conta do cliente logado via API Gateway */
  carregarConta(): void {
    this.carregando = true;
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<any>(`${this.API}/conta/minha`, { headers }).subscribe({
      next: (data) => {
        this.conta = data;
        this.saldoNegativo = (data?.saldo ?? 0) < 0;
        this.carregando = false;
      },
      error: () => {
        // Em desenvolvimento, use dados mock enquanto o back não está pronto
        this.conta = { saldo: 1500.00, limite: 500.00, numeroConta: '0000' };
        this.saldoNegativo = false;
        this.carregando = false;
      }
    });
  }

  /** Retorna o saldo disponível = saldo + limite */
  get saldoDisponivel(): number {
    return (this.conta?.saldo ?? 0) + (this.conta?.limite ?? 0);
  }

  voltar(): void {
    this.router.navigate(['/cliente']);
  }

  /** Converte string "1.500,00" → número 1500.00 */
  private parsarValor(valorStr: string): number {
    if (!valorStr) return 0;
    return parseFloat(
      valorStr.replace(/\./g, '').replace(',', '.')
    );
  }

  confirmar(form: NgForm): void {
    if (form.invalid) return;

    const valor = this.parsarValor(this.valorStr);

    if (valor <= 0) {
      this.erro = 'O valor do saque deve ser maior que zero.';
      return;
    }

    if (valor > this.saldoDisponivel) {
      this.erro = `Saldo insuficiente. Disponível: ${this.formatarBRL(this.saldoDisponivel)}`;
      return;
    }

    this.enviando = true;
    this.erro = '';

    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.post<any>(
      `${this.API}/conta/saque`,
      { valor },
      { headers }
    ).subscribe({
      next: (resp) => {
        this.valorConfirmado = valor;
        this.novoSaldo = resp?.novoSaldo ?? ((this.conta?.saldo ?? 0) - valor);
        this.dataHora  = new Date();
        this.sucesso   = true;
        this.enviando  = false;
        // Atualiza o saldo local
        if (this.conta) {
          this.conta.saldo = this.novoSaldo;
          this.saldoNegativo = this.novoSaldo < 0;
        }
      },
      error: (err) => {
        this.erro = err?.error?.message ?? 'Erro ao processar o saque. Tente novamente.';
        this.enviando = false;
      }
    });
  }

  novoSaque(): void {
    this.sucesso  = false;
    this.erro     = '';
    this.valorStr = '';
  }

  private formatarBRL(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}