package com.moedaestudantil.dto.auth;

public record LoginResponseDTO(
        String token,
        Long id,
        String nome,
        String email,
        String role) {
}
