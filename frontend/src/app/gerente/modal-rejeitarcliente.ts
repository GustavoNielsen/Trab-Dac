import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Cliente } from '../shared/models/cliente.model';


@Component({
  selector: 'app-modal-rejeitar-cliente',
  imports: [CommonModule, FormsModule],
  templateUrl: 'modal-rejeitarcliente.html',
  //providers: [NgbActiveModal],
  //styleUrl: './modal-rejeitarcliente.css'
})
export class ModalRejeitarClienteComponent {
  @Input() cliente!: Cliente;

  motivoRejeicao: string = '';

  public activeModal = inject(NgbActiveModal);

  constructor(
    //public activeModal: NgbActiveModal,
    private router: Router
  ) {}

  private atualizarCliente() {
    const clientes = JSON.parse(localStorage.getItem('clientes') || '[]') as Cliente[];

    const index = clientes.findIndex(c => c.cpf === this.cliente.cpf);
    if (index !== -1) {
      clientes[index] = this.cliente;
      localStorage.setItem('clientes', JSON.stringify(clientes));
    }
  }

  confirmarRejeicao(): void {
  if (!this.motivoRejeicao.trim()) {
    alert('Por favor, informe o motivo da rejeição.');
    return;
  }

  this.cliente.motivoRecusa = this.motivoRejeicao;
  this.cliente.dataRejeicao = new Date().toISOString();
  this.cliente.estado = 'Rejeitado';

  let clientes = JSON.parse(localStorage.getItem('clientes') || '[]') as Cliente[];
  clientes = clientes.filter(c => c.cpf !== this.cliente.cpf);
  localStorage.setItem('clientes', JSON.stringify(clientes));

  const recusados = JSON.parse(localStorage.getItem('clientesRecusados') || '[]') as Cliente[];
  recusados.push(this.cliente);
  localStorage.setItem('clientesRecusados', JSON.stringify(recusados));

  alert(`Cliente rejeitado. Email enviado para ${this.cliente.email}.`);

  this.activeModal.close(this.motivoRejeicao);
  this.router.navigate(['/tela-inicial-gerente']);
}
}
