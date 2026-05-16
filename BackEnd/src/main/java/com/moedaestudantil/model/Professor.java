package com.moedaestudantil.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "PROFESSOR")
@DiscriminatorValue("PROFESSOR")
@Getter
@Setter
@NoArgsConstructor
public class Professor extends Usuario {

    @Column(nullable = false, length = 255)
    private String departamento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instituicao_id", nullable = false)
    private InstituicaoEnsino instituicaoEnsino;
}
