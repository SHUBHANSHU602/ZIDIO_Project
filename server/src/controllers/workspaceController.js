import {
  addWorkspaceMember,
  createWorkspace,
  getWorkspace,
  listWorkspaces,
  removeWorkspaceMember,
  updateWorkspace,
} from "../services/workspaceService.js";

export async function create(req,res,next){try{res.status(201).json({success:true,data:await createWorkspace(req.auth.userId,req.body)});}catch(e){next(e);}}
export async function list(req,res,next){try{res.json({success:true,data:await listWorkspaces(req.auth.userId)});}catch(e){next(e);}}
export async function get(req,res,next){try{res.json({success:true,data:await getWorkspace(req.auth.userId,req.params.id)});}catch(e){next(e);}}
export async function update(req,res,next){try{res.json({success:true,data:await updateWorkspace(req.auth.userId,req.params.id,req.body)});}catch(e){next(e);}}
export async function addMember(req,res,next){try{res.json({success:true,data:await addWorkspaceMember(req.auth.userId,req.params.id,req.body.email)});}catch(e){next(e);}}
export async function removeMember(req,res,next){try{res.json({success:true,data:await removeWorkspaceMember(req.auth.userId,req.params.id,req.params.memberId)});}catch(e){next(e);}}
