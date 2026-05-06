#!/bin/bash

# Food Delivery App - Docker Management Script
# Usage: ./docker.sh [command]

set -e

COMPOSE_FILE="docker-compose.yml"

case "${1:-help}" in
    "up")
        echo "🚀 Starting Food Delivery App with Docker..."
        docker-compose -f $COMPOSE_FILE up --build
        ;;
    "up-d")
        echo "🚀 Starting Food Delivery App in background..."
        docker-compose -f $COMPOSE_FILE up -d --build
        ;;
    "down")
        echo "🛑 Stopping Food Delivery App..."
        docker-compose -f $COMPOSE_FILE down
        ;;
    "logs")
        echo "📋 Showing logs..."
        docker-compose -f $COMPOSE_FILE logs -f
        ;;
    "restart")
        echo "🔄 Restarting Food Delivery App..."
        docker-compose -f $COMPOSE_FILE restart
        ;;
    "rebuild")
        echo "🔨 Rebuilding and restarting..."
        docker-compose -f $COMPOSE_FILE down
        docker-compose -f $COMPOSE_FILE up --build --force-recreate
        ;;
    "clean")
        echo "🧹 Cleaning up Docker resources..."
        docker-compose -f $COMPOSE_FILE down -v --remove-orphans
        docker system prune -f
        ;;
    "seed")
        echo "🌱 Seeding database..."
        docker-compose -f $COMPOSE_FILE exec backend npm run seed
        ;;
    "status")
        echo "📊 Service Status:"
        docker-compose -f $COMPOSE_FILE ps
        ;;
    "help"|*)
        echo "Food Delivery App - Docker Management Script"
        echo ""
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  up       Start all services (with build)"
        echo "  up-d     Start all services in background"
        echo "  down     Stop all services"
        echo "  logs     Show logs from all services"
        echo "  restart  Restart all services"
        echo "  rebuild  Rebuild and restart all services"
        echo "  clean    Remove containers, volumes, and prune system"
        echo "  seed     Run database seeder"
        echo "  status   Show service status"
        echo "  help     Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0 up          # Start the app"
        echo "  $0 logs        # View logs"
        echo "  $0 down        # Stop the app"
        ;;
esac