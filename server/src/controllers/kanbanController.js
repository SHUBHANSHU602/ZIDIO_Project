import { getKanbanBoard, reorderKanbanColumn } from "../services/kanbanService.js";

export async function getBoard(req,res,next){try{res.json({success:true,data:await getKanbanBoard(req.auth.userId,req.params.id)});}catch(e){next(e);}}
export async function reorder(req,res,next){try{res.json({success:true,data:await reorderKanbanColumn(req.auth.userId,req.params.id,req.params.status,req.body.taskIds)});}catch(e){next(e);}}
