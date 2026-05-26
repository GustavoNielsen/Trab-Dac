@echo off
echo Subindo infraestrutura Docker...
echo Postgres: localhost:5434  usuario/senha: bantads/bantads
docker compose up -d

echo.
echo Se autocadastro falhar com erro de senha do Postgres, execute:
echo   scripts\reset-postgres.bat
echo.
echo Inicie em terminais separados:
echo   cd backend\ms-autenticador
echo   mvnw.cmd clean spring-boot:run
echo   cd backend\ms-cliente
echo   mvnw.cmd spring-boot:run
echo   cd backend\ms-gerente
echo   mvnw.cmd spring-boot:run
echo   cd apiGateway
echo   npm install ^&^& npm start
echo   cd frontend
echo   npm start
