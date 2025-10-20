# Módulo Resident

## Visão Geral

O módulo **Resident** representa o **papel de morador** de uma unidade no condomínio, aplicando o **Single Responsibility Principle (SRP)**.

### Separação de Responsabilidades (SRP)

```
┌──────────┐
│   User   │ → Autenticação (email, password, login)
└────┬─────┘
     │ user_id
     ▼
┌──────────┐
│ Resident │ → Papel de Morador (unit_id, role)
└────┬─────┘
     │ resident_id
     ▼
┌──────────────────┐
│ ResidentVisitor  │ → Autorização de Visitantes
└──────────────────┘
```

**Antes (❌ violação SRP):**
- `User` tinha responsabilidades de autenticação E de morador
- `ResidentVisitor` apontava direto para `User`

**Depois (✅ SRP aplicado):**
- `User`: apenas autenticação
- `Resident`: apenas papel de morador
- `ResidentVisitor`: autorização vinculada a `Resident`

---

## Estrutura

```
resident/
├── domain/
│   ├── entities/
│   │   └── Resident.ts          # Entidade de domínio
│   └── repositories/
│       └── ResidentRepository.ts # Interface do repositório
├── application/
│   ├── dtos/
│   │   └── ResidentDTOs.ts      # DTOs de request/response
│   └── use-cases/
│       ├── CreateResidentUseCase.ts
│       └── GetResidentByIdUseCase.ts
├── infrastructure/
│   └── repositories/
│       └── PrismaResidentRepository.ts
└── register.ts                   # Registro no container DI
```

---

## Entidade Resident

### Propriedades

- `id`: Identificador único
- `userId`: Referência ao usuário
- `unitId`: Referência à unidade do condomínio
- `role`: Tipo de morador (`owner`, `tenant`, `family`)
- `isActive`: Status do morador

### Métodos

- `create()`: Cria novo morador
- `restore()`: Reconstitui do banco
- `changeUnit()`: Altera unidade
- `changeRole()`: Altera tipo de morador
- `activate()` / `deactivate()`: Controle de status

---

## Casos de Uso

### CreateResidentUseCase

Cria um novo morador vinculado a um usuário e uma unidade.

**Input:**
```typescript
{
  user_id: string;
  unit_id: string;
  role?: "owner" | "tenant" | "family";
}
```

**Output:**
```typescript
{
  id: string;
  user_id: string;
  unit_id: string;
  role: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}
```

### GetResidentByIdUseCase

Busca um morador pelo ID.

---

## Schema do Banco

```prisma
model Resident {
  id        String   @id @default(uuid())
  userId    String   @map("user_id")
  unitId    String   @map("unit_id")
  role      String   @default("owner")
  isActive  Boolean  @default(true) @map("is_active")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user             User              @relation(...)
  unit             Unit              @relation(...)
  residentVisitors ResidentVisitor[]

  @@unique([userId])
  @@map("residents")
}
```

---

## Integração

O módulo é registrado automaticamente no container de DI:

```typescript
// src/core/container/index.ts
registerResidentModule(container);
```

Outros módulos (como `Visitor`) podem injetar `ResidentRepository`:

```typescript
const residentRepo = container.get<ResidentRepository>("ResidentRepository");
```

---

## Benefícios da Refatoração

✅ **SRP**: Cada entidade tem uma única responsabilidade  
✅ **Escalabilidade**: Fácil adicionar novos papéis (síndico, porteiro, etc)  
✅ **Clareza**: Relacionamentos mais explícitos  
✅ **Testabilidade**: Menos acoplamento entre módulos

