package br.ufpr.bantads.ms_autenticador.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import br.ufpr.bantads.ms_autenticador.UsuarioAuth;
import java.util.Optional;
import java.lang.Long;

public interface AuthRepository extends MongoRepository<UsuarioAuth, Long> {
    Optional<UsuarioAuth> findByEmail(String email);
}
