package com.moedaestudantil.listener;

import com.moedaestudantil.event.ResgateRealizadoEvent;
import com.moedaestudantil.event.TransacaoRealizadaEvent;
import com.moedaestudantil.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class TransacaoEmailListener {

    private final EmailService emailService;

    @KafkaListener(topics = "transacao-realizada", groupId = "email-service")
    public void onTransacaoRealizada(TransacaoRealizadaEvent event) {
        log.info("Evento recebido via Kafka: professor={} -> aluno={}, valor={}",
                event.professorEmail(), event.alunoEmail(), event.valor());
        emailService.enviarEmailProfessor(event);
        emailService.enviarEmailAluno(event);
    }

    @KafkaListener(topics = "resgate-realizado", groupId = "email-service")
    public void onResgateRealizado(ResgateRealizadoEvent event) {
        log.info("Evento de resgate recebido via Kafka: aluno={}, empresa={}, cupom={}",
                event.alunoEmail(), event.empresaEmail(), event.codigoCupom());
        emailService.enviarCupomAluno(event);
        emailService.enviarConferenciaEmpresa(event);
    }
}
