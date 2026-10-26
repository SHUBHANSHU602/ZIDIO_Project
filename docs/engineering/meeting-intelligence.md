# Meeting Intelligence

A completed transcript can be converted into a structured meeting result:

- concise summary
- explicit decisions
- action items with optional owner/date hints

The AI response is parsed through a strict Zod schema before persistence. Unknown fields and malformed data are rejected.

## Action-item safety

AI output never assigns users by guessed names. Generated owner/date values are retained only as hints. Persisted `ActionItem` records are created with:
- `source=AI`
- no assignee
- no due date

A user can later confirm the correct assignee and due date through the ordinary authorization-checked action-item API.

## Idempotency

If the latest completed transcript has already produced a completed insight, the existing result is returned. A new transcript allows regeneration.

## Provider abstraction

The business service depends on a provider factory, not directly on Groq. Groq is the internship deployment adapter; another compatible provider can be added without changing controllers or persistence.
