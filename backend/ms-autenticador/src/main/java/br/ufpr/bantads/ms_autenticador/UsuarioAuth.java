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
    private String id; // No MongoDB, o ID costuma ser uma String (o famoso ObjectId)
    
    private String login;
    private String senha;
    private String perfil;

}
