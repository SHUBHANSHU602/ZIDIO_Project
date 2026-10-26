# Security and Load Testing

## Runtime hardening

- Helmet security headers.
- Strict CORS allowlist.
- Global API rate limit plus tighter authentication rate limits.
- 1 MB JSON body cap.
- Zod request validation.
- Rejection of Mongo operator, dotted and prototype-pollution keys before route logic.
- Short-lived access tokens and rotating hashed refresh sessions.
- Authorization at resource/service boundaries.

## Dependency scanning

Security CI installs and audits backend/frontend dependencies with `npm audit --audit-level=critical` on every pull request and push to `develop`.

High and moderate findings remain visible in audit output and must be triaged rather than hidden.

## Load smoke test

With k6 installed:

```bash
BASE_URL=https://staging-api.example.com k6 run load/k6-smoke.js
```

The committed smoke profile ramps to 50 virtual users and asserts less than 1% request failures and p95 below 500 ms for the liveness endpoint. It is a smoke baseline, not evidence for 5,000 participants.

## OWASP ZAP

Against a deployed staging API:

```bash
./security/zap-baseline.sh https://staging-api.example.com
```

The script writes `security/zap-report.html`. Do not run active scanning against production without explicit authorization.

## Claim discipline

The project must not claim 10k meetings, 5k participants, less than 200 ms latency, or 99.95% availability until repeatable staging measurements demonstrate those values.
