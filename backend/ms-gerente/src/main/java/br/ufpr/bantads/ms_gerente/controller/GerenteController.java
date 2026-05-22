package br.ufpr.bantads.ms_gerente.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.ufpr.bantads.ms_gerente.dto.GerenteResponseDTO;
import br.ufpr.bantads.ms_gerente.entity.Gerente;
import br.ufpr.bantads.ms_gerente.repository.GerenteRepository;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/gerentes")
@RequiredArgsConstructor
public class GerenteController {

    private final GerenteRepository gerenteRepository;

    @GetMapping
    public List<GerenteResponseDTO> listar() {
        return gerenteRepository.findAllByOrderByNomeAsc().stream()
                .map(this::toDto)
                .toList();
    }

    private GerenteResponseDTO toDto(Gerente gerente) {
        return GerenteResponseDTO.builder()
                .cpf(gerente.getCpf())
                .nome(gerente.getNome())
                .email(gerente.getEmail())
                .telefone(gerente.getTelefone())
                .tipo(gerente.getTipo())
                .build();
    }
}
