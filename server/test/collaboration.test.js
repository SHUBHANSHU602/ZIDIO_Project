import test from "node:test";
import assert from "node:assert/strict";
import { normalizeBoardOrder } from "../src/services/kanbanService.js";

test("Kanban order assigns stable zero-based positions", () => {
  const ids=["507f1f77bcf86cd799439011","507f1f77bcf86cd799439012"];
  assert.deepEqual(normalizeBoardOrder(ids),[
    {id:ids[0],position:0},
    {id:ids[1],position:1},
  ]);
});

test("Kanban order rejects duplicate tasks", () => {
  const id="507f1f77bcf86cd799439011";
  assert.throws(()=>normalizeBoardOrder([id,id]));
});
