-- Seed: Professores pré-cadastrados com ContaCorrente
-- Senhas: "123456" codificada com BCrypt
-- Executar APÓS seed_instituicoes.sql e após o Hibernate criar as tabelas

-- Inserir professores na tabela USUARIO (tipo = PROFESSOR)
INSERT INTO usuario (nome, email, senha, cpf, tipo) VALUES
  ('Carlos Eduardo Silva',  'carlos.silva@usp.br',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '11111111111', 'PROFESSOR'),
  ('Ana Paula Oliveira',    'ana.oliveira@unicamp.br','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '22222222222', 'PROFESSOR'),
  ('Ricardo Santos Lima',   'ricardo.lima@ufmg.br',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '33333333333', 'PROFESSOR')
ON CONFLICT DO NOTHING;

-- Inserir dados na tabela PROFESSOR (id = usuario.id, departamento, instituicao_id)
INSERT INTO professor (id, departamento, instituicao_id)
SELECT u.id, dep.departamento, dep.instituicao_id
FROM (VALUES
  ('carlos.silva@usp.br',    'Ciência da Computação', 1),
  ('ana.oliveira@unicamp.br', 'Engenharia Elétrica',   2),
  ('ricardo.lima@ufmg.br',   'Matemática',             3)
) AS dep(email, departamento, instituicao_id)
JOIN usuario u ON u.email = dep.email
WHERE NOT EXISTS (SELECT 1 FROM professor p WHERE p.id = u.id);

-- Criar ContaCorrente para cada professor com saldo inicial de 1000
INSERT INTO conta_corrente (saldo, professor_id)
SELECT 1000.00, p.id
FROM professor p
WHERE NOT EXISTS (SELECT 1 FROM conta_corrente cc WHERE cc.professor_id = p.id);
