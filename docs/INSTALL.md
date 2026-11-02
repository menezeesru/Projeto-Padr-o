# Instalação - ServiceDesk Pro

## Opção 1: Docker (Recomendado)
```bash
# 1) Copiar variáveis
cp .env.example .env

# 2) Subir tudo
pnpm docker:up

# 3) Acessar
# Web: http://localhost:5173
# API: http://localhost:4000
# Swagger: http://localhost:4000/api/docs
# Adminer: http://localhost:8080
```

Credenciais seed: `admin@servicedesk.local` / `Admin@123456`

## Opção 2: Desenvolvimento local
```bash
# Instalar deps
pnpm install

# Gerar Prisma, migrar e popular
pnpm db:generate
pnpm db:migrate
pnpm db:seed

# Rodar em dev
pnpm dev
```

## Variáveis importantes
Ver `.env.example` na raiz. Para produção, troque todos os segredos JWT.
