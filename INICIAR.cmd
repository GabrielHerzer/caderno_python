@echo off
cd /d "%~dp0"
python tools\iniciar.py
if errorlevel 1 pause
