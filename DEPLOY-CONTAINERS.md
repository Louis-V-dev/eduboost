# Deploy EduBoost as Containers (Beginner Guide)

You don’t need to know Docker in depth. This guide uses **Docker** and **Docker Compose** to run the whole app (database, backend, frontend) with a few commands.

---

## What you need to know

- **Docker** runs each part of the app (database, backend, frontend) in isolated “containers.”
- **Docker Compose** starts and connects all those containers using the project’s `docker-compose.yml`.

You only need to install Docker (or Docker Desktop) and run the commands below.

---

## 1. Install Docker

### Windows

1. Download **Docker Desktop**: https://www.docker.com/products/docker-desktop/
2. Install it and restart if asked.
3. Open Docker Desktop and wait until it says it’s running.
4. Open **PowerShell** or **Command Prompt** and check:

   ```powershell
   docker --version
   docker compose version
   ```

   If both show a version, you’re ready.

### Mac

1. Download Docker Desktop from https://www.docker.com/products/docker-desktop/
2. Install and start Docker Desktop.
3. In Terminal:

   ```bash
   docker --version
   docker compose version
   ```

### Linux (e.g. Ubuntu)

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
# Log out and back in, then:
docker --version
docker compose version
```

---

## 2. Get the project and set environment variables

1. Open a terminal in the project root (the folder that contains `docker-compose.yml`).

2. Create a `.env` file in the project root. If the project has `.env.example`, copy it:

   ```powershell
   # Windows (PowerShell) – if .env.example exists
   Copy-Item .env.example .env
   ```

   ```bash
   # Mac / Linux – if .env.example exists
   cp .env.example .env
   ```

   Otherwise create a new file named `.env`. See [README_DOCKER.md](./README_DOCKER.md) or [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for the full list of variables.

3. Edit `.env` with a text editor and set at least:

   - `DB_PASSWORD` – strong password for the database  
   - `JWT_SECRET` – long random string (at least 32 characters)  
   - `MAIL_USERNAME`, `MAIL_PASSWORD` – your SMTP email (e.g. Gmail app password)  
   - `GOOGLE_CLIENT_ID` (and Google client secret if you use Google login)  
   - For production: `FRONTEND_URL_BASE`, `VITE_API_URL` to your real domain

   Leave other defaults as-is if you’re just trying it locally.

---

## 3. Run locally (development)

From the **project root** (where `docker-compose.yml` is):

```powershell
# Windows
docker compose up -d --build
```

```bash
# Mac / Linux
docker compose up -d --build
```

- First time can take several minutes (downloads images and builds backend/frontend).
- `-d` = run in background.  
- `--build` = build the app images.

Then:

- **Frontend:** http://localhost (port 80) or the port you set for the frontend in `.env`.
- **Backend API:** http://localhost:8080 (or the port you set).
- **MinIO console:** http://localhost:9001 (default user/password from `.env`: e.g. minioadmin / minioadmin123).

Useful commands:

```bash
# See running containers
docker compose ps

# View logs (all services)
docker compose logs -f

# View logs for one service
docker compose logs -f backend

# Stop everything
docker compose down
```

---

## 4. Run for production (same machine or server)

Production uses `docker-compose.prod.yml` and Nginx (with HTTPS). You need SSL certificates in `nginx/ssl/`.

### 4.1 Create SSL placeholders (for testing only)

If you don’t have real certificates yet, create self-signed ones so Nginx can start:

```bash
mkdir -p nginx/ssl
# Linux / Mac (OpenSSL):
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/key.pem -out nginx/ssl/cert.pem \
  -subj "/CN=localhost"
```

(On Windows you can use Git Bash, WSL, or a tool that provides `openssl`.)

For real production, use proper certificates (e.g. Let’s Encrypt) as in [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).

### 4.2 Set production variables in `.env`

In `.env` set:

- `FRONTEND_URL_BASE` = your public URL (e.g. `https://yourdomain.com`)
- `VITE_API_URL` = backend API URL (e.g. `https://yourdomain.com/api`)
- `JPA_DDL_AUTO=validate` (or `none`) so the DB schema isn’t changed automatically in prod
- Strong passwords and secrets

### 4.3 Start production stack

From the project root:

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Or use the deploy script (Linux/Mac):

```bash
chmod +x deploy.sh
./deploy.sh prod
```

