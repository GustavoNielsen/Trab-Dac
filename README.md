# BANTADS — Trab-DAC

Sistema de **Internet Banking** para a disciplina **DAC**: front-end em **Angular 21**, **API Gateway** em Node.js (Express), microsserviços em **Java/Spring Boot**, infraestrutura com **Docker** (PostgreSQL, MongoDB, RabbitMQ). O escopo completo (R1–R20, CQRS, SAGA orquestrada, etc.) está no **documento oficial**; este arquivo descreve **como rodar e navegar** o que existe neste repositório.

---

## Início rápido

### Windows (recomendado)

```bat
scripts\start-dev.bat
```

O script sobe o Docker e lista os comandos para abrir **cada serviço em um terminal separado**.

### Manual

```bash
# 1) Infraestrutura
docker compose up -d

# 2) Microsserviços (terminais separados)
cd backend/ms-autenticador && mvnw.cmd spring-boot:run   # porta 8081
cd backend/ms-cliente      && mvnw.cmd spring-boot:run   # porta 8082
cd backend/ms-gerente       && mvnw.cmd spring-boot:run   # porta 8083

# 3) API Gateway (porta 3000)
cd apiGateway
copy .env.example .env
npm install
npm start

# 4) Front-end (porta 4200)
cd ../frontend
npm install
npm start
```

Abra **http://localhost:4200** (redireciona para `/login`).

Validação de build do front:

```bash
cd frontend
npx ng build --configuration development
```

---

## Mapa de portas

| Serviço | Porta | Observação |
|---------|-------|------------|
| Front-end Angular | **4200** | `npm start` |
| API Gateway | **3000** | `npm start` em `apiGateway/` |
| ms-autenticador | **8081** | context-path `/auth` |
| ms-cliente | **8082** | Postgres schema `cliente` |
| ms-gerente | **8083** | Postgres schema `gerente` |
| ms-conta | **8084** | referenciado no gateway (em evolução) |
| ms-saga | **8085** | referenciado no gateway (em evolução) |
| PostgreSQL (Docker) | **5434** | host → container `5432` |
| MongoDB | **27017** | auth em `bantads_auth` |
| RabbitMQ | **5672** / **15672** | management UI na 15672 |

Credenciais Postgres: **`bantads` / `bantads`**, banco **`bantads`**.  
Mongo: **`root` / `password`**.

---

## Estrutura do repositório

| Caminho | Conteúdo |
|---------|-----------|
| `frontend/` | SPA Angular — login, autocadastro, cliente, gerente, admin |
| `frontend/src/app/guards/auth.guard.ts` | Protege rotas autenticadas (R2) |
| `apiGateway/` | Gateway Express — ponto único de entrada HTTP |
| `apiGateway/auth.routes.js` | Login/logout + **token blacklist** |
| `apiGateway/cliente.routes.js` | Clientes (autocadastro, aprovação, consultas compostas) |
| `apiGateway/conta.routes.js` | Conta (extrato, saque, transferência) |
| `apiGateway/gerente.routes.js` | CRUD gerentes (admin) |
| `apiGateway/middlewares/` | `auth.middleware.js`, `role.middleware.js` |
| `apiGateway/token-blacklist.js` | Invalidação de JWT no logout |
| `apiGateway/.env.example` | URLs dos microsserviços e `JWT_SECRET` |
| `backend/ms-autenticador/` | JWT, login, usuários no MongoDB |
| `backend/ms-cliente/` | Cadastro e gestão de clientes (Postgres) |
| `backend/ms-gerente/` | Gerentes operacionais e admin (Postgres) |
| `backend/ClienteSagaController.java` | Controller SAGA (aprovar/rejeitar/atualizar cliente) — em integração |
| `docker-compose.yml` | Postgres, MongoDB, RabbitMQ |
| `init-db/01-schemas.sql` | Schemas `cliente`/`gerente`, tabelas e seed de gerentes |
| `scripts/start-dev.bat` | Sobe Docker e orienta startup dos serviços |
| `scripts/reset-postgres.bat` | Recria volume Postgres (erro de auth no autocadastro) |

---

## Pré-requisitos

- **Node.js** + **npm** (front e gateway)
- **Docker** + Docker Compose
- **Java 17+** e **Maven** (ou `mvnw` em cada `backend/ms-*`)

