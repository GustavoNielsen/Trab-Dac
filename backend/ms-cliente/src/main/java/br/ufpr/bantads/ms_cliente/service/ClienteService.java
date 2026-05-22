package br.ufpr.bantads.ms_cliente.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import br.ufpr.bantads.ms_cliente.dto.ClienteRequestDTO;
import br.ufpr.bantads.ms_cliente.dto.ClienteResponseDTO;
import br.ufpr.bantads.ms_cliente.dto.GerenteCargaDTO;
import br.ufpr.bantads.ms_cliente.entity.Cliente;
import br.ufpr.bantads.ms_cliente.entity.StatusCliente;
import br.ufpr.bantads.ms_cliente.repository.ClienteRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public void cadastrar(ClienteRequestDTO request) {
        String cpf = normalizarCpf(request.getCpf());

        if (clienteRepository.existsByCpf(cpf)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Já existe uma solicitação ou conta para este CPF.");
        }

        Cliente cliente = new Cliente();
        cliente.setCpf(cpf);
        cliente.setNome(request.getNome());
        cliente.setEmail(request.getEmail());
        cliente.setTelefone(request.getTelefone());
        cliente.setSalario(request.getSalario());
        cliente.setLogradouro(primeiroNaoVazio(request.getLogradouro(), request.getEndereco()));
        cliente.setNumero(request.getNumero());
        cliente.setComplemento(request.getComplemento());
        cliente.setCep(request.getCep());
        cliente.setBairro(request.getBairro());
        cliente.setCidade(request.getCidade());
        cliente.setEstado(primeiroNaoVazio(request.getEstado(), request.getUf()));
        cliente.setGerenteCpf(normalizarCpf(request.getGerenteCpf()));
        cliente.setStatus(StatusCliente.PENDENTE);

        clienteRepository.save(cliente);
    }

    public List<ClienteResponseDTO> listarPendentesDoGerente(String gerenteCpf) {
        return clienteRepository
                .findByStatusAndGerenteCpf(StatusCliente.PENDENTE, normalizarCpf(gerenteCpf))
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public ClienteResponseDTO buscarPorCpf(String cpf) {
        Cliente cliente = clienteRepository.findByCpf(normalizarCpf(cpf))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente não encontrado"));
        return toResponse(cliente);
    }

    public List<GerenteCargaDTO> dashboardGerentes() {
        return clienteRepository.contarClientesPorGerente().stream()
                .map(p -> new GerenteCargaDTO(p.getGerenteCpf(), p.getQuantidadeClientes()))
                .toList();
    }

    private ClienteResponseDTO toResponse(Cliente cliente) {
        return ClienteResponseDTO.builder()
                .cpf(cliente.getCpf())
                .nome(cliente.getNome())
                .email(cliente.getEmail())
                .telefone(cliente.getTelefone())
                .salario(cliente.getSalario())
                .logradouro(cliente.getLogradouro())
                .numero(cliente.getNumero())
                .complemento(cliente.getComplemento())
                .cep(cliente.getCep())
                .bairro(cliente.getBairro())
                .cidade(cliente.getCidade())
                .estado(cliente.getEstado())
                .gerenteCpf(cliente.getGerenteCpf())
                .status(cliente.getStatus().name())
                .build();
    }

    private String normalizarCpf(String cpf) {
        if (cpf == null) {
            return "";
        }
        return cpf.replaceAll("\\D", "");
    }

    private String primeiroNaoVazio(String a, String b) {
        if (a != null && !a.isBlank()) {
            return a;
        }
        return b;
    }
}
