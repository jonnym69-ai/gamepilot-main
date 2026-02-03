# GamePilot Backup Script
# Usage: .\backup.ps1

Write-Host "🛡️ GamePilot Backup Script" -ForegroundColor Green
Write-Host "==========================" -ForegroundColor Green

# Create timestamp
$timestamp = Get-Date -Format 'yyyy-MM-dd_HH-mm-ss'
$backupPath = "..\backups\gamepilot-backup-$timestamp"

# Create backup directory
Write-Host "📁 Creating backup directory..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path $backupPath -Force | Out-Null

# Copy files
Write-Host "📦 Copying GamePilot files..." -ForegroundColor Yellow
Copy-Item -Path "." -Destination $backupPath -Recurse -Force

# Get backup stats
$files = Get-ChildItem -Path $backupPath -Recurse -File
$size = ($files | Measure-Object -Property Length -Sum).Sum

# Display results
Write-Host "✅ Backup completed successfully!" -ForegroundColor Green
Write-Host "📍 Location: $backupPath" -ForegroundColor Cyan
Write-Host "📊 Files: $($files.Count)" -ForegroundColor Cyan
Write-Host "💾 Size: $([math]::Round($size / 1MB, 2)) MB" -ForegroundColor Cyan
Write-Host "🕐 Timestamp: $timestamp" -ForegroundColor Cyan

# Create backup info file
$backupInfo = @"
GamePilot Backup Information
========================
Created: $(Get-Date)
Files: $($files.Count)
Size: $([math]::Round($size / 1MB, 2)) MB
Location: $backupPath

Contents:
- Complete source code
- Node dependencies
- Database files
- Configuration
- Documentation
"@

$backupInfo | Out-File -FilePath "$backupPath\backup-info.txt" -Encoding UTF8

Write-Host "📄 Backup info saved to: $backupPath\backup-info.txt" -ForegroundColor Green
Write-Host "🎮 Your GamePilot project is safely backed up!" -ForegroundColor Green
