package br.ufpr.bantads.ms_gerente.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GerenteResponseDTO {
    private String cpf;
    private String nome;
    private String email;
    private String telefone;
    private String tipo;
}
