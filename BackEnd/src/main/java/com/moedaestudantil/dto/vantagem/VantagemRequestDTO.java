package com.moedaestudantil.dto.vantagem;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record VantagemRequestDTO(

        @NotBlank(message = "Descrição é obrigatória")
        @Size(max = 1000, message = "Descrição deve ter no máximo 1000 caracteres")
        String descricao,

        @NotBlank(message = "Foto é obrigatória")
        String foto,

        @NotNull(message = "Custo em moedas é obrigatório")
        @DecimalMin(value = "0.01", message = "Custo deve ser positivo")
        BigDecimal custoMoedas) {
}
