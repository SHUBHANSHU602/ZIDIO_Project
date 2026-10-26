# Observability

## Logs
Requests receive or generate an `X-Request-Id`. Structured Pino logs include route, status, latency, request ID and authenticated user ID when available. Secrets and auth fields are redacted.

## Health
- `GET /health`: process liveness only.
- `GET /ready`: MongoDB/Redis readiness.
- Docker healthcheck uses liveness so dependency outages do not cause restart loops.

## Metrics
`GET /metrics` exposes Prometheus metrics, including:
- HTTP request count
- request latency histogram
- process/runtime default metrics

A production Prometheus instance can scrape this endpoint and Grafana can visualize/alert on it.
