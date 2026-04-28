# BANTADS — Trab-DAC

Projeto acadêmico de **Internet Banking** (disciplina DAC): front-end em **Angular**, **API Gateway** em Node.js, microsserviços em **Java/Spring Boot**, infraestrutura com **Docker** (PostgreSQL, MongoDB, RabbitMQ), alinhado ao enunciado (perfis Cliente, Gerente e Administrador; requisitos R1–R20 no documento oficial).

---
cd 
## Estrutura do repositório

| Pasta / arquivo | Descrição |
|-----------------|-----------|
| `frontend/` | Aplicação **Angular 21** (SPA) |
| `apiGateway/` | **API Gateway** (Express, proxy e JWT na porta **3000**) |
| `backend/ms-autenticador/` | Microsserviço **Spring Boot** — autenticação (ex.: JWT) |
| `docker-compose.yml` | Sobe **PostgreSQL**, **MongoDB** e **RabbitMQ** para desenvolvimento |
| `init-db/` | Scripts SQL montados em `/docker-entrypoint-initdb.d` (PostgreSQL) |

---

## Pré-requisitos

- **Node.js** + **npm** (Angular 21 no `frontend/`)
- **Docker** e Docker Compose (para subir bancos e fila)
- **Java 17+** e **Maven** (para compilar/rodar `backend/ms-autenticador`)

---

## Infraestrutura local (Docker)

Na raiz do repositório:

```bash
docker compose up -d
```

Serviços típicos (ver `docker-compose.yml`):

| Serviço | Porta | Uso indicado no doc |
|---------|-------|----------------------|
| PostgreSQL | 5432 | Dados transacionais (schemas por serviço) |
| MongoDB | 27017 | Autenticação / dados conforme microsserviço |
| RabbitMQ | 5672 (AMQP), 15672 (management UI) | Mensageria (ex.: CQRS / eventos) |

Credenciais e nomes de banco estão definidos no próprio `docker-compose.yml`.

---

## API Gateway

- Pasta: `apiGateway/`
- Porta padrão: **3000**
- Dependências: instalar com `npm install` dentro de `apiGateway/`
- Variáveis: uso de `.env` (ex.: `JWT_SECRET`) — ver `apiGateway.js` e documentação do grupo

O front-end deve conversar com o sistema **somente** via este gateway (conforme enunciado), não diretamente com cada microsserviço.

---

## Microsserviço de autenticação

- Pasta: `backend/ms-autenticador/`
- Build/execução típicos Maven:

```bash
cd backend/ms-autenticador
./mvnw spring-boot:run
```

(Em Windows pode ser `mvnw.cmd`.)

---

## Front-end (Angular)

### Executar em desenvolvimento

```bash
cd frontend
npm install
npm start
```

Abra `http://localhost:4200/`.

### Build de produção

```bash
cd frontend
npx ng build
```

Saída em `frontend/dist/`.

### Tecnologias principais

- Angular **21.x** (componentes standalone)
- TypeScript, RxJS
- **Bootstrap 5** (CDN em `frontend/src/index.html` onde aplicável)
- **ngx-mask** em formulários que precisam de máscara
- `HttpClient` (`provideHttpClient` em `app.config.ts`)

### Autenticação no front (`AuthService`)

- Arquivo: `frontend/src/app/services/auth.service.ts`
- Login HTTP: `POST http://localhost:3000/auth/login`
- Após sucesso, armazena em `localStorage` chaves como `token`, `user`, `role` (ajustar telas que ainda usarem `access_token` para manter consistência com o gateway).

### Rotas (`frontend/src/app/app.routes.ts`)

| Rota | Descrição |
|------|-----------|
| `/` | Redireciona para **`/login`** |
| `/login` | Tela de login |
| `/cadastro` | Autocadastro |
| `/cliente` | Home do cliente |
| `/deposito` ou `/cliente/deposito` | Depósito |
| `/cliente/saque` | Saque |
| `/cliente/transferencia` | Transferência |
| `/cliente/extrato` | Extrato |
| `/gerente/aprovar` | Aprovação de clientes |
| `/gerente/top3` | Top 3 saldos |
| `**` | Fallback (atualmente para `/cadastro`) |

Outros componentes (ex.: **administrador** — relatório de clientes, CRUD de gerentes; **gerente** — visualização de clientes, tela inicial do gerente) podem existir em pastas e serem integrados às rotas conforme o grupo evoluir.

### Pastas úteis em `frontend/src/app/`

| Caminho | Conteúdo |
|---------|----------|
| `pages/login/` | Login |
| `pages/cliente/` | Fluxos do cliente |
| `pages/administrador/` | Telas do administrador |
| `gerente/` | Fluxos do gerente (aprovar, top 3, consultas, etc.) |
| `services/` | `ClienteService`, `GerenteService`, `AuthService`, … |
| `shared/models/` | Modelos (`Cliente`, `Pessoa`, …) |

### Endpoints usados pelo front (exemplos)

Algumas telas chamam o gateway em **`http://localhost:3000`**, por exemplo:

- `GET /conta/minha`, `GET /conta/extrato`
- `POST /conta/saque`, `POST /conta/transferencia`
- `POST /auth/login` (login)

Se o gateway ou o back não estiverem no ar, partes do front podem usar **mock** ou tratamento de erro — comportamento a unificar em produção.

---

## Requisitos funcionais (referência)

O escopo completo (**R1–R20**), arquitetura de microsserviços, **CQRS**, **SAGA orquestrada**, **API Composition**, **Database per Service**, PostgreSQL + MongoDB e empacotamento em **Docker** estão no **documento oficial da disciplina**. Este README é apenas um mapa do repositório.

---

## Estado do projeto e boas práticas

- Manter **`npm install`** e **`npx ng build`** passando no `frontend/` antes de entregas.
- Alinhar **token** (`token` vs `access_token`) entre `AuthService`, gateway e telas que usam `Authorization: Bearer ...`.
- Componentes **administrador** e **gerente** podem estar em diferentes níveis de conclusão; integrar rotas e serviços de forma consistente.
- Pode haver **duas implementações** de extrato no código (`extrato` roteado vs `consultar-extrato`); convém definir uma única tela oficial.

---


