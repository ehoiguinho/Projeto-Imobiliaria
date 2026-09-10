# 🏠 Vitta Imobiliária — Sistema de Gestão Imobiliária

Sistema completo de gerenciamento imobiliário desenvolvido com arquitetura **Full Stack**, contemplando gerenciamento de imóveis, usuários, contratos, aluguéis e pagamentos online.

O projeto foi desenvolvido com foco em boas práticas de desenvolvimento, separação de responsabilidades, autenticação e autorização, integração com serviços externos, processamento de webhooks, persistência relacional e construção de uma interface moderna para usuários e administradores.

---

# 🚀 Tecnologias Utilizadas

## Backend

* Node.js
* Express.js
* JavaScript ES6+
* PostgreSQL
* Docker
* JWT
* bcrypt
* Multer
* Swagger
* CORS
* Cookies HTTP
* REST API
* Repository Pattern
* Service Layer
* MVC

## Frontend

* Next.js
* React
* TypeScript / JavaScript
* Tailwind CSS
* Lucide React
* React Hot Toast
* Responsive Design

## Pagamentos

* AbacatePay
* Webhooks
* Validação de assinatura
* Idempotência de eventos
* Controle de status de pagamentos

---

# 🏗️ Arquitetura

O backend utiliza uma arquitetura baseada na separação de responsabilidades:

```text
Routes
   ↓
Controllers
   ↓
Services
   ↓
Repositories
   ↓
PostgreSQL
```

Também são utilizados middlewares para autenticação, autorização e processamento de requisições.

### Principais responsabilidades

**Routes**

Responsáveis pelo direcionamento das requisições HTTP.

**Controllers**

Responsáveis por receber as requisições e retornar as respostas HTTP.

**Services**

Concentram as regras de negócio da aplicação.

**Repositories**

Responsáveis pelo acesso e manipulação dos dados no banco.

**Middlewares**

Responsáveis por autenticação, autorização e validações intermediárias.

Essa separação reduz o acoplamento e facilita a manutenção e evolução da aplicação.

---

# 🔐 Autenticação e Autorização

O sistema possui autenticação baseada em **JWT**.

Fluxo de autenticação:

```text
Login
 ↓
Validação do usuário
 ↓
bcrypt
 ↓
JWT
 ↓
Cookie
 ↓
Auth Middleware
 ↓
Acesso à rota protegida
```

### Recursos implementados

* Cadastro de usuários
* Login
* Hash de senha com bcrypt
* Autenticação via JWT
* Cookies HTTP
* Middleware de autenticação
* Autorização por perfil
* Controle de acesso administrativo
* Logout
* Recuperação de senha
* Redefinição de senha

### Perfis

```text
ADMIN
CLIENTE
```

Rotas administrativas são protegidas tanto no backend quanto na interface.

---

# 👤 Usuários

* Cadastro de usuários
* Login
* Logout
* Autenticação JWT
* Hash de senhas
* Recuperação de senha
* Redefinição de senha
* Controle de perfil
* Proteção de rotas
* Identificação do usuário autenticado

---

# 🏠 Imóveis

O sistema possui gerenciamento completo de imóveis.

### Funcionalidades

* Cadastro de imóveis
* Edição de imóveis
* Exclusão de imóveis
* Listagem pública
* Listagem de imóveis disponíveis
* Imóveis em destaque
* Controle de disponibilidade
* Busca por cidade
* Busca por bairro
* Filtro por valor mínimo
* Filtro por valor máximo
* Upload de imagens
* Gerenciamento de imagens dos imóveis

### Upload

As imagens são processadas utilizando **Multer**, permitindo múltiplas imagens por imóvel.

Formatos suportados:

```text
JPG
JPEG
PNG
```

---

# 📄 Contratos

O sistema permite o gerenciamento dos contratos de locação.

### Funcionalidades

* Criação de contratos
* Associação entre usuário e imóvel
* Controle de status
* Consulta de contratos
* Visualização dos detalhes da locação
* Cancelamento de contratos

Ao realizar uma locação, o sistema cria automaticamente a estrutura necessária para o controle das parcelas.

---

# 💰 Aluguéis

Cada contrato gera automaticamente **12 parcelas mensais**.

### Status disponíveis

```text
PENDENTE
PAGO
ATRASADO
CANCELADO
```

### Funcionalidades

* Geração automática das parcelas
* Consulta de parcelas
* Pagamento individual
* Controle de status
* Controle de pagamento
* Cancelamento de parcelas pendentes
* Atualização automática após confirmação do pagamento

---

# 💳 Pagamentos PIX

O sistema possui integração com a **AbacatePay** para processamento de pagamentos via PIX.

Fluxo implementado:

```text
Usuário seleciona uma parcela
        ↓
Backend cria pagamento
        ↓
AbacatePay gera checkout PIX
        ↓
Checkout é apresentado ao usuário
        ↓
Usuário realiza o pagamento
        ↓
AbacatePay envia Webhook
        ↓
Backend valida assinatura
        ↓
Pagamento é localizado
        ↓
Pagamento é marcado como PAGO
        ↓
Aluguel é marcado como PAGO
```

