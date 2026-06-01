package com.moedaestudantil.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "VANTAGEM")
@Getter
@Setter
@NoArgsConstructor
public class Vantagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 1000)
    private String descricao;

    @Column(name = "foto_url", nullable = false, columnDefinition = "TEXT")
    private String foto;

    @Column(name = "custo_moedas", nullable = false, precision = 10, scale = 2)
    private BigDecimal custoMoedas;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "empresa_id", nullable = false)
    private EmpresaParceira empresa;
}
