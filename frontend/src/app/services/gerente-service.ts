import { Injectable } from '@angular/core';
import { Cliente } from '../shared/models/cliente.model';
import { ClienteService } from './cliente-service';

@Injectable({
  providedIn: 'root',
})
export class GerenteService {
  constructor(private clienteService: ClienteService) {}

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
}
