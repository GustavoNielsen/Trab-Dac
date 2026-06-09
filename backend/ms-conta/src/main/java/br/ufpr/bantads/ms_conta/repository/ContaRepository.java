package br.ufpr.bantads.ms_conta.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import br.ufpr.bantads.ms_conta.entity.Conta;

public interface ContaRepository extends JpaRepository<Conta, String> {

    boolean existsByNumero(String numero);

    Optional<Conta> findByNumero(String numero);

    Optional<Conta> findByCpfCliente(String cpfCliente);

    List<Conta> findByCpfGerente(String cpfGerente);

    @Query("""
        SELECT c.cpfGerente AS cpfGerente, COUNT(c) AS quantidadeContas
        FROM Conta c
        GROUP BY c.cpfGerente
        """)
    List<GerenteCargaProjection> contarContasPorGerente();

    interface GerenteCargaProjection {
        String getCpfGerente();
        Long getQuantidadeContas();
    }
    
}
