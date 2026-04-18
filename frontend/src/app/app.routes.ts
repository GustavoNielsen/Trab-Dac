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

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: Login },
    //{ path: '', redirectTo: 'cadastro', pathMatch: 'full' },
    { path: 'cadastro', component: Autocadastro },

    // Cliente
    { path: 'cliente', component: TelaInicialCliente },
    { path: 'deposito', component: Deposito },
    { path: 'cliente/deposito', component: Deposito },
    { path: 'cliente/saque', component: Saque },
    { path: 'cliente/transferencia', component: Transferencia },
    { path: 'cliente/extrato', component: Extrato },

    // Gerente
    { path: 'gerente/aprovar', component: AprovarCliente },
    { path: 'gerente/top3', component: Consultar3Clientes },

    // Fallback
    { path: '**', redirectTo: 'cadastro' }
];
