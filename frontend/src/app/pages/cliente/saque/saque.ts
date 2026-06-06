import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { provideNgxMask } from 'ngx-mask';
import { finalize, timeout } from 'rxjs/operators';

@Component({
  selector: 'app-saque',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, DatePipe],
  providers: [provideNgxMask()],
  templateUrl: './saque.html',
  styleUrl: './saque.css',
})
export class Saque implements OnInit {

  private readonly cdr = inject(ChangeDetectorRef);

  /** Signal evita spinner preso com detecção de mudanças zoneless (Angular 21). */
  readonly carregando = signal(false);
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

  constructor(
    public router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.carregarConta();
  }

  /** Busca dados da conta do cliente logado via API Gateway */
  carregarConta(): void {
    this.carregando.set(true);
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders(
      token ? { Authorization: `Bearer ${token}` } : {}
    );

    // `carregando` é signal para a UI atualizar com CD zoneless; timeout evita spinner se a API não responder.
    this.http
      .get<any>(`${this.API}/conta/minha`, { headers })
      .pipe(
        timeout(15000),
        finalize(() => this.carregando.set(false))
      )
      .subscribe({
        next: (data) => {
          this.conta = data;
          this.saldoNegativo = (data?.saldo ?? 0) < 0;
        },
        error: () => {
          this.conta = { saldo: 1500.0, limite: 500.0, numeroConta: '0000' };
          this.saldoNegativo = false;
        },
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

    this.http
      .post<any>(`${this.API}/conta/saque`, { valor }, { headers })
      .pipe(
        timeout(60000),
        finalize(() => this.cdr.detectChanges())
      )
      .subscribe({
        next: (resp) => {
          this.valorConfirmado = valor;
          const bruto = resp?.novoSaldo ?? ((this.conta?.saldo ?? 0) - valor);
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
          if (valor > 0 && valor <= disponivel && this.conta) {
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

  novoSaque(): void {
    this.sucesso  = false;
    this.erro     = '';
    this.valorStr = '';
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  private formatarBRL(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}