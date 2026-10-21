@echo off
title Placify - Placement Preparation Tracker
color 0B

echo =====================================================================
echo                PLACIFY - PLACEMENT PREPARATION TRACKER
echo =====================================================================
echo.
echo Starting Spring Boot Backend and Web Application...
echo.

REM Check if Java is available
where java >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Java is not detected on your PATH!
    echo Please install Java 17+ (JDK) and ensure 'java' is accessible in terminal.
    pause
    exit /b 1
)

echo [1/3] Java detected successfully!
echo [2/3] Starting backend server on http://localhost:8080 ...
echo       (If this is the first run, Maven will take a moment to start)
echo.

REM Open browser after 6 seconds in background
start "" cmd /c "timeout /t 6 /nobreak >nul && start http://localhost:8080"

REM Navigate to backend folder and run Spring Boot
cd /d "%~dp0backend"
call mvnw.cmd spring-boot:run

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Application failed to start.
    echo If port 8080 is in use, terminate the existing process or check logs.
    pause
)
