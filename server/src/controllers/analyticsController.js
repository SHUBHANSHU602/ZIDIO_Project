import { getUserAnalytics } from "../services/analyticsService.js";

export async function get(req,res,next){
  try{
    res.json({success:true,data:await getUserAnalytics(req.auth.userId)});
  }catch(error){
    next(error);
  }
}
