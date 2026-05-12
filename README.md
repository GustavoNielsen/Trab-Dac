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
| `apiGateway/` | Ponto único de entrada HTTP (porta **3000**): `apiGateway.js`, rotas modulares (`cliente.routes.js`, `conta.routes.js`, `gerente.routes.js`, …) |
| `backend/ms-autenticador/` | Microsserviço Spring Boot — autenticação (JWT, DTOs, etc.) |
| `docker-compose.yml` | PostgreSQL, MongoDB e RabbitMQ para desenvolvimento |
| `init-db/` | Scripts SQL executados na subida do Postgres |

---

## Pré-requisitos

- **Node.js** + **npm** (front e gateway)
- **Docker** + Docker Compose (infra local)
- **Java 17+** e **Maven** (ou `mvnw` do projeto) para o `ms-autenticador`

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
- Configuração sensível (ex.: `JWT_SECRET`): arquivo **`.env`** na pasta do gateway, conforme `apiGateway.js`

O enunciado exige que o **front fale apenas com o gateway**, não diretamente com cada microsserviço.

---

## Microsserviço de autenticação (Spring Boot)

```bash
cd backend/ms-autenticador
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

### Chamadas HTTP de exemplo (gateway)

Base típica: `http://localhost:3000`

- `POST /auth/login`
- `GET /conta/minha`, `GET /conta/extrato`
- `POST /conta/saque`, `POST /conta/transferencia`

Com o gateway parado, várias telas usam **mock** ou fallback local para demonstração.

### Gerente — protótipo local

`GerenteService` pode usar **`localStorage`** (`clientesTemp`, listas de aprovados/recusados) para fluxo de demonstração. A rejeição na tela inicial do gerente pode usar **`window.prompt`** (sem `@ng-bootstrap/ng-bootstrap`), para manter o build sem dependência extra.

---

## Estado atual do projeto

- **Build do front:** deve compilar com `npx ng build --configuration development`.
- **Warnings:** por exemplo `NG8107` em `gerente/consultar-cliente` (não bloqueiam o build).
- **Extrato:** há mais de um componente relacionado (`extrato` na rota principal e `consultar-extrato` em pasta separada); convém unificar.
- **Admin / rotas:** telas em `pages/administrador/` podem precisar de rotas dedicadas (`/admin/...`) quando o fluxo for fechado.
- **Visual:** padronizar sidebar/topbar entre perfis e substituir `alert/prompt` por modais ou toasts melhora a apresentação.

---

## Roteiro sugerido para demonstração (5–10 min)

1. `/login` — autenticação e armazenamento de sessão.
2. `/cadastro` — autocadastro e CEP.
3. `/cliente` — menu e resumo.
4. `/cliente/saque`, `/cliente/transferencia`, `/cliente/extrato` — operações.
5. `/gerente/aprovar`, `/gerente/top3` — visão gerente.
6. Módulo administrador — mostrar o que estiver pronto e marcar o que falta integrar.

---

## Checklist antes de apresentar

- [ ] `docker compose up -d` (se for usar infra local)
- [ ] Gateway na porta **3000**
- [ ] `npm start` no `frontend/` e app abrindo em **4200**
- [ ] `npx ng build` sem erro no dia
- [ ] Rotas principais testadas manualmente
- [ ] Token unificado (`token` vs `access_token`)
- [ ] README revisado (este arquivo)

---

## Repositório remoto

Exemplo: `https://github.com/GustavoNielsen/Trab-Dac`

---


