package br.ufpr.bantads.ms_autenticador.service;

import br.ufpr.bantads.ms_autenticador.repository.AuthRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import java.util.Optional;
import org.springframework.security.crypto.password.PasswordEncoder;
import br.ufpr.bantads.ms_autenticador.UsuarioAuth;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthRepository authRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    // O Spring injeta automaticamente estas dependências aqui no construtor
    // public AuthService(AuthService authRepository, PasswordEncoder passwordEncoder) {
    //     this.authRepository = authRepository;
    //     this.passwordEncoder = passwordEncoder;
    // }

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

    public LoginResponseDTO login(LoginRequestDTO request) {
        UsuarioAuth user = authRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!passwordEncoder.matches(request.getSenha(), user.getSenha())) {
            throw new RuntimeException("Senha inválida");
        }

        String token = jwtService.generateToken(user.getEmail(), user.getTipo());
        return LoginResponseDTO.builder()
                .access_token(token)
                .token_type("bearer")
                .tipo(user.getTipo())
                .usuario(UsuarioDTO.builder().id(user.getId()).cpf(user.getCpf()).nome(user.getNome()).email(user.getEmail()).build())
                .build();
    }

    
}
