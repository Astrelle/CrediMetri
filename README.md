# CrediMetri Risk Analysis Dashboard

This is a quick PoC of a fullstack risk analysis application. It simulates economic stress tests on a loan portfolio.

## Tech Stack
*Backend*: Python, FastAPI, Pydantic, Pytest, Uvicorn, Docker

*Frontend*: React, TypeScript/JS, Tailwind, Vite, Nginx, Docker

*CI/CD*: GitHub Actions

## Architecture

*Shock Simulation*: Adjustable unemployment shock slider to recalculate risk exposure and projected losses from dummy portfolio.
*Automated CI/CD Pipeline*: GitHub Actions automatically validates the backend and frontend. 
*Containerized*: Full container deployment utilizing Docker and Docker Compose.

## Get Started Locally (Docker)
If for some reason you want to build this project, it's quite simple! 

1. Clone the repository:
```bash
git clone https://github.com/Astrelle/CrediMetri.git
cd credimetri
```
2. Run with Docker Compose:
```bash
docker compose up --build
```
3. Access the dashboard at http://localhost:5173 and the API documentation at http://localhost:8000/docs
