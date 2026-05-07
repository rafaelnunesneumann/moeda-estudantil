package com.moedaestudantil.service;

import com.moedaestudantil.dto.empresa.EmpresaParceiraRequestDTO;
import com.moedaestudantil.dto.empresa.EmpresaParceiraResponseDTO;
import com.moedaestudantil.exception.ResourceNotFoundException;
import com.moedaestudantil.model.EmpresaParceira;
import com.moedaestudantil.repository.EmpresaParceiraRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmpresaParceiraService {

    private final EmpresaParceiraRepository empresaParceiraRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public EmpresaParceiraResponseDTO cadastrar(EmpresaParceiraRequestDTO dto) {
        if (empresaParceiraRepository.existsByEmail(dto.email())) {
            throw new IllegalArgumentException("Email já cadastrado: " + dto.email());
        }
        if (empresaParceiraRepository.existsByCnpj(dto.cnpj())) {
            throw new IllegalArgumentException("CNPJ já cadastrado: " + dto.cnpj());
        }

        EmpresaParceira empresa = new EmpresaParceira();
        empresa.setNome(dto.nome());
        empresa.setCnpj(dto.cnpj());
        empresa.setEmail(dto.email());
        empresa.setSenha(passwordEncoder.encode(dto.senha()));

        return toResponseDTO(empresaParceiraRepository.save(empresa));
    }

    @Transactional(readOnly = true)
    public List<EmpresaParceiraResponseDTO> listarTodas() {
        return empresaParceiraRepository.findAll().stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public EmpresaParceiraResponseDTO buscarPorId(Long id) {
        return empresaParceiraRepository.findById(id)
                .map(this::toResponseDTO)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Empresa parceira não encontrada com id: " + id));
    }

    @Transactional
    public EmpresaParceiraResponseDTO atualizar(Long id, EmpresaParceiraRequestDTO dto) {
        EmpresaParceira empresa = empresaParceiraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Empresa parceira não encontrada com id: " + id));

        if (empresaParceiraRepository.existsByEmailAndIdNot(dto.email(), id)) {
            throw new IllegalArgumentException("Email já cadastrado: " + dto.email());
        }
        if (empresaParceiraRepository.existsByCnpjAndIdNot(dto.cnpj(), id)) {
            throw new IllegalArgumentException("CNPJ já cadastrado: " + dto.cnpj());
        }

        empresa.setNome(dto.nome());
        empresa.setCnpj(dto.cnpj());
        empresa.setEmail(dto.email());
        empresa.setSenha(passwordEncoder.encode(dto.senha()));

        return toResponseDTO(empresaParceiraRepository.save(empresa));
    }

    @Transactional
    public void deletar(Long id) {
        if (!empresaParceiraRepository.existsById(id)) {
            throw new ResourceNotFoundException(
                    "Empresa parceira não encontrada com id: " + id);
        }
        empresaParceiraRepository.deleteById(id);
    }

    private EmpresaParceiraResponseDTO toResponseDTO(EmpresaParceira empresa) {
        return new EmpresaParceiraResponseDTO(
                empresa.getId(),
                empresa.getNome(),
                empresa.getCnpj(),
                empresa.getEmail());
    }
}
