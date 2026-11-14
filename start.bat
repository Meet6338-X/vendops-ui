@echo off
setlocal enabledelayedexpansion

echo ======================================================================
echo                VENDOPS FULL-STACK LAUNCHER (WEB UI + API)
echo ======================================================================

echo [1/4] Ensuring Docker Desktop is running...
powershell -NoProfile -Command "if (!(Get-Process 'Docker Desktop' -ErrorAction SilentlyContinue)) { if (Test-Path 'C:\Program Files\Docker\Docker\Docker Desktop.exe') { Write-Host 'Launching Docker Desktop...'; Start-Process 'C:\Program Files\Docker\Docker\Docker Desktop.exe' } }"

echo Starting Backend Docker Stack (FastAPI and Qdrant)...
pushd ..\VendOps-Agentic-Harness
set DOCKER_RETRIES=15
:wait_docker_engine
docker compose up -d >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Backend Docker containers launched.
    goto wait_api_ready
)
set /a DOCKER_RETRIES-=1
if %DOCKER_RETRIES% LEQ 0 (
    echo [WARNING] Docker daemon still starting. Running compose directly...
    docker compose up -d
    goto wait_api_ready
)
timeout /t 2 /nobreak >nul
goto wait_docker_engine

:wait_api_ready
popd

echo [2/4] Waiting for Backend API health check on http://localhost:8000/health...
set RETRIES=20
:wait_backend
curl -s -f http://localhost:8000/health >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Backend API and Qdrant are healthy and responding.
    goto start_frontend
)
set /a RETRIES-=1
if %RETRIES% LEQ 0 (
    echo [WARNING] Backend health check wait timed out. Continuing...
    goto start_frontend
)
timeout /t 1 /nobreak >nul
goto wait_backend

:start_frontend
echo [3/4] Launching Next.js Web UI on port 3000...
echo Starting Web UI in a new window...
start "VendOps-Web-UI" cmd /k "title VendOps-Web-UI && bun run dev"

echo [4/4] System is online and ready!
echo ======================================================================
echo   Web UI Portal    : http://localhost:3000
echo   API and Docs     : http://localhost:8000/docs
echo   Health Check     : http://localhost:8000/health
echo   Qdrant Web UI    : http://localhost:6333/dashboard
echo   Terminal TUI     : python bin\vendops-tui.py
echo ======================================================================
echo Run stop.bat to shut down all frontend and backend services.
echo ======================================================================
exit /b 0
