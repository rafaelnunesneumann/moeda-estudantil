package com.moedaestudantil.controller;

import com.moedaestudantil.dto.instituicao.InstituicaoEnsinoResponseDTO;
import com.moedaestudantil.repository.InstituicaoEnsinoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/instituicoes")
@RequiredArgsConstructor
public class InstituicaoEnsinoController {

    private final InstituicaoEnsinoRepository instituicaoEnsinoRepository;

    @GetMapping
    public ResponseEntity<List<InstituicaoEnsinoResponseDTO>> listarTodas() {
        List<InstituicaoEnsinoResponseDTO> list = instituicaoEnsinoRepository.findAll().stream()
                .map(i -> new InstituicaoEnsinoResponseDTO(i.getId(), i.getNome(), i.getEndereco()))
                .toList();
        return ResponseEntity.ok(list);
    }
}
