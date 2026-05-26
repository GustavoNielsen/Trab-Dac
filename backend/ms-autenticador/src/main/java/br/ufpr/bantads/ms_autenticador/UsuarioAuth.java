package br.ufpr.bantads.ms_autenticador;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "usuarios_auth")
public class UsuarioAuth {

    @Id
    private String id;

    @Indexed(unique = true)
    private String cpf;

    private String nome;

    @Indexed(unique = true)
    private String email;

    private String senha;

    /** CLIENTE, GERENTE ou ADMINISTRADOR */
    private String tipo;

    /** false enquanto autocadastro aguarda aprovação */
    private boolean ativo = true;
}
