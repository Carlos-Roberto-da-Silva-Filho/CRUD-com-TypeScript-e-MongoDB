# 📦 Sistema de Gerenciamento de Entregas com TypeScript, MongoDB e Node.js

Este projeto é uma **API RESTful** desenvolvida em **Node.js** com **TypeScript**, utilizando **Express**, **Mongoose** e **InversifyJS** para gerenciar as operações de **Clientes**, **Endereços**, **Produtos** e **Entregas**.

A API permite cadastrar clientes, associar endereços, gerenciar produtos e criar entregas com múltiplos produtos, seguindo boas práticas de **arquitetura em camadas (Clean Architecture)** e **Injeção de Dependência (IoC)**.


# Autenticação

Todas as rotas estão protegidas por Basic Auth e para testar forneça as credenciais de teste:

Para acessar as rotas protegidas, use autenticação básica:

Usuário: UsuarioValido
Senha: SenhaValida


---

## 🚀 Tecnologias Utilizadas

- **Node.js + TypeScript** – Ambiente de execução e tipagem estática.
- **Express** – Framework para criação da API REST.
- **Mongoose** – ODM para modelar e acessar os dados no MongoDB.
- **MongoDB Atlas** – Banco de dados NoSQL na nuvem.
- **InversifyJS** – Injeção de dependências (IoC/DI).
- **ts-node-dev** – Ferramenta para desenvolvimento com hot reload.
- **dotenv** – Para gerenciar variáveis de ambiente.

---

## 🗂️ Estrutura de Dados (Tabelas / Coleções)

O sistema possui **4 coleções principais** no banco MongoDB:

### 1. 🧑‍💼 Clientes (`clientes`)
- Contém os dados básicos de cada cliente.
- Cada cliente pode ter **um ou mais endereços**.

| Campo           | Tipo     | Descrição                      |
|-----------------|---------|---------------------------------|
| `id`            | Number  | ID sequencial do cliente        |
| `nome`          | String  | Nome do cliente                 |
| `email`         | String  | Email único                     |
| `telefone`      | String  | Telefone de contato             |
|-----------------|---------|---------------------------------|

---

### 2. 🏠 Endereços (`enderecos`)
- Cada endereço pertence a um **cliente** específico.
- O relacionamento é **1:N** (um cliente pode ter vários endereços).

| Campo               | Tipo                | Descrição                   |
|---------------------|---------------------|-----------------------------|
| `id`                | Number              | ID sequencial do endereço   |
| `clienteId`         | Number              | ID do cliente proprietário  |
| `rua`               | String              | Rua do endereço             |
| `cidade`            | String              | Cidade                      |
| `estado`            | String              | Estado                      |
| `cep`               | String              | Código postal               |
|---------------------|---------------------|-----------------------------|

---

### 3. 📦 Produtos (`produtos`)
- Lista de produtos que podem ser incluídos nas entregas.

| Campo         | Tipo     | Descrição                        |
|---------------|---------|-----------------------------------|
| `id`          | Number  | ID sequencial do produto          |
| `nome`        | String  | Nome do produto                   |
| `descricao`   | String  | Descrição detalhada               |
| `preco`       | Number  | Preço unitário do produto         |
|---------------|---------|-----------------------------------|

---

### 4. 🚚 Entregas (`entregas`)
- Cada entrega está **associada a um endereço de entrega** e contém **um ou mais produtos**.
- O relacionamento é:
  - **N:1** → Várias entregas podem estar associadas a um **endereço**.
  - **N:N** → Uma entrega pode conter **vários produtos**.

| Campo                       | Tipo                | Descrição                                |
|-----------------------------|---------------------|------------------------------------------|
| `id`                        | Number              | ID sequencial da entrega                 |
| `enderecoEntregaId`         | Number              | ID do endereço onde será feita a entrega |
| `produtosNestaEntregaIds`   | [Number]            | IDs dos produtos incluídos na entrega    |
| `dataPrevista`              | Date                | Data prevista para a entrega             |
| `valorFrete`                | Number              | Valor do frete                           |
| `status`                    | Enum                | `PENDENTE`, `EM_TRANSITO`, `ENTREGUE`    |
| `dataEntregaReal`           | Date                | Data em que a entrega foi realizada      |
|-----------------------------|---------------------|------------------------------------------|

---

## 🔗 Relacionamentos Resumidos

- **Cliente → Endereços:** 1 cliente pode ter **muitos endereços**.
- **Endereço → Entregas:** 1 endereço pode estar em **muitas entregas**.
- **Entrega → Produtos:** 1 entrega pode ter **muitos produtos**.

