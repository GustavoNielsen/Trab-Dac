import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cliente } from '../../../shared/models/cliente.model';
import { FormsModule, NgForm } from '@angular/forms';
import { ClienteService } from '../../../services/cliente-service';
import { provideNgxMask } from 'ngx-mask';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-autocadastro',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  providers: [provideNgxMask()],
  templateUrl: './auto-cadastro.html',
  styleUrls: ['./auto-cadastro.css'],
})
export class Autocadastro {
  cliente: Cliente = new Cliente();
  enviando = false;
  sucesso = false;
  erro = '';

  constructor(private clienteService: ClienteService) {}

  cadastrar(form: NgForm): void {
    if (form.invalid || this.enviando) {
      return;
    }

    this.enviando = true;
    this.erro = '';
    this.sucesso = false;

    const salarioString = String(this.cliente.salario)
      .replace(/\./g, '')
      .replace(',', '.')
      .replace('R$', '')
      .trim();
    this.cliente.salario = parseFloat(salarioString || '0');

    this.clienteService.autocadastrar(this.cliente).subscribe({
      next: () => {
        this.sucesso = true;
        this.enviando = false;
        this.limparFormulario(form);
      },
      error: (err: Error) => {
        this.erro = err.message;
        this.enviando = false;
      },
    });
  }

  limparFormulario(form: NgForm): void {
    form.reset();
    this.cliente = new Cliente();
  }

  consultaCEP(): void {
    const cep = this.cliente.cep;
    if (cep && cep.length === 9) {
      this.clienteService.buscaCep(cep).subscribe({
        next: (dadosCep: any) => {
          if (dadosCep && !dadosCep.erro) {
            this.cliente.endereco = dadosCep.logradouro;
            this.cliente.bairro = dadosCep.bairro;
            this.cliente.cidade = dadosCep.localidade;
            this.cliente.uf = dadosCep.uf;
          } else {
            alert('CEP inválido ou não encontrado.');
            this.limparCamposEndereco();
          }
        },
        error: () => {
          alert('Erro ao buscar CEP.');
          this.limparCamposEndereco();
        },
      });
    }
  }

  private limparCamposEndereco(): void {
    this.cliente.endereco = '';
    this.cliente.bairro = '';
    this.cliente.cidade = '';
    this.cliente.uf = '';
  }
}
