# Runbook

## Iniciar
`pnpm docker:up` ou `pnpm dev`

## Parar
`pnpm docker:down`

## Migrations
`pnpm db:migrate`

## Seed
`pnpm db:seed`

## Logs
`pnpm docker:logs`

## Troubleshooting
- Erro de conexão DB: verificar `DATABASE_URL`
- 401: token expirado, usar refresh
- Atribuição duplicada: protegido por checagem `assigneeId null` + transação recomendada
