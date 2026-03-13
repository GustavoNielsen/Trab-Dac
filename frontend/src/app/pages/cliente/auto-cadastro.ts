// src/app/autocadastro/autocadastro.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cliente } from '../../shared/models/cliente.model';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../services/cliente-service';
import { provideNgxMask } from 'ngx-mask';
import { HttpClientModule } from '@angular/common/http'; // Importar HttpClientModule


@Component({
  selector: 'app-autocadastro',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule], // Adicionar HttpClientModule aqui
  providers: [provideNgxMask( ), ClienteService], // Adicionar ClienteService aos providers
  templateUrl: './auto-cadastro.html',
  styleUrls: ['./auto-cadastro.css']
})
export class Autocadastro {

  constructor(private router: Router,
              private clienteService: ClienteService) { }

  cliente: Cliente = new Cliente();

  cadastrarUsuarioLocalStorage(form: NgForm){
    if (form.invalid) {
      console.log("Formulário inválido, preencha todos os campos obrigatórios!");
      return;
    }else{
      const salarioString = String(this.cliente.salario)
        .replace(/\./g, '')     // remove separador de milhar
        .replace(',', '.')     // substitui vírgula por ponto decimal
        .replace('R$', '')     // remove prefixo, se houver
        .trim();

      this.cliente.salario = parseFloat(salarioString || '0'); 
      
      this.clienteService.salvarClientesTempLocalStorage(this.cliente);
      alert('Cliente cadastrado com sucesso!');
      this.limparFormulario(form);     
      this.voltarLogin();
    }
  }

  limparFormulario(form: NgForm) {
    form.reset();
    this.cliente = new Cliente(); // Resetar o objeto cliente também
  }

  voltarLogin() {
    this.router.navigate(['login']);
  }

  consultaCEP() {
    const cep = this.cliente.cep;
    if (cep && cep.length === 9) { // Verifica se o CEP tem o formato completo (ex: 00000-000)
      this.clienteService.buscaCep(cep).subscribe({
        next: (dadosCep: any) => {
          if (dadosCep && !dadosCep.erro) {
            this.cliente.endereco = dadosCep.logradouro;
            this.cliente.bairro = dadosCep.bairro;
            this.cliente.cidade = dadosCep.localidade;
            this.cliente.uf = dadosCep.uf;
          } else {
            console.log('CEP inválido ou não encontrado.');
            alert('CEP inválido ou não encontrado. Por favor, verifique o CEP digitado.');
            this.limparCamposEndereco();
          }
        },
        error: (error) => {
          console.error('Erro ao buscar CEP:', error);
          alert('Erro ao buscar CEP. Por favor, tente novamente mais tarde.');
          this.limparCamposEndereco();
        }
      });
    } else if (cep && cep.length > 0) {
      console.log('Formato de CEP inválido. Digite um CEP no formato 00000-000.');
      alert('Formato de CEP inválido. Digite um CEP no formato 00000-000.');
      this.limparCamposEndereco();
    }
  }

  private limparCamposEndereco() {
    this.cliente.endereco = '';
    this.cliente.bairro = '';
    this.cliente.cidade = '';
    this.cliente.uf = '';
  }
}







// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Cliente } from '../../shared/models/cliente.model';
// import { Router } from '@angular/router';
// import { NgForm } from '@angular/forms';
// import { FormsModule } from '@angular/forms';
// import { ClienteService } from '../../services/cliente-service';
// import { provideNgxMask } from 'ngx-mask';

// @Component({

//   selector: 'app-autocadastro',
//   standalone: true,
//   imports: [FormsModule, CommonModule],
//   providers: [provideNgxMask()],
//   templateUrl: './auto-cadastro.html',
//   styleUrls: ['./auto-cadastro.css']

// })

// export class Autocadastro {


//   // injeção das dependências

//   constructor(private router: Router,

//     private clienteService: ClienteService) { }

//     cliente: Cliente = new Cliente();

//   // cliente: Cliente = new Cliente(
//   //   '', // cpf
//   //   '', // nome
//   //   '', // email
//   //   '', // telefone
//   //   0,  // salario
//   //   '', // endereco
//   //   '', // cep
//   //   '', // complemento
//   //   '', // numero
//   //   '', // bairro
//   //   '', // cidade
//   //   '', // uf
//   //   0,  // saldo
//   //   0   // limite
//   // );

//   cadastrarUsuarioLocalStorage(form: NgForm) {
//     if (form.invalid) {
//       console.log("Formulário inválido, preencha todos os campos obrigatórios!");
//       return;
//     } else {
//     // Garante que o valor seja uma string e remove formatações indesejadas
//     const salarioString = String(this.cliente.salario)
//       .replace(/\./g, '')     // remove separador de milhar
//       .replace(',', '.')     // substitui vírgula por ponto decimal
//       .replace('R$', '')     // remove prefixo, se houver
//       .trim();

//     // Converte para float, usando 0 como fallback se a conversão falhar
//     this.cliente.salario = parseFloat(salarioString || '0'); 
    
//     this.clienteService.salvarClientesTempLocalStorage(this.cliente);
//     alert('Cliente cadastrado com sucesso!');
//     this.limparFormulario(form);     
//     this.voltarLogin();
//   }
// }

//   limparFormulario(form: NgForm) {
//     form.reset();
//   }

//   voltarLogin() {
//     this.router.navigate(['login']);
//   }

//   consultaCEP() {
//     /*
//     //chamo o microserviço para buscar o CEP
//     const cep = this.cliente.cep;
//     //recebo o observable porém só pego os dados de interesse (motivo do 'any')
//     this.clienteService.buscaCep(cep).subscribe((dadosCep: any) => {
//       //em caso de sucesso
//       if (dadosCep && !dadosCep.erro) {
//         this.cliente.endereco = dadosCep.logradouro;
//         this.cliente.cep = dadosCep.cep;
//       } else {
//         // CEP inválido ou não encontrado
//         console.log('Digite um CEP válido.');
//       }

//     });
//     */
//    console.log(this.cliente.cep)
//   }

// } 