package com.moedaestudantil.service;

import com.moedaestudantil.dto.instituicao.InstituicaoEnsinoResponseDTO;
import com.moedaestudantil.dto.professor.ProfessorResponseDTO;
import com.moedaestudantil.dto.professor.ProfessorUpdateDTO;
import com.moedaestudantil.exception.ResourceNotFoundException;
import com.moedaestudantil.model.InstituicaoEnsino;
import com.moedaestudantil.model.Professor;
import com.moedaestudantil.repository.ProfessorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProfessorService {

    private final ProfessorRepository professorRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public ProfessorResponseDTO atualizar(Long id, ProfessorUpdateDTO dto) {
        Professor professor = professorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Professor não encontrado com id: " + id));

        if (professorRepository.existsByEmailAndIdNot(dto.email(), id)) {
            throw new IllegalArgumentException("Email já cadastrado: " + dto.email());
        }
        if (professorRepository.existsByCpfAndIdNot(dto.cpf(), id)) {
            throw new IllegalArgumentException("CPF já cadastrado: " + dto.cpf());
        }

        professor.setNome(dto.nome());
        professor.setEmail(dto.email());
        professor.setCpf(dto.cpf());

        if (dto.senha() != null && !dto.senha().isBlank()) {
            professor.setSenha(passwordEncoder.encode(dto.senha()));
        }

        return toResponseDTO(professorRepository.save(professor));
    }

    public ProfessorResponseDTO toResponseDTO(Professor professor) {
        InstituicaoEnsino inst = professor.getInstituicaoEnsino();
        InstituicaoEnsinoResponseDTO instDTO = new InstituicaoEnsinoResponseDTO(
                inst.getId(), inst.getNome(), inst.getEndereco());
        return new ProfessorResponseDTO(
                professor.getId(),
                professor.getNome(),
                professor.getEmail(),
                professor.getCpf(),
                professor.getDepartamento(),
                instDTO);
    }
}
