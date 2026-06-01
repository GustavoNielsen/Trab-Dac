import { Routes } from '@angular/router';
import { Autocadastro } from './pages/cliente/autocadastro/auto-cadastro';
import { TelaInicialCliente } from './pages/cliente/tela-inicial-cliente/tela-inicial-cliente';
import { Deposito } from './pages/cliente/deposito/deposito';
import { Saque } from './pages/cliente/saque/saque';
import { Transferencia } from './pages/cliente/transferencia/transferencia';
import { Extrato } from './pages/cliente/extrato/extrato';
import { AprovarCliente } from './gerente/aprovar-cliente/aprovar-cliente';
import { Consultar3Clientes } from './gerente/consultar-3-clientes/consultar-3-clientes';
import { Login } from './pages/login/login';
import { TelaInicialAdministrador } from './pages/administrador/tela-inicial-administrador/tela-inicial-administrador';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: Login },
    { path: 'cadastro', component: Autocadastro },

    // Cliente
    { path: 'cliente', component: TelaInicialCliente, canActivate: [authGuard] },
    { path: 'deposito', component: Deposito, canActivate: [authGuard] },
    { path: 'cliente/deposito', component: Deposito, canActivate: [authGuard] },
    { path: 'cliente/saque', component: Saque, canActivate: [authGuard] },
    { path: 'cliente/transferencia', component: Transferencia, canActivate: [authGuard] },
    { path: 'cliente/extrato', component: Extrato, canActivate: [authGuard] },

    // Gerente
    { path: 'gerente/aprovar', component: AprovarCliente, canActivate: [authGuard] },
    { path: 'gerente/top3', component: Consultar3Clientes, canActivate: [authGuard] },

    // Admin
    { path: 'admin', component: TelaInicialAdministrador, canActivate: [authGuard] },

    // Fallback
    { path: '**', redirectTo: 'login' }
];
