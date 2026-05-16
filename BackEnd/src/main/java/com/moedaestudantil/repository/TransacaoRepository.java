package com.moedaestudantil.repository;

import com.moedaestudantil.model.ContaCorrente;
import com.moedaestudantil.model.TipoTransacao;
import com.moedaestudantil.model.Transacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransacaoRepository extends JpaRepository<Transacao, Long> {

    List<Transacao> findByContaOrigemAndTipoInOrderByDataDesc(
            ContaCorrente contaOrigem, List<TipoTransacao> tipos);

    List<Transacao> findByContaDestinoAndTipoInOrderByDataDesc(
            ContaCorrente contaDestino, List<TipoTransacao> tipos);
}
