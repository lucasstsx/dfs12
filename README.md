# Banco de Trocas de Conhecimento — Backend

## Sobre o projeto

Este repositório contém o **backend** do projeto Banco de Trocas de Conhecimento, conforme especificado no enunciado da disciplina DFS-2026.1.

---

## Tecnologias utilizadas

> Exigido pelo enunciado: "Node.js com Express", "Prisma ORM para realizar as operações no banco de dados", "banco de dados relacional, como PostgreSQL ou MySQL"

Foi utilizado o **Node.js com Express** para criar a API, **Prisma ORM** para realizar as operações no banco de dados e o **PostgreSQL** para o banco de dados relacional.

---

## Pré-requisitos

- Node.js >= 24.13.1
- PostgreSQL rodando localmente ou em nuvem
- Arquivo `.env` configurado (ver instruções abaixo)

---

## Como executar

> Exigido pelo enunciado: "instruções para executar a aplicação"

**1. Clone o repositório**
```bash
git clone https://github.com/lucasstsx/dfs12.git
cd dfs12
```

**2. Instale as dependências**
```bash
npm install
```

**3. Configure as variáveis de ambiente**
```bash
cp .env.example .env
```
Edite o arquivo `.env` e preencha com as credenciais do seu PostgreSQL e uma chave secreta para o JWT:
```
DATABASE_URL="postgresql://SEU_USUARIO:SUA_SENHA@localhost:5432/banco_trocas?schema=public"
PORT=3000
JWT_SECRET=sua_chave_secreta_aqui
```

**4. Execute as migrations do banco de dados**
```bash
npx prisma migrate dev
```

**5. Gere o Prisma Client**
```bash
npx prisma generate
```

**6. Inicie o servidor**
```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`.

---

## Modelagem do banco de dados

> Exigido pelo enunciado: "Estrutura básica do banco: Pessoas (id, nome, email, telefone, descricao) e Conhecimentos (id, titulo, descricao, categoria, nivel, pessoa_id)"

### Tabela `pessoas`

| Campo | Tipo | Obrigatorio | Observacao |
|---|---|---|---|
| `id` | UUID | Sim | Gerado automaticamente |
| `nome` | String | Sim | Nome completo |
| `email` | String | Sim | Unico (constraint unique) |
| `telefone` | String | Sim | Forma alternativa de contato |
| `descricao` | String | Nao | Breve apresentacao da pessoa |
| `senha` | String | Sim | Hash bcrypt — nunca retornado nas respostas |
| `isAdmin` | Boolean | Sim | Define se é administrador (default: false) |
| `criadoEm` | DateTime | Sim | Gerado automaticamente |

### Tabela `conhecimentos`

| Campo | Tipo | Obrigatorio | Observacao |
|---|---|---|---|
| `id` | UUID | Sim | Gerado automaticamente |
| `titulo` | String | Sim | Nome do conhecimento oferecido |
| `descricao` | String | Sim | Explicacao do conteudo |
| `categoria` | Enum | Sim | Ver valores aceitos abaixo |
| `nivel` | Enum | Sim | Ver valores aceitos abaixo |
| `pessoa_id` | UUID | Sim | FK para a tabela pessoas |
| `criadoEm` | DateTime | Sim | Gerado automaticamente |

### Enums

**`categoria`:** `MUSICA` | `TECNOLOGIA` | `EDUCACAO` | `ARTES` | `IDIOMAS` | `OUTROS`

**`nivel`:** `BASICO` | `INTERMEDIARIO` | `AVANCADO`

### Relação entre tabelas

- Uma `Pessoa` pode ter **muitos** `Conhecimentos` (1:N)
- Ao remover uma pessoa, todos os seus conhecimentos são removidos automaticamente (`onDelete: Cascade`)

---

## Endpoints da API

### Health Check

| Metodo | Rota | Descricao |
|---|---|---|
| `GET` | `/api/health` | Verifica se o servidor esta ativo |

---

### Autenticacao

| Metodo | Rota | Descricao |
|---|---|---|
| `POST` | `/api/auth/login` | Autentica uma pessoa e retorna um token JWT |

**Body — POST `/api/auth/login`**
```json
{
  "email": "lucas@email.com",
  "senha": "minhasenha"
}
```

