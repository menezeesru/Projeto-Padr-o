# Arquitetura - ServiceDesk Pro

## Visão geral
Monorepo Turborepo com `apps/web` (React + Vite), `apps/api` (Express + Prisma), `packages/shared` (tipos/enums/schemas).

## Banco de dados
PostgreSQL com schema relacional normalizado: usuários/perfis/permissões, chamados, filas, SLA, aprovações, base de conhecimento, ativos, notificações, auditoria.

## Segurança
- Autenticação JWT (access + refresh)
- RBAC por role/permissions
- Rate limit em login
- Helmet/CORS
- Senhas bcrypt
- Auditoria de operações críticas
- Controle de acesso a anexos

## SLA
Políticas por categoria/serviço, calendário com expediente/feriados, contadores de primeira resposta e resolução, alertas e violação auditáveis.

## Filas
Configuração por equipe, aceite pelo técnico, prevenção a atribuição duplicada, histórico de transferências.
