import { Injectable } from '@angular/core';
import { Cliente } from '../shared/models/cliente.model';

@Injectable({
  providedIn: 'root',
})
export class GerenteService {
  consultar3MelhoresClientes(): Cliente[] {
    // TODO implementar lógica
    let clientes : Cliente[] = []
    return clientes
  }
}
