package com.moedaestudantil.repository;

import com.moedaestudantil.model.Aluno;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AlunoRepository extends JpaRepository<Aluno, Long> {

    Optional<Aluno> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByCpf(String cpf);

    boolean existsByRg(String rg);

    boolean existsByEmailAndIdNot(String email, Long id);

    boolean existsByCpfAndIdNot(String cpf, Long id);

    boolean existsByRgAndIdNot(String rg, Long id);
}
