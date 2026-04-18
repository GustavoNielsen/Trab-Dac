package br.ufpr.bantads.ms_autenticador;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@Document(collection = "usuarios_auth")
public class UsuarioAuth {
    
    @Id
    private String id;
    private String cpf;
    private String nome;
    private String email;
    private String senha;
    private String tipo; // CLIENTE, GERENTE, ADMINISTRADOR
}
