import { Component } from '@angular/core';
import { Cliente } from '../../../shared/models/cliente.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GerenteService } from '../../../services/gerente-service';

@Component({
  selector: 'app-visualizar-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './visualizar-clientes.html',
  styleUrl: './visualizar-clientes.css'
})
export class VisualizarClientes {
  pesquisa: string = '';
  clientes: Cliente[] = [];

  constructor(private gerenteService: GerenteService) {
    this.carregarClientes();
  }

  carregarClientes() {
    const todosClientes = JSON.parse(localStorage.getItem('clientes') || '[]') as Cliente[];
    this.clientes = todosClientes.filter(c => c.cpfGerente === this.gerenteService.cpfLogado);
  }

  get clientesFiltrados(): Cliente[] {
    return this.clientes
      .filter(c =>
        c.nome.toLowerCase().includes(this.pesquisa.toLowerCase()) ||
        c.cpf.includes(this.pesquisa)
      )
      .sort((a, b) => a.nome.localeCompare(b.nome));
  }
}