---

## Infraestrutura (Docker)

```bash
docker compose up -d
docker compose ps
```

O Postgres expõe a porta **5434** no host para evitar conflito com instalações locais nas portas 5432/5433. O script `init-db/01-schemas.sql` roda na primeira subida do container.

**Erro de autenticação no Postgres ao autocadastrar?**

1. Confirme que só o Docker escuta na 5434: `netstat -ano | findstr :5434`
2. Execute `scripts\reset-postgres.bat`
3. Reinicie `ms-cliente` e `ms-gerente`

---

## API Gateway

- Diretório: `apiGateway/`
- Porta: **3000**
- Copie `.env.example` → `.env` antes de subir

### Variáveis de ambiente (`.env`)

| Variável | Exemplo | Uso |
|----------|---------|-----|
| `PORT` | `3000` | Porta do gateway |
| `JWT_SECRET` | *(base64)* | Validação de JWT nos middlewares |
| `AUTH_SERVICE_URL` | `http://localhost:8081` | ms-autenticador |
| `CLIENTE_SERVICE_URL` | `http://localhost:8082` | ms-cliente |
| `GERENTE_SERVICE_URL` | `http://localhost:8083` | ms-gerente |
| `CONTA_SERVICE_URL` | `http://localhost:8084` | ms-conta |
| `SAGA_SERVICE_URL` | `http://localhost:8085` | ms-saga (aprovar/rejeitar, CRUD gerente) |

O front **só** deve chamar o gateway (`http://localhost:3000`), nunca os microsserviços diretamente.

### Arquitetura do gateway

```
Front (4200) → Gateway (3000)
                 ├── /auth          → auth.routes.js      → ms-autenticador (8081)
                 ├── /clientes/*    → cliente.routes.js   → ms-cliente / ms-saga / ms-conta
                 ├── /conta/*       → conta.routes.js     → ms-conta
                 └── /gerentes/*    → gerente.routes.js   → ms-gerente / ms-saga
```

Rotas protegidas passam por `authMiddleware` (JWT + blacklist) e, quando aplicável, `requireRole` (`CLIENTE`, `GERENTE`, `ADMIN`).

### Endpoints principais

| Método | Caminho | Auth | Descrição |
|--------|---------|------|-----------|
| `POST` | `/auth/login` | Não | Login |
| `POST` | `/auth/logout` | Sim | Logout + blacklist |
| `POST` | `/clientes` | Não | Autocadastro (escolhe gerente de menor carga) |
| `GET` | `/clientes?filtro=para_aprovar` | Gerente | Pendentes do gerente |
| `POST` | `/clientes/:cpf/aprovar` | Gerente | Aprovação via SAGA |
| `POST` | `/clientes/:cpf/rejeitar` | Gerente | Rejeição via SAGA |
| `GET` | `/clientes?filtro=melhores_clientes` | Gerente | Top 3 por saldo |
| `GET` | `/gerentes` | Admin | Listagem / dashboard |
| `POST` | `/gerentes` | Admin | Cadastro via SAGA |

Demais operações de conta e relatórios admin: ver `conta.routes.js` e `cliente.routes.js`.

---

## Microsserviços (Spring Boot)

### ms-autenticador (8081)

```bash
cd backend/ms-autenticador
mvnw.cmd spring-boot:run
```

- MongoDB: `mongodb://root:password@localhost:27017/bantads_auth?authSource=admin`
- Context path: `/auth` → login em `POST /auth/login`
- Seed de usuários via `MongoDataInitializer`
- Senhas: encoder SHA256 + salt

### ms-cliente (8082)

```bash
cd backend/ms-cliente
mvnw.cmd spring-boot:run
```

- Postgres schema **`cliente`** (porta host **5434**)
- `ClienteController` — autocadastro público
- `ClienteInternalController` — endpoints internos para o gateway
- `ClienteService` — persistência e regras de status (`PENDENTE`, etc.)

### ms-gerente (8083)

```bash
cd backend/ms-gerente
mvnw.cmd spring-boot:run
```

- Postgres schema **`gerente`**
- `GerenteController` — consulta de gerentes
- Seed inicial de 3 gerentes operacionais em `init-db/01-schemas.sql`

