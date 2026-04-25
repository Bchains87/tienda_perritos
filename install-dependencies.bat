@echo off
REM Script para instalar dependencias del proyecto Tienda Perritos

echo ========================================
echo Instalando dependencias del Backend
echo ========================================

cd backend
call npm install
if %errorlevel% neq 0 (
    echo Error al instalar dependencias del backend
    pause
    exit /b 1
)

cd ..

echo.
echo ========================================
echo Dependencias instaladas correctamente
echo ========================================
pause
