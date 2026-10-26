import crypto from "node:crypto";
import { logger } from "../observability/logger.js";
import { httpDuration, httpRequests } from "../observability/metrics.js";

function normalizeRoute(req) {
  return req.route?.path
    ? `${req.baseUrl || ""}${req.route.path}`
    : req.path || "unknown";
}

export function requestContext(req,res,next) {
  const incoming=req.get("x-request-id");
  req.requestId=typeof incoming==="string"&&incoming.length<=128?incoming:crypto.randomUUID();
  res.setHeader("X-Request-Id",req.requestId);

  const started=process.hrtime.bigint();
  res.on("finish",()=>{
    const route=normalizeRoute(req);
    const duration=Number(process.hrtime.bigint()-started)/1e9;
    const labels={method:req.method,route,status:String(res.statusCode)};
    httpRequests.inc(labels);
    httpDuration.observe(labels,duration);

    const level=res.statusCode>=500?"error":res.statusCode>=400?"warn":"info";
    logger[level]({
      requestId:req.requestId,
      method:req.method,
      route,
      statusCode:res.statusCode,
      durationMs:Math.round(duration*1000),
      userId:req.auth?.userId,
    },"http_request");
  });

  next();
}
