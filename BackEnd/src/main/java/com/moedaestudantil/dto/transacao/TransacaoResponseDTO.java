package com.moedaestudantil.dto.transacao;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TransacaoResponseDTO(
        Long id,
        LocalDateTime data,
        BigDecimal valor,
        String tipo,
        String motivo,
        String nomeOrigem,
        String nomeDestino) {
}
