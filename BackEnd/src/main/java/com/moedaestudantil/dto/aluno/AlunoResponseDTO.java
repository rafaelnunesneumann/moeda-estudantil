package com.moedaestudantil.dto.aluno;

import com.moedaestudantil.dto.instituicao.InstituicaoEnsinoResponseDTO;

public record AlunoResponseDTO(
        Long id,
        String nome,
        String email,
        String cpf,
        String rg,
        String endereco,
        String curso,
        InstituicaoEnsinoResponseDTO instituicao) {
}
