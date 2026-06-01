package com.moedaestudantil.dto.vantagem;

import java.math.BigDecimal;

public record VantagemResponseDTO(
        Long id,
        String descricao,
        String foto,
        BigDecimal custoMoedas,
        Long empresaId,
        String empresaNome) {
}
