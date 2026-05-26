package br.ufpr.bantads.ms_cliente.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GerenteCargaDTO {
    private String gerenteCpf;
    private long quantidadeClientes;
}
