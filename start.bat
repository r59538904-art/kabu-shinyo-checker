@echo off
cd /d "%~dp0"
start "kabu-shinyo-server" node server.js
timeout /t 2 /nobreak >nul
start "" http://localhost:3690/
