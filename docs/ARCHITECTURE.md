# IntellMeet Architecture

## System context

IntellMeet separates four concerns:

1. **Web client** — React/TypeScript renders authenticated product flows.
2. **Application API** — Express owns authorization, durable state, provider orchestration and HTTP read/write models.
3. **Realtime control plane** — Socket.io authenticates users, authorizes meeting rooms and relays collaboration/WebRTC signaling.
4. **External infrastructure** — MongoDB, Redis, Cloudinary, Groq and optional Google OIDC.

## Core request path

```text
HTTP request
  → request ID / metrics
  → Helmet + CORS
  → JSON size limit
  → global API rate limit
  → unsafe-key rejection
  → route auth
  → Zod/schema validation
  → controller
  → service authorization/business invariants
  → Mongoose persistence / Redis cache
```

Authorization is intentionally enforced in services so the same rules can be reused by HTTP handlers, Socket.io and future workers.

## Authentication

The browser receives a short-lived access token and keeps it in memory. The refresh token is sent only through an HttpOnly cookie.

Refresh sessions are stored independently per device/session:
- refresh token stored as bcrypt hash
- token rotates on refresh
- replay/mismatch revokes the session
- logout revokes one session
- logout-all revokes all sessions

Optional Google login verifies a Google ID token against the configured client ID.

## Domain model

### User
Identity, role and provider linkage.

### AuthSession
Per-login refresh-session state and revocation.

### Team / Workspace
One persisted membership boundary. The newer workspace API intentionally reuses Team instead of creating a second membership graph.

### Meeting
Host, workspace/team, participants, schedule and lifecycle.

Lifecycle:
```text
SCHEDULED → LIVE → ENDED
     └────────→ CANCELLED
```

### Task
Workspace-scoped work item used by the Kanban board.

### MeetingNote
One collaborative note document per meeting with optimistic `revision` conflict detection.

### ChatMessage
Persisted meeting chat.

### Recording
Cloudinary recording lifecycle: UPLOADING → READY / FAILED / DELETED.

### Transcript
Normalized provider transcription with timestamped segments.

### MeetingInsight
Validated AI summary, explicit decisions and generated action-item hints.

### ActionItem
Meeting follow-up state; AI-created action items never receive guessed assignees automatically.

## Realtime and WebRTC

Socket.io validates the access token before connection.

Joining a meeting:
1. verifies meeting state;
2. verifies host/participant/workspace membership;
3. adds the user to the participant set;
4. joins the Socket.io room;
5. emits presence data.

Chat is stored in MongoDB. Socket.io can use Redis adapter fan-out across Node instances.

WebRTC offer/answer/ICE messages are:
- accepted only from joined participants;
- relayed only to target sockets in the same room;
- size bounded and rate limited;
- never persisted.

Node is the signaling/control plane, not the audio/video media relay.

## Recording trust boundary

The browser never gets the Cloudinary API secret.

```text
host requests recording upload
  → backend creates Recording(UPLOADING)
  → backend signs exact public ID
  → browser uploads directly to Cloudinary
  → browser asks backend to finalize
  → backend queries Cloudinary itself
  → verified metadata persisted as READY
```

The client cannot finalize by submitting an arbitrary URL or fabricated byte/duration metadata.

## AI pipeline

```text
verified READY recording
      ↓
transcription provider adapter
      ↓
normalized Transcript
      ↓
meeting-intelligence provider adapter
      ↓
strict Zod output validation
      ↓
MeetingInsight + safe ActionItems
```

Groq is the current internship/demo adapter. Provider-specific transport lives below a factory so business services remain replaceable.

## Post-meeting read model

The post-meeting endpoint aggregates one authorization-checked view:
- meeting
- measured duration
- latest transcript
- AI insight
- action items
- recordings
- notes
- activity counts

This reduces frontend fan-out and avoids inconsistent access checks.

## Observability

Every request receives `X-Request-Id`. Structured Pino logs include method, normalized route, status and duration. Sensitive auth fields are redacted.

Prometheus exposes HTTP counters/histograms and Node process metrics.

`/health` is liveness; `/ready` represents dependency readiness.

## Deployment topology

```text
                     Ingress
                 /      |       \
                /api  /socket.io  /
                 |       |         |
              API service      Web service
                 |                 |
            API Deployment     Nginx Deployment
             2+ replicas        2 replicas
                 |
          MongoDB + Redis
                 |
        Cloudinary + Groq
```

The backend deployment uses zero-unavailable rolling updates, readiness/liveness probes, HPA and a PodDisruptionBudget.
