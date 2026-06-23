# 📈 Carteira Mestre

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.x-blue?style=for-the-badge&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/Django-REST_Framework-092E20?style=for-the-badge&logo=django&logoColor=white" alt="Django">
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
  <img src="https://img.shields.io/badge/Arquitetura-SOA-FF6F00?style=for-the-badge" alt="SOA">
</p>

## 📋 Sobre o Projeto

**Carteira Mestre** é um sistema baseado em **Arquitetura Orientada a Serviços (SOA)**, desenvolvido como projeto de avaliação para a disciplina de Web Service. O objetivo da aplicação é simular um gerenciador de carteira de ativos e projeções de investimentos.

O projeto foi construído respeitando as mais rígidas boas práticas e diretrizes da disciplina, garantindo separação de camadas, comunicação HTTP assíncrona e conteinerização completa da infraestrutura.

## 🏗️ Arquitetura em Camadas e Microserviços

A aplicação é dividida em dois **microserviços independentes**, cada um conectado a um banco lógico separado, e comunicando-se exclusivamente via protocolo HTTP.

O padrão **MVC (Model-View-Controller)** natural do Django foi modificado para suportar o padrão imposto pela disciplina:
- 🎛️ **Controller (Views/ViewSets):** Responsável por receber as requisições HTTP, lidar com códigos de status e retornar JSON. Nenhuma lógica de negócio ou consulta ao banco ocorre aqui.
- ⚙️ **Service:** Onde vive a lógica de negócio, os cálculos de rentabilidade e a comunicação externa.
- 🗄️ **Repository:** A interface oficial e isolada para todas as interações com o ORM (Banco de Dados).
- 📦 **Model/DTO (Serializers):** Definições de entidades e Data Transfer Objects.

### 🌐 Ecossistema

- **`ms-carteira`**: Responsável por gerenciar os ativos do usuário (Cadastro, Edição, Remoção e Listagem).
- **`ms-investimentos`**: Serviço responsável por rodar simulações financeiras, consumindo os dados da carteira do usuário de forma dinâmica e resiliente (com fallback para valores manuais via *query params* em caso de falha de conexão).
- **PostgreSQL**: Instância única de banco de dados conteinerizada rodando com partições lógicas exclusivas (`db_carteira` e `db_investimentos`).

## 🚀 Como Executar Localmente (Ambiente Docker)

Todo o ecossistema está orquestrado via Docker Compose, permitindo uma inicialização simples com um único comando.

### Pré-requisitos
- [Docker](https://www.docker.com/products/docker-desktop) instalado e rodando.
- [Docker Compose](https://docs.docker.com/compose/install/).

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/carteira-mestre.git
   cd carteira-mestre
   ```

2. **Suba os containers:**
   ```bash
   docker-compose up --build
   ```
   > Esse comando irá compilar as imagens de ambos os microserviços, inicializar o PostgreSQL e rodar as migrações necessárias.

3. **Acesse as APIs:**
   - **`ms-carteira`**: [http://localhost:8000](http://localhost:8000)
   - **`ms-investimentos`**: [http://localhost:8001](http://localhost:8001)

## 📌 Principais Endpoints

### Serviço: MS-Carteira (Porta: 8000)
- `GET /api/ativos/` - Lista todos os ativos.
- `POST /api/ativos/` - Cadastra um novo ativo.
- `PUT /api/ativos/{id}/` - Atualiza um ativo existente.
- `DELETE /api/ativos/{id}/` - Remove um ativo.

### Serviço: MS-Investimentos (Porta: 8001)
- `GET /api/simulacao/` - Realiza a simulação de investimento comunicando-se com o `ms-carteira`.
  * *Fallback Resiliente:* Caso o `ms-carteira` esteja indisponível, o sistema fará um fallback com base em Query Params: `GET /api/simulacao/?valor_manual=5000`

> 💡 **Nota:** Todos os retornos da API estão obrigatoriamente padronizados no formato **JSON**, utilizando os *Status Codes* adequados do HTTP (200 OK, 201 Created, 400 Bad Request, 404 Not Found, etc).

## ✅ Critérios de Avaliação Atendidos

O projeto atende a todos os requisitos solicitados:
- [x] API REST com pelo menos 4 verbos implementados.
- [x] Arquitetura rigorosamente separada em camadas (Controller, Service, Repository, Model).
- [x] O protocolo HTTP é respeitado com JSON válido em todos os retornos e Status Codes condizentes.
- [x] Orquestração e fácil inicialização via ambiente local Dockerizado.
- [x] **Bônus Conquistado (+10pts):** Implementação e orquestração de **2 Microserviços**.

## 🛠️ Demonstração e Testes
As rotas de teste podem ser importadas para ferramentas como **Postman** ou **Insomnia**. 
