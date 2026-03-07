import { Routes } from '@angular/router';
import { AutoCadastro } from './cliente/pages/auto-cadastro/auto-cadastro';

export const routes: Routes = [
    { path: '', redirectTo: 'cadastro', pathMatch: 'full'},
    { path: 'cadastro', component: AutoCadastro }
];
