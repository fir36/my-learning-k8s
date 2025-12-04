# NGINX Access Runbook (Minikube + Kubernetes) 

This guide shows how to deploy a basic NGINX pod in Kubernetes using
Minikube and how to access it via: - Port-forward - NodePort -
LoadBalancer

## Prerequisites

### Install required packages

``` bash
sudo apt update
sudo apt install -y conntrack socat jq git curl wget
```

### Install Docker

``` bash
sudo apt install -y docker.io
sudo usermod -aG docker $USER
newgrp docker
```

### Install kubectl

``` bash
curl -LO https://dl.k8s.io/release/$(curl -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl
chmod +x kubectl
sudo mv kubectl /usr/local/bin/
```

### Install Minikube

``` bash
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
chmod +x minikube-linux-amd64
sudo mv minikube-linux-amd64 /usr/local/bin/minikube
```

### Start Minikube

``` bash
minikube start --driver=docker
```

Verify:

``` bash
kubectl get nodes
```

## Step 1 --- Create Namespace

``` bash
kubectl create namespace demo
```

## Step 2 --- Deploy NGINX Pod

``` bash
kubectl run nginx-pod -n demo --image=nginx --port=80
```

Check pod:

``` bash
kubectl get pods -n demo
```

# Step 3 --- Access Methods

## A) Port-Forward (simple and always works)

``` bash
kubectl port-forward pod/nginx-pod 8080:80 -n demo
```

Browser:

    http://localhost:8080

## B) NodePort Service

Create NodePort:

``` bash
kubectl expose pod nginx-pod -n demo --type=NodePort --port=80
```

Check NodePort:

``` bash
kubectl get svc -n demo
```

Browser:

    http://<VM-IP>:<NodePort>

## C) LoadBalancer (requires minikube tunnel)

Delete service if exists:

``` bash
kubectl delete svc nginx-pod -n demo
```

Create LoadBalancer:

``` bash
kubectl expose pod nginx-pod -n demo --type=LoadBalancer --port=80
```

Start tunnel:

``` bash
minikube tunnel
```

Check EXTERNAL-IP:

``` bash
kubectl get svc -n demo
```

Browser:

    http://<EXTERNAL-IP>

## Troubleshooting

Check if port is in use:

``` bash
sudo lsof -i :8080
```

Kill the process:

``` bash
sudo kill -9 <PID>
```

Restart Minikube:

``` bash
sudo minikube delete
sudo minikube start --driver=docker
```

## Cleanup

``` bash
kubectl delete pod nginx-pod -n demo
kubectl delete svc nginx-pod -n demo
kubectl delete namespace demo
```

## Summary Table

  Method         Requires Service   URL Example
  -------------- ------------------ -----------------------
  Port-Forward   No                 http://localhost:8080
  NodePort       Yes                http://VM-IP:NodePort
  LoadBalancer   Yes                http://EXTERNAL-IP

  # 🔑 Kubernetes Access Methods (Simple Explanation)

There are **3 common ways** to access your app running in Kubernetes:

------------------------------------------------------------------------

## 1️⃣ **Port Forwarding (kubectl port-forward)**

**Best for:** Local testing, debugging, development.

### ✔️ How it works

You forward a port from **your laptop → directly to the pod or
service**.

### ✔️ Example

``` bash
kubectl port-forward pod/nginx-pod 8080:80 -n demo
```

Open in browser:\
👉 http://localhost:8080

------------------------------------------------------------------------

## 2️⃣ **NodePort**

**Best for:** Simple access inside a private network (not recommended
for production).

### ✔️ Example

``` bash
kubectl expose pod nginx-pod -n demo --type=NodePort --port=80
kubectl get svc -n demo
```

Access:\
👉 http://`<node-ip>`{=html}:`<nodeport>`{=html}

------------------------------------------------------------------------

## 3️⃣ **LoadBalancer**

**Best for:** Production, public access, cloud environments.

### ✔️ Example

``` bash
kubectl expose pod nginx-pod -n demo --type=LoadBalancer --port=80
kubectl get svc -n demo
```

Access:\
👉 http://`<external-ip>`{=html}

