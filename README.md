# **Projeto de Teste - Notus API DX Research**

Este projeto foi desenvolvido como parte do programa de pesquisa de Developer Experience (DX) da Notus Labs. O objetivo principal é validar os fluxos e endpoints da **Trilha A (Smart Wallet, KYC, Fiat, Portfolio, History)** da Notus API em uma aplicação prática.

A aplicação é um MVP (Produto Mínimo Viável) no estilo "painel de testes", onde a interface serve para acionar chamadas à API e exibir as respostas JSON cruas, focando puramente na interação com o backend e na experiência do desenvolvedor.

-----

## **Funcionalidades Implementadas**

O painel permite testar sequencialmente as seguintes funcionalidades da Trilha A:

  - [X] **Criação de Smart Wallet:** `POST /wallets/register`
  - [X] **Recuperação de Smart Wallet Existente:** `GET /wallets/address`
  - [X] **Consulta de Portfólio:** `GET /wallets/{walletAddress}/portfolio`
  - [X] **Consulta de Histórico:** `GET /wallets/{walletAddress}/history` (incluindo testes de filtros)
  - [X] **Início do Fluxo de KYC:** `POST /kyc/individual-verification-sessions/standard`
  - [X] **Consulta de Status do KYC:** `GET /kyc/.../{sessionId}`
  - [X] **Acionamento do Processamento do KYC:** `POST /kyc/.../{sessionId}/process`
  - [X] **Investigação do Módulo Fiat:** Teste de cotação de depósito (`POST /fiat/deposit/quote`)

-----

## **Arquitetura**

Para garantir a segurança da chave de API da Notus, o projeto utiliza uma arquitetura **BFF (Backend for Frontend)** através das API Routes do Next.js.

O fluxo de comunicação é:

`[Cliente (React)] -> [API Route (Next.js BFF)] -> [Notus API]`

Isso garante que a `x-api-key` e outros segredos nunca sejam expostos no navegador.

-----

## **Tecnologias Utilizadas**

  - **Framework:** Next.js (com App Router)
  - **Linguagem:** TypeScript
  - **Blockchain Lib:** Viem
  - **Estilização:** Tailwind CSS (padrão do `create-next-app`)

-----

## **Configuração e Execução**

Siga os passos abaixo para rodar o projeto localmente.

**1. Clonar o Repositório**

```bash
git clone [URL_DO_SEU_REPOSITORIO]
cd [NOME_DO_PROJETO]
```

**2. Instalar Dependências**

```bash
npm install
```

**3. Configurar Variáveis de Ambiente**

  - Crie um arquivo chamado `.env.local` na raiz do projeto.
  - Adicione sua chave de API da Notus a este arquivo:

<!-- end list -->

```env
# .env.local

NOTUS_API_KEY="sua_chave_de_api_aqui"
NOTUS_API_BASE_URL="https://api.notus.team/api/v1"
```

**4. Rodar o Projeto**

```bash
npm run dev
```

Acesse [`http://localhost:3000`](https://www.google.com/search?q=http://localhost:3000) no seu navegador.

-----

## **Como Usar o Painel de Testes**

A aplicação foi projetada para ser um painel sequencial de testes.

1.  Ao carregar, uma carteira de testes (EOA) é gerada e sua chave privada é salva no **Local Storage** do navegador para persistência entre recarregamentos.
2.  Siga os botões para testar o fluxo da Trilha A.
3.  A resposta de cada chamada à API será exibida na seção "Resposta da API".
4.  Use o botão "Limpar Storage" para gerar uma nova EOA e recomeçar os testes do zero.

-----

## **Principais Descobertas (DX Feedback)**

Durante os testes, foram identificados alguns pontos importantes de feedback para a experiência do desenvolvedor (DX) com a Notus API:

  - **Bug no Campo `registeredAt`:** Foi observado que o campo `registeredAt` de uma carteira era incorretamente atualizado a cada chamada de leitura (`GET /wallets/address`), resultando na perda do timestamp de registro original.

  - **Documentação do KYC Incompleta:** O guia `kyc-quickstart` não detalhava a estrutura completa e plana do payload necessário para criar uma sessão de KYC. Isso levou a um processo de depuração para descobrir os campos obrigatórios (como `email` e o objeto `address` achatado).

  - **Acesso ao Módulo Fiat:** O módulo Fiat requer habilitação manual na conta de teste, uma informação que não estava explícita nos guias iniciais e que foi descoberta através de um erro de permissão.