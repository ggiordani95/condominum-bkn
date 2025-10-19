# Módulo de Visitantes

Módulo responsável pelo gerenciamento de visitantes no sistema de condomínio.

## 📁 Estrutura

```
visitor/
├── application/
│   ├── dtos/
│   │   └── VisitorDTOs.ts           # DTOs de entrada/saída
│   └── use-cases/
│       ├── CreateVisitorUseCase.ts   # Criar visitante
│       ├── GetAllVisitorsUseCase.ts  # Listar visitantes ativos
│       ├── GetVisitorByIdUseCase.ts  # Buscar por ID
│       └── UpdateVisitorUseCase.ts   # Atualizar visitante
├── domain/
│   ├── entities/
│   │   ├── Visitor.ts                # Entidade Visitante
│   │   └── ResidentVisitor.ts        # Entidade Vínculo Morador-Visitante
│   ├── repositories/
│   │   └── VisitorRepository.ts      # Interface do repositório
│   └── value-objects/
│       ├── Document.ts               # CPF do visitante
│       ├── VehiclePlate.ts           # Placa do veículo
│       └── VisitorName.ts            # Nome do visitante
├── http/
│   ├── VisitorController.ts          # Controlador HTTP
│   └── routes.ts                     # Definição das rotas
├── infrastructure/
│   └── repositories/
│       └── PrismaVisitorRepository.ts # Implementação com Prisma
└── register.ts                       # Registro no container DI
```

## 🎯 Funcionalidades

### 1. Criar Visitante
- Valida dados do visitante (nome, documento, placa)
- Verifica se o morador existe
- Cria o visitante no banco
- Estabelece vínculo com expiração de 24 horas

### 2. Listar Visitantes Ativos
- Retorna apenas visitantes com vínculo não expirado
- Inclui informações do morador responsável
- Ordenado por data de criação (mais recentes primeiro)

### 3. Buscar Visitante por ID
- Retorna dados completos do visitante
- Inclui informação do morador e tempo de expiração
- Retorna 404 se não encontrado ou expirado

### 4. Atualizar Visitante
- Permite alterar nome e placa do veículo
- Documento (CPF) não pode ser alterado
- Apenas visitantes ativos podem ser atualizados

## 🧱 Entidades de Domínio

### Visitor (Visitante)
```typescript
{
  id: UniqueId
  name: VisitorName
  document: Document
  vehiclePlate: VehiclePlate | null
  createdAt: Date
  updatedAt: Date
}
```

**Regras de Negócio:**
- Nome deve ter entre 3 e 100 caracteres
- Documento deve ter no mínimo 11 dígitos
- Placa deve seguir formato brasileiro (ABC-1234 ou ABC1D23)

### ResidentVisitor (Vínculo Morador-Visitante)
```typescript
{
  id: UniqueId
  residentId: UniqueId
  visitorId: UniqueId
  createdAt: Date
  expiresAt: Date (createdAt + 24 horas)
}
```

**Regras de Negócio:**
- Expiração automática após 24 horas
- Um visitante pode ter múltiplos vínculos com moradores diferentes
- Cada vínculo tem sua própria data de expiração

## 🔒 Value Objects

### Document
Representa o CPF do visitante com validações.

**Validações:**
- Não pode estar vazio
- Deve ter no mínimo 11 dígitos numéricos
- Remove automaticamente caracteres não numéricos

**Métodos:**
- `format()`: Retorna CPF formatado (123.456.789-00)

### VehiclePlate
Representa a placa do veículo brasileiro.

**Validações:**
- Formato brasileiro: ABC-1234 ou ABC1D23 (Mercosul)
- Converte automaticamente para maiúsculas
- Pode ser opcional (null)

**Métodos:**
- `format()`: Retorna placa formatada com hífen

### VisitorName
Representa o nome do visitante.

**Validações:**
- Mínimo: 3 caracteres
- Máximo: 100 caracteres
- Remove espaços extras

## 📊 Repositório

### Interface `VisitorRepository`
```typescript
interface VisitorRepository {
  save(visitor: Visitor): Promise<Result<Visitor>>
  findById(id: UniqueId): Promise<Result<Visitor | null>>
  findAll(): Promise<Result<VisitorWithResident[]>>
  findByIdWithResident(id: UniqueId): Promise<Result<VisitorWithResident | null>>
  createResidentVisitor(residentId: UniqueId, visitorId: UniqueId): Promise<Result<ResidentVisitor>>
  findActiveResidentVisitors(visitorId: UniqueId): Promise<Result<ResidentVisitor[]>>
  deleteExpiredVisitors(): Promise<Result<void>>
}
```

### Implementação Prisma
- Utiliza transações quando necessário
- Filtra automaticamente vínculos expirados
- Inclui relacionamentos (visitor + resident) nas queries

## 🔄 Fluxo de Dados

### Criação de Visitante
```
HTTP Request
    ↓
Controller (validação JWT)
    ↓
CreateVisitorUseCase
    ↓
1. Valida morador existe
2. Cria Value Objects
3. Cria entidade Visitor
4. Salva no repositório
5. Cria ResidentVisitor (vínculo)
    ↓
Response DTO
```

### Listagem de Visitantes
```
HTTP Request
    ↓
Controller (validação JWT)
    ↓
GetAllVisitorsUseCase
    ↓
Repository.findAll()
    → Filtra expiresAt >= NOW()
    → JOIN com users
    ↓
Response DTO[]
```

## 🧪 Testes (Sugeridos)

### Use Cases
- [ ] CreateVisitorUseCase: sucesso
- [ ] CreateVisitorUseCase: morador não encontrado
- [ ] CreateVisitorUseCase: dados inválidos
- [ ] GetAllVisitorsUseCase: retorna apenas ativos
- [ ] GetVisitorByIdUseCase: visitante expirado retorna null
- [ ] UpdateVisitorUseCase: atualização bem-sucedida

### Value Objects
- [ ] Document: aceita CPF com formatação
- [ ] Document: rejeita CPF com menos de 11 dígitos
- [ ] VehiclePlate: aceita placas antigas e Mercosul
- [ ] VehiclePlate: rejeita formato inválido
- [ ] VisitorName: valida comprimento

### Repository
- [ ] save: cria novo visitante
- [ ] save: atualiza visitante existente
- [ ] findAll: filtra visitantes expirados
- [ ] createResidentVisitor: define expiração correta

## 🔐 Segurança

- Todas as rotas requerem autenticação JWT
- Validação de tipos e formatos no schema Fastify
- Value Objects garantem consistência dos dados
- Princípio de responsabilidade única em cada camada

## 🚀 Melhorias Futuras

1. **Autorização por morador**: Apenas o morador que cadastrou pode atualizar
2. **Renovação de vínculo**: Endpoint para estender expiração
3. **Histórico de visitas**: Manter registro de acessos
4. **Notificações**: Avisar morador quando visitante chegar
5. **Check-in/Check-out**: Registrar entrada e saída
6. **Fotos**: Upload de foto do visitante
7. **QR Code**: Gerar código para facilitar identificação
8. **Relatórios**: Estatísticas de visitação

## 📚 Referências

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Value Objects](https://martinfowler.com/bliki/ValueObject.html)

