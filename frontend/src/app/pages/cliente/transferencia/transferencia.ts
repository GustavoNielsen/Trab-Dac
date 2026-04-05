import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { provideNgxMask } from 'ngx-mask';
import { finalize, timeout } from 'rxjs/operators';

@Component({
  selector: 'app-transferencia',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, DatePipe],
  providers: [provideNgxMask()],
  templateUrl: './transferencia.html',
  styleUrl: './transferencia.css',
})
export class Transferencia implements OnInit {
  private readonly cdr = inject(ChangeDetectorRef);

  readonly carregando = signal(false);
  enviando = false;
  sucesso = false;
  erro = '';

  saldoNegativo = false;
  valorStr = '';
  valorConfirmado = 0;
  novoSaldo = 0;
  dataHora: Date = new Date();
  contaDestinoStr = '';
  descricao = '';

  conta: any = null;

  private readonly API = 'http://localhost:3000';

  constructor(
    public router: Router,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.carregarConta();
  }

  carregarConta(): void {
    this.carregando.set(true);
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});

    this.http
      .get<any>(`${this.API}/conta/minha`, { headers })
      .pipe(
        timeout(15000),
        finalize(() => this.carregando.set(false)),
      )
      .subscribe({
        next: (data) => {
          this.conta = data;
          this.saldoNegativo = (data?.saldo ?? 0) < 0;
        },
        error: () => {
          this.conta = { saldo: 3240.5, limite: 2000.0, numeroConta: '12345-6' };
          this.saldoNegativo = false;
        },
      });
  }

  get saldoDisponivel(): number {
    return (this.conta?.saldo ?? 0) + (this.conta?.limite ?? 0);
  }

  private normalizarNumeroConta(s: string): string {
    return (s ?? '').replace(/\D/g, '');
  }

  voltar(): void {
    this.router.navigate(['/cliente']);
  }

  private parsarValor(valorStr: string): number {
    if (!valorStr) return 0;
    return parseFloat(valorStr.replace(/\./g, '').replace(',', '.'));
  }

  confirmar(form: NgForm): void {
    if (form.invalid) return;

    const valor = this.parsarValor(this.valorStr);
    const destino = this.normalizarNumeroConta(this.contaDestinoStr);
    const origem = this.normalizarNumeroConta(String(this.conta?.numeroConta ?? ''));

    if (destino.length < 4) {
      this.erro = 'Informe o número da conta de destino (mínimo 4 dígitos).';
      return;
    }
    if (origem.length > 0 && destino === origem) {
      this.erro = 'Não é possível transferir para a própria conta.';
      return;
    }
    if (valor <= 0) {
      this.erro = 'O valor deve ser maior que zero.';
      return;
    }
    if (valor > this.saldoDisponivel) {
      this.erro = `Saldo insuficiente. Disponível: ${this.formatarBRL(this.saldoDisponivel)}`;
      return;
    }

    this.enviando = true;
    this.erro = '';

    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});

    const body = {
      contaDestino: this.contaDestinoStr.trim(),
      valor,
      descricao: this.descricao?.trim() || undefined,
    };

    this.http
      .post<any>(`${this.API}/conta/transferencia`, body, { headers })
      .pipe(
        timeout(60000),
        finalize(() => this.cdr.detectChanges()),
      )
      .subscribe({
        next: (resp) => {
          const bruto = resp?.novoSaldo ?? ((this.conta?.saldo ?? 0) - valor);
          this.valorConfirmado = valor;
          this.novoSaldo = Math.round(bruto * 100) / 100;
          this.dataHora = new Date();
          this.sucesso = true;
          this.enviando = false;
          if (this.conta) {
            this.conta.saldo = this.novoSaldo;
            this.saldoNegativo = this.novoSaldo < 0;
          }
        },
        error: (err) => {
          const valor = this.parsarValor(this.valorStr);
          const disponivel = this.saldoDisponivel;
          const destinoOk =
            this.normalizarNumeroConta(this.contaDestinoStr).length >= 4 &&
            this.normalizarNumeroConta(this.contaDestinoStr) !==
              this.normalizarNumeroConta(String(this.conta?.numeroConta ?? ''));
          if (valor > 0 && valor <= disponivel && this.conta && destinoOk) {
            this.valorConfirmado = valor;
            this.novoSaldo = Math.round(((this.conta.saldo ?? 0) - valor) * 100) / 100;
            this.dataHora = new Date();
            this.conta.saldo = this.novoSaldo;
            this.saldoNegativo = this.novoSaldo < 0;
            this.sucesso = true;
            this.erro = '';
          } else {
            this.erro =
              err?.error?.message ??
              'Não foi possível conectar ao servidor. Verifique o API Gateway ou tente novamente.';
          }
          this.enviando = false;
        },
      });
  }

  novaTransferencia(): void {
    this.sucesso = false;
    this.erro = '';
    this.valorStr = '';
    this.contaDestinoStr = '';
    this.descricao = '';
  }

  private formatarBRL(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
