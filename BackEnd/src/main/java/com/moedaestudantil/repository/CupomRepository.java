package com.moedaestudantil.repository;

import com.moedaestudantil.model.Cupom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CupomRepository extends JpaRepository<Cupom, Long> {

    boolean existsByCodigo(String codigo);
}
