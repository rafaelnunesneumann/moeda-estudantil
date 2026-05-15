package com.moedaestudantil.controller;

import com.moedaestudantil.dto.auth.LoginRequestDTO;
import com.moedaestudantil.dto.auth.LoginResponseDTO;
import com.moedaestudantil.security.JwtUserDetails;
import com.moedaestudantil.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO dto) {
        return ResponseEntity.ok(authService.login(dto));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        JwtUserDetails details = (JwtUserDetails) authentication.getDetails();
        return ResponseEntity.ok(authService.getProfile(details.id(), details.role()));
    }
}
