# LibriX Backend

API REST para gerenciamento de bibliotecas, usuários, livros e empréstimos. O projeto oferece autenticação baseada em JWT, controle de acesso por perfil, persistência em PostgreSQL com Prisma, documentação OpenAPI/Swagger, upload de capas e recomendações de livros apoiadas por embeddings e modelos de linguagem.

## Sumário

- [Visão geral](#visão-geral)
- [Problema resolvido](#problema-resolvido)
- [O que é entregue ao usuário final](#o-que-é-entregue-ao-usuário-final)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Pré-requisitos](#pré-requisitos)
- [Configuração e execução](#configuração-e-execução)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Banco de dados](#banco-de-dados)
- [Autenticação e perfis](#autenticação-e-perfis)
- [Endpoints](#endpoints)
- [Agente de IA e recomendações](#agente-de-ia-e-recomendações)
- [Testes e qualidade](#testes-e-qualidade)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Limitações e observações](#limitações-e-observações)

## Visão geral

O LibriX Backend centraliza as operações de uma biblioteca em uma API HTTP. Ele permite cadastrar e consultar usuários, manter o catálogo de livros, registrar empréstimos e disponibilizar recomendações personalizadas com base no histórico de leitura.

A API roda por padrão em `http://localhost:3334` e a documentação interativa fica em `http://localhost:3334/api-docs`.

## Problema resolvido

Bibliotecas precisam controlar usuários, catálogo, exemplares e circulação sem depender de registros dispersos. O LibriX resolve esse problema ao:

- manter usuários, livros e empréstimos em um banco relacional;
- controlar quem pode executar cada operação por perfil;
- validar os payloads recebidos com Zod;
- informar o estado do empréstimo (`INPROGRESS`, `RETURNED` ou `DELAYED`);
- permitir busca e paginação do catálogo;
- relacionar o histórico de empréstimos às preferências de leitura;
- gerar recomendações acompanhadas de uma explicação em linguagem natural por um agente de IA.

## O que é entregue ao usuário final

Para o usuário final, o sistema entrega:

- cadastro e autenticação;
- consulta de livros e detalhes do catálogo;
- registro e acompanhamento de empréstimos pela operação da biblioteca;
- capas de livros armazenadas em serviço de mídia;
- recomendações de até três livros semelhantes ao histórico recente por agente de IA;
- explicação textual, em português, sobre o motivo das recomendações pelo agente de IA;
- uma interface Swagger para explorar e testar os endpoints.

## Tecnologias

- **Node.js + TypeScript**: execução e tipagem da aplicação;
- **Express 5**: servidor HTTP e roteamento;
- **PostgreSQL**: banco de dados relacional;
- **Prisma 7**: schema, migrações e acesso ao banco;
- **Zod**: validação de requisições;
- **JWT + bcrypt**: autenticação e proteção de senhas;
- **Hugging Face**: geração de embeddings multilíngues;
- **OpenRouter**: geração da explicação das recomendações;
- **Cloudinary + Multer**: upload e hospedagem de imagens;
- **Vitest**: testes automatizados;
- **Swagger UI**: documentação interativa.

## Arquitetura

O código é organizado em camadas:

1. **Rotas HTTP** recebem as requisições e aplicam middlewares.
2. **Controladores** extraem parâmetros, validam payloads e formatam respostas.
3. **Casos de uso** concentram as regras de negócio.
4. **Factories** montam as dependências de cada caso de uso.
5. **Repositórios** abstraem persistência, com implementações Prisma e em memória.
6. **Serviços** encapsulam JWT, embeddings e geração de texto por LLM.
7. **Prisma** conecta os casos de uso ao PostgreSQL.

O servidor só registra as rotas depois de conectar ao banco. Erros de domínio são tratados por `AppError`; erros não tratados retornam `500`.

## Pré-requisitos

- Node.js compatível com TypeScript/ESM do projeto;
- pnpm `11.5.0`;
- Docker e Docker Compose;
- credenciais opcionais para Hugging Face, OpenRouter e Cloudinary quando esses recursos forem usados.

## Configuração e execução

### 1. Instalar dependências

```bash
pnpm install
```

O `postinstall` executa `prisma generate` e atualiza o cliente em `generated/prisma`.

### 2. Subir o PostgreSQL

```bash
docker compose up -d
```

O compose cria o serviço `api-librix` na porta `5432`, com usuário `docker`, senha `docker123` e banco `apiLibrix`.

### 3. Criar o arquivo de ambiente

No PowerShell:

```powershell
Copy-Item .env.example .env
```

Preencha as variáveis conforme a seção [Variáveis de ambiente](#variáveis-de-ambiente).

### 4. Aplicar as migrações

```bash
pnpm exec prisma migrate dev
```

Para gerar novamente o cliente Prisma:

```bash
pnpm exec prisma generate
```

### 5. Popular dados iniciais

```bash
pnpm seed
```

O seed cria usuários de teste e livros de exemplo. As credenciais estão na seção [Usuários iniciais](#usuários-iniciais).

### 6. Iniciar a API

Desenvolvimento com recarga automática:

```bash
pnpm dev
```

Acesse:

- API: `http://localhost:3334`
- Swagger: `http://localhost:3334/api-docs`

## Variáveis de ambiente

O arquivo `.env.example` contém a base da configuração, mas os serviços presentes no código também leem as variáveis abaixo:

```env
DATABASE_URL="postgresql://docker:docker123@localhost:5432/apiLibrix?schema=public"
APP_HOST="http://localhost:3334"
PORT=3334
NODE_ENV=dev
JWT_SECRET="troque-por-um-segredo-forte"
JWT_REFRESH_SECRET="troque-por-outro-segredo-forte"

# IA
HUGGINGFACE_API_TOKEN="seu-token"
OPENROUTER_API_KEY="sua-chave"
OPENROUTER_MODEL="openai/gpt-oss-20b:free"

# Upload de capas
CLOUDINARY_CLOUD_NAME="seu-cloud-name"
CLOUDINARY_API_KEY="sua-api-key"
CLOUDINARY_API_SECRET="seu-api-secret"
```

`DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET` e `APP_HOST` são validadas na inicialização. Os tokens de IA e as credenciais do Cloudinary são necessários apenas para os fluxos correspondentes, mas recomendações e upload não funcionarão sem eles.

## Banco de dados

O schema Prisma possui três entidades principais:

### User

`id`, `name`, `email`, `phone`, `password`, `profile`, `situation`, `createdAt` e `updatedAt`. O e-mail é único e a senha é armazenada com hash bcrypt.

### Book

`id`, `title`, `author`, `isbn`, `publisher`, `category`, `year`, `copies`, `synopsis`, `coverUrl`, `embedding` e `embeddingUpdateAt`. ISBN é único.

### Loan

`id`, `userId`, `bookId`, `loanDate`, `dueDate`, `returnDate` e `status`. Cada empréstimo relaciona um usuário a um livro.

Status de empréstimo:

- `INPROGRESS`: empréstimo em andamento;
- `RETURNED`: livro devolvido;
- `DELAYED`: empréstimo atrasado.

Categorias aceitas no cadastro de livros: `Romance`, `Ficção`, `Ficção Científica`, `Fantasia`, `Autoajuda`, `Infantojuvenil`, `Biografia`, `HQ/Mangá`, `Poesia` e `Técnico`.

### Usuários iniciais

Criados por `pnpm seed`:

| Perfil | E-mail | Senha |
| --- | --- | --- |
| ADMIN | `admin@librix.com` | `Admin@123` |
| LIBRARIAN | `bibliotecario@librix.com` | `Bibliotecario@123` |
| VISITOR | `visitante@librix.com` | `Visitante@123` |

Essas credenciais são apenas para desenvolvimento. Altere-as em ambientes reais.

## Autenticação e perfis

O endpoint `/auth` retorna `accessToken` e `refreshToken`. Para rotas protegidas, envie o access token no cabeçalho:

```http
Authorization: Bearer <accessToken>
```

O access token expira em 15 minutos e o refresh token em 7 dias. A implementação atual fornece a geração e validação do refresh token no serviço, mas não expõe uma rota HTTP de renovação.

Perfis:

- `ADMIN`: operações administrativas e registro de empréstimos;
- `LIBRARIAN`: operações de atendimento e gestão de usuários/livros;
- `VISITOR`: perfil de visitante, sem permissões administrativas.

## Endpoints

A documentação completa e testável está em `/api-docs`. A tabela abaixo reflete as rotas registradas atualmente na aplicação.

| Método | Rota | Acesso | Finalidade |
| --- | --- | --- | --- |
| `POST` | `/register` | Público | Cadastra usuário |
| `POST` | `/auth` | Público | Autentica usuário |
| `GET` | `/users` | Público na implementação atual | Lista usuários |
| `GET` | `/user/:id` | `ADMIN`, `LIBRARIAN` | Busca usuário |
| `PUT` | `/user/update/:id` | `ADMIN`, `LIBRARIAN` | Atualiza usuário |
| `DELETE` | `/user/delete/:id` | `ADMIN`, `LIBRARIAN` | Remove usuário |
| `POST` | `/book/register` | `LIBRARIAN` | Cadastra livro |
| `GET` | `/books` | Público | Lista livros com paginação e busca |
| `GET` | `/book/:id` | Público | Busca livro por id |
| `POST` | `/book/:id/upload` | Público na implementação atual | Envia capa do livro |
| `GET` | `/books/recommendations/:userId` | Público na implementação atual | Gera recomendações para usuário |
| `POST` | `/loan/register` | `ADMIN`, `LIBRARIAN` | Registra empréstimo |

### Cadastro de usuário

```bash
curl -X POST http://localhost:3334/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Silva",
    "email": "maria@example.com",
    "phone": "55 99999-9999",
    "profile": "VISITOR",
    "situation": "ACTIVE",
    "password": "Maria@123"
  }'
```

A senha exige pelo menos seis caracteres, uma letra maiúscula, um número e um caractere especial.

### Autenticação

```bash
curl -X POST http://localhost:3334/auth \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@librix.com","password":"Admin@123"}'
```

Guarde o valor de `accessToken` retornado para as chamadas protegidas.

### Listagem de livros

`skip` representa o número da página, e `take` representa a quantidade de itens por página. O padrão aplicado pelo controlador é página `1` com `10` itens.

```bash
curl "http://localhost:3334/books?skip=1&take=10&search=clean"
```

A resposta contém `books`, `total` e `totalPage`.

### Cadastro de livro

```bash
curl -X POST http://localhost:3334/book/register \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "isbn": "978-0132350884",
    "publisher": "Prentice Hall",
    "category": "Técnico",
    "year": "01/01/2008",
    "copies": 5,
    "synopsis": "Princípios e práticas para escrever código legível.",
    "coverUrl": null
  }'
```

Datas aceitam o formato `DD/MM/YYYY` nos schemas de cadastro.

### Cadastro de empréstimo

```bash
curl -X POST http://localhost:3334/loan/register \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "<user-id>",
    "bookId": "<book-id>",
    "dueDate": "15/08/2026",
    "status": "INPROGRESS"
  }'
```

O caso de uso verifica a existência do usuário e do livro, disponibilidade de exemplares, limite de empréstimos ativos e duplicidade de empréstimo ativo para o mesmo livro.

### Upload de capa

O campo multipart deve se chamar `image`:

```bash
curl -X POST http://localhost:3334/book/<book-id>/upload \
  -F "image=@./capa.jpg"
```

A imagem é processada pelo Multer e enviada ao Cloudinary; a URL retornada é persistida em `coverUrl`.

## Agente de IA e recomendações

A recomendação combina busca semântica e geração de linguagem em duas etapas:

1. O sistema consulta os cinco empréstimos mais recentes do usuário.
2. Monta um texto com título, categoria e sinopse dos livros emprestados.
3. Solicita ao modelo multilíngue `paraphrase-multilingual-MiniLM-L12-v2`, hospedado na Hugging Face, um embedding do perfil.
4. Compara o embedding do usuário com os embeddings persistidos dos livros usando similaridade de cosseno.
5. Exclui livros que já aparecem no histórico e seleciona os três candidatos mais semelhantes.
6. Envia histórico e candidatos ao modelo configurado no OpenRouter.
7. Retorna os livros e uma explicação curta, em português, sobre a compatibilidade.

Endpoint:

```bash
curl http://localhost:3334/books/recommendations/<user-id>
```

Resposta esperada:

```json
{
  "baseadoEm": ["Livro já emprestado"],
  "sugestoes": [],
  "explicacao": "Os livros sugeridos combinam com o perfil..."
}
```

Se o usuário não possuir empréstimos, a resposta informa que ainda não há empréstimos suficientes e retorna listas vazias.

### Gerar embeddings do catálogo

Livros novos não recebem embedding automaticamente no cadastro. Execute o backfill depois de configurar `HUGGINGFACE_API_TOKEN`:

```bash
pnpm exec tsx scripts/backfill-embeddings.ts
```

O script processa livros sem embedding, grava `embeddingUpdateAt` e espera 500 ms entre requisições para reduzir o risco de rate limit. Sem embeddings persistidos, não haverá candidatos semânticos para recomendação.

O modelo do OpenRouter pode ser alterado por `OPENROUTER_MODEL`; o padrão atual é `openai/gpt-oss-20b:free`. O serviço faz até duas tentativas para gerar a explicação.

## Testes e qualidade

Comandos disponíveis:

```bash
pnpm test              # executa a suíte uma vez
pnpm test:watch        # modo observação
pnpm lint              # verifica ESLint
pnpm lint:fix          # corrige problemas aplicáveis
pnpm format            # formata os arquivos
pnpm format:check      # verifica formatação
```

Os testes de casos de uso utilizam repositórios em memória e cobrem, entre outros, autenticação, usuários, cadastro de livros, recomendações e empréstimos.

## Estrutura do projeto

```text
.
├── prisma/
│   ├── schema.prisma          # Modelo relacional
│   ├── seed.ts                # Dados iniciais
│   └── migrations/            # Histórico de alterações do banco
├── scripts/
│   └── backfill-embeddings.ts # Preenchimento de embeddings
├── generated/prisma/          # Cliente Prisma gerado
├── src/
│   ├── server.ts              # Bootstrap, middlewares e servidor HTTP
│   ├── config/                # Variáveis de ambiente e configuração Express
│   ├── docs/                  # Especificação Swagger
│   ├── http/
│   │   ├── controller/        # Controladores e schemas Zod
│   │   ├── middlewares/       # JWT e autorização por perfil
│   │   └── routes/             # Rotas da API
│   ├── lib/prisma.ts          # Cliente Prisma
│   ├── repositories/          # Interfaces, DTOs, Prisma e memória
│   ├── services/              # JWT, embeddings e LLM
│   ├── use-cases/             # Regras de negócio e factories
│   └── utils/                 # Cloudinary, Multer, paginação e erros
├── docker-compose.yml         # PostgreSQL local
├── package.json               # Scripts e dependências
├── prisma.config.ts           # Configuração do Prisma
├── tsconfig.json              # Alias `@/*` e compilação TypeScript
└── vitest.config.js           # Configuração dos testes
```

## Licença

O projeto está configurado com licença MIT, conforme o `package.json`.
