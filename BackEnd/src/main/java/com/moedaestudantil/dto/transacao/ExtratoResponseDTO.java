package com.moedaestudantil.dto.transacao;

import java.math.BigDecimal;
import java.util.List;

public record ExtratoResponseDTO(
        BigDecimal saldo,
        List<TransacaoResponseDTO> transacoes) {
}
