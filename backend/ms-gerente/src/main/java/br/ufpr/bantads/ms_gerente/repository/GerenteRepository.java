package br.ufpr.bantads.ms_gerente.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.ufpr.bantads.ms_gerente.entity.Gerente;

public interface GerenteRepository extends JpaRepository<Gerente, String> {
    List<Gerente> findAllByOrderByNomeAsc();
}
