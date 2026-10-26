import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 20 },
    { duration: "60s", target: 50 },
    { duration: "30s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<500"],
  },
};

const base = __ENV.BASE_URL || "http://localhost:5000";

export default function () {
  const response = http.get(`${base}/health`);
  check(response, { "health is 200": (result) => result.status === 200 });
  sleep(1);
}
