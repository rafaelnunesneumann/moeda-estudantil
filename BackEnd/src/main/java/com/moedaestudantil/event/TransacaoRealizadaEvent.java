package com.moedaestudantil.event;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TransacaoRealizadaEvent(
        String professorNome,
        String professorEmail,
        String alunoNome,
        String alunoEmail,
        BigDecimal valor,
        String motivo,
        BigDecimal novoSaldoAluno,
        BigDecimal novoSaldoProfessor,
        LocalDateTime dataHora
) {}
