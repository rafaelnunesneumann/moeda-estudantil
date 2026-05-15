# MoedaEstudantil

Sistema de reconhecimento do mérito estudantil através de moeda virtual. Professores distribuem moedas para reconhecer a dedicação dos alunos, que podem trocá-las por vantagens reais em empresas parceiras.

![Java](https://img.shields.io/badge/Java-21-007ec6?style=for-the-badge&logo=openjdk&logoColor=white) ![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5.0-007ec6?style=for-the-badge&logo=springboot&logoColor=white) ![Next.js](https://img.shields.io/badge/Next.js-16-007ec6?style=for-the-badge&logo=nextdotjs&logoColor=white) ![React](https://img.shields.io/badge/React-19-007ec6?style=for-the-badge&logo=react&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-007ec6?style=for-the-badge&logo=postgresql&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-007ec6?style=for-the-badge&logo=tailwindcss&logoColor=white)

---

## Sobre o Projeto

O MoedaEstudantil é uma plataforma que conecta alunos, professores e empresas parceiras em um ecossistema de reconhecimento acadêmico. O sistema foi desenvolvido como projeto da disciplina de Laboratório de Desenvolvimento de Software.

**Como funciona:**
- **Professores** recebem 1.000 moedas por semestre e as distribuem aos alunos como forma de reconhecimento por bom comportamento, participação em aula, etc.
- **Alunos** acumulam moedas e podem trocá-las por vantagens oferecidas por empresas parceiras (descontos em restaurantes, material escolar, mensalidades, etc.).
- **Empresas parceiras** cadastram vantagens com descrição, foto e custo em moedas, e recebem notificações quando alunos resgatam suas ofertas.

---

## Funcionalidades Implementadas

- **Cadastro de Alunos:** Nome, email, CPF, RG, endereço, instituição de ensino e curso, com validação completa e seleção de instituição pré-cadastrada.
- **Cadastro de Empresas Parceiras:** Nome, CNPJ, email e senha com validação de duplicidade.
- **Autenticação JWT:** Login unificado para alunos e empresas parceiras com tokens JWT stateless.
- **Dashboard por perfil:** Painel diferenciado para alunos (saldo, transações, vantagens) e empresas (vantagens cadastradas, cupons, resgates).
- **Gerenciamento de Perfil:** Visualização e edição de dados cadastrais, alteração de senha e exclusão de conta.
- **Landing Page:** Página institucional com seções de funcionalidades, como funciona, estatísticas e call-to-action.

---

## Tecnologias Utilizadas

### Back-end

- **Java 21** com **Spring Boot 3.5.0**
- **Spring Security** com autenticação JWT (jjwt 0.12.6)
- **Spring Data JPA** / Hibernate com PostgreSQL
- **Bean Validation** para validação de DTOs
- **Lombok** para redução de boilerplate
- **BCrypt** para hash de senhas

### Front-end

- **Next.js 16** (App Router) com **React 19** e **TypeScript**
- **Tailwind CSS v4** com **shadcn/ui** (estilo base-nova)
- **Framer Motion** para animações e transições
- **React Hook Form** + **Zod** para formulários e validação
- **Axios** para comunicação com a API
- **Lucide React** para ícones
- **Sonner** para notificações toast
- **react-imask** para máscaras de CPF/CNPJ/RG

### Infraestrutura

- **Docker Compose** para o banco de dados PostgreSQL 16
- **Maven Wrapper** para build do back-end

---

## Arquitetura

O sistema segue uma arquitetura em camadas, documentada nos diagramas disponíveis em `docs/`:

| Diagrama | Descrição |
| :--- | :--- |
| Diagrama de Componentes | Camadas: Frontend (portais por role) → API Gateway (REST) → Serviços de Negócio → Persistência JPA → PostgreSQL |
| Diagrama de Classes | Herança de `Usuario` (abstrato) para `Aluno` e `Professor`; `EmpresaParceira` standalone; `ContaCorrente`, `Transacao`, `Vantagem`, `Cupom` |
| Diagrama ER | Modelo relacional com 8 tabelas: USUARIO, ALUNO, PROFESSOR, EMPRESA_PARCEIRA, CONTA_CORRENTE, TRANSACAO, VANTAGEM, CUPOM |
| Diagrama de Casos de Uso | Atores: Aluno, Professor, Empresa Parceira, Sistema |

### Padrões adotados

- **Repository Pattern** para acesso a dados
- **Service Layer** para lógica de negócio
- **DTOs** (records) para transferência de dados entre camadas
- **Global Exception Handler** para tratamento centralizado de erros
- **JWT Stateless** para autenticação sem sessão no servidor
- **React Context API** para gerenciamento de estado de autenticação no frontend

### Endpoints da API

| Método | Rota | Acesso | Descrição |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | Público | Login (retorna JWT) |
| `GET` | `/auth/me` | Autenticado | Perfil do usuário logado |
| `POST` | `/alunos` | Público | Cadastro de aluno |
| `GET` | `/alunos` | Autenticado | Listar todos os alunos |
| `GET` | `/alunos/{id}` | Autenticado | Buscar aluno por ID |
| `PUT` | `/alunos/{id}` | Autenticado | Atualizar aluno |
| `DELETE` | `/alunos/{id}` | Autenticado | Deletar aluno |
| `POST` | `/empresas` | Público | Cadastro de empresa |
| `GET` | `/empresas` | Autenticado | Listar empresas |
| `GET` | `/empresas/{id}` | Autenticado | Buscar empresa por ID |
| `PUT` | `/empresas/{id}` | Autenticado | Atualizar empresa |
| `DELETE` | `/empresas/{id}` | Autenticado | Deletar empresa |
| `GET` | `/instituicoes` | Público | Listar instituições |

### Rotas do Frontend

| Rota | Acesso | Descrição |
| :--- | :--- | :--- |
| `/` | Público | Landing page institucional |
| `/cadastro` | Público | Cadastro de alunos e empresas |
| `/login` | Público | Login unificado |
| `/dashboard` | Autenticado | Painel principal (diferenciado por role) |
| `/dashboard/perfil` | Autenticado | Gerenciamento de perfil |

---

## Instalação e Execução

### Pré-requisitos

- **Java JDK 21** ou superior
- **Node.js 18+** com npm
- **Docker** (para o banco de dados PostgreSQL)

### 1. Clone o repositório

```bash
git clone <URL_DO_REPOSITÓRIO>
cd moeda-estudantil
```

### 2. Suba o banco de dados

```bash
cd BackEnd
docker-compose up -d
```

Isso inicia o PostgreSQL 16 na porta 5432 com o banco `moeda_estudantil`.

### 3. Execute o Back-end

```bash
cd BackEnd
./mvnw spring-boot:run
```

O back-end estará disponível em **http://localhost:8080**. O Hibernate cria/atualiza as tabelas automaticamente (`ddl-auto=update`).

### 4. Instale e execute o Front-end

```bash
cd FrontEnd/moeda-estudantil-web
npm install
npm run dev
```

O front-end estará disponível em **http://localhost:3000**.

### Seed de dados

Para popular as instituições de ensino, execute o script SQL disponível em `BackEnd/src/main/resources/db/seed_instituicoes.sql` diretamente no banco.

---

## Estrutura de Pastas

```
moeda-estudantil/
├── BackEnd/                              # API Spring Boot
│   ├── docker-compose.yml                # PostgreSQL 16
│   ├── pom.xml                           # Dependências Maven
│   └── src/main/java/com/moedaestudantil/
│       ├── config/                       # SecurityConfig (JWT + CORS)
│       ├── controller/                   # AlunoController, EmpresaParceiraController, AuthController, InstituicaoEnsinoController
│       ├── dto/                          # DTOs organizados por domínio (aluno/, empresa/, auth/, instituicao/)
│       ├── exception/                    # GlobalExceptionHandler, ResourceNotFoundException
│       ├── model/                        # Usuario (abstract), Aluno, EmpresaParceira, InstituicaoEnsino
│       ├── repository/                   # JPA Repositories
│       ├── security/                     # JwtUtil, JwtAuthenticationFilter, JwtUserDetails
│       └── service/                      # AlunoService, EmpresaParceiraService, AuthService
│
├── FrontEnd/moeda-estudantil-web/        # Aplicação Next.js
│   ├── src/
│   │   ├── app/                          # Rotas (App Router)
│   │   │   ├── page.tsx                  # Landing page
│   │   │   ├── login/page.tsx            # Login
│   │   │   ├── cadastro/page.tsx         # Cadastro (Aluno/Empresa)
│   │   │   └── dashboard/               # Área autenticada
│   │   │       ├── layout.tsx            # Layout com sidebar + auth guard
│   │   │       ├── page.tsx              # Dashboard principal
│   │   │       └── perfil/page.tsx       # Gerenciamento de perfil
│   │   ├── components/
│   │   │   ├── dashboard/               # Sidebar, DashboardHeader, StatCard, TransactionList
│   │   │   ├── forms/                   # AlunoForm, EmpresaForm, RoleSelector
│   │   │   ├── landing/                 # HeroSection, FeaturesSection, HowItWorksSection, StatsSection, CTASection
│   │   │   ├── layout/                  # Header, Footer
│   │   │   ├── shared/                  # AnimatedSection, GradientText, SectionHeader
│   │   │   └── ui/                      # shadcn/ui (button, input, card, label, badge, etc.)
│   │   ├── contexts/AuthContext.tsx      # Estado global de autenticação
│   │   ├── hooks/useInstituicoes.ts     # Hook para carregar instituições
│   │   ├── lib/
│   │   │   ├── api/                     # Módulos de API (alunos, empresas, auth, instituicoes)
│   │   │   ├── axios.ts                 # Instância Axios com interceptors JWT
│   │   │   └── utils.ts                 # Utilitário cn() (clsx + tailwind-merge)
│   │   └── types/api.ts                 # Interfaces TypeScript dos DTOs
│   └── package.json
│
└── docs/                                 # Documentação e diagramas UML
    ├── Diagrama casos de uso.png
    ├── Diagrama de classes.png
    ├── Diagrama de componentes.png
    ├── Diagrama Entidade Relacionamento.png
    ├── Modelo Entidade Relacionamento.png
    └── Historias.txt                     # User stories (US-01 a US-11)
```

---

## Variáveis de Ambiente

### Back-end (`application.properties`)

| Variável | Descrição | Valor padrão |
| :--- | :--- | :--- |
| `spring.datasource.url` | URL JDBC do PostgreSQL | `jdbc:postgresql://localhost:5432/moeda_estudantil` |
| `spring.datasource.username` | Usuário do banco | `postgres` |
| `spring.datasource.password` | Senha do banco | `postgres` |
| `jwt.secret` | Chave secreta para assinatura JWT | (configurada em application.properties) |
| `jwt.expiration` | Tempo de expiração do token (ms) | `86400000` (24h) |

### Front-end (`.env.local`)

| Variável | Descrição | Valor padrão |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | URL base da API back-end | `http://localhost:8080` |

---

## Documentações Utilizadas

- [Spring Boot 3.x](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Spring Security](https://docs.spring.io/spring-security/reference/)
- [Next.js 16](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [JJWT (Java JWT)](https://github.com/jwtk/jjwt)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Framer Motion](https://motion.dev/)

---

## Autores

| Nome | GitHub |
| :--- | :--- |
| Rafael Neumann | [@rafaelneumann](https://github.com/rafaelnunesneumann) |

---

## Licença

Este projeto foi desenvolvido com propósito educacional para a disciplina de Laboratório de Desenvolvimento de Software.
