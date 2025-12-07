# 🏠 Na Porta - Frontend

### Frontend moderno para o sistema de gestão de pedidos Na Porta, desenvolvido em React com TypeScript.

## ⚠️ Pré-requisitos
ATENÇÃO: Este frontend depende do backend para funcionar. Antes de começar, você precisa:
- ✅ Ter o backend instalado e rodando
- ✅ MongoDB configurado
- ✅ Microserviço Go em execução

## 📦 Backend necessário: na-porta-backend
caso  nao tenha, va ate esse repositorio clone e rode na sua maquina
git clone [(https://github.com/Davi-France/naporta-backend)]

## 🚀 Começando Rápido
### Passo 1: Clone este repositório

git clone https://github.com/Davi-France/naporta-frontend.git

- e depois
```bash
cd frontend-naporta
```
Passo 2: Instale as dependências
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

Passo 3: Configure o backend
Certifique-se que seu backend está rodando:

```bash
# O backend deve estar acessível em:
# http://localhost:3000
```

Passo 4: Inicie o frontend
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
O frontend estará disponível em: http://localhost:5173
```

  
### 1. Primeiro, garanta que o backend está rodando
```bash
# No projeto do backend:
cd backend/na-porta-api
npm run start:dev
```

###  2. Em outro terminal, inicie o microserviço Go:
```bash
cd backend/naporta-go
go run main.go
```

### 3. Acesse o frontend
Abra http://localhost:5173

### 4. Crie uma conta
Vá para /register e crie um usuário

### 5. Faça login
Use as credenciais criadas em /login

### 6. Explore as funcionalidades
- Crie pedidos com diferentes itens
- Teste os filtros de busca
- Calcule totais com o microserviço Go
- Edite status dos pedidos

## 🎨 Tecnologias Utilizadas
- React 18 com TypeScript
- Vite para desenvolvimento ultrarrápido
- Tailwind CSS para estilização
- Shadcn/ui para componentes prontos
- React Router DOM para navegação
- Axios para requisições HTTP
- React Hook Form + Zod para validação
- Sonner para notificações
- date-fns para datas

## 🔐 Fluxo de Autenticação
- Registro → Cria usuário no backend
- Login → Obtém token JWT
- Acesso → Token é armazenado e usado em todas as requisições
- Logout → Remove token e redireciona para login

## 📊 Funcionalidades Implementadas
### ✅ Dashboard

- Visão geral de pedidos
- Estatísticas em tempo real
- Últimos pedidos criados
- Gráfico de distribuição por status

### ✅ Gestão de Pedidos
- Criação: Formulário com validação completa
- Listagem: Tabela com paginação e filtros
- Edição: Atualização de status e informações
- Exclusão: Soft delete (exclusão lógica)
- Cálculo: Integração com microserviço Go

###   ✅ Filtros Avançados
- 🔍 Busca por número, cliente ou documento
- 🏷️ Filtro por status (novo, aceito, produção, etc.)
- 📅 Filtro por data de criação ou entrega
- 🔄 Limpeza rápida de filtros
- 🧪 Testando a Aplicação

## 🎯 Motivação do Projeto

Este projeto frontend foi desenvolvido **por iniciativa própria**, como um desafio pessoal para complementar o backend que havia desenvolvido anteriormente para a Na Porta.

### 🚀 O Desafio

Apesar de não ter recebido um desafio formal de frontend, decidi criar uma interface completa que demonstrasse:

1. **Integração prática** com uma API REST real (a que eu mesmo desenvolvi)
2. **Aplicação de conhecimentos** em React, TypeScript e bibliotecas modernas
3. **Criação de uma UX/UI profissional** para um sistema real de gestão
4. **Implementação de boas práticas** como validação, tratamento de erros e segurança
