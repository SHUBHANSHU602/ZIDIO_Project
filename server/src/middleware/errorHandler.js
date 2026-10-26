import { logger } from "../observability/logger.js";
import { HttpError } from "../utils/httpError.js";

export function notFound(req, _res, next) {
  next(new HttpError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(error, req, res, _next) {
  if (error?.code === 11000) {
    return res.status(409).json({ success:false, error:"Resource already exists", requestId:req.requestId });
  }

  const status=error instanceof HttpError?error.status:500;
  const body={
    success:false,
    error:status===500?"Internal server error":error.message,
    requestId:req.requestId,
  };

  if(error instanceof HttpError&&error.details)body.details=error.details;

  if(status>=500){
    logger.error({
      requestId:req.requestId,
      err:{
        name:error?.name,
        message:error?.message,
        stack:process.env.NODE_ENV==="production"?undefined:error?.stack,
      },
    },"request_failed");
  }

  res.status(status).json(body);
}