Then open your site via the port Nginx uses (e.g. 443 for HTTPS, 80 for HTTP redirect). Full server setup (firewall, DNS, SSL) is in [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).

---

## 5. Deploy to Azure (containers)

To run the same containers in Azure:

1. **Push images to a registry**  
   Build and push your backend and frontend images to **Azure Container Registry (ACR)**.

2. **Run the containers**  
   Use one of:
   - **Azure Container Apps** – good fit for this app, minimal Kubernetes knowledge.
   - **Azure App Service** (Web App for Containers) – run backend and frontend as separate container apps.
   - **Azure Kubernetes Service (AKS)** – if you want Kubernetes.

3. **Use managed services**  
   Replace the Postgres and MinIO containers with:
   - **Azure Database for PostgreSQL**
   - **Azure Blob Storage** (and optionally adjust the app to use it instead of MinIO)

Your existing Dockerfiles and Compose files define the app; Azure is just where the containers and data run. For step-by-step Azure setup, see the project’s Azure deployment docs or the Azure docs for Container Apps / App Service.

---

## 6. Troubleshooting

| Problem | What to do |
|--------|------------|
| Port already in use | Change the port in `.env` (e.g. `BACKEND_PORT=8081`, `FRONTEND_PORT=8080`) or stop the program using that port. |
| Container won’t start | Run `docker compose logs backend` (or `frontend`, `postgres`) to see the error. |
| “Cannot connect to database” | Wait 30 seconds and try again (Postgres may still be starting). Check `docker compose ps` and ensure `postgres` is healthy. |
| Frontend shows wrong API URL | Set `VITE_API_URL` in `.env` and **rebuild** the frontend: `docker compose up -d --build frontend`. |
| Production Nginx won’t start | Ensure `nginx/ssl/cert.pem` and `nginx/ssl/key.pem` exist (see 4.1). |

---

## Troubleshooting – Azure Frontend (eduboost-fe)

If you deploy the frontend to Azure Web App (eduboost-fe), you may see these in the logs:

| Message | Meaning | What to do |
|--------|---------|------------|
| **`cates.crt` does not contain exactly one certificate or CRL** | System CA store update found a cert file with multiple certs or wrong format. | **If you didn’t add a custom cert:** Safe to ignore. It’s from the base image. **If you added a custom cert** (TLS/SSL in Azure): Re-upload a `.crt` that has **exactly one** PEM block (one `-----BEGIN CERTIFICATE-----` … `-----END CERTIFICATE-----`). Use only the leaf cert, not the full chain in one file. |
| **Could not find build manifest at oryx-manifest.toml** | No Oryx build was run (we deploy pre-built `dist`). | Expected. The app still starts with `default-static-site.js`. No fix needed. |
| **node /opt/startup/default-static-site.js** | Azure is serving your static files with the default static site server. | This is correct. Your built files in `wwwroot` are being served. |

For client-side routing (e.g. React Router), the repo includes `public/web.config` so requests to paths like `/login` or `/admin` are rewritten to `/index.html`. Rebuild and redeploy the frontend so `web.config` is in `dist/`.

**Static SPA + minimal Node server:** We deploy the Vite build plus a tiny Node server (`server.js`) and `package.json` so the Node.js container has an entry point. The workflow injects these into the deploy package; they are not in the frontend repo. Azure runs `npm start` → `node server.js`, which serves static files and SPA fallback. You can leave Startup Command empty (Azure will use `npm start`); or set it to `node server.js` if needed. If you still see "waiting for your content", the deploy may not have put `index.html` at wwwroot. In Azure Portal → App Service → **Development Tools** → **SSH** → run:

```bash
cd /home/site/wwwroot
ls -la
```

You should see `index.html`, `web.config`, and an `assets/` folder. If wwwroot is empty or only has other files, fix the deployment (workflow uses `clean: true` and a zip with files at root).

---

## Quick reference

| Goal | Command (from project root) |
|------|-----------------------------|
| Start dev stack | `docker compose up -d --build` |
| Start prod stack | `docker compose -f docker-compose.prod.yml up -d --build` |
| View logs | `docker compose logs -f` |
| Stop all | `docker compose down` |
| Rebuild after code change | `docker compose up -d --build` |

More detail: [README_DOCKER.md](./README_DOCKER.md), [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).
