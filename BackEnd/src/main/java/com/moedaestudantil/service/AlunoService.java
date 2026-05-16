package com.moedaestudantil.service;

import com.moedaestudantil.dto.aluno.AlunoRequestDTO;
import com.moedaestudantil.dto.aluno.AlunoResponseDTO;
import com.moedaestudantil.dto.instituicao.InstituicaoEnsinoResponseDTO;
import com.moedaestudantil.exception.ResourceNotFoundException;
import com.moedaestudantil.model.Aluno;
import com.moedaestudantil.model.ContaCorrente;
import com.moedaestudantil.model.InstituicaoEnsino;
import com.moedaestudantil.model.Professor;
import com.moedaestudantil.repository.AlunoRepository;
import com.moedaestudantil.repository.ContaCorrenteRepository;
import com.moedaestudantil.repository.InstituicaoEnsinoRepository;
import com.moedaestudantil.repository.ProfessorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AlunoService {

    private final AlunoRepository alunoRepository;
    private final InstituicaoEnsinoRepository instituicaoEnsinoRepository;
    private final ContaCorrenteRepository contaCorrenteRepository;
    private final ProfessorRepository professorRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public AlunoResponseDTO cadastrar(AlunoRequestDTO dto) {
        if (alunoRepository.existsByEmail(dto.email())) {
            throw new IllegalArgumentException("Email já cadastrado: " + dto.email());
        }
        if (alunoRepository.existsByCpf(dto.cpf())) {
            throw new IllegalArgumentException("CPF já cadastrado: " + dto.cpf());
        }
        if (alunoRepository.existsByRg(dto.rg())) {
            throw new IllegalArgumentException("RG já cadastrado: " + dto.rg());
        }

        InstituicaoEnsino instituicao = instituicaoEnsinoRepository.findById(dto.instituicaoId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Instituição não encontrada com id: " + dto.instituicaoId()));

        Aluno aluno = new Aluno();
        aluno.setNome(dto.nome());
        aluno.setEmail(dto.email());
        aluno.setSenha(passwordEncoder.encode(dto.senha()));
        aluno.setCpf(dto.cpf());
        aluno.setRg(dto.rg());
        aluno.setEndereco(dto.endereco());
        aluno.setCurso(dto.curso());
        aluno.setInstituicaoEnsino(instituicao);

        Aluno savedAluno = alunoRepository.save(aluno);

        ContaCorrente conta = new ContaCorrente();
        conta.setSaldo(BigDecimal.ZERO);
        conta.setAluno(savedAluno);
        contaCorrenteRepository.save(conta);

        return toResponseDTO(savedAluno);
    }

    @Transactional(readOnly = true)
    public List<AlunoResponseDTO> listarTodos() {
        return alunoRepository.findAll().stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public AlunoResponseDTO buscarPorId(Long id) {
        return alunoRepository.findById(id)
                .map(this::toResponseDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Aluno não encontrado com id: " + id));
    }

    @Transactional
    public AlunoResponseDTO atualizar(Long id, AlunoRequestDTO dto) {
        Aluno aluno = alunoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Aluno não encontrado com id: " + id));

        if (alunoRepository.existsByEmailAndIdNot(dto.email(), id)) {
            throw new IllegalArgumentException("Email já cadastrado: " + dto.email());
        }
        if (alunoRepository.existsByCpfAndIdNot(dto.cpf(), id)) {
            throw new IllegalArgumentException("CPF já cadastrado: " + dto.cpf());
        }
        if (alunoRepository.existsByRgAndIdNot(dto.rg(), id)) {
            throw new IllegalArgumentException("RG já cadastrado: " + dto.rg());
        }

        InstituicaoEnsino instituicao = instituicaoEnsinoRepository.findById(dto.instituicaoId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Instituição não encontrada com id: " + dto.instituicaoId()));

        aluno.setNome(dto.nome());
        aluno.setEmail(dto.email());
        aluno.setSenha(passwordEncoder.encode(dto.senha()));
        aluno.setCpf(dto.cpf());
        aluno.setRg(dto.rg());
        aluno.setEndereco(dto.endereco());
        aluno.setCurso(dto.curso());
        aluno.setInstituicaoEnsino(instituicao);

        return toResponseDTO(alunoRepository.save(aluno));
    }

    @Transactional(readOnly = true)
    public List<AlunoResponseDTO> listarPorInstituicaoDoProfessor(Long professorId) {
        Professor professor = professorRepository.findById(professorId)
                .orElseThrow(() -> new ResourceNotFoundException("Professor não encontrado com id: " + professorId));
        return alunoRepository.findByInstituicaoEnsinoId(professor.getInstituicaoEnsino().getId())
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional
    public void deletar(Long id) {
        if (!alunoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Aluno não encontrado com id: " + id);
        }
        alunoRepository.deleteById(id);
    }

    private AlunoResponseDTO toResponseDTO(Aluno aluno) {
        InstituicaoEnsino inst = aluno.getInstituicaoEnsino();
        InstituicaoEnsinoResponseDTO instDTO = new InstituicaoEnsinoResponseDTO(
                inst.getId(), inst.getNome(), inst.getEndereco());
        return new AlunoResponseDTO(
                aluno.getId(),
                aluno.getNome(),
                aluno.getEmail(),
                aluno.getCpf(),
                aluno.getRg(),
                aluno.getEndereco(),
                aluno.getCurso(),
                instDTO);
    }
}
