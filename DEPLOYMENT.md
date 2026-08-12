# ProspectusIQ — Deployment Guide (Render)

This guide covers deploying ProspectusIQ to [Render](https://render.com) using the included `render.yaml` blueprint. The blueprint provisions two services automatically:

| Service | Runtime | Name |
|---|---|---|
| Backend API | Node.js / Fastify | `prospectusiq-backend` |
| ML Engine | Python / FastAPI | `prospectusiq-ml` |

---

## Prerequisites

- A [Render account](https://render.com) (free tier is sufficient)
- A **Gemini API key** from [Google AI Studio](https://aistudio.google.com/app/apikey)
- This repository pushed to GitHub / GitLab

---

## Step 1 — Connect Repository to Render

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click **New → Blueprint**
3. Connect your GitHub account and select this repository
4. Render will auto-detect `render.yaml` at the root

---

## Step 2 — Set Required Secrets

The blueprint auto-generates `JWT_SECRET` and `INTERNAL_SERVICE_TOKEN`. The **only secret you must set manually** is:

| Service | Key | Where to get it |
|---|---|---|
| `prospectusiq-ml` | `GEMINI_API_KEY` | [aistudio.google.com](https://aistudio.google.com/app/apikey) |

After Render creates the services, go to:
**Dashboard → prospectusiq-ml → Environment → `GEMINI_API_KEY` → Edit → paste your key → Save**

---

## Step 3 — Deploy

Click **Apply** on the Blueprint page. Render will:

1. Build and deploy `prospectusiq-ml` (Python) first
2. Build and deploy `prospectusiq-backend` (Node.js), with `ML_ENGINE_URL` auto-wired to the ML service host
3. Both services will be live at `*.onrender.com` URLs

**First deploy takes ~5–10 minutes** (pip installs + FAISS index build).

---

## Step 4 — Frontend (Vercel)

The frontend (`frontend/portal`) is deployed separately on Vercel.

1. Go to [vercel.com/new](https://vercel.com/new) and import this repository
2. Set **Root Directory** to `frontend/portal`
3. Add the following environment variable in Vercel:

| Key | Value |
|---|---|
| `VITE_API_BASE_URL` | Your Render backend URL, e.g. `https://prospectusiq-backend.onrender.com` |

4. Deploy — Vercel handles the rest.

---

## Architecture Overview

```
[User Browser]
      │
      ▼
[Vercel — React/Vite Frontend]
      │  REST API calls
      ▼
[Render — Node.js/Fastify Backend]   ◄── SQLite @ /tmp/sqlite.db
      │  Internal token-auth
      ▼
[Render — Python/FastAPI ML Engine]  ◄── Gemini API + FAISS index
```

---

## Free Tier Limitations

| Limitation | Detail |
|---|---|
| **SQLite is ephemeral** | Database lives at `/tmp/sqlite.db` — wiped on every redeploy/restart. Fine for demos. |
| **Services spin down** | Free services sleep after 15 min of inactivity. First request after sleep takes ~30s. |
| **No persistent disk** | Disks require a paid plan ($7/mo). See upgrade note below. |
| **HuggingFace cache** | Model weights cached at `/tmp/hf_cache` — re-downloaded on each cold start. |

---

## Upgrading to Persistent Storage (Optional)

If you need data to survive redeploys, upgrade the backend service to a paid plan and re-add the disk to `render.yaml`:

```yaml
# Under prospectusiq-backend in render.yaml
plan: starter           # or standard
disk:
  name: sqlite-data
  mountPath: /data
  sizeGB: 1

# Also restore DATABASE_URL:
- key: DATABASE_URL
  value: /data/sqlite.db
```

---

## Environment Variables Reference

### `prospectusiq-backend`

| Key | Source | Notes |
|---|---|---|
| `NODE_ENV` | `production` | Hardcoded |
| `PORT` | `3001` | Hardcoded |
| `JWT_SECRET` | Auto-generated | Render manages this |
| `DATABASE_URL` | `/tmp/sqlite.db` | Ephemeral on free tier |
| `ML_ENGINE_URL` | Auto-wired from `prospectusiq-ml` | Set automatically by blueprint |
| `INTERNAL_SERVICE_TOKEN` | Auto-generated | Shared with ML service |

### `prospectusiq-ml`

| Key | Source | Notes |
|---|---|---|
| `GEMINI_API_KEY` | **Manual** | Must set in Render dashboard |
| `INTERNAL_SERVICE_TOKEN` | Synced from backend | Set automatically by blueprint |
| `HF_HOME` | `/tmp/hf_cache` | Ephemeral |
| `TRANSFORMERS_CACHE` | `/tmp/hf_cache` | Ephemeral |
| `SENTENCE_TRANSFORMERS_HOME` | `/tmp/hf_cache` | Ephemeral |
| `PYTHONUNBUFFERED` | `1` | Ensures logs stream in real time |

---

## Troubleshooting

**Build fails on ML service**
- Check that `ml/ai-engine/requirements.txt` exists
- Ensure `ml/scripts/build_faiss_index.py` path is correct relative to repo root

**Backend can't reach ML engine**
- `ML_ENGINE_URL` is auto-set to the ML service hostname by the blueprint
- The backend prepends `https://` automatically if the URL has no scheme
- Verify both services are in the same Render region

**`GEMINI_API_KEY` not set error**
- Go to Render dashboard → `prospectusiq-ml` → Environment → set `GEMINI_API_KEY`
- Trigger a manual redeploy after saving

**Frontend shows CORS errors**
- Confirm `VITE_API_BASE_URL` in Vercel points to the correct backend URL (no trailing slash)
- Ensure the backend's CORS config allows your Vercel domain
