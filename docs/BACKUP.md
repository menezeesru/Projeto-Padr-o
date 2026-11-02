# Backup e Restauração

## Backup PostgreSQL (Docker)
```bash
docker exec -t servicedesk-db pg_dump -U servicedesk servicedesk > backup_$(date +%Y%m%d_%H%M%S).sql
```

## Restauração
```bash
cat backup_YYYYMMDD_HHMMSS.sql | docker exec -i servicedesk-db psql -U servicedesk -d servicedesk
```

## Uploads
Fazer backup do volume/ diretório `apps/api/uploads/`
```bash
tar -czf uploads_backup_$(date +%Y%m%d_%H%M%S).tar.gz apps/api/uploads/
```
