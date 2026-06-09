package br.ufpr.bantads.ms_conta.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import br.ufpr.bantads.ms_conta.entity.Conta;
import br.ufpr.bantads.ms_conta.entity.Movimentacao;
import br.ufpr.bantads.ms_conta.entity.TipoMovimentacao;
import br.ufpr.bantads.ms_conta.repository.ContaRepository;
import br.ufpr.bantads.ms_conta.repository.MovimentacaoRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ContaService {

    private final ContaRepository contaRepository;
    private final MovimentacaoRepository movimentacaoRepository;

    
    public Conta consultarPorNumero(String numero) {
        return contaRepository.findByNumero(numero)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Conta não encontrada: " + numero));
    }

    public Conta consultarPorCpfCliente(String cpfCliente) {
        return contaRepository.findByCpfCliente(cpfCliente)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Conta não encontrada para o cliente."));
    }

   public Conta depositar(String numero, BigDecimal valor, String cpfOrigem) {
    if (valor.compareTo(BigDecimal.ZERO) <= 0) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "O valor do depósito deve ser positivo.");
    }
    Conta conta = consultarPorNumero(numero);
    conta.setSaldo(conta.getSaldo().add(valor));
    contaRepository.save(conta);
    registrarMovimentacao(numero, TipoMovimentacao.DEPOSITO, valor, cpfOrigem, null);
    return conta;
}

    private void registrarMovimentacao(String contaNumero, TipoMovimentacao tipo,
                                       BigDecimal valor, String cpfOrigem, String cpfDestino) {
        Movimentacao mov = new Movimentacao();
        mov.setContaNumero(contaNumero);
        mov.setTipo(tipo);
        mov.setValor(valor);
        mov.setDataHora(LocalDateTime.now());
        mov.setCpfOrigem(cpfOrigem);
        mov.setCpfDestino(cpfDestino);
        movimentacaoRepository.save(mov);
    }
}
