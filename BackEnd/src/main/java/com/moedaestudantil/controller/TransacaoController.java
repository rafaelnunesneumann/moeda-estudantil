package com.moedaestudantil.controller;

import com.moedaestudantil.dto.aluno.AlunoResponseDTO;
import com.moedaestudantil.dto.transacao.EnviarMoedasRequestDTO;
import com.moedaestudantil.dto.transacao.ExtratoResponseDTO;
import com.moedaestudantil.dto.transacao.TransacaoResponseDTO;
import com.moedaestudantil.security.JwtUserDetails;
import com.moedaestudantil.service.AlunoService;
import com.moedaestudantil.service.TransacaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transacoes")
@RequiredArgsConstructor
public class TransacaoController {

    private final TransacaoService transacaoService;
    private final AlunoService alunoService;

    @PostMapping("/enviar")
    public ResponseEntity<TransacaoResponseDTO> enviarMoedas(
            Authentication authentication,
            @Valid @RequestBody EnviarMoedasRequestDTO dto) {
        JwtUserDetails details = (JwtUserDetails) authentication.getDetails();
        if (!"PROFESSOR".equals(details.role())) {
            throw new IllegalArgumentException("Apenas professores podem enviar moedas");
        }
        TransacaoResponseDTO response = transacaoService.enviarMoedas(details.id(), dto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/extrato")
    public ResponseEntity<ExtratoResponseDTO> getExtrato(Authentication authentication) {
        JwtUserDetails details = (JwtUserDetails) authentication.getDetails();
        ExtratoResponseDTO response = transacaoService.getExtrato(details.id(), details.role());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/alunos-instituicao")
    public ResponseEntity<List<AlunoResponseDTO>> listarAlunosDaInstituicao(Authentication authentication) {
        JwtUserDetails details = (JwtUserDetails) authentication.getDetails();
        if (!"PROFESSOR".equals(details.role())) {
            throw new IllegalArgumentException("Apenas professores podem acessar esta lista");
        }
        return ResponseEntity.ok(alunoService.listarPorInstituicaoDoProfessor(details.id()));
    }
}
