package com.example.ms_saga.controller;

import com.example.ms_saga.dto.ContaResponse;
import com.example.ms_saga.dto.PerfilInfoRequest;
import com.example.ms_saga.dto.RejeitarClienteRequest;
import com.example.ms_saga.service.ClienteAprovacaoSagaService;
import com.example.ms_saga.service.ClientePerfilSagaService;
import com.example.ms_saga.service.ClienteRejeicaoSagaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/clientes")
public class ClienteSagaController {

    private final ClienteAprovacaoSagaService clienteAprovacaoSagaService;
    private final ClienteRejeicaoSagaService clienteRejeicaoSagaService;
    private final ClientePerfilSagaService clientePerfilSagaService;

    public ClienteSagaController(
            ClienteAprovacaoSagaService clienteAprovacaoSagaService,
            ClienteRejeicaoSagaService clienteRejeicaoSagaService,
            ClientePerfilSagaService clientePerfilSagaService
    ) {
        this.clienteAprovacaoSagaService = clienteAprovacaoSagaService;
        this.clienteRejeicaoSagaService = clienteRejeicaoSagaService;
        this.clientePerfilSagaService = clientePerfilSagaService;
    }

    @PostMapping("/{cpf}/aprovar")
public ContaResponse aprovar(
        @PathVariable String cpf,
        @RequestHeader("x-user-cpf") String gerenteCpf
) {
    return clienteAprovacaoSagaService.aprovar(cpf, gerenteCpf);
}

    @PostMapping("/{cpf}/rejeitar")
@ResponseStatus(HttpStatus.OK)
public void rejeitar(
        @PathVariable String cpf,
        @RequestHeader("x-user-cpf") String gerenteCpf,
        @RequestBody RejeitarClienteRequest request
) {
    clienteRejeicaoSagaService.rejeitar(cpf, gerenteCpf, request);
}

    @PutMapping("/{cpf}")
    @ResponseStatus(HttpStatus.OK)
    public void atualizarPerfil(
            @PathVariable String cpf,
            @Valid @RequestBody PerfilInfoRequest request
    ) {
        clientePerfilSagaService.atualizar(cpf, request);
    }
}
