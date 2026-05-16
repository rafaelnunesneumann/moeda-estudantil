package com.moedaestudantil.repository;

import com.moedaestudantil.model.ContaCorrente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ContaCorrenteRepository extends JpaRepository<ContaCorrente, Long> {

    Optional<ContaCorrente> findByAlunoId(Long alunoId);

    Optional<ContaCorrente> findByProfessorId(Long professorId);
}
