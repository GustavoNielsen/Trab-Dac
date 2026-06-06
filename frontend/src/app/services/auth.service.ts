import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; senha: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((res: any) => {
        this.persistSession(res);
      })
    );
  }

  logout(): Observable<void> {
    const token = this.getToken();
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : undefined;

    return this.http.post<void>(`${this.apiUrl}/logout`, {}, { headers }).pipe(
      catchError(() => of(void 0)),
      tap(() => this.clearSession())
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token') ?? localStorage.getItem('access_token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  getUser<T = any>(): T | null {
    const raw = localStorage.getItem('user');
    return raw ? (JSON.parse(raw) as T) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private persistSession(res: any): void {
    localStorage.setItem('token', res.access_token);
    localStorage.setItem('access_token', res.access_token);
    localStorage.setItem('user', JSON.stringify(res.usuario));
    localStorage.setItem('role', res.tipo);
  }

  private clearSession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
  }
}
