# 💼 Carteira Mestre - API de Gestão Financeira e Investimentos

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.x-blue?style=for-the-badge&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/Django-REST_Framework-092E20?style=for-the-badge&logo=django&logoColor=white" alt="Django">
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
  <img src="https://img.shields.io/badge/Arquitetura-SOA-FF6F00?style=for-the-badge" alt="SOA">
</p>

Bem-vindo ao repositório do **Carteira Mestre**, um ecossistema desenvolvido sob a Arquitetura Orientada a Serviços (SOA) focado no controle de fluxo de caixa pessoal e projeções de investimentos.

O projeto cumpre com rigor as melhores práticas de construção de APIs RESTful, separação de responsabilidades (Camadas MVC) e interoperabilidade entre sistemas distribuídos.

---

## 🏗️ Arquitetura e Tecnologias

* **Linguagem Base:** Python 3.x
* **Framework Backend:** Django + Django REST Framework (DRF)
* **Banco de Dados:** PostgreSQL (Bancos Lógicos Isolados)
* **Orquestração e Infraestrutura:** Docker & Docker Compose
* **Arquitetura:** Microserviços (SOA)

### A Divisão dos Microserviços

O ecossistema é formado por dois serviços independentes que se comunicam via protocolo HTTP (com rotinas de resiliência e fallback):

1. **`ms-carteira` (Gestão e Custódia)**
   * Responsável por manter o fluxo de caixa do usuário.
   * **Domínios:** `Transacao` (Receitas e Despesas para cálculo de saldo) e `Ativo` (Ações/Títulos mantidos sob custódia).
   * **Banco de Dados:** `db_carteira`

2. **`ms-investimentos` (Motor Analítico)**
   * Responsável por calcular juros compostos e projeções futuras.
   * **Comunicação Ativa:** O serviço consome ativamente o endpoint do `ms-carteira` para puxar o "Saldo Livre" do usuário e usá-lo como base de cálculo.
   * **Resiliência (Fallback):** Caso o `ms-carteira` fique indisponível, o sistema não trava; ele passa a exigir um valor manual do usuário para continuar processando simulações.
   * **Domínios:** `Simulacao` (Histórico de cálculos de rentabilidade).
   * **Banco de Dados:** `db_investimentos`

---

## 🚀 Como Executar o Projeto Localmente

O ambiente de desenvolvimento está 100% conteinerizado. Você não precisa instalar Python ou PostgreSQL na sua máquina, apenas o **Docker Desktop**.

1. Clone este repositório ou baixe a pasta do projeto.
2. Abra o terminal na raiz do projeto (onde está o arquivo `docker-compose.yml`).
3. Execute o comando de orquestração:
   ```bash
   docker-compose up -d --build
   ```

O Docker construirá as imagens do Python, baixará o PostgreSQL, criará os dois bancos lógicos separadamente e iniciará as duas APIs simultaneamente.

**Acesse as APIs:**
* Microserviço de Carteira: `http://localhost:8000`
* Microserviço de Investimentos: `http://localhost:8001`

---

## 📡 Endpoints Principais (CRUD)

Todas as requisições e respostas são trafegadas em formato **JSON** rígido, respeitando os Status Codes HTTP convencionais (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`).

### ms-carteira (Porta 8000)
* `GET /api/transacoes/` - Lista todas as receitas e despesas e devolve o cálculo dinâmico do **Saldo Total**.
* `POST /api/transacoes/` - Cadastra uma nova transação.
* `PUT /api/transacoes/{id}/` - Edita uma transação existente.
* `DELETE /api/transacoes/{id}/` - Remove uma transação.
* `GET /api/ativos/` - Lista os ativos em custódia.
*(Idem POST, PUT, DELETE para ativos).*

### ms-investimentos (Porta 8001)
* `GET /api/simulacoes/` - Retorna o histórico de simulações realizadas.
* `POST /api/simulacoes/` - Realiza o cálculo de juros. Aceita a flag `usar_saldo_carteira: true` para puxar os dados via rede interna, ou o preenchimento de `valor_manual` em caso de falha de rede (resiliência).

---

*Projeto desenvolvido como Trabalho Final da Disciplina de Web Services / Arquitetura de Software.*
