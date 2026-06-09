package br.ufpr.bantads.ms_conta.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "contas", schema = "conta")
public class Conta {

    @Id
    private String numero;

    @Column(name = "cpf_cliente", nullable = false, length = 11)
    private String cpfCliente;

    @Column(nullable = false)
    private BigDecimal saldo;

    @Column(nullable = false)
    private BigDecimal limite;

    @Column(name = "cpf_gerente", nullable = false, length = 11)
    private String cpfGerente;

    @Column(name = "data_criacao", nullable = false)
    private LocalDate dataCriacao;

}