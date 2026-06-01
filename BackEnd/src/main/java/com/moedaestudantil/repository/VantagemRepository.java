package com.moedaestudantil.repository;

import com.moedaestudantil.model.Vantagem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VantagemRepository extends JpaRepository<Vantagem, Long> {

    List<Vantagem> findAllByOrderByIdDesc();

    List<Vantagem> findByEmpresaIdOrderByIdDesc(Long empresaId);

    Optional<Vantagem> findByIdAndEmpresaId(Long id, Long empresaId);
}
