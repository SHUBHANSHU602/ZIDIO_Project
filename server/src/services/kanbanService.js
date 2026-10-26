import mongoose from "mongoose";
import { Task } from "../models/Task.js";
import { HttpError } from "../utils/httpError.js";
import { requireTeamMembership } from "./teamService.js";

export const KANBAN_COLUMNS = ["TODO", "IN_PROGRESS", "DONE"];

export function normalizeBoardOrder(ids) {
  if (!Array.isArray(ids)) throw new HttpError(400, "taskIds must be an array");
  const seen = new Set();
  return ids.map((id, index) => {
    if (typeof id !== "string" || !mongoose.isValidObjectId(id)) throw new HttpError(400, "Invalid task id in board order");
    if (seen.has(id)) throw new HttpError(400, "Duplicate task id in board order");
    seen.add(id);
    return { id, position: index };
  });
}

export async function getKanbanBoard(userId, workspaceId) {
  await requireTeamMembership(workspaceId, userId);
  const tasks = await Task.find({ team: workspaceId })
    .sort({ status: 1, position: 1, createdAt: 1 })
    .populate("assignee", "name email")
    .populate("createdBy", "name email");

  return Object.fromEntries(
    KANBAN_COLUMNS.map((status) => [status, tasks.filter((task) => task.status === status)])
  );
}

export async function reorderKanbanColumn(userId, workspaceId, status, taskIds) {
  await requireTeamMembership(workspaceId, userId);
  if (!KANBAN_COLUMNS.includes(status)) throw new HttpError(400, "Invalid Kanban status");

  const order = normalizeBoardOrder(taskIds);
  const existing = await Task.find({ _id: { $in: order.map((entry) => entry.id) }, team: workspaceId });
  if (existing.length !== order.length) throw new HttpError(422, "All tasks must belong to this workspace");

  await Promise.all(order.map((entry) =>
    Task.updateOne({ _id: entry.id, team: workspaceId }, { $set: { status, position: entry.position } })
  ));

  return getKanbanBoard(userId, workspaceId);
}
