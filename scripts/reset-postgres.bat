@echo off
echo Recriando Postgres do BANTADS (porta 5434, usuario/senha: bantads/bantads)...
cd /d "%~dp0.."
docker compose down -v
docker compose up -d postgres
echo.
echo Aguarde ~15 segundos para o banco inicializar e executar init-db...
timeout /t 15 /nobreak
docker exec bantads-postgres psql -U bantads -d bantads -c "\dt cliente.*"
echo.
echo Se listou tabelas em cliente.*, o banco esta pronto.
echo Reinicie ms-cliente e ms-gerente.
