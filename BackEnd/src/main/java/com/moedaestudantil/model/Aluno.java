package com.moedaestudantil.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "ALUNO")
@DiscriminatorValue("ALUNO")
@Getter
@Setter
@NoArgsConstructor
public class Aluno extends Usuario {

    @Column(nullable = false, length = 20)
    private String rg;

    @Column(nullable = false, length = 500)
    private String endereco;

    @Column(nullable = false, length = 255)
    private String curso;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instituicao_id", nullable = false)
    private InstituicaoEnsino instituicaoEnsino;
}
