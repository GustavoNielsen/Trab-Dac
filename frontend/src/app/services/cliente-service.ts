import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Cliente } from '../shared/models/cliente.model';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private readonly VIA_CEP_URL = 'https://viacep.com.br/ws/';
  private readonly gatewayUrl = 'http://localhost:3000';
  private readonly LOCAL_STORAGE_KEY = 'clientesTemp';

  constructor(private http: HttpClient) {}

  /** Legado — telas de gerente ainda não migradas para API. */
  getClientesTempLocalStorage(): Cliente[] {
    const clientesJson = localStorage.getItem(this.LOCAL_STORAGE_KEY);
    return clientesJson ? JSON.parse(clientesJson) : [];
  }

  listarClientesLocalStorage(): Cliente[] {
    return this.getClientesTempLocalStorage();
  }

  salvarClientesLocalStorage(cliente: Cliente): void {
    const clientes = this.getClientesTempLocalStorage();
    clientes.push(cliente);
    localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(clientes));
  }

  /** Stub até integração com ms-conta via gateway. */
  consultarExtratoPorConta(_numeroConta: string, _inicio: Date, _fim: Date): any[] {
    return [];
  }

  autocadastrar(cliente: Cliente): Observable<void> {
    const payload = {
      cpf: this.somenteDigitos(cliente.cpf),
      nome: cliente.nome,
      email: cliente.email,
      telefone: cliente.telefone,
      salario: cliente.salario,
      endereco: cliente.endereco,
      numero: cliente.numero,
      complemento: cliente.complemento,
      cep: cliente.cep,
      bairro: cliente.bairro,
      cidade: cliente.cidade,
      uf: cliente.uf,
    };

    return this.http.post<void>(`${this.gatewayUrl}/clientes`, payload).pipe(
      catchError((error: HttpErrorResponse) => {
        const msg =
          error.status === 409
            ? 'Já existe uma solicitação para este CPF.'
            : error.error?.message || 'Não foi possível enviar a solicitação.';
        return throwError(() => new Error(msg));
      })
    );
  }

  listarPendentes(): Observable<any[]> {
    const token = localStorage.getItem('token') ?? localStorage.getItem('access_token');
    return this.http.get<any[]>(`${this.gatewayUrl}/clientes`, {
      params: { filtro: 'para_aprovar' },
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  buscaCep(cep: string): Observable<any> {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) {
      return throwError(() => new Error('CEP inválido.'));
    }
    return this.http.get(`${this.VIA_CEP_URL}${cleanCep}/json/`).pipe(
      catchError(() => throwError(() => new Error('Erro ao buscar CEP.')))
    );
  }

  private somenteDigitos(valor: string): string {
    return (valor || '').replace(/\D/g, '');
  }
}
