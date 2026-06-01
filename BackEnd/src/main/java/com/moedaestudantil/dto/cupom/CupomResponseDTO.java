package com.moedaestudantil.dto.cupom;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CupomResponseDTO(
        String codigo,
        Long vantagemId,
        String vantagemDescricao,
        String empresaNome,
        BigDecimal custoMoedas,
        BigDecimal novoSaldo,
        LocalDateTime dataGeracao
) {}