O frontend **não é responsável por confirmar o pagamento**.

A confirmação oficial ocorre através do webhook enviado pela plataforma de pagamento.

---

# 🔄 Webhooks

Foi implementado um sistema de processamento de Webhooks para receber eventos da AbacatePay.

### Recursos implementados

* Recebimento de eventos externos
* `express.raw()` para preservação do payload original
* Validação de assinatura
* Identificação do evento
* Busca do pagamento relacionado
* Atualização do pagamento
* Atualização do aluguel
* Registro dos eventos recebidos
* Tratamento de eventos duplicados
* Idempotência

Eventos já processados não devem gerar uma segunda alteração no banco.

Estrutura utilizada:

```text
AbacatePay
     ↓
Webhook
     ↓
Validação
     ↓
Identificação do evento
     ↓
Busca do pagamento
     ↓
Atualização do banco
```

---

# 🧾 Controle de eventos de Webhook

O projeto possui uma tabela específica para armazenamento dos eventos recebidos:

```text
tb_webhook_evento
```

Essa estrutura permite registrar eventos processados e auxilia no controle de **idempotência**, evitando processamento duplicado.

---

# 🗄️ Banco de Dados

O projeto utiliza **PostgreSQL** como banco de dados relacional.

Principais tabelas:

```text
tb_usuario
tb_perfil
tb_imovel
tb_imgimovel
tb_contrato
tb_aluguel
tb_pagamento
tb_webhook_evento
```

O modelo relacional permite manter os relacionamentos entre:

```text
Usuário
   ↓
Contrato
   ↓
Imóvel
   ↓
Aluguéis
   ↓
Pagamentos
```

---

# 🐳 Docker

O PostgreSQL é executado através do **Docker**, tornando o ambiente de desenvolvimento mais previsível e reproduzível.

Banco utilizado:

```text
PostgreSQL 17
```

Container:

```text
imobiliaria-postgres
```

Para iniciar o banco:

```bash
docker compose up -d
```

Para verificar os containers:

```bash
docker ps
```

---

# 🏢 Área Administrativa

O sistema possui uma área administrativa protegida.

### Funcionalidades

* Dashboard administrativo
* Gerenciamento de imóveis
* Cadastro de imóveis
* Gerenciamento de contratos
* Gerenciamento de aluguéis
* Visualização de informações de locação
* Controle de usuários autenticados

O acesso é restrito a usuários com perfil:

```text
ADMIN
```

---


# 📚 Documentação da API

A API possui documentação utilizando **Swagger**, permitindo visualizar e testar os endpoints disponíveis.

A documentação facilita:

* Testes dos endpoints
* Visualização dos parâmetros
* Consulta das respostas
* Entendimento da estrutura da API
* Desenvolvimento e manutenção

---

# 🔒 Segurança

O projeto implementa diferentes camadas de proteção:

* JWT
* bcrypt
* Cookies
* Middleware de autenticação
* Middleware de autorização
* Controle de perfil
* Validação de assinatura de Webhook
* Idempotência de pagamentos
* Proteção de rotas administrativas
* Validação de estado do imóvel no backend

As regras de negócio são aplicadas no backend, evitando depender exclusivamente das validações do frontend.


---

# 📁 Estrutura do Projeto

Estrutura simplificada:

```text
Projeto-Imobiliaria/
│
├── controllers/
├── services/
├── repositories/
├── middlewares/
├── routes/
├── db/
├── uploads/
├── swagger/
│
├── my-app/
│   ├── app/
│   ├── components/
│   ├── public/
│   └── ...
│
├── docker-compose.yml
├── package.json
└── README.md
```

---

# ▶️ Como Executar

## 1. Clonar o repositório

```bash
git clone https://github.com/ehoiguinho/Projeto-Imobiliaria
```

```bash
cd Projeto-Imobiliaria
```

---

## 2. Instalar dependências do backend

```bash
npm install
```

---

## 3. Instalar dependências do frontend

```bash
cd my-app
npm install
```

---

## 4. Iniciar o PostgreSQL

Na raiz do projeto:

```bash
docker compose up -d
```

---

## 5. Configurar variáveis de ambiente

Configure as variáveis necessárias para o ambiente de desenvolvimento, incluindo:

```text
JWT_SECRET
ABACATEPAY_API_KEY
```

Além das configurações de banco de dados utilizadas pela aplicação.

---

## 6. Executar o backend

Na raiz do projeto:

```bash
npm start
```

Backend:

```text
http://localhost:3000
```

---

## 7. Executar o frontend

Dentro de `my-app`:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5001
```


---

# 👨‍💻 Tecnologias e Conceitos Demonstrados

```text
Node.js
Express.js
PostgreSQL
Docker
Next.js
React
Tailwind CSS
JavaScript
JWT
bcrypt
Multer
Swagger
REST API
Repository Pattern
Service Layer
MVC
Transactions
Webhooks
PIX
AbacatePay
Idempotency
Authentication
Authorization
Responsive Design
```

---

# 📄 Licença

Projeto desenvolvido para fins acadêmicos, de estudo e portfólio.
