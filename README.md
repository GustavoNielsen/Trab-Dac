# BANTADS — Trab-DAC

Sistema de **Internet Banking** para a disciplina **DAC**: front-end em **Angular 21**, **API Gateway** em Node.js (Express), microsserviços em **Java/Spring Boot**, infraestrutura com **Docker** (PostgreSQL, MongoDB, RabbitMQ). O escopo completo (R1–R20, CQRS, SAGA orquestrada, etc.) está no **documento oficial**; este arquivo descreve **como rodar e navegar** o que existe neste repositório.

---

## Início rápido

```bash
# 1) Infraestrutura (opcional, se for testar com bancos locais)
docker compose up -d

# 2) API Gateway (porta 3000)
cd apiGateway
npm install
node apiGateway.js

# 3) Front-end (porta 4200)
cd ../frontend
npm install
npm start
```

Abra o navegador em **http://localhost:4200** (redireciona para `/login`).

Validação de build do front:

```bash
cd frontend
npx ng build --configuration development
```

---

## Estrutura do repositório

| Caminho | Conteúdo |
|---------|-----------|
| `frontend/` | SPA Angular (telas cliente, gerente, admin, login, serviços) |
| `apiGateway/` | Ponto único de entrada HTTP (porta **3000**): `apiGateway.js` e rotas modulares |
| `apiGateway/auth.routes.js` | Login/logout via proxy para o `ms-autenticador` + blacklist de tokens |
| `apiGateway/cliente.routes.js` | Rotas de cliente |
| `apiGateway/conta.routes.js` | Rotas de conta (extrato, saque, transferência, etc.) |
| `apiGateway/gerente.routes.js` | Rotas de gerente |
| `backend/ms-autenticador/` | Microsserviço Spring Boot — autenticação (JWT, DTOs, repositório) |
| `backend/ms-cliente/` | Microsserviço Spring Boot — **esqueleto** (projeto Maven; regras de negócio em evolução) |
| `docker-compose.yml` | PostgreSQL, MongoDB e RabbitMQ para desenvolvimento |
| `init-db/` | Scripts SQL executados na subida do Postgres |

---

## Pré-requisitos

- **Node.js** + **npm** (front e gateway)
- **Docker** + Docker Compose (infra local)
- **Java 17+** e **Maven** (ou `mvnw` em cada pasta `backend/ms-*`) para os microsserviços

---

## Infraestrutura (Docker)

```bash
docker compose up -d
docker compose ps
```

Portas usuais: **5432** (Postgres), **27017** (Mongo), **5672 / 15672** (RabbitMQ). Credenciais em `docker-compose.yml`.

---

## API Gateway

- Diretório: `apiGateway/`
- Porta: **3000**
- Instalação: `npm install` dentro de `apiGateway/`
- Variáveis no **`.env`** (exemplos): `JWT_SECRET`, `AUTH_SERVICE_URL` (URL base do `ms-autenticador`, usada em `auth.routes.js`)

O enunciado exige que o **front fale apenas com o gateway**, não diretamente com cada microsserviço.

### Rotas de autenticação

Há duas abordagens no código (alinhar com o time qual manter):

| Abordagem | Onde | Comportamento |
|-----------|------|----------------|
| Proxy direto | `apiGateway.js` | `app.use('/auth', …)` → `http://localhost:8081/auth` |
| Router modular | `auth.routes.js` | `POST /login` e `POST /logout` com axios para `AUTH_SERVICE_URL`, middleware de auth e **token blacklist** |

O arquivo `auth.routes.js` existe no repositório; confira se está registrado em `apiGateway.js` (ex.: `app.use('/auth', require('./auth.routes'))`) antes de depender dele em produção/demo.

### Endpoints expostos pelo gateway (referência)

| Método | Caminho | Observação |
|--------|---------|------------|
| `POST` | `/auth/login` | Login (front → gateway → autenticador) |
| `POST` | `/auth/logout` | Logout (quando `auth.routes.js` estiver ativo) |
| — | `/conta/*`, `/cliente/*`, `/gerente/*` | Ver arquivos `*.routes.js` correspondentes |

---

## Microsserviços (Spring Boot)

### ms-autenticador

```bash
cd backend/ms-autenticador
mvnw.cmd spring-boot:run
```

(Linux/macOS: `./mvnw spring-boot:run`.)

Configure `application.properties` (Postgres, Mongo) conforme o `docker-compose.yml`. O gateway costuma apontar para a porta **8081** no path `/auth`.

### ms-cliente

Projeto inicial (Spring Boot 4, Java 17, WAR). Ainda sem APIs de domínio documentadas no repo — serve como base para cadastro/consulta de clientes.

```bash
cd backend/ms-cliente
mvnw.cmd spring-boot:run
```

(Linux/macOS: `./mvnw spring-boot:run`.)

---

## Front-end (Angular)

### Tecnologias

