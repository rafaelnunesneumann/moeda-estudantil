package com.moedaestudantil.controller;

import com.moedaestudantil.dto.vantagem.VantagemRequestDTO;
import com.moedaestudantil.dto.vantagem.VantagemResponseDTO;
import com.moedaestudantil.security.JwtUserDetails;
import com.moedaestudantil.service.VantagemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vantagens")
@RequiredArgsConstructor
public class VantagemController {

    private final VantagemService vantagemService;

    @PostMapping
    public ResponseEntity<VantagemResponseDTO> cadastrar(
            Authentication authentication,
            @Valid @RequestBody VantagemRequestDTO dto) {
        JwtUserDetails details = (JwtUserDetails) authentication.getDetails();
        if (!"EMPRESA".equals(details.role())) {
            throw new IllegalArgumentException("Apenas empresas parceiras podem cadastrar vantagens");
        }
        VantagemResponseDTO response = vantagemService.cadastrar(details.id(), dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<VantagemResponseDTO>> listarDisponiveis() {
        return ResponseEntity.ok(vantagemService.listarDisponiveis());
    }

    @GetMapping("/minhas")
    public ResponseEntity<List<VantagemResponseDTO>> listarMinhas(Authentication authentication) {
        JwtUserDetails details = (JwtUserDetails) authentication.getDetails();
        if (!"EMPRESA".equals(details.role())) {
            throw new IllegalArgumentException("Apenas empresas parceiras possuem vantagens");
        }
        return ResponseEntity.ok(vantagemService.listarPorEmpresa(details.id()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<VantagemResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(vantagemService.buscarPorId(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(Authentication authentication, @PathVariable Long id) {
        JwtUserDetails details = (JwtUserDetails) authentication.getDetails();
        if (!"EMPRESA".equals(details.role())) {
            throw new IllegalArgumentException("Apenas empresas parceiras podem remover vantagens");
        }
        vantagemService.deletar(id, details.id());
        return ResponseEntity.noContent().build();
    }
}
