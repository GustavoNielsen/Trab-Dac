import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-editar-gerente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-gerentes.html',
})
export class EditarGerente implements OnInit {

  gerente = {
    cpf: '',
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
  };

  carregando = false;
  enviando = false;
  sucesso = false;
  erro = '';

  private readonly API = 'http://localhost:3000';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const cpf = this.route.snapshot.paramMap.get('cpf');
    if (cpf) this.carregarGerente(cpf);
  }

  carregarGerente(cpf: string): void {
    this.carregando = true;
    const headers = this.headers();

    this.http.get<any>(`${this.API}/admin/gerentes/${cpf}`, { headers }).subscribe({
      next: (data) => {
        this.gerente.cpf   = data.cpf;
        this.gerente.nome  = data.nome;
        this.gerente.email = data.email;
        this.carregando = false;
      },
      error: () => {
        // Mock: preenche com dados fictícios para desenvolvimento
        this.gerente = { cpf, nome: 'Geniéve', email: 'ger1@bantads.com.br', senha: '', confirmarSenha: '' };
        this.carregando = false;
      }
    });
  }

  salvar(form: NgForm): void {
    if (form.invalid) return;

    if (this.gerente.senha && this.gerente.senha !== this.gerente.confirmarSenha) {
      this.erro = 'As senhas não conferem.';
      return;
    }

    this.enviando = true;
    this.erro = '';

    // R20: só permite alterar nome, e-mail e senha
    const payload: any = { nome: this.gerente.nome, email: this.gerente.email };
    if (this.gerente.senha) payload.senha = this.gerente.senha;

    this.http.put(`${this.API}/admin/gerentes/${this.gerente.cpf}`, payload, { headers: this.headers() })
      .subscribe({
        next: () => {
          this.sucesso = true;
          this.enviando = false;
        },
        error: (err) => {
          this.erro = err?.error?.message ?? 'Erro ao alterar gerente. Tente novamente.';
          this.enviando = false;
        }
      });
  }

  voltar(): void {
    this.router.navigate(['/admin/gerentes']);
  }

  private headers(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${localStorage.getItem('access_token')}` });
  }
}
