package com.moedaestudantil.controller;

import com.moedaestudantil.dto.empresa.EmpresaParceiraRequestDTO;
import com.moedaestudantil.dto.empresa.EmpresaParceiraResponseDTO;
import com.moedaestudantil.service.EmpresaParceiraService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/empresas")
@RequiredArgsConstructor
public class EmpresaParceiraController {

    private final EmpresaParceiraService empresaParceiraService;

    @PostMapping
    public ResponseEntity<EmpresaParceiraResponseDTO> cadastrar(
            @Valid @RequestBody EmpresaParceiraRequestDTO dto) {
        EmpresaParceiraResponseDTO response = empresaParceiraService.cadastrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<EmpresaParceiraResponseDTO>> listarTodas() {
        return ResponseEntity.ok(empresaParceiraService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmpresaParceiraResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(empresaParceiraService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmpresaParceiraResponseDTO> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody EmpresaParceiraRequestDTO dto) {
        return ResponseEntity.ok(empresaParceiraService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        empresaParceiraService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
