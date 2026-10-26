# Demo Runbook

This runbook is designed to demonstrate implemented behavior without depending on unverified scale claims.

## 1. Start dependencies

Run MongoDB and Redis locally or configure managed URLs.

Prepare `server/.env` from `.env.example` with:
- MongoDB
- Redis
- JWT secrets

For the full media/AI demo also configure Cloudinary and Groq.

## 2. Start the application

Terminal A:

```bash
cd server
npm install
npm run dev
```

Terminal B:

```bash
cd IntellMeet-Frontend
npm ci
npm run dev
```

Open `http://localhost:5173`.

## 3. Authentication proof

1. Register a new user with a strong password.
2. Confirm the application opens the authenticated workspace UI.
3. Reload the browser.
4. The frontend restores the session through the HttpOnly refresh cookie.
5. Sign out and confirm the authenticated UI disappears.

Optional Google sign-in requires `GOOGLE_CLIENT_ID`.

## 4. Core product proof

1. Create a meeting from the UI.
2. Confirm it appears after refreshing—evidence it is persisted, not local fixture state.
3. Use a second account to demonstrate workspace membership where needed.
4. Exercise task/Kanban APIs or UI integration available in the current client.

## 5. Realtime proof

Use two authenticated clients and the same authorized meeting.

Demonstrate:
- room join authorization
- participant joined/left events
- chat broadcast and persisted chat history
- typing events

WebRTC signaling can be demonstrated with compatible browser clients. Internet-wide media reliability requires configured STUN/TURN infrastructure.

## 6. Recording proof

With Cloudinary configured:

1. Host requests a meeting recording upload.
2. Client uploads directly to the signed Cloudinary URL.
3. Complete the recording.
4. Backend verifies the expected Cloudinary public ID itself.
5. Confirm the recording becomes READY and is visible through the meeting recording/post-meeting APIs.

Do not demo by manually inserting a recording URL into MongoDB; that bypasses the feature's trust boundary.

## 7. AI proof

With Groq configured:

1. Trigger transcription for a READY recording.
2. Read timestamped transcript segments.
3. Trigger meeting intelligence.
4. Show the validated summary and explicit decisions.
5. Show AI action items created without guessed assignees.
6. Open **AI Notes** in the frontend and show the real persisted post-meeting result.

## 8. Analytics proof

Open **Analytics**.

Explain that values come from persisted:
- meeting lifecycle/timestamps
- AI insight records
- action-item completion

The UI intentionally does not show invented “hours saved.”

## 9. Operational proof

```bash
curl http://localhost:5000/health
curl http://localhost:5000/ready
curl http://localhost:5000/metrics
```

Show:
- request ID response header
- structured server logs
- Prometheus metrics

## 10. CI/CD proof

In GitHub Actions show successful runs for:
- Backend CI
- Frontend CI
- Security CI
- Deployment CI

Explain that image publishing is configured for `main`, while production Kubernetes deployment is a protected manual workflow requiring production environment credentials.

## Recommended demo narrative

Use one story:

> A team creates a workspace and meeting, collaborates in real time, records the session, converts the verified recording into a transcript, extracts decisions/actions, and tracks the result afterward.

This demonstrates architecture cohesion better than opening unrelated endpoints one-by-one.
