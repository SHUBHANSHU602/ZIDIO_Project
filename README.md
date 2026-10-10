# IntellMeet — ZIDIO Project

IntellMeet is an AI-powered enterprise meeting and collaboration platform being built as a team internship project.

## Team architecture

The codebase is organized so that each team member can own a clear subsystem:

- **Backend & Data** — Node.js, Express, MongoDB, Redis, authentication, REST APIs, validation and security.
- **Frontend & UX** — React, TypeScript, Vite and product UI.
- **Real-Time Systems** — Socket.io and WebRTC meeting collaboration.
- **AI Intelligence** — transcription, summaries and action-item extraction.

## Branching model

- `main` — stable/release-ready code.
- `develop` — integration branch.
- `feature/*` — isolated feature work merged into `develop` through pull requests.

The backend foundation is being developed incrementally with small, reviewable commits and automated CI checks.
