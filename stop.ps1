# PowerShell Shutdown Script for VendOps
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "               VENDOPS FULL-STACK SHUTDOWN                            " -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan

# 1. Terminate Console Windows with title VendOps-Web-UI
Write-Host "[1/3] Terminating VendOps Web UI console windows..." -ForegroundColor Yellow
Get-Process | Where-Object { $_.MainWindowTitle -match "VendOps-Web-UI" } | ForEach-Object {
    Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
}

# 2. Terminate any processes listening on port 3000 and 8000
Write-Host "[2/3] Checking and stopping processes on port 3000 and 8000..." -ForegroundColor Yellow
@(3000, 8000) | ForEach-Object {
    $port = $_
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connections) {
        $pids = $connections | Select-Object -ExpandProperty OwningProcess -Unique
        foreach ($p in $pids) {
            if ($p -gt 0) {
                Write-Host "Stopping process on port $port (PID: $p)..." -ForegroundColor Yellow
                Stop-Process -Id $p -Force -ErrorAction SilentlyContinue
            }
        }
    }
}

# 3. Stop Backend Docker Containers
Write-Host "[3/3] Stopping Backend Docker Compose containers..." -ForegroundColor Yellow
Push-Location "..\VendOps-Agentic-Harness"
docker compose down
Pop-Location

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "[SUCCESS] All VendOps frontend and backend services stopped cleanly." -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Cyan