**Resposta — POST `/api/auth/login`**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

O token retornado deve ser enviado no header `Authorization` das rotas protegidas:
```
Authorization: Bearer <token>
```

O token contém `id`, `email` e `isAdmin` no payload e expira em **7 dias**.

---

### Pessoas

| Metodo | Rota | Descricao | Autenticacao |
|---|---|---|---|
| `POST` | `/api/pessoas` | Cria uma nova pessoa | Nao |
| `GET` | `/api/pessoas` | Lista pessoas com paginacao | Nao |
| `GET` | `/api/pessoas/:id` | Busca pessoa por ID (inclui conhecimentos) | Nao |
| `PATCH` | `/api/pessoas/:id` | Atualiza dados de uma pessoa | Sim — dono ou admin |
| `DELETE` | `/api/pessoas/:id` | Remove uma pessoa e seus conhecimentos | Sim — dono ou admin |

**Body — POST `/api/pessoas`**
```json
{
  "nome": "Lucas Silva",
  "email": "lucas@email.com",
  "telefone": "81999999999",
  "descricao": "Desenvolvedor apaixonado por música",
  "senha": "minhasenha"
}
```

**Body — PATCH `/api/pessoas/:id`** (todos os campos são opcionais)
```json
{
  "nome": "Lucas Souza",
  "email": "lucas.novo@email.com"
}
```

**Resposta — GET `/api/pessoas/:id`**
```json
{
  "id": "uuid-aqui",
  "nome": "Lucas Silva",
  "email": "lucas@email.com",
  "telefone": "81999999999",
  "descricao": "Desenvolvedor apaixonado por música",
  "isAdmin": false,
  "criadoEm": "2026-02-22T00:00:00.000Z",
  "conhecimentos": [
    {
      "id": "uuid-conhecimento",
      "titulo": "Violão básico",
      "descricao": "Ensino acordes iniciais",
      "categoria": "MUSICA",
      "nivel": "BASICO",
      "pessoaId": "uuid-aqui",
      "criadoEm": "2026-02-22T00:00:00.000Z"
    }
  ]
}
```

