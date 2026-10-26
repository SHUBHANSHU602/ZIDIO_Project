import { z } from "zod";
import { objectId } from "./common.js";

export const workspaceIdParams = z.object({ id: objectId }).strict();
export const workspaceMemberParams = z.object({ id: objectId, memberId: objectId }).strict();
export const workspaceKanbanParams = z.object({
  id: objectId,
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
}).strict();

export const createWorkspaceBody = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().max(1000).optional(),
}).strict();

export const updateWorkspaceBody = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  description: z.string().trim().max(1000).optional(),
}).strict().refine((value) => Object.keys(value).length > 0, "at least one field is required");

export const addWorkspaceMemberBody = z.object({
  email: z.string().trim().email().max(254),
}).strict();

export const reorderKanbanBody = z.object({
  taskIds: z.array(objectId).max(500),
}).strict();

export const noteParams = z.object({ meetingId: objectId }).strict();
export const updateNoteBody = z.object({
  content: z.string().max(100000),
  revision: z.number().int().min(0),
}).strict();
