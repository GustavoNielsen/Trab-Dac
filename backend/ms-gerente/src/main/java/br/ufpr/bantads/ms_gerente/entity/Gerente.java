package br.ufpr.bantads.ms_gerente.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "gerentes", schema = "gerente")
public class Gerente {

    @Id
    @Column(length = 11)
    private String cpf;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String email;

    private String telefone;

    @Column(nullable = false, length = 20)
    private String tipo = "GERENTE";
}
