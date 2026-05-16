package com.moedaestudantil.controller;

import com.moedaestudantil.dto.professor.ProfessorResponseDTO;
import com.moedaestudantil.dto.professor.ProfessorUpdateDTO;
import com.moedaestudantil.service.ProfessorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/professores")
@RequiredArgsConstructor
public class ProfessorController {

    private final ProfessorService professorService;

    @PutMapping("/{id}")
    public ResponseEntity<ProfessorResponseDTO> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody ProfessorUpdateDTO dto) {
        return ResponseEntity.ok(professorService.atualizar(id, dto));
    }
}
