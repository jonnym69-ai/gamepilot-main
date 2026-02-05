@echo off
echo Testing API health endpoint...
powershell -Command "Invoke-RestMethod -Uri 'http://localhost:3001/health' -Method Get"
pause
