import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listar-gerentes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listar-gerentes.html',
})
export class ListarGerentes {
  gerentes: Array<{ nome: string; cpf: string; email: string; telefone: string }> = [];
  carregando = false;
  erro = '';
  sucesso = '';

  private readonly storageKey = 'gerentes';

  constructor(private router: Router) {
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.erro = '';
    try {
      const lista = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      this.gerentes = Array.isArray(lista) ? lista : [];
      this.gerentes.sort((a, b) => (a.nome || '').localeCompare(b.nome || ''));
    } catch {
      this.erro = 'Não foi possível carregar os gerentes.';
      this.gerentes = [];
    } finally {
      this.carregando = false;
    }
  }

  inserir(): void {
    this.router.navigate(['/admin/gerentes/inserir']);
  }

  editar(cpf: string): void {
    this.router.navigate(['/admin/gerentes/editar', cpf]);
  }

  confirmarRemocao(cpf: string): void {
    const ok = window.confirm('Deseja remover este gerente?');
    if (!ok) return;

    this.gerentes = this.gerentes.filter((g) => g.cpf !== cpf);
    localStorage.setItem(this.storageKey, JSON.stringify(this.gerentes));
    this.sucesso = 'Gerente removido com sucesso.';
  }

  voltar(): void {
    this.router.navigate(['/admin']);
  }
}