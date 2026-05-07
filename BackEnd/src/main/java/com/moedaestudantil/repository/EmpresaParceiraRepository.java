package com.moedaestudantil.repository;

import com.moedaestudantil.model.EmpresaParceira;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmpresaParceiraRepository extends JpaRepository<EmpresaParceira, Long> {

    boolean existsByEmail(String email);

    boolean existsByCnpj(String cnpj);

    boolean existsByEmailAndIdNot(String email, Long id);

    boolean existsByCnpjAndIdNot(String cnpj, Long id);
}
