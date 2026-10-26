# API Reference

Base path: `/api` unless otherwise noted.

Protected routes require:

```http
Authorization: Bearer <access-token>
```

Refresh uses the HttpOnly cookie rather than a JSON refresh token.

## System

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/health` | Process liveness |
| GET | `/ready` | MongoDB/Redis readiness |
| GET | `/metrics` | Prometheus metrics |

## Authentication

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/api/auth/register` | Local registration |
| POST | `/api/auth/login` | Local login |
| POST | `/api/auth/google` | Google OIDC ID-token login |
| POST | `/api/auth/refresh` | Rotate refresh session and issue access token |
| POST | `/api/auth/logout` | Revoke current refresh session |
| POST | `/api/auth/logout-all` | Revoke all user sessions |

## User

| Method | Path |
| --- | --- |
| GET | `/api/users/me` |
| PATCH | `/api/users/me` |

## Workspaces

The workspace API uses the same persisted Team membership boundary.

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/api/workspaces` | Create workspace |
| GET | `/api/workspaces` | List accessible workspaces |
| GET | `/api/workspaces/:id` | Read workspace |
| PATCH | `/api/workspaces/:id` | Owner edits workspace |
| POST | `/api/workspaces/:id/members` | Owner adds existing user by email |
| DELETE | `/api/workspaces/:id/members/:memberId` | Owner removes member |
| GET | `/api/workspaces/:id/kanban` | Get TODO/IN_PROGRESS/DONE board |
| PUT | `/api/workspaces/:id/kanban/:status` | Reorder one Kanban column |

Legacy team-compatible endpoints remain:
- `POST /api/teams`
- `GET /api/teams/:id`
- `POST /api/teams/:id/members`

## Meetings

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/api/meetings` | Create |
| GET | `/api/meetings` | List accessible meetings |
| GET | `/api/meetings/:id` | Read |
| PATCH | `/api/meetings/:id` | Host update/lifecycle transition |
| DELETE | `/api/meetings/:id` | Host delete non-live meeting |

## Tasks

| Method | Path |
| --- | --- |
| POST | `/api/tasks` |
| GET | `/api/tasks?team=:workspaceId` |
| PATCH | `/api/tasks/:id` |
| DELETE | `/api/tasks/:id` |

Task assignees must belong to the task workspace. Meeting references must belong to the same workspace.

## Meeting action items

| Method | Path |
| --- | --- |
| POST | `/api/meetings/:meetingId/action-items` |
| GET | `/api/meetings/:meetingId/action-items` |
| PATCH | `/api/action-items/:id` |

Client-created action items are forced to `source=MANUAL`. AI-created action items are created server-side.

## Chat history

| Method | Path |
| --- | --- |
| GET | `/api/meetings/:meetingId/messages` |

Realtime messages are sent over Socket.io and persisted before broadcast.

## Shared meeting notes

| Method | Path |
| --- | --- |
| GET | `/api/meetings/:meetingId/notes` |
| PUT | `/api/meetings/:meetingId/notes` |

Updates include the previously read integer `revision`; stale writes return 409.

## Media / recordings

Generic signed media endpoint:

| Method | Path |
| --- | --- |
| POST | `/api/media/signature` |

Meeting-scoped recording lifecycle:

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/api/meetings/:meetingId/recordings/upload` | Host creates signed upload |
| POST | `/api/meetings/:meetingId/recordings/:recordingId/complete` | Backend verifies Cloudinary asset |
| GET | `/api/meetings/:meetingId/recordings` | List meeting recordings |
| DELETE | `/api/meetings/:meetingId/recordings/:recordingId` | Host removes recording |

## Transcription

| Method | Path |
| --- | --- |
| POST | `/api/meetings/:meetingId/recordings/:recordingId/transcription` |
| GET | `/api/meetings/:meetingId/transcripts` |

Optional request body:

```json
{ "language": "en" }
```

## Meeting intelligence

| Method | Path |
| --- | --- |
| POST | `/api/meetings/:meetingId/intelligence` |
| GET | `/api/meetings/:meetingId/intelligence` |

Output contains validated `summary`, `decisions`, and generated action-item metadata.

## Post-meeting dashboard

| Method | Path |
| --- | --- |
| GET | `/api/meetings/:meetingId/post-meeting` |

Returns the aggregated post-meeting read model.

## Analytics

| Method | Path |
| --- | --- |
| GET | `/api/analytics` |

Metrics are derived from persisted meeting/action-item/AI records.

## Socket.io events

Client → server:
- `meeting:join`
- `meeting:leave`
- `chat:send`
- `typing:start`
- `typing:stop`
- `webrtc:offer`
- `webrtc:answer`
- `webrtc:ice-candidate`
- `media:state`

Server → client:
- `participant:joined`
- `participant:left`
- `chat:message`
- `typing:start`
- `typing:stop`
- `webrtc:offer`
- `webrtc:answer`
- `webrtc:ice-candidate`
- `media:state`
