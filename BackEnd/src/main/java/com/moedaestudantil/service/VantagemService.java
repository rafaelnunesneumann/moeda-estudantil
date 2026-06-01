package com.moedaestudantil.service;

import com.moedaestudantil.dto.vantagem.VantagemRequestDTO;
import com.moedaestudantil.dto.vantagem.VantagemResponseDTO;
import com.moedaestudantil.exception.ResourceNotFoundException;
import com.moedaestudantil.model.EmpresaParceira;
import com.moedaestudantil.model.Vantagem;
import com.moedaestudantil.repository.EmpresaParceiraRepository;
import com.moedaestudantil.repository.VantagemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VantagemService {

    private final VantagemRepository vantagemRepository;
    private final EmpresaParceiraRepository empresaParceiraRepository;

    @Transactional
    public VantagemResponseDTO cadastrar(Long empresaId, VantagemRequestDTO dto) {
        EmpresaParceira empresa = empresaParceiraRepository.findById(empresaId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Empresa parceira não encontrada com id: " + empresaId));

        Vantagem vantagem = new Vantagem();
        vantagem.setDescricao(dto.descricao());
        vantagem.setFoto(dto.foto());
        vantagem.setCustoMoedas(dto.custoMoedas());
        vantagem.setEmpresa(empresa);

        return toResponseDTO(vantagemRepository.save(vantagem));
    }

    @Transactional(readOnly = true)
    public List<VantagemResponseDTO> listarDisponiveis() {
        return vantagemRepository.findAllByOrderByIdDesc().stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<VantagemResponseDTO> listarPorEmpresa(Long empresaId) {
        return vantagemRepository.findByEmpresaIdOrderByIdDesc(empresaId).stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public VantagemResponseDTO buscarPorId(Long id) {
        return vantagemRepository.findById(id)
                .map(this::toResponseDTO)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Vantagem não encontrada com id: " + id));
    }

    @Transactional
    public void deletar(Long id, Long empresaId) {
        Vantagem vantagem = vantagemRepository.findByIdAndEmpresaId(id, empresaId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Vantagem não encontrada com id: " + id));
        vantagemRepository.delete(vantagem);
    }

    private VantagemResponseDTO toResponseDTO(Vantagem vantagem) {
        EmpresaParceira empresa = vantagem.getEmpresa();
        return new VantagemResponseDTO(
                vantagem.getId(),
                vantagem.getDescricao(),
                vantagem.getFoto(),
                vantagem.getCustoMoedas(),
                empresa.getId(),
                empresa.getNome());
    }
}
