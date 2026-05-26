package br.ufpr.bantads.ms_cliente.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import br.ufpr.bantads.ms_cliente.entity.Cliente;
import br.ufpr.bantads.ms_cliente.entity.StatusCliente;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    boolean existsByCpf(String cpf);

    Optional<Cliente> findByCpf(String cpf);

    List<Cliente> findByStatusAndGerenteCpf(StatusCliente status, String gerenteCpf);

    List<Cliente> findByStatus(StatusCliente status);

    @Query("""
        SELECT c.gerenteCpf AS gerenteCpf, COUNT(c) AS quantidadeClientes
        FROM Cliente c
        GROUP BY c.gerenteCpf
        """)
    List<GerenteCargaProjection> contarClientesPorGerente();

    interface GerenteCargaProjection {
        String getGerenteCpf();
        Long getQuantidadeClientes();
    }
}
