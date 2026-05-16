package com.moedaestudantil.dto.professor;

import com.moedaestudantil.dto.instituicao.InstituicaoEnsinoResponseDTO;

public record ProfessorResponseDTO(
        Long id,
        String nome,
        String email,
        String cpf,
        String departamento,
        InstituicaoEnsinoResponseDTO instituicao) {
}
