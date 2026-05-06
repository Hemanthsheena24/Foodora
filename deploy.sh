#!/bin/bash
# Food Delivery - Kubernetes Deployment Script
# Usage: ./deploy.sh [environment] [action]

set -e

ENVIRONMENT="${1:-development}"
ACTION="${2:-apply}"
NAMESPACE="food-delivery"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Validate environment
validate_environment() {
    if [[ ! -d "k8s/overlays/$ENVIRONMENT" ]]; then
        log_error "Environment '$ENVIRONMENT' not found. Available environments:"
        ls -1 k8s/overlays/
        exit 1
    fi
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."

    if ! command -v kubectl &> /dev/null; then
        log_error "kubectl is not installed or not in PATH"
        exit 1
    fi

    if ! command -v kustomize &> /dev/null && ! kubectl kustomize --help &> /dev/null; then
        log_error "kustomize is not available. Install kustomize or use kubectl v1.14+"
        exit 1
    fi

    if ! kubectl cluster-info &> /dev/null; then
        log_error "Unable to connect to Kubernetes cluster"
        exit 1
    fi

    log_success "Prerequisites check passed"
}

# Deploy application
deploy() {
    log_info "Deploying Food Delivery to $ENVIRONMENT environment..."

    # Apply manifests
    kubectl apply -k "k8s/overlays/$ENVIRONMENT"

    # Wait for deployments to be ready
    log_info "Waiting for deployments to be ready..."
    kubectl wait --for=condition=available --timeout=300s deployment/food-delivery-backend -n $NAMESPACE
    kubectl wait --for=condition=available --timeout=300s deployment/food-delivery-frontend -n $NAMESPACE
    kubectl wait --for=condition=available --timeout=300s deployment/mongodb -n $NAMESPACE

    log_success "Deployment completed successfully!"
}

# Get status
status() {
    log_info "Getting status for $ENVIRONMENT environment..."

    echo "=== Pods ==="
    kubectl get pods -n $NAMESPACE -o wide

    echo -e "\n=== Services ==="
    kubectl get services -n $NAMESPACE

    echo -e "\n=== Ingress ==="
    kubectl get ingress -n $NAMESPACE

    echo -e "\n=== Persistent Volumes ==="
    kubectl get pvc -n $NAMESPACE

    echo -e "\n=== HPA ==="
    kubectl get hpa -n $NAMESPACE
}

# Logs
logs() {
    COMPONENT="${3:-backend}"
    log_info "Showing logs for $COMPONENT in $ENVIRONMENT environment..."

    kubectl logs -f deployment/food-delivery-$COMPONENT -n $NAMESPACE
}

# Cleanup
cleanup() {
    log_warning "This will delete all resources in the $ENVIRONMENT environment!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log_info "Cleaning up $ENVIRONMENT environment..."
        kubectl delete -k "k8s/overlays/$ENVIRONMENT" --ignore-not-found=true
        log_success "Cleanup completed"
    else
        log_info "Cleanup cancelled"
    fi
}

# Main script
main() {
    case "$ACTION" in
        "apply"|"deploy")
            validate_environment
            check_prerequisites
            deploy
            ;;
        "status")
            validate_environment
            status
            ;;
        "logs")
            validate_environment
            logs "$@"
            ;;
        "delete"|"cleanup")
            validate_environment
            cleanup
            ;;
        "help"|*)
            echo "Food Delivery - Kubernetes Deployment Script"
            echo ""
            echo "Usage: $0 [environment] [action]"
            echo ""
            echo "Environments:"
            echo "  development  - Development environment (default)"
            echo "  staging      - Staging environment"
            echo "  production   - Production environment"
            echo ""
            echo "Actions:"
            echo "  apply        - Deploy application (default)"
            echo "  status       - Show deployment status"
            echo "  logs         - Show application logs"
            echo "  delete       - Delete deployment"
            echo "  help         - Show this help"
            echo ""
            echo "Examples:"
            echo "  $0 development apply    # Deploy to development"
            echo "  $0 production status    # Check production status"
            echo "  $0 staging logs backend # Show staging backend logs"
            ;;
    esac
}

main "$@"