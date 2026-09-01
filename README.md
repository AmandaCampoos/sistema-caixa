# 🛒 Sistema de Caixa

Sistema web para gerenciamento de vendas, produtos e estoque, desenvolvido com Python e FastAPI.

O projeto está sendo construído como uma aplicação real para pequenas lojas, com foco inicial no segmento de moda e varejo.

A arquitetura foi pensada para permitir a evolução do sistema para uma solução SaaS comercial.

---

## 🚀 Status

**Em desenvolvimento — versão 0.1.0**

O backend já possui gerenciamento de produtos, vendas, itens de venda e integração com PostgreSQL.

Também está sendo desenvolvida uma interface web para utilização do sistema através do navegador.

---

## ✨ Funcionalidades

### Produtos

- Cadastro de produtos
- Listagem de produtos
- Consulta de produto por ID
- Controle de estoque
- Status ativo/inativo
- Informações de tamanho e cor

### Vendas

- Criação de vendas
- Inclusão de múltiplos produtos na venda
- Cálculo automático do subtotal
- Cálculo automático do total
- Validação de estoque
- Baixa automática do estoque
- Registro da forma de pagamento
- Consulta de venda por ID
- Listagem de vendas

### Infraestrutura

- API REST
- PostgreSQL
- SQLAlchemy
- Docker
- Docker Compose
- Validação de dados com Pydantic
- Documentação automática da API
- Health check da aplicação

### Interface

- Interface web em desenvolvimento
- Visualização dos produtos
- Carrinho de venda
- Seleção de forma de pagamento
- Integração com a API

---

## 🧰 Stack

**Backend**

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- Uvicorn

**Banco de dados**

- PostgreSQL

**Infraestrutura**

- Docker
- Docker Compose

**Frontend**

- HTML
- CSS
- JavaScript

**Versionamento**

- Git
- GitHub

---

## 📁 Arquitetura

```text
sistema-caixa/
│
├── app/
│   ├── api/
│   │   ├── produtos.py
│   │   └── venda.py
│   │
│   ├── core/
│   │   └── database.py
│   │
│   ├── models/
│   │   ├── produto.py
│   │   └── venda.py
│   │
│   ├── schemas/
│   │   ├── produto.py
│   │   └── venda.py
│   │
│   ├── services/
│   │   └── venda_service.py
│   │
│   └── main.py
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── tests/
│
├── .env
├── .env.example
├── .gitignore
├── docker-compose.yml
├── requirements.txt
└── README.md

```
```
Organização

A aplicação utiliza uma separação por responsabilidades:

api
│
├── endpoints e rotas HTTP
│
models
│
├── estrutura das entidades do banco
│
schemas
│
├── validação e formato dos dados da API
│
services
│
├── regras de negócio
│
core
│
├── configurações e conexão com infraestrutura

Essa estrutura facilita a manutenção e permite que novas funcionalidades sejam adicionadas sem concentrar toda a lógica em um único arquivo.

```

🗄️ Banco de dados

O sistema utiliza PostgreSQL executando através de Docker.

Atualmente o banco possui as seguintes entidades:

produtos
vendas
itens_venda
Produto

Um produto possui:

ID
Nome
Preço
Estoque
Tamanho
Cor
Status ativo/inativo
Venda

Uma venda possui:

ID
Data
Total
Desconto
Forma de pagamento
Status
Item da venda

Cada item relaciona uma venda a um produto e possui:

ID
Venda
Produto
Quantidade
Preço unitário
Subtotal
🔌 API

A API disponibiliza endpoints para gerenciamento dos produtos e vendas.

Produtos
POST /produtos/

Cadastra um produto.

GET /produtos/

Lista os produtos.

GET /produtos/{produto_id}

Consulta um produto específico.

Vendas
POST /vendas/

Cria uma nova venda.

GET /vendas/

Lista as vendas.

GET /vendas/{venda_id}

Consulta uma venda específica com seus itens.

Health Check
GET /health

Verifica a comunicação entre a aplicação e o banco de dados.

▶️ Executando o projeto
1. Criar o ambiente virtual
python -m venv .venv
2. Ativar o ambiente virtual
.\.venv\Scripts\Activate.ps1
3. Instalar as dependências
python -m pip install -r requirements.txt
4. Iniciar o banco de dados
docker compose up -d
5. Iniciar a API
python -m uvicorn app.main:app --reload

A API ficará disponível em:

http://127.0.0.1:8000

Documentação interativa:

http://127.0.0.1:8000/docs
🖥️ Frontend

O frontend está sendo desenvolvido separadamente da API.

Para executar localmente:

cd frontend
python -m http.server 5500

Depois acesse:

http://127.0.0.1:5500

O frontend se comunica diretamente com a API através de requisições HTTP.

🧪 Testes

O projeto possui testes automatizados para validar as principais regras da aplicação.

As funcionalidades são desenvolvidas de forma incremental:

O objetivo do projeto é desenvolver uma aplicação de caixa completa, utilizando uma arquitetura próxima da encontrada em sistemas comerciais reais.

👩‍💻 Desenvolvimento

Projeto desenvolvido por Amanda Campos Ximenes.

O desenvolvimento é realizado de forma incremental, utilizando Git para controle de versão e mantendo cada funcionalidade documentada e testada antes da evolução para a próxima etapa.

