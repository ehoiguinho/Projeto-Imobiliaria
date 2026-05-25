# 🏠 Sistema de Imobiliária API REST

API RESTful desenvolvida para gerenciamento de imóveis, contratos de locação e controle de aluguéis.

O projeto foi criado com foco em estudo de backend utilizando Node.js, Express e MySQL, aplicando conceitos reais de autenticação, regras de negócio e arquitetura MVC.

---

# 🚀 Tecnologias Utilizadas

- Node.js
- Express.js
- MySQL
- JWT Authentication
- JavaScript ES6+
- REST API

---

# 🔐 Funcionalidades

## 👤 Usuários

- Cadastro de usuários
- Login com JWT
- Rotas protegidas

## 🏠 Imóveis

- Cadastro de imóveis
- Listagem pública de imóveis
- Controle de disponibilidade

## 📄 Contratos

- Criação de contratos
- Cancelamento de contratos
- Associação entre usuário e imóvel

## 💰 Aluguéis

- Geração automática de 12 parcelas
- Pagamento individual
- Controle de status:
  - PENDENTE
  - PAGO
  - ATRASADO
  - CANCELADO

---

# ▶️ Como Executar

## Clonar repositório

```bash
git clone https://github.com/ehoiguinho/Projeto-Imobiliaria
```

## Instalar dependências

```bash
npm install
```

## Configurar banco de dados

Configure a conexão MySQL em:

```txt
db/database.js
```

## Executar projeto

```bash
npm start
```
