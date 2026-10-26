import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../src/app.js";

const app = createApp();

test("Helmet security headers are present", async () => {
  const response = await request(app).get("/health");
  assert.equal(response.status, 200);
  assert.ok(response.headers["content-security-policy"]);
  assert.equal(response.headers["x-content-type-options"], "nosniff");
});

test("unsafe Mongo-style operator keys are rejected before route logic", async () => {
  const response = await request(app)
    .post("/api/auth/login")
    .send({ email: { "$ne": null }, password: "StrongPass1" });

  assert.equal(response.status, 400);
  assert.equal(response.body.error, "Unsafe request key");
});
