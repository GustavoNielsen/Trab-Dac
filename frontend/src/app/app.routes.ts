import { Routes } from '@angular/router';
import { Autocadastro } from './pages/cliente/autocadastro/auto-cadastro';
import { TelaInicialCliente } from './pages/cliente/tela-inicial-cliente/tela-inicial-cliente';
import { Deposito } from './pages/cliente/deposito/deposito';
import { Saque } from './pages/cliente/saque/saque';
import { AprovarCliente } from './gerente/aprovar-cliente/aprovar-cliente';
import { Consultar3Clientes } from './gerente/consultar-3-clientes/consultar-3-clientes';

export const routes: Routes = [
    { path: '', redirectTo: 'cadastro', pathMatch: 'full' },
    { path: 'cadastro', component: Autocadastro },

    // Cliente
    { path: 'cliente', component: TelaInicialCliente },
    { path: 'deposito', component: Deposito },
    { path: 'cliente/deposito', component: Deposito },
    { path: 'cliente/saque', component: Saque }, 

    // Gerente
    { path: 'gerente/aprovar', component: AprovarCliente },
    { path: 'gerente/top3', component: Consultar3Clientes },

    // Fallback
    { path: '**', redirectTo: 'cadastro' }
];
