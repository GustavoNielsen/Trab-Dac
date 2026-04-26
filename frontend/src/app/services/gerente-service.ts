import { Injectable } from '@angular/core';
import { Cliente } from '../shared/models/cliente.model';
import { ClienteService } from './cliente-service';
import { Gerente } from '../shared/models/gerente.model';

@Injectable({
  providedIn: 'root',
})
export class GerenteService {
  rejeitarCliente(cliente: Cliente, motivoRejeicao: string) {
    throw new Error('Method not implemented.');
  }
  
  constructor(private clienteService: ClienteService) {}

  cpfLogado: String = '';

  // Implementar a lógica para buscar o cpf do gerente logado
  obtemCpf(gerente: Gerente): string {
    return gerente.cpf;
  }

  consultar3MelhoresClientes(): Cliente[] {
    const clientes: Cliente[] = [];
    return clientes;
  }

  /** Busca cliente por CPF (normalizado) no armazenamento local — substituir por API. */
  consultarCliente(cpf: string): Cliente | undefined {
    const n = (cpf || '').replace(/\D/g, '');
    return this.clienteService
      .getClientesTempLocalStorage()
      .find((c) => (c.cpf || '').replace(/\D/g, '') === n);
  }

  aprovarCliente(cliente: Cliente) {
    throw new Error('Method not implemented.');
  }
  listarPendentes(): Cliente[] {
    throw new Error('Method not implemented.');
  }
}
