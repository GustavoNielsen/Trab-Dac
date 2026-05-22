package br.ufpr.bantads.ms_cliente.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.ufpr.bantads.ms_cliente.dto.ClienteResponseDTO;
import br.ufpr.bantads.ms_cliente.dto.GerenteCargaDTO;
import br.ufpr.bantads.ms_cliente.service.ClienteService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/internal/clientes")
@RequiredArgsConstructor
public class ClienteInternalController {

    private final ClienteService clienteService;

    @GetMapping("/dashboard/gerentes")
    public List<GerenteCargaDTO> dashboardGerentes() {
        return clienteService.dashboardGerentes();
    }

    @GetMapping("/{cpf}")
    public ClienteResponseDTO buscarPorCpf(@PathVariable String cpf) {
        return clienteService.buscarPorCpf(cpf);
    }
}