- Angular **21** (standalone components)
- TypeScript, RxJS
- Bootstrap 5 (via CDN em `frontend/src/index.html` onde aplicável)
- **ngx-mask** em formulários com máscara
- `HttpClient` habilitado em `frontend/src/app/app.config.ts`

### Login e sessão

- Serviço: `frontend/src/app/services/auth.service.ts`
- Chamada típica: `POST http://localhost:3000/auth/login`
- Após login, o serviço grava no `localStorage` chaves como **`token`**, **`user`**, **`role`**

**Atenção:** algumas telas ainda podem usar `access_token` no header. Vale unificar com o que o gateway e o `AuthService` esperam.

### Rotas ativas (`frontend/src/app/app.routes.ts`)

| Rota | Tela |
|------|------|
| `/` | Redireciona para `/login` |
| `/login` | Login |
| `/cadastro` | Autocadastro |
| `/cliente` | Home do cliente |
| `/deposito` ou `/cliente/deposito` | Depósito |
| `/cliente/saque` | Saque |
| `/cliente/transferencia` | Transferência |
| `/cliente/extrato` | Extrato |
| `/gerente/aprovar` | Aprovação de pedidos |
| `/gerente/top3` | Top 3 clientes por saldo |
| `**` | Fallback → `/cadastro` |

Outros componentes (administrador, telas extras de gerente, `consultar-extrato` legado) podem existir em pastas **sem rota** até serem registrados em `app.routes.ts`.

### Administrador (CRUD gerentes)

Telas em `frontend/src/app/pages/administrador/crud-gerentes/`:

| Pasta / tela | Estado |
|--------------|--------|
| `listar-gerentes/` | Listagem de gerentes |
| `inserir-gerentes/` | Cadastro |
| `editar-gerentes/` | Formulário completo (loading, validação, feedback de sucesso/erro) — HTML atualizado recentemente |

Registre rotas em `app.routes.ts` (ex.: `/admin/gerentes`, `/admin/gerentes/editar/:id`) quando o fluxo admin for fechado para demo.

### Chamadas HTTP de exemplo (gateway)

Base típica: `http://localhost:3000`

- `POST /auth/login`
- `GET /conta/minha`, `GET /conta/extrato`
- `POST /conta/saque`, `POST /conta/transferencia`

Com o gateway parado, várias telas usam **mock** ou fallback local para demonstração.

### Gerente — protótipo local

`GerenteService` pode usar **`localStorage`** (`clientesTemp`, listas de aprovados/recusados) para fluxo de demonstração. A rejeição na tela inicial do gerente pode usar **`window.prompt`** (sem `@ng-bootstrap/ng-bootstrap`), para manter o build sem dependência extra.

---

## Alterações recentes (remoto)

- **`apiGateway/auth.routes.js`** — login/logout com proxy, middleware e blacklist de tokens.
- **`backend/ms-cliente/`** — microsserviço cliente (estrutura Maven/Spring; lógica ainda em construção).
- **`editar-gerentes.html`** — UI de alteração de gerente (formulário, loading, mensagens de sucesso/erro).

---

## Estado atual do projeto

- **Build do front:** deve compilar com `npx ng build --configuration development`.
- **Warnings:** por exemplo `NG8107` em `gerente/consultar-cliente` (não bloqueiam o build).
- **Gateway / auth:** validar se o front usa proxy legado ou `auth.routes.js`; unificar registro no `apiGateway.js`.
- **ms-cliente:** scaffold pronto; falta integrar com gateway e front.
- **Extrato:** há mais de um componente relacionado (`extrato` na rota principal e `consultar-extrato` em pasta separada); convém unificar.
- **Admin / rotas:** telas de gerentes existem, mas muitas ainda sem rota em `app.routes.ts`.
- **Visual:** padronizar sidebar/topbar entre perfis e substituir `alert/prompt` por modais ou toasts melhora a apresentação.

---

## Roteiro sugerido para demonstração (5–10 min)

1. `/login` — autenticação e armazenamento de sessão.
2. `/cadastro` — autocadastro e CEP.
3. `/cliente` — menu e resumo.
4. `/cliente/saque`, `/cliente/transferencia`, `/cliente/extrato` — operações.
5. `/gerente/aprovar`, `/gerente/top3` — visão gerente.
6. Módulo administrador — listar/inserir/editar gerentes (conforme rotas registradas).

---

## Checklist antes de apresentar

- [ ] `docker compose up -d` (se for usar infra local)
- [ ] Gateway na porta **3000**
- [ ] `npm start` no `frontend/` e app abrindo em **4200**
- [ ] `npx ng build` sem erro no dia
- [ ] Rotas principais testadas manualmente
- [ ] Token unificado (`token` vs `access_token`)
- [ ] `ms-autenticador` rodando (porta esperada pelo gateway, ex. **8081**)
- [ ] `AUTH_SERVICE_URL` no `.env` do gateway, se usar `auth.routes.js`
- [ ] README revisado (este arquivo)

---

## Repositório remoto

Exemplo: `https://github.com/GustavoNielsen/Trab-Dac`

---


