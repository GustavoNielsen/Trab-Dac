package br.ufpr.bantads.ms_autenticador.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // Gera Getters, Setters
@AllArgsConstructor // Gera construtor com todos os argumentos
@NoArgsConstructor

public class LoginRequestDTO {
    private String email;
    private String senha;
    private TipoCliente tipo;  
    public enum TipoCliente {
        CLIENTE,
        GERENTE,
        ADMINISTRADOR
    }
}
