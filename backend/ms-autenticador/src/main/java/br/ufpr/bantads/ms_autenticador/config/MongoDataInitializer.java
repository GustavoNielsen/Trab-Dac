package br.ufpr.bantads.ms_autenticador.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import br.ufpr.bantads.ms_autenticador.UsuarioAuth;
import br.ufpr.bantads.ms_autenticador.repository.AuthRepository;
import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class MongoDataInitializer {

    private final AuthRepository authRepository;

    @Bean
    CommandLineRunner seedUsuarios() {
        return args -> {
            if (authRepository.count() > 0) {
                return;
            }

            String senhaHash = Sha256SaltPasswordEncoder.hash("tads");

            authRepository.save(usuario("cli1", "12912861012", "Catharyna", "cli1@bantads.com.br", senhaHash, "CLIENTE", true));
            authRepository.save(usuario("cli2", "09506382000", "Cleuddônio", "cli2@bantads.com.br", senhaHash, "CLIENTE", true));
            authRepository.save(usuario("cli3", "85733854057", "Catianna", "cli3@bantads.com.br", senhaHash, "CLIENTE", true));
            authRepository.save(usuario("cli4", "58872160006", "Cutardo", "cli4@bantads.com.br", senhaHash, "CLIENTE", true));
            authRepository.save(usuario("cli5", "76179646090", "Coândrya", "cli5@bantads.com.br", senhaHash, "CLIENTE", true));

            authRepository.save(usuario("ger1", "98574307084", "Geniéve", "ger1@bantads.com.br", senhaHash, "GERENTE", true));
            authRepository.save(usuario("ger2", "64065268052", "Godophredo", "ger2@bantads.com.br", senhaHash, "GERENTE", true));
            authRepository.save(usuario("ger3", "23862179060", "Gyândula", "ger3@bantads.com.br", senhaHash, "GERENTE", true));

            authRepository.save(usuario("adm1", "40501740066", "Adamântio", "adm1@bantads.com.br", senhaHash, "ADMINISTRADOR", true));
        };
    }

    private UsuarioAuth usuario(String id, String cpf, String nome, String email, String senha, String tipo, boolean ativo) {
        UsuarioAuth u = new UsuarioAuth();
        u.setId(id);
        u.setCpf(cpf);
        u.setNome(nome);
        u.setEmail(email);
        u.setSenha(senha);
        u.setTipo(tipo);
        u.setAtivo(ativo);
        return u;
    }
}
