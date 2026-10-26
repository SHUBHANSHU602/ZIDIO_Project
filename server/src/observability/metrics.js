import client from "prom-client";

export const registry = new client.Registry();
client.collectDefaultMetrics({ register: registry, prefix: "intellmeet_" });

export const httpRequests = new client.Counter({
  name: "intellmeet_http_requests_total",
  help: "HTTP requests processed by IntellMeet",
  labelNames: ["method", "route", "status"],
  registers: [registry],
});

export const httpDuration = new client.Histogram({
  name: "intellmeet_http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status"],
  buckets: [0.01,0.025,0.05,0.1,0.25,0.5,1,2,5],
  registers: [registry],
});

export async function metricsResponse() {
  return registry.metrics();
}

export const metricsContentType = registry.contentType;
