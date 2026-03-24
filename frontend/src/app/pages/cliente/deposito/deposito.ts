import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-deposito',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, DatePipe],
  templateUrl: './deposito.html',
  styleUrl: './deposito.css',
})
export class Deposito implements OnInit {

  carregando = false;
  enviando   = false;
  sucesso    = false;
  erro       = '';

  saldoNegativo = false;
  valorStr      = '';
  valorConfirmado = 0;
  novoSaldo     = 0;
  dataHora: Date = new Date();

  conta: any = null;

  constructor(public router: Router) {}

  ngOnInit(): void {
    // TODO: carregar dados reais da conta
  }

  voltar(): void {
    this.router.navigate(['/cliente']);
  }

  confirmar(form: NgForm): void {
    if (form.invalid) return;
    // TODO: lógica de depósito
  }

  novoDeposito(): void {
    this.sucesso  = false;
    this.erro     = '';
    this.valorStr = '';
  }
}