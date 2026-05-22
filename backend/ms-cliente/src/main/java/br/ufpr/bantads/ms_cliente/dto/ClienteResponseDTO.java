package br.ufpr.bantads.ms_cliente.dto;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ClienteResponseDTO {
    private String cpf;
    private String nome;
    private String email;
    private String telefone;
    private BigDecimal salario;
    private String logradouro;
    private String numero;
    private String complemento;
    private String cep;
    private String bairro;
    private String cidade;
    private String estado;
    private String gerenteCpf;
    private String status;
}
