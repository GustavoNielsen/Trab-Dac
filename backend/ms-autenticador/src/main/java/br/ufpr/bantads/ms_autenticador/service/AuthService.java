package br.ufpr.bantads.ms_autenticador.service;

import br.ufpr.bantads.ms_autenticador.repository.AuthRepository;
import org.springframework.stereotype.Service;
import java.util.Optional;
import org.springframework.security.crypto.password.PasswordEncoder;
import br.ufpr.bantads.ms_autenticador.UsuarioAuth;

@Service
public class AuthService {

    private final AuthRepository authRepository;
    private final PasswordEncoder passwordEncoder;

    // O Spring injeta automaticamente estas dependências aqui no construtor
    public AuthService(AuthRepository authRepository, PasswordEncoder passwordEncoder) {
        this.authRepository = authRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Optional<UsuarioAuth> findByLogin(String login) {
        return authRepository.findByLogin(login);
    }

    public Optional<UsuarioAuth> fazerLogin(String login, String senha) {
        Optional<UsuarioAuth> usuarioOpt = authRepository.findByLogin(login);
        if (usuarioOpt.isPresent()) {
            UsuarioAuth usuario = usuarioOpt.get();
            if (passwordEncoder.matches(senha, usuario.getSenha())) {
                return Optional.of(usuario);
            }
        }
        return Optional.empty();
    }
    
}