## 📁 Estrutura do Projeto

src/
│
├─ 1entidades/ # Entidades do domínio
├─ 2domain/ # Services, DTOs e interfaces
│ ├─ dtos/
│ ├─ exceptions/
│ ├─ interfaces/
│ └─ services/
├─ 3infra/ # Repositórios e schemas do Mongo
│ ├─ dbConfig/
│ ├─ middlewares/
│ └─ repositorios/Schemas/
├─ 4webAPI/ # Controllers e rotas Express
│ ├─ Config/
│ ├─ controllers/
│ └─ routes.ts
├─ config/
│ └─ inversify.config.ts
│ └─ types.ts
│
├─ tsconfig.json
├─ .env
└─ main.ts # Ponto de entrada da aplicação


1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/seu-repo.git
cd seu-repo
```

2. Instalar dependências

npm install

3. Configurar variáveis de ambiente

Crie um arquivo .env na raiz do projeto baseado no arquivo env_exemplo:
MONGO_URI=mongodb+srv://<USUARIO>:<SENHA>@<CLUSTER>/<NOME_DO_BANCO>?retryWrites=true&w=majority

4. Rodar em desenvolvimento

npm run dev

A API estará disponível em http://localhost:3000.

📌 Endpoints Principais


# 🧑‍💻 CLIENTES:

| Método | Rota                | Descrição                          |
| ------ | ------------------- | ---------------------------------- |
| GET    | `/api/clientes`     | Listar **todos os clientes**       |
| GET    | `/api/clientes/:id` | Buscar **cliente por ID**          |
| POST   | `/api/clientes`     | **Criar** um novo cliente          |
| PATCH  | `/api/clientes/:id` | **Atualizar parcialmente** cliente |
| PUT    | `/api/clientes/:id` | **Substituir** cliente (replace)   |
| DELETE | `/api/clientes/:id` | **Remover** cliente                |
| ------ | ------------------- | ---------------------------------- |


# 🏠 ENDEREÇOS

| Método | Rota                         | Descrição                           |
| ------ | ---------------------------- | ----------------------------------- |
| GET    | `/api/enderecos`             | Listar **todos os endereços**       |
| GET    | `/api/enderecos/:id`         | Buscar **endereço por ID**          |
| GET    | `/api/enderecos/cliente/:id` | Listar **endereços de um cliente**  |
| POST   | `/api/enderecos`             | **Criar** um novo endereço          |
| PATCH  | `/api/enderecos/:id`         | **Atualizar parcialmente** endereço |
| PUT    | `/api/enderecos/:id`         | **Substituir** endereço (replace)   |
| DELETE | `/api/enderecos/:id`         | **Remover** endereço                |
| ------ | ---------------------------- | ----------------------------------- |



# 📦 PRODUTOS

| Método | Rota                | Descrição                          |
| ------ | ------------------- | ---------------------------------- |
| GET    | `/api/produtos`     | Listar **todos os produtos**       |
| GET    | `/api/produtos/:id` | Buscar **produto por ID**          |
| POST   | `/api/produtos`     | **Criar** um novo produto          |
| PATCH  | `/api/produtos/:id` | **Atualizar parcialmente** produto |
| PUT    | `/api/produtos/:id` | **Substituir** produto (replace)   |
| DELETE | `/api/produtos/:id` | **Remover** produto                |
| ------ | ------------------- | ---------------------------------- |

...

# 🚚 ENTREGAS

| Método | Rota                         | Descrição                                |
| ------ | ---------------------------- | ---------------------------------------- |
| GET    | `/api/entregas`              | Listar **todas as entregas**             |
| GET    | `/api/entregas/:id`          | Buscar **entrega por ID**                |
| GET    | `/api/entregas/endereco/:id` | Listar **entregas por endereço**         |
| POST   | `/api/entregas`              | **Criar** uma nova entrega               |
| PATCH  | `/api/entregas/:id`          | **Atualizar parcialmente** entrega       |
| PATCH  | `/api/entregas/:id/status`   | **Atualizar apenas o status** da entrega |
| PUT    | `/api/entregas/:id`          | **Substituir** entrega inteira (replace) |
| DELETE | `/api/entregas/:id`          | **Remover** entrega                      |
| ------ | ---------------------------- | ---------------------------------------- |




📝 Boas Práticas

Utilize variáveis de ambiente para dados sensíveis.

Mantenha injeção de dependência para repositórios, serviços e controladores.

Siga o padrão Clean Architecture para escalabilidade do sistema.



📜 Licença

Este projeto está licenciado sob a licença MIT

