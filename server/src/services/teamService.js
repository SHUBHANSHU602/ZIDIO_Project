import mongoose from "mongoose";
import { Team } from "../models/Team.js";
import { User } from "../models/User.js";
import { HttpError } from "../utils/httpError.js";

function assertId(id, label = "id") {
  if (!mongoose.isValidObjectId(id)) throw new HttpError(400, `Invalid ${label}`);
}

export async function createTeam(ownerId, payload) {
  const team = await Team.create({
    name: payload.name?.trim(),
    owner: ownerId,
    members: [ownerId],
  });
  return team.populate("members", "name email role");
}

export async function getTeamForMember(teamId, userId) {
  assertId(teamId, "team id");
  const team = await Team.findOne({
    _id: teamId,
    $or: [{ owner: userId }, { members: userId }],
  }).populate("members", "name email role");

  if (!team) throw new HttpError(404, "Team not found");
  return team;
}

export async function addTeamMember(teamId, ownerId, email) {
  assertId(teamId, "team id");
  const team = await Team.findOne({ _id: teamId, owner: ownerId });
  if (!team) throw new HttpError(404, "Team not found or you are not the owner");

  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user) throw new HttpError(404, "User not found");

  if (!team.members.some((memberId) => memberId.equals(user._id))) {
    team.members.push(user._id);
    await team.save();
  }

  return team.populate("members", "name email role");
}
