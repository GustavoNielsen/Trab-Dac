import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  credentials = { email: '', senha: '' };
  error = '';
  loading = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  onSubmit(): void {
    this.error = '';
    this.loading = true;

    this.authService.login(this.credentials).subscribe({
      next: (res: any) => {
        this.loading = false;
        const role = res.tipo;
        if (role === 'CLIENTE') {
          this.router.navigate(['/cliente']);
        } else if (role === 'GERENTE') {
          this.router.navigate(['/gerente/aprovar']);
        } else if (role === 'ADMINISTRADOR') {
          this.router.navigate(['/admin']);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        if (typeof err.error === 'string') {
          this.error = err.error;
        } else {
          this.error = err.error?.message || 'E-mail ou senha inválidos.';
        }
      },
    });
  }
}
