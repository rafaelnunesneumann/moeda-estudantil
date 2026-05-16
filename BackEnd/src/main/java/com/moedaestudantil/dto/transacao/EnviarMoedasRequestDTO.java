package com.moedaestudantil.dto.transacao;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record EnviarMoedasRequestDTO(

        @NotNull(message = "ID do aluno é obrigatório")
        Long alunoId,

        @NotNull(message = "Valor é obrigatório")
        @DecimalMin(value = "0.01", message = "Valor deve ser positivo")
        BigDecimal valor,

        @NotBlank(message = "Motivo é obrigatório")
        String motivo) {
}
