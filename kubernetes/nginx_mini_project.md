# Kubernetes Hands-On Mini Project (Port-Forward Only)

This guide is designed to help you **learn Kubernetes practically** using Minikube and **port-forwarding** to access applications. Each step includes:

* **Why we do it**
* **Expected results**
* **Real-world use cases**

💡 **Goal:** Learn Pods, Deployments, ConfigMaps, rolling updates, and the sidecar pattern in Kubernetes.

---

## Step 0: Prepare a Clean Environment

**Why:** Ensures you start fresh and avoid conflicts from previous experiments.
**Expected Result:** A new namespace `demo` is created; any old resources are removed.
**Real Case:** In production, clearing old resources prevents deployment issues.

```bash
kubectl delete namespace demo --ignore-not-found
kubectl create namespace demo
kubectl get namespaces
```

✅ **Tip:** Use namespaces to isolate resources for experiments or teams.

---

## Step 1: Deploy a Single NGINX Pod

**Why:** Learn how to create a Pod and access it directly with `port-forward`.
**Expected Result:** `nginx-pod` is running and accessible via `localhost:8080`.
**Real Case:** Useful for testing, debugging, or inspecting pod behavior without exposing services publicly.

```yaml
# nginx-pod.yml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
  namespace: demo
spec:
  containers:
  - name: nginx
    image: nginx:latest
    ports:
    - containerPort: 80
```

```bash
kubectl apply -f nginx-pod.yml
kubectl get pods -n demo
kubectl port-forward pod/nginx-pod 8080:80 -n demo
```

*Open in browser:* [http://localhost:8080](http://localhost:8080)

---

## Step 2: Create a Deployment with Multiple Replicas

**Why:** Learn Deployments, scaling, and high availability.
**Expected Result:** Three pods running NGINX. Can scale up/down easily.
**Real Case:** Ensures redundancy, load balancing, and resilience in production.

```yaml
# nginx-deploy.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deploy
  namespace: demo
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:latest
        ports:
        - containerPort: 80
```

```bash
kubectl apply -f nginx-deploy.yml
kubectl get pods -n demo
kubectl scale deployment nginx-deploy --replicas=5 -n demo
kubectl get pods -n demo
kubectl port-forward pod/<pod-name> 8080:80 -n demo
```

✅ **Tip:** You can forward different pods to different ports for testing:

```bash
kubectl port-forward pod/nginx-deploy-xxxx 8081:80 -n demo
```

---

## Step 3: Update Deployment Image (Simulate CI/CD)

**Why:** Learn rolling updates, version control, and zero downtime deployments.
**Expected Result:** Pods update to `nginx:alpine` smoothly.
**Real Case:** Production updates without downtime; used in CI/CD pipelines.

```bash
kubectl set image deployment/nginx-deploy nginx=nginx:alpine -n demo
kubectl rollout status deployment/nginx-deploy -n demo
kubectl get pods -n demo
kubectl port-forward pod/<pod-name> 8080:80 -n demo
```

✅ **Tip:** To rollback if something goes wrong:

```bash
kubectl rollout undo deployment/nginx-deploy -n demo
```

---

## Step 4: Use a ConfigMap to Customize NGINX

**Why:** Separate configuration from code and dynamically update content.
**Expected Result:** NGINX serves a custom HTML page from ConfigMap.
**Real Case:** Manage environment-specific configs, secrets, or app settings without rebuilding images.

```yaml
# nginx-config.yml
apiVersion: v1
kind: ConfigMap
metadata:
  name: nginx-config
  namespace: demo
data:
  index.html: |
    <html><body><h1>Welcome to My Custom NGINX!</h1></body></html>
```

```yaml
# nginx-deploy-config.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deploy
  namespace: demo
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:latest
        ports:
        - containerPort: 80
        volumeMounts:
        - name: html
          mountPath: /usr/share/nginx/html
      volumes:
      - name: html
        configMap:
          name: nginx-config
```

```bash
kubectl apply -f nginx-config.yml
kubectl apply -f nginx-deploy-config.yml
kubectl port-forward pod/<pod-name> 8080:80 -n demo
```

*Browser:* [http://localhost:8080](http://localhost:8080)

---

## Step 5: Add a Sidecar Container

**Why:** Learn the sidecar pattern for logging, monitoring, or helper processes.
**Expected Result:** Pod runs NGINX + BusyBox sidecar printing messages.
**Real Case:** Microservices often use sidecars for log collection, metrics, or service mesh proxies.

```yaml
# nginx-sidecar.yml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-sidecar
  namespace: demo
spec:
  containers:
  - name: nginx
    image: nginx:latest
    ports:
    - containerPort: 80
  - name: busybox
    image: busybox
    command: ["sh", "-c", "while true; do echo Hello from sidecar; sleep 10; done"]
```

```bash
kubectl apply -f nginx-sidecar.yml
kubectl get pods -n demo
kubectl logs -f nginx-sidecar -c busybox -n demo
kubectl port-forward pod/nginx-sidecar 8080:80 -n demo
```

*Browser:* [http://localhost:8080](http://localhost:8080)

---

## Step 6: Tips & Tricks

* **Port-forwarding** is great for **local testing** without exposing pods externally.
* Forward multiple pods to different local ports:

```bash
kubectl port-forward pod/<another-pod> 8081:80 -n demo
```

* Use `kubectl describe pod <pod-name> -n demo` to debug pods.
* Always **clean resources** after experiments to avoid conflicts:

```bash
kubectl delete namespace demo
```

* Experiment with **different container images**, **sidecars**, and **configurations** to explore Kubernetes features.

---

✅ This guide is ready to be used as a GitHub `.md` note for practicing Kubernetes.
