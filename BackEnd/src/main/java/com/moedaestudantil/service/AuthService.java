package com.moedaestudantil.service;

import com.moedaestudantil.dto.aluno.AlunoResponseDTO;
import com.moedaestudantil.dto.auth.LoginRequestDTO;
import com.moedaestudantil.dto.auth.LoginResponseDTO;
import com.moedaestudantil.dto.empresa.EmpresaParceiraResponseDTO;
import com.moedaestudantil.dto.instituicao.InstituicaoEnsinoResponseDTO;
import com.moedaestudantil.dto.professor.ProfessorResponseDTO;
import com.moedaestudantil.model.Aluno;
import com.moedaestudantil.model.EmpresaParceira;
import com.moedaestudantil.model.InstituicaoEnsino;
import com.moedaestudantil.model.Professor;
import com.moedaestudantil.repository.AlunoRepository;
import com.moedaestudantil.repository.EmpresaParceiraRepository;
import com.moedaestudantil.repository.ProfessorRepository;
import com.moedaestudantil.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AlunoRepository alunoRepository;
    private final ProfessorRepository professorRepository;
    private final EmpresaParceiraRepository empresaParceiraRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional(readOnly = true)
    public LoginResponseDTO login(LoginRequestDTO dto) {
        var alunoOpt = alunoRepository.findByEmail(dto.email());
        if (alunoOpt.isPresent()) {
            Aluno aluno = alunoOpt.get();
            if (passwordEncoder.matches(dto.senha(), aluno.getSenha())) {
                String token = jwtUtil.generateToken(aluno.getId(), aluno.getEmail(), "ALUNO");
                return new LoginResponseDTO(token, aluno.getId(), aluno.getNome(), aluno.getEmail(), "ALUNO");
            }
        }

        var professorOpt = professorRepository.findByEmail(dto.email());
        if (professorOpt.isPresent()) {
            Professor professor = professorOpt.get();
            if (passwordEncoder.matches(dto.senha(), professor.getSenha())) {
                String token = jwtUtil.generateToken(professor.getId(), professor.getEmail(), "PROFESSOR");
                return new LoginResponseDTO(token, professor.getId(), professor.getNome(), professor.getEmail(), "PROFESSOR");
            }
        }

        var empresaOpt = empresaParceiraRepository.findByEmail(dto.email());
        if (empresaOpt.isPresent()) {
            EmpresaParceira empresa = empresaOpt.get();
            if (passwordEncoder.matches(dto.senha(), empresa.getSenha())) {
                String token = jwtUtil.generateToken(empresa.getId(), empresa.getEmail(), "EMPRESA");
                return new LoginResponseDTO(token, empresa.getId(), empresa.getNome(), empresa.getEmail(), "EMPRESA");
            }
        }

        throw new IllegalArgumentException("Email ou senha inválidos");
    }

    @Transactional(readOnly = true)
    public Object getProfile(Long id, String role) {
        return switch (role) {
            case "ALUNO" -> {
                Aluno aluno = alunoRepository.findById(id)
                        .orElseThrow(() -> new IllegalArgumentException("Aluno não encontrado"));
                InstituicaoEnsino inst = aluno.getInstituicaoEnsino();
                yield new AlunoResponseDTO(
                        aluno.getId(), aluno.getNome(), aluno.getEmail(),
                        aluno.getCpf(), aluno.getRg(), aluno.getEndereco(),
                        aluno.getCurso(),
                        new InstituicaoEnsinoResponseDTO(inst.getId(), inst.getNome(), inst.getEndereco()));
            }
            case "PROFESSOR" -> {
                Professor professor = professorRepository.findById(id)
                        .orElseThrow(() -> new IllegalArgumentException("Professor não encontrado"));
                InstituicaoEnsino inst = professor.getInstituicaoEnsino();
                yield new ProfessorResponseDTO(
                        professor.getId(), professor.getNome(), professor.getEmail(),
                        professor.getCpf(), professor.getDepartamento(),
                        new InstituicaoEnsinoResponseDTO(inst.getId(), inst.getNome(), inst.getEndereco()));
            }
            case "EMPRESA" -> {
                EmpresaParceira empresa = empresaParceiraRepository.findById(id)
                        .orElseThrow(() -> new IllegalArgumentException("Empresa não encontrada"));
                yield new EmpresaParceiraResponseDTO(
                        empresa.getId(), empresa.getNome(), empresa.getCnpj(), empresa.getEmail());
            }
            default -> throw new IllegalArgumentException("Role inválida");
        };
    }
}
