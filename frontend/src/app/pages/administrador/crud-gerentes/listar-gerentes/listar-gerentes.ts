import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-inserir-gerente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inserir-gerente.html',
})
export class InserirGerente {

  gerente = {
    cpf: '',
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    confirmarSenha: '',
  };

  enviando = false;
  sucesso = false;
  erro = '';

  private readonly API = 'http://localhost:3000';

  constructor(private router: Router, private http: HttpClient) {}

  salvar(form: NgForm): void {
    if (form.invalid) return;

    if (this.gerente.senha !== this.gerente.confirmarSenha) {
      this.erro = 'As senhas não conferem.';
      return;
    }

    this.enviando = true;
    this.erro = '';

    const { confirmarSenha, ...payload } = this.gerente;
    const headers = new HttpHeaders({ Authorization: `Bearer ${localStorage.getItem('access_token')}` });

    // R17: o back-end atribui automaticamente uma conta ao novo gerente (SAGA)
    this.http.post(`${this.API}/admin/gerentes`, payload, { headers }).subscribe({
      next: () => {
        this.sucesso = true;
        this.enviando = false;
      },
      error: (err) => {
        this.erro = err?.error?.message ?? 'Erro ao inserir gerente. Tente novamente.';
        this.enviando = false;
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/admin/gerentes']);
  }
}