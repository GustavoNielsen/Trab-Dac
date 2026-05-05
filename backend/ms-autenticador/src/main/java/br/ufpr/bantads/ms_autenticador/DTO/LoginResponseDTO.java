package br.ufpr.bantads.ms_autenticador.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponseDTO {
    private String access_token;
    private String token_type;
    private String tipo;
    private UsuarioDTO usuario;
}