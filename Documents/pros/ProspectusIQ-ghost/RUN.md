# How to Run

### 1. Backend (Port 8000)
```bash
cd backend && npm install && npm run dev
```

### 2. ML AI Engine (Port 8001)
```bash
cd ml/ai-engine && uvicorn src.api.server:app --reload --port 8001
```

### 3. Frontend Portal (Port 3000)
```bash
cd frontend/portal && npm install && npm run dev
```
