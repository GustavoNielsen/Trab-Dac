import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface Gerente {
  cpf: string;
  nome: string;
  email: string;
  telefone: string;
}

@Component({
  selector: 'app-listar-gerentes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './listar-gerentes.html',
})
export class ListarGerentes implements OnInit {

  gerentes: Gerente[] = [];
  carregando = false;
  erro = '';
  sucesso = '';

  private readonly API = 'http://localhost:3000';

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.erro = '';

    const headers = this.headers();

    this.http.get<Gerente[]>(`${this.API}/admin/gerentes`, { headers }).subscribe({
      next: (data) => {
        // R19: ordenar crescente por nome
        this.gerentes = data.sort((a, b) => a.nome.localeCompare(b.nome));
        this.carregando = false;
      },
      error: () => {
        this.gerentes = [
          { cpf: '64065268052', nome: 'Godophredo', email: 'ger2@bantads.com.br', telefone: '(41) 99999-0002' },
          { cpf: '98574307084', nome: 'Geniéve',    email: 'ger1@bantads.com.br', telefone: '(41) 99999-0001' },
          { cpf: '23862179060', nome: 'Gyândula',   email: 'ger3@bantads.com.br', telefone: '(41) 99999-0003' },
        ].sort((a, b) => a.nome.localeCompare(b.nome));
        this.carregando = false;
      }
    });
  }

  editar(cpf: string): void {
    this.router.navigate(['/admin/gerentes/alterar', cpf]);
  }

  confirmarRemocao(cpf: string): void {
    this.router.navigate(['/admin/gerentes/remover', cpf]);
  }

  inserir(): void {
    this.router.navigate(['/admin/gerentes/inserir']);
  }

  voltar(): void {
    this.router.navigate(['/admin']);
  }

  private headers(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
}
