import mongoose from "mongoose";
import { Team } from "../models/Team.js";
import { User } from "../models/User.js";
import { HttpError } from "../utils/httpError.js";

function assertId(id) {
  if (!mongoose.isValidObjectId(id)) throw new HttpError(400, "Invalid workspace id");
}

export async function createWorkspace(userId, payload) {
  return Team.create({
    name: payload.name.trim(),
    description: payload.description?.trim() ?? "",
    owner: userId,
    members: [userId],
  });
}

export async function listWorkspaces(userId) {
  return Team.find({ $or: [{ owner: userId }, { members: userId }] })
    .sort({ updatedAt: -1 })
    .populate("owner", "name email")
    .populate("members", "name email role");
}

export async function getWorkspace(userId, workspaceId) {
  assertId(workspaceId);
  const workspace = await Team.findOne({
    _id: workspaceId,
    $or: [{ owner: userId }, { members: userId }],
  })
    .populate("owner", "name email")
    .populate("members", "name email role");

  if (!workspace) throw new HttpError(404, "Workspace not found");
  return workspace;
}

export async function updateWorkspace(userId, workspaceId, payload) {
  assertId(workspaceId);
  const workspace = await Team.findOne({ _id: workspaceId, owner: userId });
  if (!workspace) throw new HttpError(403, "Only the workspace owner can edit the workspace");

  if (payload.name !== undefined) workspace.name = payload.name.trim();
  if (payload.description !== undefined) workspace.description = payload.description.trim();
  await workspace.save();
  return workspace;
}

export async function addWorkspaceMember(userId, workspaceId, email) {
  assertId(workspaceId);
  const workspace = await Team.findOne({ _id: workspaceId, owner: userId });
  if (!workspace) throw new HttpError(403, "Only the workspace owner can add members");

  const member = await User.findOne({ email: email.trim().toLowerCase() });
  if (!member) throw new HttpError(404, "User not found");

  await Team.updateOne({ _id: workspaceId }, { $addToSet: { members: member._id } });
  return getWorkspace(userId, workspaceId);
}

export async function removeWorkspaceMember(userId, workspaceId, memberId) {
  assertId(workspaceId);
  if (!mongoose.isValidObjectId(memberId)) throw new HttpError(400, "Invalid member id");

  const workspace = await Team.findOne({ _id: workspaceId, owner: userId });
  if (!workspace) throw new HttpError(403, "Only the workspace owner can remove members");
  if (String(workspace.owner) === String(memberId)) throw new HttpError(409, "Workspace owner cannot be removed");

  await Team.updateOne({ _id: workspaceId }, { $pull: { members: memberId } });
  return getWorkspace(userId, workspaceId);
}
