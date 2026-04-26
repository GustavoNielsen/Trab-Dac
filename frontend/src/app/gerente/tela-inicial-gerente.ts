import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Cliente } from '../shared/models/cliente.model';
import { GerenteService } from '../services/gerente-service';
import { ModalRejeitarClienteComponent } from './modal-rejeitarcliente';
import { ClienteService } from '../services/cliente-service';


@Component({
  selector: 'app-tela-inicial',
  standalone: true,
  imports: [CommonModule],
  providers: [NgbActiveModal],
  templateUrl: './tela-inicial-gerente.html',
  //styleUrl: './tela-inicial-gerente.css'
})
export class TelaInicialGerente implements OnInit {
  pedidos: Cliente[] = [];
  mensagem: string = '';

  private modalService = inject(NgbModal);

  constructor(
    private gerenteService: GerenteService,
//    private modalService: NgbModal,
    private clienteService: ClienteService
  ) {}

  ngOnInit(): void {
    this.pedidos = this.gerenteService.listarPendentes();
  }

  aprovar(cliente: Cliente) {
    this.gerenteService.aprovarCliente(cliente);
    this.pedidos = this.gerenteService.listarPendentes();
    this.mensagem = `✅ Cliente ${cliente.nome} aprovado! Conta: ${cliente.conta}, Limite: R$ ${cliente.limite?.toFixed(2)}.`;
  }

abrirModalRecusar(cliente: Cliente) {
  const modalRef = this.modalService.open(ModalRejeitarClienteComponent, {
    backdrop: 'static',
    centered: true
  });
   
  modalRef.componentInstance.cliente = cliente;

  modalRef.result.then(
    (motivoRejeicao: string) => {
      // motivoRejeicao vem quando o modal foi fechado via close(motivo)
      if (!motivoRejeicao || !motivoRejeicao.trim()) {
        console.log('Rejeição cancelada ou sem motivo.');
        return;
      }
      this.gerenteService.rejeitarCliente(cliente, motivoRejeicao);
      this.pedidos = this.gerenteService.listarPendentes();
      this.mensagem = `❌ Cliente ${cliente.nome} rejeitado. Motivo: ${motivoRejeicao}`;
    },
    (reason: any) => {
      // dismissed (botão fechar ou ESC)
      console.log('Modal fechado/dismissed:', reason);
    }
  );
}

}
