# IntellMeet

IntellMeet is an AI-powered meeting and collaboration platform built as a production-style MERN internship project.

It combines secure authentication, meeting/workspace management, real-time collaboration, WebRTC signaling, verified recording uploads, AI transcription and meeting intelligence, action-item tracking, post-meeting dashboards, analytics, observability, security controls, and container/Kubernetes delivery.

> **Evidence policy:** this repository distinguishes implemented capability from deployment or scale claims. Kubernetes delivery, load-test scripts, and security-scan tooling are included, but no public production URL or 5,000-participant/10,000-meeting benchmark is claimed until it is exercised against real infrastructure.

## Product flow

```text
Register / sign in
        ↓
Create workspace + invite existing users
        ↓
Create meeting
        ↓
Authenticated Socket.io room
        ↓
Chat / presence / WebRTC signaling
        ↓
Host records meeting → verified Cloudinary upload
        ↓
Groq transcription
        ↓
Validated summary + decisions + action items
        ↓
Post-meeting dashboard
        ↓
Kanban + analytics
```

## Architecture

```text
React + TypeScript + Vite
          │
          │ HTTPS / Socket.io
          ▼
Node.js + Express + Socket.io
   │          │           │
   │          │           └── Groq: transcription + structured intelligence
   │          └── Redis: cache + Socket.io multi-instance adapter
   ├── MongoDB: durable product state
   └── Cloudinary: direct signed recording/media uploads

Production packaging:
Nginx frontend image + Node API image → GHCR → Kubernetes/Helm
```

See [Architecture](docs/ARCHITECTURE.md) for component and trust-boundary details.

## Implemented capabilities

| Area | Implementation |
| --- | --- |
| Authentication | Email/password, optional Google OIDC, short-lived JWT access tokens, rotating hashed refresh sessions, HttpOnly refresh cookie, logout-all |
| Authorization | Workspace/team membership, meeting host/participant rules, task/action-item invariants |
| Validation | Zod schemas, ObjectId/date/enum bounds, unknown-field rejection, unsafe operator/dotted/prototype-key rejection |
| Meetings | CRUD, lifecycle transitions, participants, caching |
| Workspaces | Workspace facade over Team, membership, descriptions |
| Tasks/Kanban | Task CRUD, assignees, statuses, stable column positions/reordering |
| Shared notes | Meeting notes with optimistic revision control |
| Realtime | Authenticated Socket.io rooms, presence, typing, persisted chat, Redis adapter |
| WebRTC | Authorized offer/answer/ICE signaling and media-state events |
| Recordings | Host-only signed Cloudinary uploads, server-side asset verification, metadata persistence/deletion |
| AI transcription | Provider abstraction with Groq demo adapter and timestamped transcript segments |
| AI intelligence | Strict structured summary, decisions, action-item extraction; no guessed user assignment |
| Post-meeting | Aggregate dashboard for transcript, insight, action items, recordings, notes, activity |
| Analytics | Persisted meeting/action data only; no fabricated productivity metrics |
| Observability | Pino JSON logs, request IDs, Prometheus metrics, liveness/readiness |
| Security | Helmet, CORS allowlist, API/auth rate limits, JWT/session hardening, npm audit CI, ZAP script |
| Delivery | Backend/frontend Docker images, GHCR workflow, Helm chart, probes, HPA, PDB, atomic deployment workflow |

## Repository layout

```text
.
├── IntellMeet-Frontend/       React + TypeScript + Vite client
├── server/                    Express API, Socket.io and AI integrations
├── deploy/helm/intellmeet/    Kubernetes Helm chart
├── load/                      k6 load-test profiles
├── security/                  OWASP ZAP staging scan script
├── docs/
│   ├── engineering/           implementation notes
│   └── operations/            deployment operations
└── .github/workflows/         CI, security, image delivery and deployment
```

## Local development

### Prerequisites

- Node.js 20+
- MongoDB
- Redis
- Cloudinary account for recording/media features
- Groq API key for transcription/meeting intelligence
- optional Google OAuth client ID

### Backend

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

The API defaults to `http://localhost:5000`.

### Frontend

```bash
cd IntellMeet-Frontend
cp .env.example .env
npm ci
npm run dev
```

The frontend defaults to `http://localhost:5173`.

### Minimum local environment

```env
MONGODB_URI=mongodb://127.0.0.1:27017/intellmeet
REDIS_URL=redis://127.0.0.1:6379
CLIENT_ORIGIN=http://localhost:5173

JWT_ACCESS_SECRET=<32+ random characters>
JWT_REFRESH_SECRET=<different 32+ random characters>
```

Cloudinary/Groq values can be added when exercising media and AI flows. Never commit real secrets.

## Quality gates

Backend PRs run:
- ESLint
- Node tests
- backend Docker image build

Frontend PRs run:
- TypeScript build
- Vite production build

Security CI runs:
- backend dependency audit at critical severity
- frontend dependency audit at critical severity

Deployment CI runs:
- Helm lint
- manifest rendering
- production frontend Docker image build

## Operations endpoints

- `GET /health` — process liveness
- `GET /ready` — MongoDB/Redis readiness
- `GET /metrics` — Prometheus metrics

## Testing and verification

```bash
cd server
npm run lint
npm test
```

Load smoke test:

```bash
BASE_URL=https://staging-api.example.com k6 run load/k6-smoke.js
```

OWASP ZAP baseline:

```bash
./security/zap-baseline.sh https://staging-api.example.com
```

These scripts are verification tools. Their existence is **not** presented as benchmark evidence.

## Deployment

The Helm chart supports:
- two API replicas and two frontend replicas by default
- `maxUnavailable: 0` rolling updates
- API readiness/liveness probes
- frontend health probes
- backend CPU autoscaling
- PodDisruptionBudgets
- same-origin routing for `/`, `/api`, and `/socket.io`
- externally managed application secrets
- atomic Helm upgrade/rollback

See [Production Deployment](docs/operations/deployment.md).

## Evaluator resources

- [Architecture](docs/ARCHITECTURE.md)
- [API Reference](docs/API_REFERENCE.md)
- [Demo Runbook](docs/DEMO_RUNBOOK.md)
- [Evaluation Checklist](docs/EVALUATION_CHECKLIST.md)
- [Security & Load Testing](docs/engineering/security-testing.md)

## Known limitations

- A real public deployment is not established by this repository alone; cluster credentials, DNS/TLS, managed MongoDB/Redis and provider secrets are external.
- WebRTC signaling is implemented, but reliable internet-wide media connectivity requires a production STUN/TURN service and browser meeting-room integration.
- AI provider execution requires valid Groq credentials. Cloudinary media verification requires valid Cloudinary credentials.
- AI processing currently runs synchronously in the API process; high-volume production should move provider work to a durable background queue/worker.
- The repository does not claim the internship brief's 500–5,000 participant, 10k concurrent meeting, <200 ms or 99.95% targets without measured staging evidence.

## Git workflow

```text
feature/* / fix/* / refactor/* / test/* / docs/*
                         ↓
                      develop
                         ↓
                 release verification
                         ↓
                       main
```

Implementation work is merged through PRs after green CI.
