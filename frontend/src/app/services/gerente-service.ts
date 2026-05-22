import { Injectable } from '@angular/core';
import { Cliente } from '../shared/models/cliente.model';
import { ClienteService } from './cliente-service';
import { Gerente } from '../shared/models/gerente.model';

@Injectable({
  providedIn: 'root',
})
export class GerenteService {
  rejeitarCliente(cliente: Cliente, motivoRejeicao: string) {
    const motivo = (motivoRejeicao || '').trim();
    if (!motivo) return;
    const pendentes = this.listarPendentes().filter((c) => c.cpf !== cliente.cpf);
    localStorage.setItem('clientesTemp', JSON.stringify(pendentes));

    cliente.motivoRecusa = motivo;
    cliente.dataRejeicao = new Date().toISOString();
    cliente.estado = 'Rejeitado';

    const recusados = JSON.parse(localStorage.getItem('clientesRecusados') || '[]') as Cliente[];
    recusados.push(cliente);
    localStorage.setItem('clientesRecusados', JSON.stringify(recusados));
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
      .find((c: Cliente) => (c.cpf || '').replace(/\D/g, '') === n);
  }

  aprovarCliente(cliente: Cliente) {
    const conta = Math.floor(1000 + Math.random() * 9000).toString();
    const limite = cliente.salario >= 2000 ? cliente.salario / 2 : 0;
    cliente.conta = conta;
    cliente.limite = limite;
    cliente.estado = 'Aprovado';
    cliente.senha = cliente.senha || 'tads';

    const pendentes = this.listarPendentes().filter((c) => c.cpf !== cliente.cpf);
    localStorage.setItem('clientesTemp', JSON.stringify(pendentes));

    const aprovados = JSON.parse(localStorage.getItem('clientesAprovados') || '[]') as Cliente[];
    aprovados.push(cliente);
    localStorage.setItem('clientesAprovados', JSON.stringify(aprovados));
  }
  listarPendentes(): Cliente[] {
    return this.clienteService.getClientesTempLocalStorage();
  }
}
