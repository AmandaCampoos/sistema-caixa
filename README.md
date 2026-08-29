# 🛒 Sistema de Caixa

Sistema de gerenciamento de vendas e estoque desenvolvido em Python.

O projeto está sendo desenvolvido com foco em pequenas lojas, inicialmente uma loja de roupas, com possibilidade de futuramente transformar o sistema em um produto comercial SaaS.

## 🚧 Status do projeto

**Em desenvolvimento — versão 0.1.0**

### Funcionalidades atuais

* [x] Estrutura inicial do projeto
* [x] Ambiente virtual Python
* [x] FastAPI configurado
* [x] PostgreSQL configurado
* [x] PostgreSQL executando via Docker
* [x] SQLAlchemy configurado
* [x] Modelo de Produto
* [x] Cadastro de produtos
* [x] Listagem de produtos
* [x] Busca de produto por ID
* [x] Documentação automática com Swagger

### Próximas funcionalidades

* [ ] Atualizar produto
* [ ] Excluir/desativar produto
* [ ] Controle de estoque
* [ ] Cadastro de vendas
* [ ] Itens da venda
* [ ] Controle de caixa
* [ ] Formas de pagamento
* [ ] Relatórios
* [ ] Autenticação de usuários
* [ ] Interface web
* [ ] Deploy

---

## 🧰 Tecnologias

* Python
* FastAPI
* SQLAlchemy
* PostgreSQL
* Docker
* Docker Compose
* Pydantic
* Uvicorn

---

## 📁 Estrutura atual

```text
sistema-caixa/
│
├── app/
│   ├── api/
│   │   └── produtos.py
│   │
│   ├── core/
│   │   └── database.py
│   │
│   ├── models/
│   │   └── produto.py
│   │
│   ├── schemas/
│   │   └── produto.py
│   │
│   ├── services/
│   │
│   └── main.py
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

---

## ▶️ Como executar o projeto

### 1. Criar e ativar o ambiente virtual

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

### 2. Instalar as dependências

```powershell
python -m pip install -r requirements.txt
```

### 3. Iniciar o PostgreSQL

```powershell
docker compose up -d
```

### 4. Iniciar a API

```powershell
python -m uvicorn app.main:app --reload
```

A API estará disponível em:

```text
http://127.0.0.1:8000
```

A documentação da API pode ser acessada em:

```text
http://127.0.0.1:8000/docs
```

---

## 🗄️ Banco de dados

O projeto utiliza PostgreSQL executando em um container Docker.

Atualmente o banco possui a tabela:

```text
produtos
```

Cada produto possui:

* ID
* Nome
* Preço
* Estoque
* Tamanho
* Cor
* Status ativo/inativo

---

## 🔌 Endpoints atuais

### Produtos

```text
POST /produtos/
```

Cadastra um produto.

```text
GET /produtos/
```

Lista os produtos cadastrados.

```text
GET /produtos/{produto_id}
```

Busca um produto específico.

### Health Check

```text
GET /health
```

Verifica se a API consegue se comunicar com o banco de dados.

---

## 🎯 Objetivo do projeto

O objetivo é desenvolver um sistema de caixa completo para pequenas lojas, começando por uma API e evoluindo gradualmente para uma aplicação comercial.

A ideia é transformar o projeto em um produto que possa futuramente ser disponibilizado para empresas através de um modelo de assinatura mensal.
