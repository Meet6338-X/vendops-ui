@echo off
setlocal

echo ======================================================================
echo                VENDOPS FULL-STACK SHUTDOWN
echo ======================================================================

echo [1/3] Terminating VendOps Web UI console windows...
powershell -NoProfile -Command "Get-Process | Where-Object { $_.MainWindowTitle -match 'VendOps-Web-UI' } | Stop-Process -Force -ErrorAction SilentlyContinue"

echo [2/3] Stopping any processes on port 3000 and port 8000...
powershell -NoProfile -Command "$p = (Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue).OwningProcess; if ($p) { Stop-Process -Id $p -Force -ErrorAction SilentlyContinue }"
powershell -NoProfile -Command "$p = (Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue).OwningProcess; if ($p) { Stop-Process -Id $p -Force -ErrorAction SilentlyContinue }"

echo [3/3] Stopping Backend Docker Compose containers...
pushd ..\VendOps-Agentic-Harness
docker compose down >nul 2>&1
popd

echo ======================================================================
echo [SUCCESS] All VendOps frontend and backend services stopped cleanly.
echo ======================================================================
exit /b 0
