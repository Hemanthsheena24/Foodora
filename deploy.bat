@echo off
REM Food Delivery - Kubernetes Deployment Script for Windows
REM Usage: deploy.bat [environment] [action]

setlocal enabledelayedexpansion

set ENVIRONMENT=%1
if "%ENVIRONMENT%"=="" set ENVIRONMENT=development

set ACTION=%2
if "%ACTION%"=="" set ACTION=apply

set NAMESPACE=food-delivery

REM Colors (Windows CMD doesn't support ANSI colors well, so we'll use plain text)
set INFO=[INFO]
set SUCCESS=[SUCCESS]
set WARNING=[WARNING]
set ERROR=[ERROR]

:validate_environment
if not exist "k8s\overlays\%ENVIRONMENT%" (
    echo %ERROR% Environment '%ENVIRONMENT%' not found. Available environments:
    dir /b k8s\overlays\
    exit /b 1
)
goto :check_prerequisites

:check_prerequisites
echo %INFO% Checking prerequisites...
kubectl version >nul 2>&1
if errorlevel 1 (
    echo %ERROR% kubectl is not installed or not in PATH
    exit /b 1
)
kubectl cluster-info >nul 2>&1
if errorlevel 1 (
    echo %ERROR% Unable to connect to Kubernetes cluster
    exit /b 1
)
echo %SUCCESS% Prerequisites check passed
goto :main

:deploy
echo %INFO% Deploying Food Delivery to %ENVIRONMENT% environment...
kubectl apply -k k8s/overlays/%ENVIRONMENT%
if errorlevel 1 (
    echo %ERROR% Failed to apply manifests
    exit /b 1
)
echo %INFO% Waiting for deployments to be ready...
kubectl wait --for=condition=available --timeout=300s deployment/food-delivery-backend -n %NAMESPACE%
kubectl wait --for=condition=available --timeout=300s deployment/food-delivery-frontend -n %NAMESPACE%
kubectl wait --for=condition=available --timeout=300s deployment/mongodb -n %NAMESPACE%
echo %SUCCESS% Deployment completed successfully!
goto :eof

:status
echo %INFO% Getting status for %ENVIRONMENT% environment...
echo === Pods ===
kubectl get pods -n %NAMESPACE% -o wide
echo.
echo === Services ===
kubectl get services -n %NAMESPACE%
echo.
echo === Ingress ===
kubectl get ingress -n %NAMESPACE%
echo.
echo === Persistent Volumes ===
kubectl get pvc -n %NAMESPACE%
echo.
echo === HPA ===
kubectl get hpa -n %NAMESPACE%
goto :eof

:logs
set COMPONENT=%3
if "%COMPONENT%"=="" set COMPONENT=backend
echo %INFO% Showing logs for %COMPONENT% in %ENVIRONMENT% environment...
kubectl logs -f deployment/food-delivery-%COMPONENT% -n %NAMESPACE%
goto :eof

:cleanup
echo %WARNING% This will delete all resources in the %ENVIRONMENT% environment!
set /p CONFIRM="Are you sure? (y/N): "
if /i "!CONFIRM!"=="y" (
    echo %INFO% Cleaning up %ENVIRONMENT% environment...
    kubectl delete -k k8s/overlays/%ENVIRONMENT% --ignore-not-found=true
    echo %SUCCESS% Cleanup completed
) else (
    echo %INFO% Cleanup cancelled
)
goto :eof

:help
echo Food Delivery - Kubernetes Deployment Script for Windows
echo.
echo Usage: %0 [environment] [action]
echo.
echo Environments:
echo   development  - Development environment (default)
echo   staging      - Staging environment
echo   production   - Production environment
echo.
echo Actions:
echo   apply        - Deploy application (default)
echo   status       - Show deployment status
echo   logs         - Show application logs
echo   delete       - Delete deployment
echo   help         - Show this help
echo.
echo Examples:
echo   %0 development apply    # Deploy to development
echo   %0 production status    # Check production status
echo   %0 staging logs backend # Show staging backend logs
goto :eof

:main
if "%ACTION%"=="apply" goto deploy
if "%ACTION%"=="deploy" goto deploy
if "%ACTION%"=="status" goto status
if "%ACTION%"=="logs" goto logs
if "%ACTION%"=="delete" goto cleanup
if "%ACTION%"=="cleanup" goto cleanup
goto help