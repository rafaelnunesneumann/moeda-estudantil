package com.moedaestudantil.event;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ResgateRealizadoEvent(
        String codigoCupom,
        String alunoNome,
        String alunoEmail,
        String empresaNome,
        String empresaEmail,
        String vantagemDescricao,
        BigDecimal custoMoedas,
        BigDecimal novoSaldoAluno,
        LocalDateTime dataHora
) {}
