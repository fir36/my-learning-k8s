### Project Overview
- Node.js app with environment secret
- Persistent Volume + PVC for storage
- Deployment with 3 replicas
- NodePort Service
- Ingress for routing

# Node.js Kubernetes Deployment on Minikube

## Step-by-Step Instructions

### Step 1: Start Minikube
```bash
minikube start
minikube addons enable ingress
```
**Debug tip:**
```bash
minikube status
```

### Step 2: Clone Your GitHub Repository
```bash
git clone <your-repo-url>
cd my-k8s-project-phase2
```
**Debug tip:**
```bash
git pull origin main
```

### Step 3: Build Docker Image
```bash
docker build -t <your-dockerhub-user>/k8s-node-app:v1 .
```
**Debug tip:**
```bash
docker images
```

### Step 4: Login to Docker Hub
```bash
docker login
```

### Step 5: Push the Image
```bash
docker push <your-dockerhub-user>/k8s-node-app:v1
```
**Debug tip:** Check on Docker Hub that the image exists.

### Step 6: Apply Kubernetes YAMLs in Namespace `demo`
```bash
kubectl apply -f k8s/combined.yml -n demo
```
**Debug tip:**
```bash
kubectl create namespace demo  # if namespace does not exist
kubectl get all -n demo
kubectl describe pod <pod-name> -n demo
kubectl logs <pod-name> -n demo
```

### Step 7: Verify Deployment
```bash
kubectl get pods -n demo
kubectl get svc -n demo
kubectl get ingress -n demo
```

### Step 8: Update Hosts File for Ingress
Edit `/etc/hosts`:
```
192.168.49.2 node-app.local
```
**Debug tip:**
```bash
ping node-app.local
```

### Step 9: Access the Application
- **NodePort:**
```bash
minikube service node-app-service -n demo
```
- **Ingress:** Open browser at `http://node-app.local`

### Step 10: Verify Persistent Storage
```bash
kubectl exec -it <node-app-pod> -n demo -- ls /usr/src/app/storage
```
**Debug tip:**
```bash
kubectl get pvc -n demo
kubectl describe pvc app-pvc -n demo
kubectl get pv
```

### Step 11: Verify Secret Injection
```bash
kubectl exec -it <node-app-pod> -n demo -- printenv DB_PASSWORD
```

### Step 12: Scaling the Deployment
```bash
kubectl scale deployment node-app-deployment --replicas=5 -n demo
kubectl get pods -n demo
```

### Step 13: Debugging Common Issues
- Pods not starting:
```bash
kubectl describe pod <pod-name> -n demo
kubectl logs <pod-name> -n demo
```
- Service not reachable:
```bash
kubectl get svc -n demo
kubectl describe svc node-app-service -n demo
```
- Ingress issues:
```bash
kubectl describe ingress node-app-ingress -n demo
kubectl get pods -n ingress-nginx
```
- PVC issues:
```bash
kubectl get pvc -n demo
kubectl describe pvc app-pvc -n demo
kubectl get pv
```

### Step 14: Cleanup
```bash
kubectl delete -f k8s/combined.yml -n demo
kubectl delete namespace demo
minikube stop
minikube delete
```

```

### Phase 2 Overview
Phase 2 demonstrates **real-world Kubernetes practices**:
- **Volumes/PVC** → Persistent storage
- **Secrets** → Secure environment variables
- **Deployment & Service** → Replicas and access
- **Ingress** → Route external traffic

This setup is now **both educational and realistic** for company-like workflows.
