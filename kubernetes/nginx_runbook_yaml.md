# 📝 Kubernetes NGINX Pod + Services Runbook (Step-by-Step Guide) 

This runbook shows how to create a basic **NGINX pod** and expose it via:

- Port-forward (local testing)
- NodePort (internal access)
- LoadBalancer (simulated public access in Minikube)

It also explains the proper order to apply resources and use namespaces.

---

## 1️⃣ Setup Namespace

```bash
kubectl create namespace demo
```

---

## 2️⃣ Create NGINX Pod

`nginx-pod.yaml`:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
  namespace: demo
  labels:
    app: nginx
spec:
  containers:
  - name: nginx
    image: nginx
    ports:
    - containerPort: 80
```

Apply the pod:

```bash
kubectl apply -f nginx-pod.yaml
```

> ✅ Pod must exist **before** port-forwarding or creating services.

---

## 3️⃣ Port-Forward (Local Testing)

```bash
kubectl port-forward pod/nginx-pod 8080:80 -n demo
```

- Maps host port **8080** → pod port **80**  
- Access in browser:

```
http://localhost:8080
```

- No services are required for this.  
- Keep the terminal running while testing.

---

## 4️⃣ NodePort Service (Internal Access)

`nginx-service-nodeport.yaml`:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service-nodeport
  namespace: demo
spec:
  type: NodePort
  selector:
    app: nginx
  ports:
    - port: 80
      targetPort: 80
      nodePort: 31080
```

Apply service:

```bash
kubectl apply -f nginx-service-nodeport.yaml
```

- Access in browser (host must reach VM IP):

```
http://<VM-IP>:31080
```

- Works with bridged networking or proper firewall rules.

---

## 5️⃣ LoadBalancer Service (Public Access in Minikube)

`nginx-service-lb.yaml`:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service-lb
  namespace: demo
spec:
  type: LoadBalancer
  selector:
    app: nginx
  ports:
    - port: 80
      targetPort: 80
```

Apply service:

```bash
kubectl apply -f nginx-service-lb.yaml
```

Start Minikube tunnel (root required):

```bash
sudo minikube tunnel
```

- Wait for `EXTERNAL-IP` to appear:

```bash
kubectl get svc -n demo
```

- Access in browser:

```
http://<EXTERNAL-IP>
```

> Tunnel must stay running.  
> LoadBalancer simulates a public IP in Minikube; host machine may not see it without the tunnel.

---

## 6️⃣ Cleanup

```bash
kubectl delete pod nginx-pod -n demo
kubectl delete svc nginx-service-nodeport -n demo
kubectl delete svc nginx-service-lb -n demo
kubectl delete namespace demo
```

---

## ✅ Notes

- **Order matters**: Pod first → port-forward → services.  
- **Port-forward** is independent; can coexist with NodePort/LoadBalancer.  
- `-n demo` is optional if the namespace is defined in YAML, but recommended for clarity.  
- NodePort requires host → VM network connectivity.  
- LoadBalancer requires `minikube tunnel` to simulate external access.  

---

This guide allows you to test **all three access methods** safely in Minikube.  
Port-forwarding is the easiest for quick local testing, NodePort for internal network, and LoadBalancer for a simulated cloud-like setup.

