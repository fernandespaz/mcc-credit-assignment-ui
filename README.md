# MCC — Credit Assignment UI

Interface web para o sistema de **cessão de crédito** da MCC. Permite ao operador registrar recebíveis, simular o valor presente líquido em tempo real e executar liquidações, além de gerenciar cedentes e consultar o extrato consolidado de operações.

---

## Sumário

- [Pré-requisitos](#pré-requisitos)
- [Configuração do ambiente](#configuração-do-ambiente)
- [Como executar](#como-executar)
- [Arquitetura](#arquitetura)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Principais fluxos](#principais-fluxos)
- [Stack e dependências](#stack-e-dependências)

---

## Pré-requisitos

| Ferramenta | Versão mínima |
|---|---|
| Node.js | 20+ |
| npm / yarn / pnpm | qualquer recente |
| Backend `mcc-credit-assignment-api` | rodando em `localhost:8080` |

---

## Configuração do ambiente

Copie o arquivo de exemplo e ajuste as variáveis:

```bash
cp .env.example .env
```

| Variável | Padrão | Descrição |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8080` | URL base do backend Spring Boot |

> **Proxy de desenvolvimento:** o Vite já está configurado para redirecionar todas as requisições com prefixo `/api` para `http://localhost:8080`, então em desenvolvimento a variável pode ser deixada vazia.

---

## Como executar

```bash
# 1. Instalar dependências
npm install

# 2. Rodar em modo desenvolvimento (porta 3000)
npm run dev

# 3. Build de produção
npm run build

# 4. Preview do build
npm run preview

# 5. Linting
npm run lint
```

---

## Arquitetura

O projeto segue os princípios de **Clean Architecture** com separação em camadas, combinada com o padrão **MVVM** (os hooks de aplicação fazem o papel dos ViewModels).

```
┌─────────────────────────────────────────────────────────────┐
│  Presentation Layer                                          │
│  components/ui · components/layout · pages · router         │
│  (React Components — apenas renderização e interação)        │
├─────────────────────────────────────────────────────────────┤
│  Application Layer  (ViewModel / Use Cases)                  │
│  hooks: useReceivables · useCreateReceivable · ...           │
│  (React Query mutations/queries + orquestração de estado)    │
├─────────────────────────────────────────────────────────────┤
│  Domain Layer                                                │
│  entities: Assignor · Receivable · Settlement · ExchangeRate │
│  ports: IAssignorRepository · IReceivableRepository · ...    │
│  value-objects: enums · labels · constantes de negócio       │
├─────────────────────────────────────────────────────────────┤
│  Infrastructure Layer                                        │
│  apiClient (Axios) · *HttpRepository (implementações HTTP)   │
└─────────────────────────────────────────────────────────────┘
```

### Princípios aplicados

- **Inversão de Dependência:** os hooks de aplicação dependem das interfaces `IXxxRepository` do domínio; as implementações HTTP ficam isoladas na infraestrutura.
- **Single Responsibility:** cada hook cuida de exatamente uma operação (ex.: `useCreateReceivable` só cria, `useSimulateReceivable` só simula).
- **Open/Closed:** novos repositórios ou canais de dados podem ser criados implementando as interfaces de porta sem alterar a camada de aplicação.
- **DRY:** componentes de UI compartilhados (`Button`, `Input`, `Select`, `Badge`, `Modal`, `Pagination`, `Spinner`) evitam duplicação de estilo e comportamento.

---

## Estrutura de pastas

```
src/
├── lib/
│   ├── cn.ts                   # utilitário clsx + tailwind-merge
│   ├── formatters.ts           # formatCurrency · formatDate · formatPercent
│   └── useDebounce.ts          # hook genérico de debounce
│
├── domain/
│   ├── entities/               # tipos puros de negócio (Assignor, Receivable, Settlement, ExchangeRate)
│   ├── ports/                  # interfaces de repositório (contratos)
│   └── value-objects/
│       └── enums.ts            # Currency · ReceivableType · ReceivableStatus · labels · SPREAD_BY_TYPE
│
├── infrastructure/
│   ├── http/
│   │   └── apiClient.ts        # instância Axios com interceptor de erro normalizado
│   └── repositories/           # implementações HTTP dos contratos de domínio
│       ├── AssignorHttpRepository.ts
│       ├── ReceivableHttpRepository.ts
│       ├── SettlementHttpRepository.ts
│       ├── ExchangeRateHttpRepository.ts
│       └── ReportHttpRepository.ts
│
├── application/
│   ├── assignors/
│   │   ├── useAssignors.ts          # lista cedentes (query)
│   │   ├── useCreateAssignor.ts     # cria cedente (mutation)
│   │   ├── useUpdateAssignor.ts     # atualiza cedente (mutation)
│   │   └── useDeactivateAssignor.ts # desativa cedente (mutation)
│   ├── receivables/
│   │   ├── useReceivables.ts        # lista recebíveis (query)
│   │   ├── useCreateReceivable.ts   # cria recebível (mutation)
│   │   └── useSimulateReceivable.ts # simula PV em tempo real (query debounced)
│   └── settlements/
│       ├── useExecuteSettlement.ts  # executa liquidação (mutation)
│       └── useSettlementStatement.ts# extrato com filtros (query)
│
└── presentation/
    ├── components/
    │   ├── ui/                      # primitivos de UI reutilizáveis
    │   │   ├── Button.tsx
    │   │   ├── Input.tsx
    │   │   ├── Select.tsx
    │   │   ├── Badge.tsx
    │   │   ├── Spinner.tsx
    │   │   ├── Modal.tsx
    │   │   └── Pagination.tsx
    │   └── layout/
    │       ├── Sidebar.tsx          # navegação lateral (NavLink ativo)
    │       └── AppLayout.tsx        # wrapper com <Outlet />
    ├── pages/
    │   ├── receivables/
    │   │   ├── ReceivablesPage.tsx              # layout split: tabela | painel
    │   │   └── components/
    │   │       ├── OperatorPanel.tsx            # fluxo criar → simular → liquidar
    │   │       ├── ReceivablesTable.tsx         # tabela com filtro de status
    │   │       └── SimulateModal.tsx            # modal de simulação para registros existentes
    │   ├── assignors/
    │   │   ├── AssignorsPage.tsx
    │   │   └── components/
    │   │       ├── AssignorFormModal.tsx        # modais criar / editar (react-hook-form + zod)
    │   │       └── AssignorsTable.tsx
    │   └── settlements/
    │       ├── SettlementStatementPage.tsx
    │       └── components/
    │           ├── StatementFilters.tsx         # filtros: data · cedente · moeda
    │           └── StatementTable.tsx
    └── router/
        └── AppRouter.tsx                        # rotas com redirect de `/` → `/receivables`
```

---

## Principais fluxos

### 1. Painel do Operador — Nova Operação

```
Operador preenche o formulário
  → assignorId · type · faceValue · assetCurrency · paymentCurrency · maturityDate · termMonths
  → POST /api/v1/receivables
  → Recebível criado com status PENDING

Operador informa a Taxa Base (% a.a.)
  → debounce 600 ms
  → GET /api/v1/receivables/{id}/simulate?baseRate={rate}
  → Exibe Valor de Face · Spread · Taxa Base · Câmbio (se cross-currency) · Valor Líquido em tempo real

Operador confirma a liquidação
  → POST /api/v1/settlements
  → Status do recebível muda para SETTLED
  → Cache React Query invalidado (receivables + settlements)
```

### 2. Simular um recebível existente

Qualquer recebível com status **PENDING** na tabela exibe o botão **Simular**, que abre um modal com o mesmo fluxo de taxa base + execução.

### 3. Gestão de Cedentes

- Cadastro (nome, CPF/CNPJ, e-mail) com validação via **Zod**
- Edição de nome e e-mail
- Desativação lógica (soft delete via `DELETE /api/v1/assignors/{id}`)

### 4. Extrato de Liquidações

Filtros dinâmicos (data inicial, data final, cedente, moeda de pagamento) com paginação server-side de 20 registros por página. Exibe taxa base, valor de face, câmbio utilizado e valor líquido convertido.

---

## Stack e dependências

| Categoria | Biblioteca | Versão |
|---|---|---|
| Framework UI | React | 19 |
| Build / Dev Server | Vite | 8 |
| Linguagem | TypeScript | 6 |
| Estilo | Tailwind CSS | 4 |
| Roteamento | react-router-dom | 7 |
| Server State | TanStack React Query | 5 |
| Formulários | react-hook-form | 7 |
| Validação | Zod | 3 |
| HTTP Client | Axios | 1 |
| Ícones | lucide-react | — |
| Utilitários CSS | clsx + tailwind-merge | — |
| Datas | date-fns (pt-BR) | 4 |
| Testes | Vitest + Testing Library | — |
| Mocks de API | MSW (Mock Service Worker) | 2 |
| Linting | oxlint | — |

### Decisões de arquitetura relevantes

- **React Query** como camada de server-state: evita Zustand para dados remotos; o cache é invalidado cirurgicamente por query key após mutations.
- **Zod + react-hook-form** com `zodResolver`: validação tipada no cliente sem duplicar regras.
- **Proxy Vite** em desenvolvimento: requisições `/api/*` são redirecionadas para o backend sem expor a URL ou precisar de CORS em dev.
- **Interceptor Axios**: normaliza erros HTTP em objetos `Error` com `.status`, desacoplando o tratamento de erro da infraestrutura HTTP das camadas superiores.
- **`useDebounce`** no `useSimulateReceivable`: evita chamadas à API a cada tecla digitada, esperando 600 ms de inatividade antes de disparar a simulação.
- **Alias `@/`** (mapeado para `src/`): elimina imports relativos profundos e torna os módulos movíveis sem reescrita de caminhos.
