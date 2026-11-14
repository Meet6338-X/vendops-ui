# PowerShell Full-Stack Launcher for VendOps (Web UI + Backend)
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "             VENDOPS FULL-STACK LAUNCHER (WEB UI + API)               " -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan

# 1. Ensure Docker Desktop is active
Write-Host "[1/4] Ensuring Docker Desktop is running..." -ForegroundColor Yellow
$dockerProc = Get-Process "Docker Desktop" -ErrorAction SilentlyContinue
if (-not $dockerProc) {
    if (Test-Path "C:\Program Files\Docker\Docker\Docker Desktop.exe") {
        Write-Host "Starting Docker Desktop..." -ForegroundColor Yellow
        Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    }
}

# 2. Launch Backend Docker Stack
Write-Host "Launching Backend Docker Stack (FastAPI and Qdrant)..." -ForegroundColor Yellow
Push-Location "..\VendOps-Agentic-Harness"
$dockerReady = $false
for ($i = 0; $i -lt 15; $i++) {
    docker compose up -d 2>$null
    if ($LASTEXITCODE -eq 0) {
        $dockerReady = $true
        break
    }
    Start-Sleep -Seconds 2
}
Pop-Location

if ($dockerReady) {
    Write-Host "[OK] Backend Docker containers launched." -ForegroundColor Green
} else {
    Write-Host "[WARNING] Docker daemon still starting. Proceeding with frontend..." -ForegroundColor DarkYellow
}

# 3. Wait for Backend Health
Write-Host "[2/4] Waiting for Backend API health check on http://localhost:8000/health..." -ForegroundColor Yellow
$healthy = $false
for ($i = 0; $i -lt 15; $i++) {
    try {
        $res = Invoke-RestMethod -Uri "http://localhost:8000/health" -TimeoutSec 1 -ErrorAction Stop
        if ($res.status -eq "healthy") {
            $healthy = $true
            break
        }
    } catch {
        Start-Sleep -Seconds 1
    }
}
if ($healthy) {
    Write-Host "[OK] Backend API & Qdrant are healthy and responding." -ForegroundColor Green
} else {
    Write-Host "[WARNING] Backend health check wait timed out. Continuing..." -ForegroundColor DarkYellow
}

# 4. Start Next.js Frontend
Write-Host "[3/4] Launching Next.js Web UI on port 3000..." -ForegroundColor Yellow
Start-Process -FilePath "cmd.exe" -ArgumentList '/k "title VendOps-Web-UI && bun run dev"'

# 5. Ready Status
Write-Host "[4/4] System is online and ready!" -ForegroundColor Yellow
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "  Web UI Portal    : http://localhost:3000" -ForegroundColor Green
Write-Host "  API & Docs       : http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "  Health Status    : http://localhost:8000/health" -ForegroundColor Cyan
Write-Host "  Qdrant Web UI    : http://localhost:6333/dashboard" -ForegroundColor Cyan
Write-Host "  Terminal TUI     : python bin\vendops-tui.py" -ForegroundColor Yellow
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "Run .\stop.ps1 to shut down all frontend and backend services." -ForegroundColor DarkGray
