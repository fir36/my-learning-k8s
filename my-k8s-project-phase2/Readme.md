### Project Overview
- Node.js app with environment secret
- Persistent Volume + PVC for storage
- Deployment with 3 replicas
- NodePort Service
- Ingress for routing

### Step-by-Step Instructions

#### Step 1: Start Minikube
```bash
minikube start
minikube addons enable ingress
```

#### Step 2: Clone Your GitHub Repository
```bash
git clone <your-repo-url>
cd my-k8s-project
```

#### Step 3: Configure Minikube Docker Environment
```bash
# Linux/Mac
eval $(minikube docker-env)
# Windows PowerShell
# & minikube -p minikube docker-env --shell powershell | Invoke-Expression
```

#### Step 4: Build Docker Image
```bash
docker build -t k8s-node-app:v1 .
```

#### Step 5: Apply Kubernetes Manifests
```bash
kubectl apply -f k8s/combined.yaml
kubectl get pods
kubectl get svc
kubectl get ingress
```

#### Step 6: Update Hosts File for Ingress
```
127.0.0.1 node-app.local
```

#### Step 7: Access the Application
- NodePort: `minikube service node-app-service`
- Ingress: `http://node-app.local`

#### Step 8: Verify Persistent Storage
```bash
kubectl exec -it <node-app-pod> -- ls /usr/src/app/storage
```

#### Step 9: Verify Secret Injection
```bash
kubectl exec -it <node-app-pod> -- printenv DB_PASSWORD
```

#### Step 10: Scaling the Deployment
```bash
kubectl scale deployment node-app-deployment --replicas=5
kubectl get pods
```

#### Step 11: Cleanup
```bash
kubectl delete -f k8s/combined.yaml
minikube stop
```

### Phase 2 Overview
Phase 2 demonstrates **real-world Kubernetes practices**:
- **Volumes/PVC** → Persistent storage
- **Secrets** → Secure environment variables
- **Deployment & Service** → Replicas and access
- **Ingress** → Route external traffic

This setup is now **both educational and realistic** for company-like workflows.
