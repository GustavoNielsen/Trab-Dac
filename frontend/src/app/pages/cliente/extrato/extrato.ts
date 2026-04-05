import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { finalize, timeout } from 'rxjs/operators';

export interface MovimentoExtrato {
  data: string;
  tipo: 'CREDITO' | 'DEBITO' | 'TRANSFERENCIA' | 'SAQUE' | 'DEPOSITO';
  descricao: string;
  valor: number;
  saldoApos: number;
}

@Component({
  selector: 'app-extrato',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, DatePipe],
  templateUrl: './extrato.html',
  styleUrl: './extrato.css',
})
export class Extrato implements OnInit {
  private readonly cdr = inject(ChangeDetectorRef);

  readonly carregando = signal(false);

  conta: any = null;
  saldoNegativo = false;

  /** Todas as linhas retornadas pela API ou mock */
  linhas: MovimentoExtrato[] = [];

  /** yyyy-MM para filtro (input type="month") */
  mesFiltro = '';

  private readonly API = 'http://localhost:3000';

  constructor(
    public router: Router,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    const d = new Date();
    this.mesFiltro = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    this.carregar();
  }

  /** Linhas do mês selecionado, mais recentes primeiro */
  get linhasFiltradas(): MovimentoExtrato[] {
    if (!this.mesFiltro) return [...this.linhas].sort((a, b) => b.data.localeCompare(a.data));
    const [y, m] = this.mesFiltro.split('-').map(Number);
    const inicio = new Date(y, m - 1, 1);
    const fim = new Date(y, m, 0, 23, 59, 59, 999);
    const t0 = inicio.toISOString();
    const t1 = fim.toISOString();
    return this.linhas
      .filter((l) => l.data >= t0 && l.data <= t1)
      .sort((a, b) => b.data.localeCompare(a.data));
  }

  carregar(): void {
    this.carregando.set(true);
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});

    this.http
      .get<any>(`${this.API}/conta/minha`, { headers })
      .pipe(timeout(15000))
      .subscribe({
        next: (data) => {
          this.conta = data;
          this.saldoNegativo = (data?.saldo ?? 0) < 0;
          this.buscarMovimentos(headers);
        },
        error: () => {
          this.conta = { saldo: 3240.5, limite: 2000, numeroConta: '12345-6' };
          this.saldoNegativo = false;
          this.buscarMovimentos(headers);
        },
      });
  }

  private buscarMovimentos(headers: HttpHeaders): void {
    this.http
      .get<MovimentoExtrato[]>(`${this.API}/conta/extrato`, { headers })
      .pipe(
        timeout(15000),
        finalize(() => {
          this.carregando.set(false);
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (rows) => {
          this.linhas = Array.isArray(rows) ? rows : [];
          if (this.linhas.length === 0) {
            this.linhas = this.mockMovimentos();
          }
        },
        error: () => {
          this.linhas = this.mockMovimentos();
        },
      });
  }

  private mockMovimentos(): MovimentoExtrato[] {
    return [
      {
        data: new Date(2026, 2, 30, 9, 12).toISOString(),
        tipo: 'DEPOSITO',
        descricao: 'Depósito em conta — agência',
        valor: 500,
        saldoApos: 3740.5,
      },
      {
        data: new Date(2026, 2, 28, 14, 30).toISOString(),
        tipo: 'TRANSFERENCIA',
        descricao: 'TED enviada — conta ****9876',
        valor: -150,
        saldoApos: 3240.5,
      },
      {
        data: new Date(2026, 2, 25, 11, 0).toISOString(),
        tipo: 'SAQUE',
        descricao: 'Saque caixa eletrônico',
        valor: -200,
        saldoApos: 3390.5,
      },
      {
        data: new Date(2026, 2, 20, 8, 45).toISOString(),
        tipo: 'CREDITO',
        descricao: 'Salário recebido',
        valor: 3500,
        saldoApos: 3590.5,
      },
      {
        data: new Date(2026, 2, 10, 16, 22).toISOString(),
        tipo: 'DEBITO',
        descricao: 'Pagamento boleto',
        valor: -89.9,
        saldoApos: 90.5,
      },
    ];
  }

  voltar(): void {
    this.router.navigate(['/cliente']);
  }

  labelTipo(t: MovimentoExtrato['tipo']): string {
    const map: Record<MovimentoExtrato['tipo'], string> = {
      CREDITO: 'Crédito',
      DEBITO: 'Débito',
      TRANSFERENCIA: 'Transferência',
      SAQUE: 'Saque',
      DEPOSITO: 'Depósito',
    };
    return map[t] ?? t;
  }

  classeValor(valor: number): string {
    if (valor > 0) return 'text-success';
    if (valor < 0) return 'text-danger';
    return 'text-muted';
  }
}
