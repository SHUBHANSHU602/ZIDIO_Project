import { getMeetingNote, updateMeetingNote } from "../services/meetingNoteService.js";

export async function get(req,res,next){try{res.json({success:true,data:await getMeetingNote(req.auth.userId,req.params.meetingId)});}catch(e){next(e);}}
export async function update(req,res,next){try{res.json({success:true,data:await updateMeetingNote(req.auth.userId,req.params.meetingId,req.body)});}catch(e){next(e);}}
