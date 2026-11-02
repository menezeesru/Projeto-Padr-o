# API - ServiceDesk Pro

Base URL: `http://localhost:4000`

## Auth
- POST `/api/auth/login`
- GET `/api/auth/me`
- POST `/api/auth/refresh`

## Tickets
- POST `/api/tickets` (criar)
- GET `/api/tickets` (listar)
- GET `/api/tickets/:id` (detalhe)
- POST `/api/tickets/:id/comments` (comentário)
- PATCH `/api/tickets/:id/status` (alterar status)
- POST `/api/tickets/:id/assign` (atribuir - Supervisor/Gestor/Admin)

## Filas
- GET `/api/queues`
- GET `/api/queues/:id/tickets`
- POST `/api/queues/tickets/:ticketId/accept` (aceitar)

## Dashboard
- GET `/api/dashboard`

## SLA
- GET `/api/sla/instances`

## Usuários
- GET `/api/users`

## Auditoria
- GET `/api/audit`

Swagger completo: `http://localhost:4000/api/docs`
