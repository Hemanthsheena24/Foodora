# Food Delivery - Kubernetes Deployment

This directory contains production-ready Kubernetes manifests for deploying the Food Delivery application using GitOps best practices.

## 🏗️ Architecture Overview

```
Internet
    ↓
[Ingress Controller]
    ↓
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   MongoDB       │
│   (React/Nginx) │◄──►│   (Node.js)     │◄──►│   (Database)    │
│   Port: 80      │    │   Port: 5000    │    │   Port: 27017    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 Directory Structure

```
k8s/
├── base/                          # Base Kubernetes manifests
│   ├── namespace.yaml            # Namespace definition
│   ├── configmap.yaml            # Application configuration
│   ├── secrets.yaml              # Sensitive data (encrypted)
│   ├── mongodb-pvc.yaml          # Persistent storage for DB
│   ├── mongodb-deployment.yaml   # MongoDB deployment
│   ├── mongodb-service.yaml      # MongoDB service
│   ├── backend-deployment.yaml   # Backend API deployment
│   ├── backend-service.yaml      # Backend API service
│   ├── frontend-deployment.yaml  # Frontend deployment
│   ├── frontend-service.yaml     # Frontend service
│   ├── ingress.yaml              # External access routing
│   ├── backend-hpa.yaml          # Auto-scaling for backend
│   ├── network-policies.yaml     # Security policies
│   ├── pdb.yaml                  # Pod disruption budgets
│   └── kustomization.yaml        # Kustomize base config
└── overlays/                     # Environment-specific configs
    ├── development/              # Development environment
    │   ├── kustomization.yaml
    │   └── patch-config.yaml
    ├── staging/                  # Staging environment
    │   ├── kustomization.yaml
    │   └── patch-config.yaml
    └── production/               # Production environment
        ├── kustomization.yaml
        └── patch-config.yaml
```

## 🚀 Quick Start

### Prerequisites

- Kubernetes cluster (v1.24+)
- kubectl configured
- Kustomize (built into kubectl v1.14+)
- NGINX Ingress Controller
- cert-manager (for TLS certificates)
- External DNS (for DNS management)

### Deploy to Development

```bash
# Deploy to development environment
kubectl apply -k k8s/overlays/development

# Check deployment status
kubectl get pods -n food-delivery
kubectl get services -n food-delivery
kubectl get ingress -n food-delivery
```

### Deploy to Production

```bash
# Deploy to production environment
kubectl apply -k k8s/overlays/production

# Verify deployment
kubectl get all -n food-delivery
```

## 🔧 Configuration

### Environment Variables

All configuration is managed through ConfigMaps and Secrets:

- **ConfigMap**: `food-delivery-config` - Application settings
- **Secret**: `food-delivery-secrets` - Sensitive data (JWT keys, DB credentials)

### Scaling

- **Backend**: Auto-scales based on CPU (70%) and memory (80%) utilization
- **Frontend**: Manual scaling based on environment
- **Database**: Single replica with persistent storage

### Resource Limits

| Component | CPU Request | CPU Limit | Memory Request | Memory Limit |
|-----------|-------------|-----------|----------------|--------------|
| Backend   | 100m        | 300m     | 256Mi         | 512Mi       |
| Frontend  | 50m         | 150m     | 128Mi         | 256Mi       |
| MongoDB   | 250m        | 500m     | 512Mi         | 1Gi         |

## 🔒 Security Features

### Network Policies
- Backend can only communicate with MongoDB and Frontend
- Frontend can only communicate with Backend
- External access through Ingress only

### Security Context
- Non-root user execution
- Read-only root filesystem
- Dropped capabilities
- No privilege escalation

### Secrets Management
- Base64 encoded secrets
- External secret management recommended for production
- Secret rotation annotations included

## 📊 Monitoring & Observability

### Health Checks
- Liveness probes for container health
- Readiness probes for traffic routing
- Startup probes for slow-starting containers

### Metrics
- Prometheus annotations for scraping
- Custom metrics endpoints
- HPA based on resource utilization

### Logging
- Structured logging with configurable levels
- Log aggregation through sidecar containers (optional)

## 🔄 CI/CD Integration

### GitOps Workflow

```yaml
# Example GitHub Actions workflow
name: Deploy to Kubernetes
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Configure kubectl
      uses: azure/k8s-set-context@v2
    - name: Deploy to development
      run: kubectl apply -k k8s/overlays/development
    - name: Run tests
      run: kubectl wait --for=condition=available --timeout=300s deployment/food-delivery-backend -n food-delivery
```

### Image Management

Images are tagged with:
- `latest` - Development
- `staging-vX.X.X` - Staging
- `vX.X.X` - Production

## 🛠️ Maintenance

### Database Backup

```bash
# Create backup
kubectl exec -n food-delivery deployment/mongodb -- mongodump --out /backup/$(date +%Y%m%d_%H%M%S)

# Copy backup to local
kubectl cp food-delivery/mongodb-pod:/backup/latest ./backup/
```

### Rolling Updates

```bash
# Update backend image
kubectl set image deployment/food-delivery-backend backend=food-delivery-backend:v1.1.0 -n food-delivery

# Check rollout status
kubectl rollout status deployment/food-delivery-backend -n food-delivery
```

### Troubleshooting

```bash
# Check pod logs
kubectl logs -f deployment/food-delivery-backend -n food-delivery

# Debug pod
kubectl exec -it deployment/food-delivery-backend -c backend -- /bin/sh -n food-delivery

# Check events
kubectl get events -n food-delivery --sort-by=.metadata.creationTimestamp
```

## 📈 Performance Optimization

### Database
- Connection pooling configured
- Indexes optimized for query patterns
- Persistent volume for data durability

### Caching
- CDN integration through Ingress annotations
- Browser caching headers
- API response caching (future enhancement)

### Networking
- Service mesh integration points
- Load balancing across zones
- SSL/TLS termination at Ingress

## 🔐 Compliance & Governance

### Labels & Annotations
- Standard Kubernetes labels
- Company-specific metadata
- Cost allocation tags
- Security classification

### RBAC
- Service accounts with minimal permissions
- Network policies for segmentation
- Pod security standards

### Backup & Recovery
- Automated database backups
- Configurable retention policies
- Disaster recovery procedures

## 📞 Support

For issues and questions:
- **Platform Team**: platform-team@company.com
- **Application Team**: food-delivery-team@company.com
- **Security Team**: security@company.com

## 📝 Change Log

### v1.0.0
- Initial production deployment
- Multi-environment support
- Security hardening
- Monitoring integration