-- Seed: Instituições de Ensino pré-cadastradas
-- Executar apenas uma vez; utiliza INSERT ... ON CONFLICT DO NOTHING para ser idempotente.

INSERT INTO instituicao_ensino (nome, endereco) VALUES
  ('Universidade de São Paulo (USP)',            'Rua da Reitoria, 374 – Cidade Universitária, São Paulo – SP'),
  ('Universidade Estadual de Campinas (UNICAMP)', 'Cidade Universitária Zeferino Vaz, Campinas – SP'),
  ('Universidade Federal de Minas Gerais (UFMG)', 'Av. Antônio Carlos, 6627 – Pampulha, Belo Horizonte – MG'),
  ('Universidade Federal do Rio de Janeiro (UFRJ)','Av. Pedro Calmon, 550 – Ilha do Fundão, Rio de Janeiro – RJ'),
  ('Universidade Federal de Santa Catarina (UFSC)','R. Eng. Agronômico Andrei Cristian Ferreira, s/n – Trindade, Florianópolis – SC'),
  ('Universidade Federal do Rio Grande do Sul (UFRGS)', 'Av. Paulo Gama, 110 – Farroupilha, Porto Alegre – RS'),
  ('Pontifícia Universidade Católica de São Paulo (PUC-SP)', 'R. Monte Alegre, 984 – Perdizes, São Paulo – SP'),
  ('Pontifícia Universidade Católica do Rio de Janeiro (PUC-Rio)', 'R. Marquês de São Vicente, 225 – Gávea, Rio de Janeiro – RJ'),
  ('Fundação Getulio Vargas (FGV)',               'Rua Itapeva, 474 – Bela Vista, São Paulo – SP'),
  ('Instituto Tecnológico de Aeronáutica (ITA)',  'Praça Marechal Eduardo Gomes, 50 – Vila das Acácias, São José dos Campos – SP'),
  ('Universidade Federal de Pernambuco (UFPE)',   'Av. Prof. Moraes Rego, 1235 – Cidade Universitária, Recife – PE'),
  ('Universidade Federal do Paraná (UFPR)',       'R. XV de Novembro, 1299 – Centro, Curitiba – PR')
ON CONFLICT DO NOTHING;
