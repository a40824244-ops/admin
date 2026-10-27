# AUREX Admin

Standalone React admin panel for AUREX. This repository contains the admin
frontend only; the FastAPI backend remains a separate service.

## Local setup

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

Set `VITE_API_BASE_URL` to the backend API URL, including `/api`, and
`VITE_STOREFRONT_URL` to the public store URL. The backend must allow this
admin site's origin in `cORS_ORIGINS`.

## Deployment

Deploy this repository as a Vite static site (for example, on Vercel). Set
`VITE_API_BASE_URL` and `VITE_STOREFRONT_URL` in the deployment environment.
Add the deployed admin URL to the backend's `cORS_ORIGINS`.

Signing in uses the backend's `/auth/login` endpoint. Admin access control is
enforced by the backend on protected API routes; never put admin passwords or
signing keys in this frontend repository.
