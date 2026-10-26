import mongoose from "mongoose";
import { getRedisClient } from "../config/redis.js";

export function getLiveness() {
  return { status:"ok", service:"intellmeet-api", uptimeSeconds:Math.round(process.uptime()) };
}

export async function getReadiness() {
  const mongoReady=mongoose.connection.readyState===1;
  const redis=getRedisClient();
  let redisReady=!process.env.REDIS_URL;

  if(redis){
    try{
      redisReady=(await redis.ping())==="PONG";
    }catch{
      redisReady=false;
    }
  }

  return {
    ready:mongoReady&&redisReady,
    dependencies:{
      mongodb:mongoReady?"ready":"unavailable",
      redis:redisReady?"ready":"unavailable",
    },
  };
}
