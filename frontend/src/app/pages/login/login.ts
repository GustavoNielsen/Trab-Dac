import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule, Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html'
})
export class Login {
  credentials = { email: '', senha: '' };
  error = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  onSubmit() {
    this.authService.login(this.credentials).subscribe({
      next: (res: any) => {
        const role = res.tipo;
        if (role === 'CLIENTE') this.router.navigate(['/cliente']);
        else if (role === 'GERENTE') this.router.navigate(['/gerente/aprovar']);
        else if (role === 'ADMINISTRADOR') this.router.navigate(['/admin']);
      },
      error: () => this.error = 'E-mail ou senha inválidos.'
    });
  }
}