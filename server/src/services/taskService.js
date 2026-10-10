import mongoose from "mongoose";
import { Task } from "../models/Task.js";
import { Team } from "../models/Team.js";
import { HttpError } from "../utils/httpError.js";

function assertId(id, label = "id") {
  if (!mongoose.isValidObjectId(id)) throw new HttpError(400, `Invalid ${label}`);
}

async function requireTeamMembership(teamId, userId) {
  assertId(teamId, "team id");
  const member = await Team.exists({
    _id: teamId,
    $or: [{ owner: userId }, { members: userId }],
  });
  if (!member) throw new HttpError(403, "You do not have access to this team");
}

export async function createTask(userId, payload) {
  await requireTeamMembership(payload.team, userId);
  return Task.create({
    title: payload.title?.trim(),
    description: payload.description?.trim() ?? "",
    team: payload.team,
    meeting: payload.meeting ?? null,
    assignee: payload.assignee ?? null,
    createdBy: userId,
    dueAt: payload.dueAt ?? null,
  });
}

export async function listTasks(userId, teamId) {
  await requireTeamMembership(teamId, userId);
  return Task.find({ team: teamId })
    .sort({ createdAt: -1 })
    .populate("assignee", "name email")
    .populate("createdBy", "name email");
}

export async function updateTask(userId, taskId, payload) {
  assertId(taskId, "task id");
  const task = await Task.findById(taskId);
  if (!task) throw new HttpError(404, "Task not found");

  await requireTeamMembership(task.team, userId);
  const allowed = ["title", "description", "assignee", "status", "dueAt"];
  for (const key of allowed) {
    if (payload[key] !== undefined) task[key] = payload[key];
  }
  await task.save();
  return task;
}

export async function deleteTask(userId, taskId) {
  assertId(taskId, "task id");
  const task = await Task.findById(taskId);
  if (!task) throw new HttpError(404, "Task not found");

  await requireTeamMembership(task.team, userId);
  await task.deleteOne();
}
