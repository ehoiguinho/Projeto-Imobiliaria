# 🏠 Vitta Imobiliária

Sistema Full Stack de gestão imobiliária desenvolvido para administrar **imóveis, usuários, contratos, aluguéis e pagamentos PIX**, com autenticação, autorização por perfil, integração com gateway de pagamentos e processamento seguro de Webhooks.

O projeto foi desenvolvido com foco em **separação de responsabilidades, regras de negócio no backend, segurança, persistência relacional e integração com serviços externos**.

## 🚀 Funcionalidades

### 👤 Usuários e autenticação

* Cadastro e login
* Autenticação com JWT
* Cookies HTTP-only
* Hash de senhas com bcrypt
* Recuperação e redefinição de senha por e-mail
* Logout
* Autorização por perfil (`ADMIN` / `CLIENTE`)
* Proteção de rotas

### 🏠 Imóveis

* Cadastro, edição e exclusão
* Listagem pública
* Imóveis disponíveis e em destaque
* Busca por cidade e bairro
* Filtros por faixa de preço
* Controle de disponibilidade
* Upload de múltiplas imagens

### 📄 Contratos e aluguéis

* Criação de contratos de locação
* Associação entre usuário e imóvel
* Geração automática de **12 parcelas mensais**
* Controle de vencimento e status
* Cancelamento de contratos e parcelas pendentes
* Consulta das locações do usuário

### 💳 Pagamentos PIX

Integração com **AbacatePay** para pagamento individual das parcelas.

```text
Usuário seleciona a parcela
        ↓
Backend cria o pagamento
        ↓
AbacatePay gera o checkout PIX
        ↓
Usuário realiza o pagamento
        ↓
AbacatePay envia Webhook
        ↓
Backend valida a assinatura
        ↓
Pagamento é localizado
        ↓
Pagamento e parcela são atualizados
```

A confirmação do pagamento é realizada pelo **backend através do Webhook**, evitando que o frontend seja responsável por determinar se uma transação foi concluída.

### 🔐 Webhooks e idempotência

O processamento dos Webhooks possui:

* Validação de assinatura
* Preservação do payload original
* Identificação dos eventos
* Atualização de pagamentos
* Atualização das parcelas
* Registro dos eventos recebidos
* Tratamento de eventos duplicados
* Idempotência

Eventos já processados são identificados através da tabela `tb_webhook_evento`, evitando alterações duplicadas no banco.

---

# 🏗️ Arquitetura

O backend utiliza uma arquitetura em camadas baseada em **Routes, Controllers, Services e Repositories**:

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

### Responsabilidades

| Camada       | Responsabilidade                       |
| ------------ | -------------------------------------- |
| Routes       | Definição dos endpoints                |
| Controllers  | Comunicação HTTP                       |
| Services     | Regras de negócio                      |
| Repositories | Acesso ao banco                        |
| Middlewares  | Autenticação, autorização e validações |

Essa estrutura reduz o acoplamento e facilita a manutenção e evolução da aplicação.

---

# 🛠️ Tecnologias

### Backend

* Node.js
* Express.js
* JavaScript ES6+
* PostgreSQL
* JWT
* bcrypt
* Multer
* Nodemailer
* Swagger
* CORS
* Cookies HTTP
* REST API

### Frontend

* Next.js
* React
* JavaScript / TypeScript
* Tailwind CSS
* Lucide React
* React Hot Toast
* Responsive Design

### Infraestrutura e integração

* Docker
* AbacatePay
* PIX
* Webhooks
* Idempotência
* Git / GitHub
* Deploy em Vercel e Render

### Padrões e conceitos

* MVC
* Repository Pattern
* Service Layer
* Transactions
* Authentication
* Authorization
* RESTful APIs

---

# 🗄️ Banco de Dados

O projeto utiliza **PostgreSQL** como banco de dados relacional.

Principais entidades:

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

Relacionamento principal:

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

Transações são utilizadas em operações críticas para manter a consistência dos dados.

---

# 🏢 Área Administrativa

Área protegida destinada aos usuários com perfil `ADMIN`.

Permite:

* Gerenciamento de imóveis
* Upload de imagens
* Gerenciamento de contratos
* Gerenciamento de aluguéis
* Visualização das locações
* Controle das informações administrativas

As permissões são validadas **no backend**, não dependendo apenas da interface.

---

# 📚 Documentação da API

A API possui documentação através do **Swagger**, permitindo visualizar endpoints, parâmetros e respostas disponíveis.

---

# ▶️ Executando o projeto

## 1. Clone o repositório

```bash
git clone https://github.com/ehoiguinho/Projeto-Imobiliaria.git

cd Projeto-Imobiliaria
```

## 2. Instale as dependências do backend

```bash
npm install
```

## 3. Instale as dependências do frontend

```bash
cd my-app

npm install
```

## 4. Inicie o PostgreSQL

Na raiz do projeto:

```bash
docker compose up -d
```

## 5. Configure as variáveis de ambiente

Configure as variáveis utilizadas pela aplicação, incluindo as credenciais do banco, JWT, e-mail e AbacatePay.

> As credenciais e chaves utilizadas em produção não são versionadas no repositório.

## 6. Execute o backend

Na raiz:

```bash
npm start
```

Backend:

```text
http://localhost:3000
```

## 7. Execute o frontend

Dentro de `my-app`:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5001
```

---

# 🌐 Deploy

A aplicação possui ambiente publicado, com:

```text
Frontend → Vercel
Backend  → Render
Database → PostgreSQL
Pagamento → AbacatePay
```

O fluxo de pagamento e processamento de Webhook foi validado em **ambiente de produção**.

---

# 📁 Estrutura

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
│   └── public/
│
├── docker-compose.yml
├── package.json
└── README.md
```

---

# 🎯 Objetivo

Projeto desenvolvido para fins **acadêmicos, de estudo e portfólio**, com foco na aplicação prática de conceitos de desenvolvimento Full Stack, arquitetura de software, APIs REST, autenticação, banco de dados, integração com serviços externos e processamento de pagamentos.

## 👨‍💻 Desenvolvedor

**Igor Lins**

Desenvolvedor Full Stack com foco em Back-End, interessado em construção de APIs, arquitetura de aplicações, bancos de dados e resolução de problemas.

---

### Principais conceitos demonstrados

```text
Full Stack Development
Node.js
Express.js
Next.js
React
PostgreSQL
Docker
REST API
JWT
bcrypt
Repository Pattern
Service Layer
Transactions
Authentication
Authorization
Webhooks
PIX
AbacatePay
Idempotency
Deploy
```
