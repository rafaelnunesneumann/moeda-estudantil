package com.moedaestudantil.service;

import com.moedaestudantil.dto.transacao.EnviarMoedasRequestDTO;
import com.moedaestudantil.dto.transacao.ExtratoResponseDTO;
import com.moedaestudantil.dto.transacao.TransacaoResponseDTO;
import com.moedaestudantil.event.TransacaoRealizadaEvent;
import com.moedaestudantil.exception.ResourceNotFoundException;
import com.moedaestudantil.model.*;
import com.moedaestudantil.repository.AlunoRepository;
import com.moedaestudantil.repository.ContaCorrenteRepository;
import com.moedaestudantil.repository.TransacaoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransacaoService {

    private final ContaCorrenteRepository contaCorrenteRepository;
    private final TransacaoRepository transacaoRepository;
    private final AlunoRepository alunoRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Transactional
    public TransacaoResponseDTO enviarMoedas(Long professorId, EnviarMoedasRequestDTO dto) {
        ContaCorrente contaProfessor = contaCorrenteRepository.findByProfessorId(professorId)
                .orElseThrow(() -> new ResourceNotFoundException("Conta do professor não encontrada"));

        Aluno aluno = alunoRepository.findById(dto.alunoId())
                .orElseThrow(() -> new ResourceNotFoundException("Aluno não encontrado com id: " + dto.alunoId()));

        Professor professor = contaProfessor.getProfessor();
        if (!professor.getInstituicaoEnsino().getId().equals(aluno.getInstituicaoEnsino().getId())) {
            throw new IllegalArgumentException(
                    "O professor só pode enviar moedas para alunos da mesma instituição");
        }

        ContaCorrente contaAluno = contaCorrenteRepository.findByAlunoId(dto.alunoId())
                .orElseThrow(() -> new ResourceNotFoundException("Conta do aluno não encontrada"));

        if (contaProfessor.getSaldo().compareTo(dto.valor()) < 0) {
            throw new IllegalArgumentException("Saldo insuficiente. Saldo atual: " + contaProfessor.getSaldo());
        }

        contaProfessor.setSaldo(contaProfessor.getSaldo().subtract(dto.valor()));
        contaAluno.setSaldo(contaAluno.getSaldo().add(dto.valor()));

        contaCorrenteRepository.save(contaProfessor);
        contaCorrenteRepository.save(contaAluno);

        LocalDateTime agora = LocalDateTime.now();

        Transacao envio = new Transacao();
        envio.setData(agora);
        envio.setValor(dto.valor());
        envio.setTipo(TipoTransacao.ENVIO);
        envio.setMotivo(dto.motivo());
        envio.setContaOrigem(contaProfessor);
        envio.setContaDestino(contaAluno);
        envio.setProfessor(contaProfessor.getProfessor());
        envio.setAluno(aluno);
        transacaoRepository.save(envio);

        Transacao recebimento = new Transacao();
        recebimento.setData(agora);
        recebimento.setValor(dto.valor());
        recebimento.setTipo(TipoTransacao.RECEBIMENTO);
        recebimento.setMotivo(dto.motivo());
        recebimento.setContaOrigem(contaProfessor);
        recebimento.setContaDestino(contaAluno);
        recebimento.setProfessor(contaProfessor.getProfessor());
        recebimento.setAluno(aluno);
        transacaoRepository.save(recebimento);

        TransacaoRealizadaEvent event = new TransacaoRealizadaEvent(
                professor.getNome(),
                professor.getEmail(),
                aluno.getNome(),
                aluno.getEmail(),
                dto.valor(),
                dto.motivo(),
                contaAluno.getSaldo(),
                contaProfessor.getSaldo(),
                agora
        );
        kafkaTemplate.send("transacao-realizada", event);
        log.info("Evento publicado no Kafka: professor={} -> aluno={}, valor={}",
                professor.getEmail(), aluno.getEmail(), dto.valor());

        return toResponseDTO(envio);
    }

    @Transactional(readOnly = true)
    public ExtratoResponseDTO getExtrato(Long userId, String role) {
        ContaCorrente conta = findContaByUserIdAndRole(userId, role);

        List<Transacao> transacoes = switch (role) {
            case "PROFESSOR" -> transacaoRepository.findByContaOrigemAndTipoInOrderByDataDesc(
                    conta, List.of(TipoTransacao.ENVIO, TipoTransacao.CREDITO_SEMESTRAL));
            case "ALUNO" -> transacaoRepository.findByContaDestinoAndTipoInOrderByDataDesc(
                    conta, List.of(TipoTransacao.RECEBIMENTO, TipoTransacao.RESGATE));
            default -> List.of();
        };

        List<TransacaoResponseDTO> transacoesDTO = transacoes.stream()
                .map(this::toResponseDTO)
                .toList();

        return new ExtratoResponseDTO(conta.getSaldo(), transacoesDTO);
    }

    private ContaCorrente findContaByUserIdAndRole(Long userId, String role) {
        return switch (role) {
            case "PROFESSOR" -> contaCorrenteRepository.findByProfessorId(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Conta do professor não encontrada"));
            case "ALUNO" -> contaCorrenteRepository.findByAlunoId(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Conta do aluno não encontrada"));
            default -> throw new IllegalArgumentException("Role inválida para extrato: " + role);
        };
    }

    private TransacaoResponseDTO toResponseDTO(Transacao tx) {
        String nomeOrigem = null;
        String nomeDestino = null;

        if (tx.getContaOrigem() != null) {
            if (tx.getContaOrigem().getProfessor() != null) {
                nomeOrigem = tx.getContaOrigem().getProfessor().getNome();
            } else if (tx.getContaOrigem().getAluno() != null) {
                nomeOrigem = tx.getContaOrigem().getAluno().getNome();
            }
        }
        if (tx.getContaDestino() != null) {
            if (tx.getContaDestino().getAluno() != null) {
                nomeDestino = tx.getContaDestino().getAluno().getNome();
            } else if (tx.getContaDestino().getProfessor() != null) {
                nomeDestino = tx.getContaDestino().getProfessor().getNome();
            }
        }

        return new TransacaoResponseDTO(
                tx.getId(),
                tx.getData(),
                tx.getValor(),
                tx.getTipo().name(),
                tx.getMotivo(),
                nomeOrigem,
                nomeDestino);
    }
}
