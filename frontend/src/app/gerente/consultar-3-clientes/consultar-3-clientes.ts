import { Component, OnInit } from '@angular/core';
import { Cliente } from '../../../shared/models/cliente.model';
import { GerenteService } from '../../../services/gerente-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-consultar-3-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './consultar-3-clientes.html',
  styleUrl: './consultar-3-clientes.css'
})
export class Consultar3Clientes implements OnInit {
  melhores: Cliente[] = [];

  constructor(private gerenteService: GerenteService) {}

  ngOnInit() {
    this.melhores = this.gerenteService.consultar3MelhoresClientes();
  }
}
