# Production Deployment

IntellMeet ships two OCI images:
- `ghcr.io/<owner>/intellmeet-api`
- `ghcr.io/<owner>/intellmeet-web`

The frontend is built with `VITE_API_BASE_URL=/api`, allowing the Ingress to serve the web UI and API from one origin. This is compatible with the HttpOnly refresh-cookie design and avoids production CORS drift.

## Kubernetes/Helm

The chart lives in `deploy/helm/intellmeet`.

It provides:
- two backend replicas
- two frontend replicas
- rolling updates with `maxUnavailable: 0`
- liveness/readiness probes
- backend CPU HPA
- PodDisruptionBudgets
- Ingress routing for `/`, `/api`, and `/socket.io`
- external Secret reference; no credentials are committed

Before deploying, create the `intellmeet-secrets` Secret with at least:
- `MONGODB_URI`
- `REDIS_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `GROQ_API_KEY`

Optional: `GOOGLE_CLIENT_ID`.

## GitHub production environment

Configure:
- secret `KUBE_CONFIG_B64`: base64-encoded kubeconfig with least-privilege access to the deployment namespace.
- variable `PROD_HOST`: public hostname.

Publish images after merging/releasing to `main`, then manually run **Deploy Production** with the exact immutable `sha-<commit>` tag.

The Helm command uses `--atomic`; a failed rollout rolls back instead of leaving a half-deployed release.

## What this repository does not prove

The chart is deployment-ready, but a public production deployment cannot be claimed until a real cluster, DNS/TLS, managed MongoDB/Redis, secrets, and provider credentials are configured and the rollout is successfully exercised.
