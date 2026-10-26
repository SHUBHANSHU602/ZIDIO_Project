# Post-Meeting Dashboard

The frontend calls:

`GET /api/meetings/:meetingId/post-meeting`

The backend performs one authorization check and returns an aggregate read model containing:
- meeting metadata and measured duration
- structured AI summary and decisions
- latest completed timestamped transcript
- action items
- verified recordings
- shared notes
- chat/activity counts

This keeps frontend rendering simple and avoids multiple inconsistent authorization paths across the same post-meeting screen.
