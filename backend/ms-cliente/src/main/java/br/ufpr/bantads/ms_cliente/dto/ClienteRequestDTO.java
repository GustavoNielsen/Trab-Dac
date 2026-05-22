package br.ufpr.bantads.ms_cliente.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class ClienteRequestDTO {
    private String cpf;
    private String nome;
    private String email;
    private String telefone;
    private BigDecimal salario;
    private String endereco;
    private String logradouro;
    private String numero;
    private String complemento;
    private String cep;
    private String bairro;
    private String cidade;
    private String uf;
    private String estado;
    private String gerenteCpf;
}
