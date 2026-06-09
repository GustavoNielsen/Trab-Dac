package br.ufpr.bantads.ms_conta.controller;

import java.math.BigDecimal;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.ufpr.bantads.ms_conta.entity.Conta;
import br.ufpr.bantads.ms_conta.service.ContaService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/contas")
@RequiredArgsConstructor
public class ContaController {

    private final ContaService contaService;

    // GET /contas/{numero}  -> consulta a conta pelo número 
    @GetMapping("/{numero}")
    public Conta consultar(@PathVariable String numero) {
        return contaService.consultarPorNumero(numero);
    }
    
     @GetMapping("/{numero}/saldo")
    public Conta consultarSaldo(@PathVariable String numero) {
        return contaService.consultarPorNumero(numero);
    }

    @GetMapping("/cliente/{cpfCliente}")
    public Conta consultarPorCpfCliente(@PathVariable String cpfCliente) {
        return contaService.consultarPorCpfCliente(cpfCliente);
    }

    @PostMapping("/{numero}/depositar")
    public Conta depositar(@PathVariable String numero, @RequestBody Map<String, Object> payload) {
        BigDecimal valor = new BigDecimal(payload.get("valor").toString());
        String cpfOrigem = (String) payload.get("cpfOrigem");
        return contaService.depositar(numero, valor, cpfOrigem);
    }
}
