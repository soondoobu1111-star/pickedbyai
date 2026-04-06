#!/bin/bash
# pickedby.ai 스테이징 배포
# 사용법: ./scripts/deploy-staging.sh

set -e

STAGING_API="https://pickedbyai-api-staging.perceptdot.workers.dev"
LANDING_DIR="landing"
STAGING_DIR="/tmp/pickedbyai-staging-landing"

echo "🚀 pickedby.ai staging 배포 시작..."

# 1. landing 임시 복사 + API URL 교체
rm -rf "$STAGING_DIR"
cp -r "$LANDING_DIR" "$STAGING_DIR"
find "$STAGING_DIR" -name "*.html" -exec sed -i '' \
  "s|https://api.pickedby.ai|$STAGING_API|g" {} \;
find "$STAGING_DIR" -name "*.html" -exec sed -i '' \
  "s|https://pickedbyai-api.pickedby.ai|$STAGING_API|g" {} \;

echo "✅ API URL 교체 완료 → $STAGING_API"

# 2. Gemini Relay staging 배포
echo "📡 Gemini Relay staging 배포..."
cd gemini-relay && npx wrangler deploy --env staging && cd ..

# 3. API staging 배포
echo "📡 API staging 배포..."
cd api && npx wrangler deploy --env staging && cd ..

# 4. FE staging 배포 (임시 디렉토리 사용)
echo "📡 FE staging 배포..."
cp wrangler.toml "$STAGING_DIR/wrangler.toml"
cd "$STAGING_DIR" && npx wrangler deploy --env staging 2>/dev/null || \
  (cd - && npx wrangler deploy --env staging --config wrangler.toml)
cd - > /dev/null

# 5. 정리
rm -rf "$STAGING_DIR"

echo ""
echo "✅ 스테이징 배포 완료!"
echo "🌐 FE: https://staging-0404.pickedby.ai"
echo "🔌 API: https://pickedbyai-api-staging.perceptdot.workers.dev"
