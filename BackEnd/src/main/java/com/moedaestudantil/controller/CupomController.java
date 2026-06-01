package com.moedaestudantil.controller;

import com.moedaestudantil.dto.cupom.CupomResponseDTO;
import com.moedaestudantil.security.JwtUserDetails;
import com.moedaestudantil.service.CupomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/vantagens")
@RequiredArgsConstructor
public class CupomController {

    private final CupomService cupomService;

    @PostMapping("/{id}/resgatar")
    public ResponseEntity<CupomResponseDTO> resgatar(
            Authentication authentication,
            @PathVariable Long id) {
        JwtUserDetails details = (JwtUserDetails) authentication.getDetails();
        if (!"ALUNO".equals(details.role())) {
            throw new IllegalArgumentException("Apenas alunos podem resgatar vantagens");
        }
        CupomResponseDTO response = cupomService.resgatar(details.id(), id);
        return ResponseEntity.ok(response);
    }
}
