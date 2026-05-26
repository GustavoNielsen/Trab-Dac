package br.ufpr.bantads.ms_cliente.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.ufpr.bantads.ms_cliente.dto.ClienteRequestDTO;
import br.ufpr.bantads.ms_cliente.dto.ClienteResponseDTO;
import br.ufpr.bantads.ms_cliente.service.ClienteService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/clientes")
@RequiredArgsConstructor
public class ClienteController {

    private final ClienteService clienteService;

    @PostMapping
    public ResponseEntity<Void> cadastrar(@RequestBody ClienteRequestDTO request) {
        clienteService.cadastrar(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping
    public List<ClienteResponseDTO> listar(
            @RequestParam(required = false) String filtro,
            @RequestHeader(value = "x-user-cpf", required = false) String gerenteCpf) {

        if ("para_aprovar".equals(filtro)) {
            return clienteService.listarPendentesDoGerente(gerenteCpf);
        }

        return List.of();
    }
}
