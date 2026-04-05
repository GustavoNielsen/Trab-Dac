// src/app/services/cliente-service.ts
import { Injectable } from '@angular/core';
import { Cliente } from '../shared/models/cliente.model';
import { HttpClient } from '@angular/common/http'; // Importar HttpClient
import { Observable, throwError } from 'rxjs'; // Importar Observable e throwError
import { catchError } from 'rxjs/operators'; // Importar catchError

@Injectable({
  providedIn: 'root',
} )
export class ClienteService {
  private readonly VIA_CEP_URL = 'https://viacep.com.br/ws/';
  private readonly LOCAL_STORAGE_KEY = 'clientesTemp';

  constructor(private http: HttpClient ) {}

  salvarClientesLocalStorage(cliente: Cliente): void {
    let clientes: Cliente[] = this.getClientesTempLocalStorage();
    clientes.push(cliente);
    localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(clientes));
  }

  salvarClientesTempLocalStorage(cliente: Cliente): void {
    this.salvarClientesLocalStorage(cliente);
  }

  getClientesTempLocalStorage(): Cliente[] {
    const clientesJson = localStorage.getItem(this.LOCAL_STORAGE_KEY);
    return clientesJson ? JSON.parse(clientesJson) : [];
  }

  listarClientesLocalStorage(): any[] {
    return this.getClientesTempLocalStorage();
  }

  /** Extrato por conta e período — stub até integração com gateway. */
  consultarExtratoPorConta(_numeroConta: string, _inicio: Date, _fim: Date): any[] {
    return [];
  }

  buscaCep(cep: string): Observable<any> {
    // Remove caracteres não numéricos do CEP
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) {
      // Retorna um Observable de erro se o CEP for inválido
      return throwError(() => new Error('CEP inválido.'));
    }
    return this.http.get(`${this.VIA_CEP_URL}${cleanCep}/json/` ).pipe(
      catchError(error => {
        console.error('Erro ao buscar CEP:', error);
        return throwError(() => new Error('Erro ao buscar CEP.'));
      })
    );
  }
}