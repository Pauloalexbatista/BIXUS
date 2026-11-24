@echo off
SETLOCAL
title BIXUS.PT - Loja & Backoffice

REM Ir para a pasta do projeto
cd /d "%~dp0"

echo ===================================================
echo   BIXUS.PT - O melhor de Nos para Eles
echo ===================================================
echo.
echo   Site:       http://localhost:3000
echo   Backoffice: http://localhost:3000/admin
echo.
echo   Password Pre-visualizacao: bixus2026
echo   Login Backoffice:          admin@bixus.pt / bixusadmin2026
echo ===================================================
echo.
echo [+] A abrir o navegador (Loja e Backoffice)...
echo.

start http://localhost:3000
start http://localhost:3000/admin

echo [+] A iniciar o servidor Next.js na porta 3000...
echo [+] (Mantenha esta janela aberta enquanto testa o site)
echo.

REM Usar 'call' no Windows para evitar que o script feche prematuramente
call npm run dev -- -p 3000

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [!] Ocorreu um erro ao iniciar o servidor.
    echo [!] Certifique-se que o Node.js esta instalado e as dependencias carregadas.
    echo.
    pause
)
