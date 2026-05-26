package br.ufpr.bantads.ms_autenticador.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioDTO {
    private String id;
    private String cpf;
    private String nome;
    private String email;
}
