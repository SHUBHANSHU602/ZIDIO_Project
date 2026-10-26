#!/usr/bin/env sh
set -eu

TARGET_URL="${1:-}"
if [ -z "$TARGET_URL" ]; then
  echo "Usage: ./security/zap-baseline.sh https://staging-api.example.com"
  exit 2
fi

docker run --rm -t \
  -v "$(pwd)/security:/zap/wrk/:rw" \
  ghcr.io/zaproxy/zaproxy:stable \
  zap-baseline.py -t "$TARGET_URL" -r zap-report.html
