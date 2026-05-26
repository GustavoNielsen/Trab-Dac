package br.ufpr.bantads.ms_autenticador.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import br.ufpr.bantads.ms_autenticador.UsuarioAuth;

public interface AuthRepository extends MongoRepository<UsuarioAuth, String> {
    Optional<UsuarioAuth> findByEmail(String email);
    boolean existsByCpf(String cpf);
}