**Resposta — GET `/api/pessoas`** (paginada)
```json
{
  "data": [ ... ],
  "meta": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

**Query params de paginacao:** `?page=1&limit=10`

---

### Conhecimentos

| Metodo | Rota | Descricao | Autenticacao |
|---|---|---|---|
| `POST` | `/api/conhecimentos` | Cria um novo conhecimento | Sim |
| `GET` | `/api/conhecimentos` | Lista conhecimentos com paginacao e filtros | Nao |
| `GET` | `/api/conhecimentos/:id` | Busca conhecimento por ID (inclui responsavel) | Nao |
| `PATCH` | `/api/conhecimentos/:id` | Atualiza um conhecimento | Sim — dono ou admin |
| `DELETE` | `/api/conhecimentos/:id` | Remove um conhecimento | Sim — dono ou admin |

**Body — POST `/api/conhecimentos`**
```json
{
  "titulo": "Violão básico",
  "descricao": "Ensino os acordes iniciais e técnicas básicas de dedilhado",
  "categoria": "MUSICA",
  "nivel": "BASICO",
  "pessoaId": "uuid-da-pessoa"
}
```

**Body — PATCH `/api/conhecimentos/:id`** (todos os campos são opcionais)
```json
{
  "titulo": "Violão intermediário",
  "nivel": "INTERMEDIARIO"
}
```

**Resposta — GET `/api/conhecimentos`** (paginada, com responsavel)
```json
{
  "data": [
    {
      "id": "uuid-conhecimento",
      "titulo": "Violão básico",
      "descricao": "Ensino os acordes iniciais...",
      "categoria": "MUSICA",
      "nivel": "BASICO",
      "pessoaId": "uuid-pessoa",
      "criadoEm": "2026-02-22T00:00:00.000Z",
      "pessoa": {
        "id": "uuid-pessoa",
        "nome": "Lucas Silva",
        "email": "lucas@email.com",
        "telefone": "81999999999"
      }
    }
  ],
  "meta": {
    "total": 15,
    "page": 1,
    "limit": 10,
    "totalPages": 2
  }
}
```

**Query params disponíveis:**

| Param | Tipo | Descricao | Exemplo |
|---|---|---|---|
| `page` | number | Numero da pagina (padrao: 1) | `?page=2` |
| `limit` | number | Itens por pagina (padrao: 10) | `?limit=5` |
| `categoria` | string | Filtra por categoria | `?categoria=TECNOLOGIA` |
| `nivel` | string | Filtra por nivel | `?nivel=BASICO` |
| `busca` | string | Busca no titulo e na descricao | `?busca=violao` |

**Exemplos de combinação de filtros:**
```
GET /api/conhecimentos?categoria=TECNOLOGIA
GET /api/conhecimentos?nivel=BASICO
GET /api/conhecimentos?busca=python
GET /api/conhecimentos?categoria=TECNOLOGIA&nivel=BASICO
GET /api/conhecimentos?categoria=TECNOLOGIA&nivel=BASICO&busca=python
```

---

### Codigos de resposta

| Codigo | Significado |
|---|---|
| `200` | Sucesso |
| `201` | Criado com sucesso |
| `204` | Removido com sucesso (sem corpo) |
| `400` | Dados inválidos (campos faltando, enum inválido, UUID inválido) |
| `401` | Token ausente ou inválido |
| `403` | Sem permissão para modificar este recurso |
| `404` | Recurso não encontrado |
| `409` | Conflito — e-mail já cadastrado |
| `500` | Erro interno do servidor |

---


## Melhorias adicionais implementadas

Itens não exigidos explicitamente pelo PDF, mas implementados para maior qualidade e robustez da API.

### Paginacao em todas as listagens

Ambos os endpoints `GET /api/pessoas` e `GET /api/conhecimentos` aceitam `?page` e `?limit` e retornam metadados (`total`, `page`, `limit`, `totalPages`). Implementado com `skip`/`take` do Prisma e `$transaction` para busca + contagem em paralelo.

**Arquivos:** `src/services/pessoa.service.js`, `src/services/conhecimento.service.js`

### Ordenacao por data de criacao

Todas as listagens retornam os registros ordenados por `criadoEm` decrescente (mais recentes primeiro), garantindo comportamento previsível na paginação.

**Arquivos:** `src/services/pessoa.service.js` e `src/services/conhecimento.service.js` — `orderBy: { criadoEm: 'desc' }`

### Conhecimentos inclusos no detalhe de pessoa

`GET /api/pessoas/:id` retorna a pessoa com o array `conhecimentos` populado, evitando que o frontend futuramente precise fazer uma segunda requisição.

**Arquivo:** `src/services/pessoa.service.js` — `include: { conhecimentos: true }` no `getById`

### Tratamento de email duplicado no update

`PATCH /api/pessoas/:id` com um e-mail já pertencente a outra pessoa retorna `409` com mensagem clara, em vez de `500` genérico. Tratamento do erro Prisma `P2002`.

**Arquivo:** `src/controllers/pessoa.controller.js` — bloco `catch` do método `update`

### Validacao centralizada de UUID e enums

`isValidUUID`, `CATEGORIAS_VALIDAS` e `NIVEIS_VALIDOS` são exportados de um único arquivo utilitário e reutilizados em todos os controllers.

**Arquivo:** `src/utils/validators.js`

---

## Extras (Desafios Opcionais)

### Filtros Avancados — Implementado

> **Enunciado — Seção "Extras":** "Busca por título ou descrição. Combinação de filtros ex (categoria + nível)."

**Busca por título ou descrição** (`?busca=`)

Permite pesquisa textual livre nos campos `titulo` e `descricao`, sem distinção de maiúsculas/minúsculas. Implementado com o operador `OR` + `contains` + `mode: 'insensitive'` do Prisma.

```
GET /api/conhecimentos?busca=violao
GET /api/conhecimentos?busca=matematica
```

**Arquivo:** `src/services/conhecimento.service.js` — `where.OR = [{ titulo: { contains } }, { descricao: { contains } }]`

**Combinação de filtros**

Os três filtros (`categoria`, `nivel`, `busca`) podem ser usados juntos na mesma requisição. O `where` é construído dinamicamente — cada campo só é adicionado se o valor foi fornecido.

```
GET /api/conhecimentos?categoria=TECNOLOGIA&nivel=BASICO&busca=python
```

| Combinacao | Comportamento |
|---|---|
| Nenhum filtro | Lista paginada completa |
| `?categoria=MUSICA` | Apenas categoria MUSICA |
| `?nivel=BASICO` | Apenas nível BASICO |
| `?busca=python` | Busca textual no titulo e descricao |
| `?categoria=TECNOLOGIA&nivel=BASICO` | Categoria E nivel |
| `?categoria=TECNOLOGIA&busca=python` | Categoria E busca textual |
| `?nivel=AVANCADO&busca=react` | Nivel E busca textual |
| `?categoria=TECNOLOGIA&nivel=BASICO&busca=python` | Todos os filtros combinados |

**Arquivos:** `src/controllers/conhecimento.controller.js` e `src/services/conhecimento.service.js`

---

### Autenticacao e Roles (Admin) — Implementado

> **PDF — Seção "Extras":** "Implementar um sistema de autenticação para: pessoas cadastradas editarem e excluírem apenas suas próprias ofertas."

**Cadastro com senha e Nível de Acesso**

`POST /api/pessoas` exige o campo `senha` (armazenada como hash bcrypt). O campo `isAdmin` define se o usuário tem privilégios totais sobre o sistema.

**Arquivo:** `src/controllers/pessoa.controller.js`, `prisma/schema.prisma`

**Login e token JWT**

`POST /api/auth/login` valida as credenciais e retorna um JWT contendo `{ id, email, isAdmin }` no payload.

**Arquivos:** `src/controllers/auth.controller.js`, `src/services/auth.service.js`

**Middleware e Protecao com Admin Override**

O `authMiddleware` valida o token e injeta `req.pessoaId` e `req.isAdmin`. As rotas de escrita verificam se o usuário é o dono do recurso **OU** se ele é um administrador, permitindo o gerenciamento via dashboard administrativo.

- `PATCH/DELETE /api/pessoas/:id` — Permite se `id === req.pessoaId` ou `req.isAdmin === true`
- `PATCH/DELETE /api/conhecimentos/:id` — Permite se `conhecimento.pessoaId === req.pessoaId` ou `req.isAdmin === true`

**Arquivos:** `src/middlewares/auth.middleware.js`, `src/controllers/pessoa.controller.js`, `src/controllers/conhecimento.controller.js`

---

## Estrutura de pastas

```
dfs12/
├── prisma/
│   ├── schema.prisma          # Modelos Pessoa e Conhecimento, enums Categoria e Nivel
│   └── migrations/            # Historico de migrations do banco de dados
├── src/
│   ├── app.js                 # Configuracao do Express e registro das rotas
│   ├── server.js              # Inicializacao do servidor HTTP
│   ├── config/
│   │   └── prisma.js          # Instancia do Prisma Client (singleton)
│   ├── controllers/
│   │   ├── auth.controller.js         # Recebe requisicao de login e retorna JWT
│   │   ├── pessoa.controller.js       # Recebe requisicao, valida e retorna resposta (Pessoa)
│   │   └── conhecimento.controller.js # Recebe requisicao, valida enums e retorna resposta (Conhecimento)
│   ├── middlewares/
│   │   └── auth.middleware.js         # Valida JWT e injeta req.pessoaId e req.isAdmin
│   ├── services/
│   │   ├── auth.service.js            # Valida credenciais e gera token JWT
│   │   ├── pessoa.service.js          # Regras de negocio e queries Prisma para Pessoa
│   │   └── conhecimento.service.js    # Regras de negocio e queries Prisma para Conhecimento
│   ├── routes/
│   │   ├── index.js                   # Agrega e registra todas as rotas
│   │   ├── auth.routes.js             # Rotas de /api/auth
│   │   ├── pessoa.routes.js           # Rotas de /api/pessoas
│   │   └── conhecimento.routes.js     # Rotas de /api/conhecimentos
│   └── utils/
│       └── validators.js              # isValidUUID, CATEGORIAS_VALIDAS, NIVEIS_VALIDOS
├── .env.example               # Modelo de variaveis de ambiente
├── package.json
└── README.md
```
