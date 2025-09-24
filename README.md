# 🌍 Darukaa.Earth – Geospatial Data Analytics Platform

Darukaa.Earth is a **full-stack geospatial analytics dashboard** for managing and visualizing carbon and biodiversity projects.  
It enables administrators to create projects, add multiple sites (as polygons), and view performance analytics over time.

This project was built as part of the **Darukaa.Earth Full-Stack Developer Hackathon Challenge**.

---
## 🔗 Live Demo

👉 [Geospace Project (Darukaa.Earth)](https://geospace-project.vercel.app/)

---

## 🚀 High-Level Architecture

The platform is structured into three main layers:

- **Frontend (React + Leaflet + Chart.js)**  
  - React for the SPA dashboard.  
  - Leaflet.js for maps and polygon drawing. (Originally Mapbox GL JS was considered, but Leaflet was chosen because it is open-source, free, and requires no credit card sign-up, making it the most practical choice for MVP delivery.)  
  - Chart.js for interactive analytics visualization.  

- **Backend (FastAPI + Python)**  
  - REST APIs for authentication, project management, site management, and analytics history.  
  - **JWT-based authentication** with both **access tokens** and **refresh tokens** for better security and user experience.  
  - Implemented a dedicated **`refresh_access_token`** endpoint:  
    - Uses a valid refresh token to issue a new short-lived access token.  
    - Ensures users stay logged in without needing to re-enter credentials.  
    - Enhances security by keeping access tokens ephemeral while maintaining seamless UX.  
  - Database access via SQLAlchemy (async).  

- **Database (PostgreSQL)**  
  - Projects, Sites, Users, and Site Analytics History stored in relational tables.  
  - Polygon coordinates are stored in JSON for simplicity in MVP scope, with a clear migration path to PostGIS if advanced geospatial queries are needed later.  
  - Timestamps and audit fields included to support history and scaling needs.  

- **CI/CD & Developer Experience**  
  - GitHub Actions for automated linting, formatting, type checks, tests, and builds.  
  - Husky + lint-staged pre-commit hooks ensure code quality is enforced before commits land in the repo.  
  - Deployment handled by Vercel (frontend) and Render (backend), which automatically deploy on push.  

---

## 📊 Database Schema

### Key Entities

- **Users**  
  - `id`, `email`, `password_hash`, `created_at`  
  - Authenticated with JWTs.  

- **Projects**  
  - `id`, `name`, `description`, `created_by`, `created_at`  
  - Holds one or more sites.  

- **Sites**  
  - `id`, `project_id (FK)`, `name`, `polygon_coordinates (JSON)`, `created_at`  
  - Stores polygon data as JSON arrays (simple, effective, and flexible for the current stage).  

- **Site Analytics History**  
  - `id`, `site_id (FK)`, `timestamp`, `metric_type`, `metric_value`  
  - Maintains historical analytics data for each site.  
  - Decision: Keeping a dedicated history table avoids bloating the main site table and enables scalable time-series analytics.  

### Schema Decisions

- **Timestamps across all tables** → helpful for audits, debugging, and analytics growth.  
- **JWT-based Auth** → stateless, secure, and production-ready.  
- **Separate History Table** → optimized for scalability and data integrity.  

---

## 🖼️ Features

- ✅ User Registration & JWT Authentication  
- ✅ Project & Site Management  
- ✅ Polygon Drawing on Maps (Leaflet)  
- ✅ Analytics Visualization with Chart.js  
- ✅ Automated Code Quality Checks (Husky + lint-staged + Prettier + ESLint + Black + Flake8 + Mypy)  
- ✅ CI/CD with GitHub Actions  
- ✅ Deployment with Render (backend) + Vercel (frontend)  

---

## ⚡ CI/CD Pipeline

Implemented using **GitHub Actions**:

- **On every push & PR to `main`**  
  - Install frontend & backend dependencies.  
  - Run **lint** (ESLint for frontend, Flake8 + Mypy for backend).  
  - Run **format checks** (Prettier + Black + isort).  
  - Run **tests** (Jest for frontend, Pytest for backend).  
  - Build frontend for deployment.  

- **Developer Workflow**  
  - Pre-commit hooks (Husky + lint-staged) run linting and formatting locally before commits.  
  - This ensures consistency and prevents bad code from entering the repository.  

---

## ☁️ Deployment

- **Frontend:** Vercel (auto-deploy on push to `main`).  
- **Backend:** Render (auto-deploy with database connection).  

Both platforms handle **CI/CD automatically**, ensuring quick feedback and smooth releases.  

---

## 🔮 Future with AWS

For production scale:  
- **Dockerize** both frontend and backend.  
- Deploy containers on **AWS EKS (Elastic Kubernetes Service)**.  
- Use **Kubernetes pods** to scale backend API servers automatically based on load.  
- Use **AWS RDS (PostgreSQL)** for database.  
- Add **NGINX + Load Balancer** for routing between services.  

This architecture would provide:  
- Horizontal scaling of services.  
- High availability with self-healing workloads.  
- Secure, isolated environments with IAM, VPC, and monitoring.  

---

## 🛠 Setup & Local Development

### Prerequisites
- Node.js v18+  
- Python 3.11+  
- PostgreSQL  

### Clone & Install
```bash
git clone <repo-url>
cd darukaa-platform

# Install dependencies
npm run install:frontend
npm run install:backend
npm run install:backend-dev

### Run Locally
# Run frontend (React)
npm run start:frontend

# Run backend (FastAPI)
npm run start:backend

# Run both concurrently
npm run dev

