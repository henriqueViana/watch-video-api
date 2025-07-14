# Video Streaming Service (NestJS + Kafka + S3)

Este projeto é um serviço de backend responsável por entregar vídeos em formato de streaming, utilizando NestJS com integração a Kafka, autenticação com JWT, armazenamento no S3 (mockado via LocalStack), e observabilidade com OpenTelemetry.

---

## Visão Geral

- **Backend:** NestJS
- **Mensageria:** Kafka (via KafkaJS)
- **Armazenamento:** S3 (LocalStack - armazenamento dos videos e PostgreSQL para armazenamento dos logs)
- **Segurança:** JWT
- **Observabilidade:** OpenTelemetry + Jaeger + Prometheus + Grafana

---

## Arquitetura

```mermaid
graph TD
  A[Client Gateway] --> B[GET api/video]
  B --> C[NestJS Controller]
  C --> D[S3Service getVideoStream]
  C --> E[Kafka Emit video-accessed]
  E --> F[Kafka Broker]
  F --> G[Kafka Consumer]
  G --> H[Log Storage and Tracing]
  C --> I[JWT Auth Guard]
```

## Estrutura do projeto

```bash
src/
├── main.ts # Bootstrap App
├── application/ # Use-cases files
├── domain/ # interfaces, DTOs and basic business logic
├── common/
  ├── errors/ # errors strategies files to map common errors
  ├── interceptors/ # interceptors files
  ├── interfaces/ # common interfaces with not business logic
├── infra/
  ├── auth/ # files to configure and implement JWT auth rules
  ├── kafka/ # files to configure and implement kafka
  ├── observability/ # files to configure and implement observability (logs, metrics and trace)
  ├── s3/ # files to configure and implement S3
├── interfaces/ # entry-layer to communication with external aplications (frontend, api gateway or any other service)
  ├── controllers/
```

## Setup Local

### Pré requisitos

- **Node.js 22+**
- **Yarn ou NPM**
- **Docker**

### Instalação

1- Instalando as dependências e subindo os container

```bash
yarn install
yarn docker:dev  #roda o docker-compose executando em segundo plano (detached).
```

2- Criação do Bucket no S3 do localstack e subindo um video para testes

```bash
yarn s3:all-flow  # executa os stripts que cria o bucket e faz upload de um video (/assets/videos)
```

Após executar esses comandos teremos os containers rodando e com um video de exemplo disponível para testes

## Como usar

### Autenticação

- **Endpoint:** /auth/token
- **Query param:** userId (required)

Endpoint responsável por retornar um token JWT válido.
Para buscar ou fazer upload de um video, o usuário precisa estar autenticado. Use a requisição abaixo para gerar um token (testes).

**Requisição:**

```bash
curl --location 'http://localhost:3000/v1/api/auth/token?userId=123'
```

### Get Video (Streaming)

- **Endpoint:** /video
- **Query param:** filename (required)
- **Authorization** Bearer token (required)

Endpoint responsável por retornar um video via stream.
Rota protejida por JWT, onde busca o video no S3, faz o stream do video, emite log de acesso com o Kafka e gera métricas para o Prometeus

O nome do arquivo de video usado para testes é: **video-test.mp4**

**Requisição:**

```bash
curl --location 'http://localhost:3000/v1/api/video?filename=video-test.mp4' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NSIsImlhdCI6MTc1MjQ5NTY5NCwiZXhwIjoxNzUyNDk5Mjk0fQ.NUFp25oXoRU-Fd4veXiyUPrKPhYJItrnM6lZm1wT03U'
```

## Ferramentas

### Kafka

#### Configurações

- **Broker:** kafka:9092
- **Tópico:** video-accessed
- **ClientId:** video-streaming-client
- **Consumer Group::** video-streaming-consumer

### Observabilidade

#### Ferramentas

- **Jaeger:** http://localhost:16686
- **Prometheus:** http://localhost:9090
- **Grafana:** http://localhost:3001
- **Métricas NestJS:** http://localhost:3000/metrics

#### Spans geradas

- **video.access.log:** (Producer Kafka)
- **video.log.save:** (Consumer Kafka)

## Documentação em HTML

### Pré requisitos

- **mkdocs:**

Gerando uma versão HTML do README.

```bash
yarn docs:prepare  # faz uma cópia do conteúdo de README para /docs/index.md
yarn docs:server  # sobe um servidor que disponibiliza o HTML na porta :8000
```

Ou também podendo gerar uma versão estática da documentação. Criando um diretório chamado **site**

```bash
yarn docs:build
```

## Contribuições

Sinta-se à vontade para abrir PRs, issues ou sugestões.
