package com.moedaestudantil.service;

import com.moedaestudantil.dto.cupom.CupomResponseDTO;
import com.moedaestudantil.event.ResgateRealizadoEvent;
import com.moedaestudantil.exception.ResourceNotFoundException;
import com.moedaestudantil.model.*;
import com.moedaestudantil.repository.ContaCorrenteRepository;
import com.moedaestudantil.repository.CupomRepository;
import com.moedaestudantil.repository.TransacaoRepository;
import com.moedaestudantil.repository.VantagemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CupomService {

    private final VantagemRepository vantagemRepository;
    private final ContaCorrenteRepository contaCorrenteRepository;
    private final TransacaoRepository transacaoRepository;
    private final CupomRepository cupomRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Transactional
    public CupomResponseDTO resgatar(Long alunoId, Long vantagemId) {
        Vantagem vantagem = vantagemRepository.findById(vantagemId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Vantagem não encontrada com id: " + vantagemId));

        ContaCorrente contaAluno = contaCorrenteRepository.findByAlunoId(alunoId)
                .orElseThrow(() -> new ResourceNotFoundException("Conta do aluno não encontrada"));

        BigDecimal custo = vantagem.getCustoMoedas();
        if (contaAluno.getSaldo().compareTo(custo) < 0) {
            throw new IllegalArgumentException("Saldo insuficiente. Saldo atual: " + contaAluno.getSaldo());
        }

        contaAluno.setSaldo(contaAluno.getSaldo().subtract(custo));
        contaCorrenteRepository.save(contaAluno);

        Aluno aluno = contaAluno.getAluno();
        EmpresaParceira empresa = vantagem.getEmpresa();
        LocalDateTime agora = LocalDateTime.now();

        Cupom cupom = new Cupom();
        cupom.setCodigo(gerarCodigoUnico());
        cupom.setVantagem(vantagem);
        cupom.setAluno(aluno);
        cupom.setDataGeracao(agora);
        cupom.setUtilizado(false);
        cupomRepository.save(cupom);

        Transacao resgate = new Transacao();
        resgate.setData(agora);
        resgate.setValor(custo);
        resgate.setTipo(TipoTransacao.RESGATE);
        resgate.setMotivo(vantagem.getDescricao());
        resgate.setContaOrigem(contaAluno);
        resgate.setContaDestino(contaAluno);
        resgate.setAluno(aluno);
        transacaoRepository.save(resgate);

        ResgateRealizadoEvent event = new ResgateRealizadoEvent(
                cupom.getCodigo(),
                aluno.getNome(),
                aluno.getEmail(),
                empresa.getNome(),
                empresa.getEmail(),
                vantagem.getDescricao(),
                custo,
                contaAluno.getSaldo(),
                agora
        );
        kafkaTemplate.send("resgate-realizado", event);
        log.info("Evento de resgate publicado no Kafka: aluno={}, vantagem={}, cupom={}",
                aluno.getEmail(), vantagem.getId(), cupom.getCodigo());

        return new CupomResponseDTO(
                cupom.getCodigo(),
                vantagem.getId(),
                vantagem.getDescricao(),
                empresa.getNome(),
                custo,
                contaAluno.getSaldo(),
                agora
        );
    }

    private String gerarCodigoUnico() {
        String codigo;
        do {
            codigo = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } while (cupomRepository.existsByCodigo(codigo));
        return codigo;
    }
}
