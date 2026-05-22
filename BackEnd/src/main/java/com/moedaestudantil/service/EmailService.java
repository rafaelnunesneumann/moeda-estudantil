package com.moedaestudantil.service;

import com.moedaestudantil.event.TransacaoRealizadaEvent;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${spring.mail.from:noreply@moedaestudantil.com}")
    private String fromAddress;

    public void enviarEmailProfessor(TransacaoRealizadaEvent event) {
        try {
            Context ctx = new Context();
            ctx.setVariable("professorNome", event.professorNome());
            ctx.setVariable("alunoNome", event.alunoNome());
            ctx.setVariable("valor", event.valor());
            ctx.setVariable("motivo", event.motivo());
            ctx.setVariable("dataHora", event.dataHora());
            ctx.setVariable("novoSaldo", event.novoSaldoProfessor());

            String html = templateEngine.process("email/professor-envio", ctx);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromAddress);
            helper.setTo(event.professorEmail());
            helper.setSubject("Envio de moedas confirmado");
            helper.setText(html, true);

            mailSender.send(message);
            log.info("Email de confirmação enviado para professor: {}", event.professorEmail());
        } catch (Exception e) {
            log.error("Erro ao enviar email para professor {}: {}", event.professorEmail(), e.getMessage(), e);
        }
    }

    public void enviarEmailAluno(TransacaoRealizadaEvent event) {
        try {
            Context ctx = new Context();
            ctx.setVariable("alunoNome", event.alunoNome());
            ctx.setVariable("professorNome", event.professorNome());
            ctx.setVariable("valor", event.valor());
            ctx.setVariable("motivo", event.motivo());
            ctx.setVariable("dataHora", event.dataHora());
            ctx.setVariable("novoSaldo", event.novoSaldoAluno());

            String html = templateEngine.process("email/aluno-recebimento", ctx);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromAddress);
            helper.setTo(event.alunoEmail());
            helper.setSubject("Você recebeu moedas!");
            helper.setText(html, true);

            mailSender.send(message);
            log.info("Email de recebimento enviado para aluno: {}", event.alunoEmail());
        } catch (Exception e) {
            log.error("Erro ao enviar email para aluno {}: {}", event.alunoEmail(), e.getMessage(), e);
        }
    }
}
