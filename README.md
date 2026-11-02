# ServiceDesk Pro

Sistema completo de Gestão de Chamados de TI (Help Desk / Service Desk) com identidade visual branca e azul, filas inteligentes, SLA auditável, controle de acesso por perfis, dashboard gerencial e arquitetura modular pronta para expansão.

## Tecnologias
- **Frontend:** Vite + React + TypeScript + Tailwind CSS + shadcn/ui + TanStack Query + Recharts
- **Backend:** Node.js + Express + TypeScript + Prisma ORM + Zod
- **Banco:** PostgreSQL 16
- **Infra:** Docker + Docker Compose + Turborepo + pnpm

## Perfis de acesso
Administrador, Gestor de TI, Supervisor, Técnico de TI, Solicitante.

## Principais módulos
Dashboard, Meus Chamados, Abrir Chamado, Fila de Atendimento, Todos os Chamados, SLA e Escalonamentos, Catálogo de Serviços, Base de Conhecimento, Inventário de TI, Equipes e Técnicos, Aprovações, Relatórios, Notificações, Auditoria, Configurações.

## Pré-requisitos (desenvolvimento local)
- Node.js >= 20
- pnpm >= 9
- PostgreSQL 16 (ou usar Docker)
- Docker e Docker Compose (recomendado)

## Instalação rápida com Docker
1. Copie `.env.example` para `.env` e ajuste variáveis
2. Suba os serviços:
```bash
pnpm docker:up
```
3. Acesse:
- Web: http://localhost:5173
- API: http://localhost:4000
- Swagger: http://localhost:4000/api/docs
- Adminer: http://localhost:8080

## Desenvolvimento sem Docker
1. Instalar dependências
```bash
pnpm install
```
2. Configurar `.env` (raiz/apps/api/apps/web conforme necessário)
3. Gerar Prisma e migrar
```bash
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```
4. Rodar dev
```bash
pnpm dev
```

## Credenciais de demonstração (apenas local)
Definidas em `.env.example` via `SEED_ADMIN_*`. Após `db:seed`:
- Admin: admin@servicedesk.local / Admin@123456

## Segurança
- Senhas com bcrypt
- JWT (access + refresh)
- RBAC por perfil/permissões
- Rate limiting em login
- Helmet, CORS
- Validação Zod no backend
- Proteção a anexos por autorização
- Logs de auditoria para operações críticas
- Prevenção a atribuição concorrente

## Documentação
- [Arquitetura](./docs/ARCHITECTURE.md)
- [Instalação](./docs/INSTALL.md)
- [API](./docs/API.md)
- [Runbook](./docs/RUNBOOK.md)
- [LGPD/Segurança](./docs/SECURITY_LGPD.md)
- [Backup/Restore](./docs/BACKUP.md)

## Licença
Uso interno/empresarial. Adapte conforme necessidades da organização.
