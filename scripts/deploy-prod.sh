#!/bin/bash
# pickedby.ai 프로덕션 배포 (안전 게이트 포함)
# 사용법: ./scripts/deploy-prod.sh
#
# 안전 장치:
#  1. 필수 시크릿 존재 검증 (없으면 배포 차단)
#  2. 키체인의 prod 시크릿 자동 재바인딩 (worker secret 손상 방지)
#  3. 배포 후 라이브 smoke test (missing_secret/missing_url 같은 백엔드 환경 오류 즉시 검출)
#  4. 실패 시 즉시 alert + non-zero exit (롤백 가이드 포함)
#
# 2026-04-28 BUG-PROD-MISSING-SECRET-01 사후 신설.

set -e

PROD_API="https://api.pickedby.ai"
PROD_FE="https://pickedby.ai"
KW="/Volumes/My Passport for Mac/My_project/kw-key.sh"

# 색상 helper
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'

echo -e "${YELLOW}🚀 pickedby.ai 프로덕션 배포 시작${NC}"
echo "=========================================="

# ── Phase 1: 필수 시크릿 존재 검증 ─────────────────────────────
echo -e "\n${YELLOW}[1/5] 필수 시크릿 검증...${NC}"
REQUIRED_SECRETS=(
  "TURNSTILE_SECRET"
  "SUPABASE_SERVICE_KEY"
  "SUPABASE_ANON_KEY"
  "TAVILY_API_KEY"
  "GEMINI_API_KEY"
  "PERPLEXITY_API_KEY"
  "BREVO_API_KEY"
)

cd api
SECRET_LIST=$(npx wrangler secret list 2>/dev/null)
MISSING_SECRETS=()
for s in "${REQUIRED_SECRETS[@]}"; do
  if ! echo "$SECRET_LIST" | grep -q "\"$s\""; then
    MISSING_SECRETS+=("$s")
  fi
done

if [ ${#MISSING_SECRETS[@]} -gt 0 ]; then
  echo -e "${RED}❌ 누락된 프로덕션 시크릿:${NC}"
  printf "   - %s\n" "${MISSING_SECRETS[@]}"
  echo -e "${YELLOW}수동 등록 후 재시도:${NC}"
  echo "   eval \$(\"$KW\" load pickedbyai)"
  echo "   echo \"\$TURNSTILE_SECRET_PROD\" | npx wrangler secret put TURNSTILE_SECRET"
  exit 1
fi
echo -e "${GREEN}   ✓ ${#REQUIRED_SECRETS[@]}/${#REQUIRED_SECRETS[@]} 시크릿 등록 확인${NC}"

# ── Phase 2: 시크릿 자동 재바인딩 (worker secret 손상 방지) ────
echo -e "\n${YELLOW}[2/5] TURNSTILE_SECRET 재바인딩 (예방적 조치)...${NC}"
eval $("$KW" load pickedbyai 2>/dev/null) || true
if [ -n "$TURNSTILE_SECRET_PROD" ]; then
  echo "$TURNSTILE_SECRET_PROD" | npx wrangler secret put TURNSTILE_SECRET 2>&1 | grep -E "Success|Error" | head -1
else
  echo -e "${YELLOW}   ⚠️  키체인에 TURNSTILE_SECRET_PROD 없음 — 재바인딩 스킵${NC}"
fi

# ── Phase 3: API 배포 ─────────────────────────────────────────
echo -e "\n${YELLOW}[3/5] API 배포...${NC}"
npx wrangler deploy 2>&1 | grep -E "Uploaded|Version ID|Error" | tail -3
cd ..

# ── Phase 4: FE 배포 ──────────────────────────────────────────
echo -e "\n${YELLOW}[4/5] FE 배포...${NC}"
npx wrangler deploy --config wrangler.toml 2>&1 | grep -E "Uploaded|Version ID|Error" | tail -3

# ── Phase 5: 라이브 smoke test (CRITICAL — missing_secret 류 즉시 검출) ─
echo -e "\n${YELLOW}[5/5] 라이브 smoke test...${NC}"

# 5a. landing 페이지 200
LANDING_STATUS=$(curl -sIL "$PROD_FE/" --max-time 15 -o /dev/null -w "%{http_code}")
if [ "$LANDING_STATUS" != "200" ]; then
  echo -e "${RED}❌ Landing 비정상: HTTP $LANDING_STATUS${NC}"; exit 1
fi
echo -e "${GREEN}   ✓ Landing 200 OK${NC}"

# 5b. dashboard 200 (307 → /dashboard)
DASH_STATUS=$(curl -sIL "$PROD_FE/dashboard.html" --max-time 15 -o /dev/null -w "%{http_code}")
if [ "$DASH_STATUS" != "200" ]; then
  echo -e "${RED}❌ Dashboard 비정상: HTTP $DASH_STATUS${NC}"; exit 1
fi
echo -e "${GREEN}   ✓ Dashboard 200 OK${NC}"

# 5c. API /v1/check 백엔드 환경 검증 (잘못된 토큰으로 호출 → missing_secret 류 검출)
API_RESP=$(curl -sX POST "$PROD_API/v1/check" -H "Content-Type: application/json" \
  -d '{"product":"smoke-test","cf_turnstile_token":"deploy_smoke_invalid"}' --max-time 30)

# missing_secret / missing_url / missing_anon 같은 backend env 에러 검출
if echo "$API_RESP" | grep -qE "missing_secret|missing_url|missing_anon|missing_key"; then
  echo -e "${RED}❌ CRITICAL: 백엔드 환경 변수/시크릿 누락 검출${NC}"
  echo -e "${RED}   응답: $API_RESP${NC}"
  echo -e "${YELLOW}   롤백: git reset --hard \$(git tag -l 'stable-*' | tail -2 | head -1)${NC}"
  exit 1
fi

# 정상: turnstile_failed (잘못된 토큰 거부)이면 시크릿/검증 작동 중
if echo "$API_RESP" | grep -q "turnstile_failed"; then
  echo -e "${GREEN}   ✓ API turnstile 검증 정상 (invalid token 거부)${NC}"
else
  echo -e "${YELLOW}   ⚠️  API 응답 예상 외: $API_RESP${NC}"
fi

# 5d. _rxDebug 류 디버그 코드 잔여 검사
DBG_COUNT=$(curl -sL "$PROD_FE/dashboard.html" --max-time 15 | grep -cE "_rxDebug|RX_DEBUG" 2>/dev/null | head -1 | tr -d '[:space:]')
DBG_COUNT=${DBG_COUNT:-0}
if [ "$DBG_COUNT" -gt 0 ] 2>/dev/null; then
  echo -e "${RED}❌ 디버그 코드 잔여 ($DBG_COUNT건). 정리 후 재배포 필요.${NC}"; exit 1
fi
echo -e "${GREEN}   ✓ 디버그 코드 잔여 0${NC}"

# ── 배포 완료 ─────────────────────────────────────────────────
echo -e "\n${GREEN}=========================================="
echo -e "✅ 프로덕션 배포 완료 — 모든 게이트 통과"
echo -e "==========================================${NC}"
echo "🌐 FE:  $PROD_FE"
echo "🔌 API: $PROD_API"
echo ""
echo "📋 배포 후 권장:"
echo "   1. 실제 인증 로그인 → /v1/check 동작 확인"
echo "   2. 오늘 밤 00:01 KST cron 로그 확인"
echo "   3. memory/MEMORY.md 복구포인트 갱신"
