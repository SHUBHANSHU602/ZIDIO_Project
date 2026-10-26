import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../src/app.js";

const app=createApp();

test("health endpoint returns liveness and a request id",async()=>{
  const response=await request(app).get("/health");
  assert.equal(response.status,200);
  assert.equal(response.body.status,"ok");
  assert.ok(response.headers["x-request-id"]);
});

test("metrics endpoint exposes Prometheus text",async()=>{
  const response=await request(app).get("/metrics");
  assert.equal(response.status,200);
  assert.match(response.text,/intellmeet_http_requests_total|intellmeet_process_/);
});
