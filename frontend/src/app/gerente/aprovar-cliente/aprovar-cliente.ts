import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../services/cliente-service';

@Component({
  selector: 'app-aprovar-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './aprovar-cliente.html',
  styleUrl: './aprovar-cliente.css',
})
export class AprovarCliente implements OnInit {
  clientesPendentes: any[] = [];
  mensagem = '';
  sucesso = false;
  erro = '';
  carregando = true;

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.carregarPendentes();
  }

  carregarPendentes(): void {
    this.carregando = true;
    this.clienteService.listarPendentes().subscribe({
      next: (lista) => {
        this.clientesPendentes = lista;
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Não foi possível carregar os pedidos de autocadastro.';
        this.carregando = false;
      },
    });
  }
}
