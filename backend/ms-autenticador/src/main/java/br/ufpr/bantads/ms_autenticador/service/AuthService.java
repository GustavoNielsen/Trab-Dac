package br.ufpr.bantads.ms_autenticador.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import br.ufpr.bantads.ms_autenticador.DTO.LoginRequestDTO;
import br.ufpr.bantads.ms_autenticador.DTO.LoginResponseDTO;
import br.ufpr.bantads.ms_autenticador.DTO.UsuarioDTO;
import br.ufpr.bantads.ms_autenticador.UsuarioAuth;
import br.ufpr.bantads.ms_autenticador.repository.AuthRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthRepository authRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public LoginResponseDTO login(LoginRequestDTO request) {
        UsuarioAuth user = authRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!user.isAtivo()) {
            throw new RuntimeException("Conta ainda não aprovada. Aguarde a confirmação do gerente.");
        }

        if (!passwordEncoder.matches(request.getSenha(), user.getSenha())) {
            throw new RuntimeException("Senha inválida");
        }

        String token = jwtService.generateToken(user.getEmail(), user.getTipo(), user.getCpf());

        return LoginResponseDTO.builder()
                .access_token(token)
                .token_type("bearer")
                .tipo(user.getTipo())
                .usuario(UsuarioDTO.builder()
                        .id(user.getId())
                        .cpf(user.getCpf())
                        .nome(user.getNome())
                        .email(user.getEmail())
                        .build())
                .build();
    }
}
