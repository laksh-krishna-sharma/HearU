# Hearu Kubernetes Deployment Guide

This guide will help you set up and deploy the **Hearu** application on **Minikube** using Kubernetes.

---

## 🚀 Steps to Run

### 1. Start Minikube with Docker Driver
```bash
minikube start --driver=docker
```

### 2. Create Kubernetes Secret
Make sure you have a `.env` file in the parent directory (`../.env`) containing all environment variables.

```bash
kubectl create secret generic hearu-secrets \
  --from-env-file=../.env \
  --dry-run=client -o yaml | kubectl apply -f -
```

This creates a **Kubernetes Secret** named `hearu-secrets` that can be mounted inside the pods.

### 3. Apply Deployment YAML
Apply the deployment configuration for Hearu.

```bash
kubectl apply -f hearu-deployment.yaml
```

### 4. Expose Service via Minikube
To access the Hearu service externally:

```bash
minikube service hearu-service --url
```

This will return a URL that you can open in your browser or use in your API client.

### 5. Access Kubernetes Dashboard
Launch the Kubernetes dashboard UI:

```bash
minikube dashboard
```

---

## 📌 Notes
- **Secrets** are stored securely in Kubernetes using `kubectl create secret`. These values (like API keys, DB passwords) should **not** be hardcoded in deployment files.
- **Service Type**: The `hearu-service` is of type `LoadBalancer`. Since Minikube doesn’t provide a real cloud LoadBalancer, you can use `minikube tunnel` to assign an external IP.

```bash
minikube tunnel
```

- **Check Services:**
```bash
kubectl get all
```

---

