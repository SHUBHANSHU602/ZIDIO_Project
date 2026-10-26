# Collaboration and Workspace Model

IntellMeet treats the existing Team aggregate as the persisted workspace boundary. This avoids maintaining duplicate membership/authorization systems.

## Workspace API

`/api/workspaces` provides:
- create/list/get/update workspace
- owner-controlled membership
- Kanban board read/reorder

The legacy `/api/teams` endpoints remain compatible.

## Kanban

Tasks have a numeric `position` within one of three states:
- TODO
- IN_PROGRESS
- DONE

Column reorder requests validate every task belongs to the workspace before updating state/order.

## Shared meeting notes

Each meeting has at most one shared note document. Updates use optimistic concurrency:
- client reads `revision`
- client sends the same revision on update
- server increments it atomically
- stale edits receive HTTP 409 with the current revision

This prevents silent last-write-wins data loss during concurrent collaboration.
