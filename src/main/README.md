# Main Layer - Estrutura Organizada

A camada **main** foi refatorada seguindo o princípio da **Single Responsibility Principle (SRP)**, com cada módulo tendo uma responsabilidade específica.

## 📁 Nova Estrutura

```
src/main/
├── buildServer.ts              # Entry point - orquestra a construção do servidor
├── config/
│   ├── appConfig.ts           # Configuração de ambiente e validação
│   └── logger.ts              # Configuração específica do logger
├── container/
│   └── initializeContainer.ts # Inicialização do container DI
├── handlers/
│   └── errorHandlers.ts       # Handlers de erro globais
├── plugins/
│   └── registerPlugins.ts    # Registro de plugins do Fastify
└── routes/
    └── registerRoutes.ts      # Registro de todas as rotas
```

## 🎯 Responsabilidades

### **buildServer.ts**

- **Responsabilidade**: Orquestrar a construção do servidor
- **O que faz**:
  - Carrega configurações
  - Inicializa container DI
  - Cria instância Fastify
  - Registra plugins, rotas e handlers
  - Retorna servidor configurado

### **config/appConfig.ts**

- **Responsabilidade**: Gerenciar configurações da aplicação
- **O que faz**:
  - Carrega variáveis de ambiente
  - Valida configurações críticas
  - Fornece interface tipada para configuração

### **config/logger.ts**

- **Responsabilidade**: Configurar sistema de logs
- **O que faz**:
  - Cria configuração do Pino baseada no ambiente
  - Configura transports de desenvolvimento/produção

### **container/initializeContainer.ts**

- **Responsabilidade**: Inicializar dependency injection
- **O que faz**:
  - Valida serviços críticos
  - Inicializa container de dependências
  - Logs de inicialização

### **plugins/registerPlugins.ts**

- **Responsabilidade**: Registrar plugins do Fastify
- **O que faz**:
  - Configura CORS
  - Configura Swagger/OpenAPI
  - Configura JWT
  - Outros plugins globais

### **routes/registerRoutes.ts**

- **Responsabilidade**: Registrar todas as rotas
- **O que faz**:
  - Registra health check
  - Registra rotas de negócio (auth, users)
  - Organiza prefixos de rotas

### **handlers/errorHandlers.ts**

- **Responsabilidade**: Gerenciar tratamento de erros
- **O que faz**:
  - Error handler global
  - Handler de 404 Not Found
  - Formatação consistente de erros

## 🔄 Fluxo de Inicialização

```typescript
1. loadConfig() → validateConfig()     // Carrega e valida configurações
2. initializeContainer()               // Inicializa DI container
3. Fastify({ logger })                 // Cria instância com logger
4. registerPlugins()                   // Registra plugins globais
5. registerRoutes()                    // Registra todas as rotas
6. registerErrorHandlers()             // Configura tratamento de erros
7. return app                          // Retorna servidor configurado
```

## 🚀 Uso

O buildServer continua com a mesma interface, mas agora internamente está muito mais organizado:

```typescript
import { buildServer } from "./main/buildServer";

const server = buildServer(); // Tudo configurado automaticamente
```
