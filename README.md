# HearU

HearU is a voice/chat application with a Python backend and a Bun + Vercel frontend. This repository includes deployment configuration, CI workflows, a Bruno API test collection, and Kubernetes deployment notes.

## Overview
MindSpace is an AI-powered, confidential, and empathetic mental wellness companion designed for Indian youth. It provides a safe platform where young individuals can openly share their thoughts, seek guidance, and access resources without fear of stigma or judgment. Leveraging Google Cloud's Generative AI, MindSpace offers intelligent support, mental wellness insights, and a community-driven space to promote emotional well-being.

## Problem Statement
Mental health continues to be a significant taboo in India, particularly among young adults and students. High academic pressure, limited access to affordable care, and social stigma often prevent youth from seeking help. Professional mental healthcare remains out of reach for many due to high costs and lack of accessibility. MindSpace addresses this gap by providing an AI-driven, culturally sensitive, and confidential solution.

## Objectives
- Provide a confidential AI-powered mental wellness companion.
- Offer empathetic conversations through a Generative AI chatbot.
- Create a safe space for youth to express themselves via journals.
- Promote mental wellness awareness and destigmatization.

## Key Features
1. **User Authentication**
   - Secure sign-up and login system.
   - Confidential user profiles.

2. **AI Wellness Chatbot**
   - Confidential and empathetic conversations.
   - Guidance and suggestions powered by Google Cloud Generative AI.

3. **Journaling**
   - Users can post personal journals.
   - A safe space to express emotions and thoughts.

4. **Resource Center**
   - Curated wellness articles, guides, and self-help material.
   - Localized resources tailored for Indian youth.


## Repository layout
- [backend/](backend) — Python backend, Dockerfile, deployment config, and Kubernetes guide. See [backend/pyproject.toml](backend/pyproject.toml) and [backend/deployment.md](backend/deployment.md).
- [frontend/](frontend) — Bun-based frontend and Vercel deployment setup. CI/CD is defined in [.github/workflows/preview.yaml](.github/workflows/preview.yaml) and [.github/workflows/production.yaml](.github/workflows/production.yaml).
- [HearU_api/](HearU_api) — Bruno collection and instructions for API testing. See [HearU_api/README.md](HearU_api/README.md).
- CI & deployment configs: [.github/workflows/preview.yaml](.github/workflows/preview.yaml), [.github/workflows/production.yaml](.github/workflows/production.yaml).
- Repo-level ignores and environment notes: [.gitignore](.gitignore), [backend/.dockerignore](backend/.dockerignore).

## Quick start

Prerequisites (typical)
- Python >= 3.13
- Bun (frontend) — used by CI and local frontend dev
- Docker (optional for images/local Kubernetes)
- Minikube (optional for local k8s)

Backend (local)
1. Open the backend folder:
   - [backend/](backend)
2. Create and activate a Python venv, install dependencies (project contains [backend/requirements.txt](backend/requirements.txt)):
   - Example (typical):
     - python -m venv .venv
     - source .venv/bin/activate
     - pip install -r backend/requirements.txt
3. See the API test/run instructions in [HearU_api/README.md](HearU_api/README.md).

Frontend (local)
1. Open the frontend folder:
   - [frontend/](frontend)
2. Install dependencies using Bun (CI uses `bun install --frozen-lockfile`). See the Vercel workflows:
   - [.github/workflows/preview.yaml](.github/workflows/preview.yaml)
   - [.github/workflows/production.yaml](.github/workflows/production.yaml)

Deployment
- Dockerfile and docker-compose are available under [backend/](backend). See [backend/Dockerfile](backend/Dockerfile) and [backend/docker-compose.yaml](backend/docker-compose.yaml).
- Kubernetes/minikube deployment steps are documented in [backend/deployment.md](backend/deployment.md).
- CI deploys the frontend to Vercel via the GitHub Actions workflows at:
  - [.github/workflows/preview.yaml](.github/workflows/preview.yaml)
  - [.github/workflows/production.yaml](.github/workflows/production.yaml)

Environment
- Environment variables are expected in a `.env` file (root). Note that `.gitignore` and [backend/.dockerignore](backend/.dockerignore) already exclude environment files: [.gitignore](.gitignore), [backend/.dockerignore](backend/.dockerignore).

Testing
- API tests and example requests are stored as a Bruno collection in [HearU_api/README.md](HearU_api/README.md).

Project configuration
- Python project metadata: [backend/pyproject.toml](backend/pyproject.toml)
- Backend linting & type tools configured in the repo (see [backend/pyproject.toml](backend/pyproject.toml) and [backend/mypy.ini](backend/mypy.ini) if present).

Useful files
- Root README (this file): [README.md](README.md)
- Backend deployment guide: [backend/deployment.md](backend/deployment.md)
- API Bruno collection: [HearU_api/README.md](HearU_api/README.md)
- Workflow configs: [.github/workflows/preview.yaml](.github/workflows/preview.yaml), [.github/workflows/production.yaml](.github/workflows/production.yaml)
- Backend project config: [backend/pyproject.toml](backend/pyproject.toml)
- Backend Docker ignore: [backend/.dockerignore](backend/.dockerignore)
- Repo .gitignore: [.gitignore](.gitignore)
- Backend Dockerfile: [backend/Dockerfile](backend/Dockerfile)
- Backend docker-compose: [backend/docker-compose.yaml](backend/docker-compose.yaml)
- Backend requirements: [backend/requirements.txt](backend/requirements.txt)
- Frontend package manifest: [frontend/package.json](frontend/package.json)
- Frontend bun lock: [frontend/bun.lock](frontend/bun.lock)

Notes
- Do not commit any secrets or `.env` files. The repository already excludes `.env` in [.gitignore](.gitignore) and [backend/.dockerignore](backend/.dockerignore).
- For Kubernetes-specific instructions, follow [backend/deployment.md](backend/deployment.md)

## Vision
To break the stigma around mental health for Indian youth by creating an accessible, AI-powered safe space that offers support, guidance, and community-driven healing.

## Team
- **The Aesthetic Devs**
- Built for Hackathon: **Gen AI Exchange Hackathon**
