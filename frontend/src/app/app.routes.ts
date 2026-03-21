import { Routes } from '@angular/router';
import { Autocadastro } from './pages/cliente/autocadastro/auto-cadastro';

export const routes: Routes = [
    { path: '', redirectTo: 'cadastro', pathMatch: 'full' },
    { path: 'cadastro', component: Autocadastro }
];
