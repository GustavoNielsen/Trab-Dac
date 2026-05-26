package br.ufpr.bantads.ms_cliente.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "clientes", schema = "cliente")
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 11)
    private String cpf;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String email;

    private String telefone;

    @Column(nullable = false)
    private BigDecimal salario;

    private String logradouro;
    private String numero;
    private String complemento;
    private String cep;
    private String bairro;
    private String cidade;

    @Column(length = 2)
    private String estado;

    @Column(name = "gerente_cpf", nullable = false, length = 11)
    private String gerenteCpf;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatusCliente status = StatusCliente.PENDENTE;

    @Column(name = "motivo_recusa")
    private String motivoRecusa;

    @Column(name = "data_decisao")
    private LocalDateTime dataDecisao;

    @Column(name = "criado_em", nullable = false)
    private LocalDateTime criadoEm = LocalDateTime.now();
}
