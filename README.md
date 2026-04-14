# BANTADS — Trab-DAC


---

## Pré-requisitos

- **Node.js** (compatível com Angular 21; recomenda-se LTS recente)
- **npm** (veja `packageManager` em `frontend/package.json`)

---

## Como executar o front-end

Na pasta do projeto Angular:

```bash
cd frontend
npm install
npm start
```

Ou, equivalente:

```bash
cd frontend
npx ng serve
```

Abra o navegador em `http://localhost:4200/`.

O build de produção:

```bash
cd frontend
npx ng build
```

Artefatos em `frontend/dist/`.

---

## Tecnologias (front-end)

- Angular **21.x** (componentes standalone, zoneless por padrão)
- TypeScript
- RxJS
- **Bootstrap 5** (CSS via CDN em `frontend/src/index.html`, onde aplicável)
- **ngx-mask** (campos monetários em algumas telas)
- `HttpClient` para chamadas ao API Gateway (`provideHttpClient` em `app.config.ts`)

---

## Estrutura relevante (`frontend/src/app/`)

| Caminho | Conteúdo |
|---------|----------|
| `app.routes.ts` | Definição de rotas da aplicação |
| `app.config.ts` | `provideRouter`, `provideHttpClient`, etc. |
| `pages/cliente/` | Autocadastro, dashboard, depósito, saque, transferência, extrato, consultar-extrato (legado/paralelo) |
| `pages/administrador/` | Telas e stubs de CRUD/relatório (evolução contínua) |
| `gerente/` | Aprovação, consulta de cliente, top 3, tela inicial do gerente (em evolução) |
| `services/` | `ClienteService`, `GerenteService` (ex.: localStorage, integrações futuras com API) |
| `shared/models/` | Modelos como `Cliente`, `Pessoa` |

---

## Rotas registradas (`app.routes.ts`)

| Rota | Componente (resumo) |
|------|----------------------|
| `/` | Redireciona para `/cadastro` |
| `/cadastro` | Autocadastro |
| `/cliente` | Tela inicial do cliente |
| `/deposito` ou `/cliente/deposito` | Depósito |
| `/cliente/saque` | Saque |
| `/cliente/transferencia` | Transferência |
| `/cliente/extrato` | Extrato |
| `/gerente/aprovar` | Aprovar cliente |
| `/gerente/top3` | Três maiores saldos |
| `**` | Redireciona para `/cadastro` |

Componentes adicionais podem existir em pastas (ex.: administrador, `tela-inicial-gerente`, `consultar-extrato`) **sem rota dedicada** até serem integrados em `app.routes.ts`.

---

## API Gateway (desenvolvimento)

Várias telas usam URL base **`http://localhost:3000`** para endpoints como:

- `GET /conta/minha`
- `POST /conta/saque`, `POST /conta/transferencia`
- `GET /conta/extrato`

Se o gateway não estiver no ar, alguns fluxos usam **dados mock** ou tratamento de erro para permitir demonstração.

---

## Requisitos funcionais (referência)

O escopo completo (R1–R20), perfis Cliente, Gerente e Administrador, arquitetura de microsserviços, CQRS, SAGA orquestrada, API Gateway, PostgreSQL/MongoDB e Docker está definido no **documento oficial da disciplina**. Este README não substitui esse documento; serve apenas como mapa do repositório.

---

## Estado atual e pendências técnicas

Situação típica de projeto em andamento:

- O **build** (`ng build`) pode falhar enquanto houver imports quebrados, dependências não instaladas ou componentes incompletos (ex.: integração de telas novas com `GerenteService`, modais, ou pacotes como `@ng-bootstrap/ng-bootstrap` se forem adotados).
- Pastas **administrador** e alguns componentes em **gerente** podem estar em **esqueleto** (templates mínimos, testes gerados pelo CLI).
- Há **duas linhas** de extrato possíveis no código (`extrato` na rota principal e `consultar-extrato` em outra pasta); alinhar rotas e um único fluxo evita divergência.
- **Login** e proteção de rotas podem estar incompletos em relação ao enunciado (R2).

Antes de entregar ou apresentar, recomenda-se: `npm install`, `npx ng build`, corrigir erros de compilação e validar manualmente as rotas críticas.

---

## Equipe e repositório

- Remote típico: `https://github.com/GustavoNielsen/Trab-Dac` (ajuste se o fork for outro).

---

## Licença e uso

Uso acadêmico conforme regras da disciplina DAC / instituição.