### ms-conta e ms-saga

Referenciados nas URLs do gateway (`8084`, `8085`). Operações como aprovação de cliente, rejeição, alteração de perfil e CRUD de gerentes dependem deles. O arquivo `backend/ClienteSagaController.java` indica a orquestração SAGA em construção.

(Linux/macOS: substitua `mvnw.cmd` por `./mvnw`.)

---

## Front-end (Angular)

### Tecnologias

- Angular **21** (standalone components)
- TypeScript, RxJS, Bootstrap 5, **ngx-mask**
- `HttpClient` em `app.config.ts`

### Login, sessão e guard

- Serviço: `frontend/src/app/services/auth.service.ts`
- Login: `POST http://localhost:3000/auth/login`
- Após login: `localStorage` com **`token`**, **`access_token`**, **`user`**, **`role`**
- **`authGuard`**: rotas de cliente, gerente e admin exigem login; fallback redireciona para `/login`

### Rotas (`frontend/src/app/app.routes.ts`)

| Rota | Tela | Guard |
|------|------|-------|
| `/` | → `/login` | — |
| `/login` | Login | — |
| `/cadastro` | Autocadastro | — |
| `/cliente` | Home do cliente | Sim |
| `/deposito`, `/cliente/deposito` | Depósito | Sim |
| `/cliente/saque` | Saque | Sim |
| `/cliente/transferencia` | Transferência | Sim |
| `/cliente/extrato` | Extrato | Sim |
| `/gerente/aprovar` | Aprovação de pedidos | Sim |
| `/gerente/top3` | Top 3 clientes | Sim |
| `/admin` | Painel administrador | Sim |
| `**` | → `/login` | — |

Telas de CRUD de gerentes (`listar`, `inserir`, `editar`) existem em `pages/administrador/crud-gerentes/` e podem ser acessadas a partir do painel admin conforme a navegação implementada.

### Integração com o gateway

| Fluxo | Estado |
|-------|--------|
| **Autocadastro** (`/cadastro`) | Integrado — `ClienteService.autocadastrar()` → `POST /clientes` |
| **Login** | Integrado — gateway → ms-autenticador |
| **Aprovar cliente** | Parcial — gateway/SAGA prontos; front em evolução |
| **Operações de conta** | Stub/mock até ms-conta completo |
| **Gerente (localStorage)** | Legado em algumas telas — migrar para API |

---

## Estado atual do projeto

- **Autocadastro ponta a ponta:** front → gateway → ms-cliente → Postgres (com gerente de menor carga).
- **Auth:** gateway modular com JWT, blacklist e auth guard no Angular.
- **ms-gerente** e schemas Postgres seedados; **ms-conta** e **ms-saga** ainda em integração.
- **Build do front:** `npx ng build --configuration development` deve passar.
- **Pendências:** unificar telas de gerente com API (sair do `localStorage`), ms-conta/ms-saga operacionais, rotas explícitas do CRUD admin, extrato real.

---

## Roteiro sugerido para demonstração (5–10 min)

1. Subir infra + microsserviços + gateway + front (`scripts\start-dev.bat` como guia).
2. `/cadastro` — autocadastro (valida Postgres e escolha de gerente).
3. `/login` — autenticar como gerente ou admin (usuários seed no Mongo).
4. `/gerente/aprovar` — fila de pendentes (quando SAGA estiver ativa).
5. `/gerente/top3` — melhores clientes por saldo.
6. `/admin` — visão administrador e CRUD de gerentes.

---

## Checklist antes de apresentar

- [ ] `docker compose up -d` (Postgres na **5434**, Mongo na **27017**)
- [ ] `ms-autenticador`, `ms-cliente`, `ms-gerente` rodando
- [ ] `apiGateway/.env` configurado; gateway na **3000**
- [ ] `npm start` no `frontend/` — app em **4200**
- [ ] `npx ng build` sem erro
- [ ] Autocadastro e login testados manualmente
- [ ] ms-conta / ms-saga no ar, se for demo de aprovação ou conta

---

## Repositório remoto

`https://github.com/GustavoNielsen/Trab-Dac`

---

## Licença / uso

Uso acadêmico conforme regras da disciplina e da instituição.
