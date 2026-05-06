@echo off
REM Food Delivery App - Docker Management Script for Windows
REM Usage: docker.bat [command]

setlocal enabledelayedexpansion

set COMPOSE_FILE=docker-compose.yml

if "%1"=="" goto help
if "%1"=="up" goto up
if "%1"=="up-d" goto up-d
if "%1"=="down" goto down
if "%1"=="logs" goto logs
if "%1"=="restart" goto restart
if "%1"=="rebuild" goto rebuild
if "%1"=="clean" goto clean
if "%1"=="seed" goto seed
if "%1"=="status" goto status
goto help

:up
echo 🚀 Starting Food Delivery App with Docker...
docker-compose -f %COMPOSE_FILE% up --build
goto end

:up-d
echo 🚀 Starting Food Delivery App in background...
docker-compose -f %COMPOSE_FILE% up -d --build
goto end

:down
echo 🛑 Stopping Food Delivery App...
docker-compose -f %COMPOSE_FILE% down
goto end

:logs
echo 📋 Showing logs...
docker-compose -f %COMPOSE_FILE% logs -f
goto end

:restart
echo 🔄 Restarting Food Delivery App...
docker-compose -f %COMPOSE_FILE% restart
goto end

:rebuild
echo 🔨 Rebuilding and restarting...
docker-compose -f %COMPOSE_FILE% down
docker-compose -f %COMPOSE_FILE% up --build --force-recreate
goto end

:clean
echo 🧹 Cleaning up Docker resources...
docker-compose -f %COMPOSE_FILE% down -v --remove-orphans
docker system prune -f
goto end

:seed
echo 🌱 Seeding database...
docker-compose -f %COMPOSE_FILE% exec backend npm run seed
goto end

:status
echo 📊 Service Status:
docker-compose -f %COMPOSE_FILE% ps
goto end

:help
echo Food Delivery App - Docker Management Script for Windows
echo.
echo Usage: %0 [command]
echo.
echo Commands:
echo   up       Start all services (with build)
echo   up-d     Start all services in background
echo   down     Stop all services
echo   logs     Show logs from all services
echo   restart  Restart all services
echo   rebuild  Rebuild and restart all services
echo   clean    Remove containers, volumes, and prune system
echo   seed     Run database seeder
echo   status   Show service status
echo   help     Show this help message
echo.
echo Examples:
echo   %0 up          # Start the app
echo   %0 logs        # View logs
echo   %0 down        # Stop the app
echo.
goto end

:end