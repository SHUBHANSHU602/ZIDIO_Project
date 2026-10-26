import { Router } from "express";
import { addMember, create, get, list, removeMember, update } from "../controllers/workspaceController.js";
import { getBoard, reorder } from "../controllers/kanbanController.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  addWorkspaceMemberBody,
  createWorkspaceBody,
  reorderKanbanBody,
  updateWorkspaceBody,
  workspaceIdParams,
  workspaceKanbanParams,
  workspaceMemberParams,
} from "../validation/workspaceSchemas.js";

const router = Router();
router.use(requireAuth);
router.post("/", validate({ body:createWorkspaceBody }), create);
router.get("/", list);
router.get("/:id", validate({ params:workspaceIdParams }), get);
router.patch("/:id", validate({ params:workspaceIdParams, body:updateWorkspaceBody }), update);
router.post("/:id/members", validate({ params:workspaceIdParams, body:addWorkspaceMemberBody }), addMember);
router.delete("/:id/members/:memberId", validate({ params:workspaceMemberParams }), removeMember);
router.get("/:id/kanban", validate({ params:workspaceIdParams }), getBoard);
router.put("/:id/kanban/:status", validate({ params:workspaceKanbanParams, body:reorderKanbanBody }), reorder);

export default router;
