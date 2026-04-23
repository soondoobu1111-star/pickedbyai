# Domain Verification — 기획 스펙
> 작성일: 2026-04-15 | 상태: CEO 승인 완료
> 근거: 2026-04-15 CPO 전략 세션

---

## 1. 핵심 결정사항 (확정)

| 항목 | 결정 |
|------|------|
| 미리보기 | 유지 + 🔒 잠금 처리 |
| 서브도메인 | 추후 허용 (현재 보류) |
| 재확인 정책 | 구글 서치콘솔 동일 — 토큰 상시 유지 체크, 만료일 없음 |
| 무료 도메인 수 | 1개 |
| 소유자 확인 방식 | 메타태그 + JSON 둘 다 |
| SDK/llms.txt 단계 | 등록 플로우에서 제외 → 대시보드 배너로 |
| 기존 베타 유저 | 영향 없음 (1명, 그대로 진행) |

---

## 2. 최종 플로우

```
랜딩
 ├── [미리보기 검색] → 결과 + 🔒 소유자 전용 데이터 잠금 + CTA
 └── [Register Your Domain] 버튼
          │
          ▼
     STEP 1: 제품 등록
     제품명 + URL 입력
          │
          ▼
     STEP 2: 소유자 확인
     메타태그 탭 | JSON 파일 탭
     토큰 발급 → 설치 → "Verify Now" 클릭
     Worker가 도메인 fetch → 토큰 매칭
          │
          ├── 실패 → 에러 메시지 + 재시도
          │
          ▼ 성공
     대시보드 바로 진입 (전체 데이터 언락)
          │
          ▼ (배너)
     SDK 설치 권장 + llms.txt 권장
```

---

## 3. UI 상세

### 3-1. 미리보기 결과 (잠금 처리)

```
┌──────────────────────────────────────┐
│  notion   SEEN BY AI       70 /100   │
│  Web Presence              25/25 ✅  │
│  Source Authority          20/20 ✅  │
│  Recommendation Signals     7/20     │
│  ...                                 │
│  ─────────────────────────────────   │
│  🔒 OWNER-ONLY DATA                  │
│  Query Coverage              ---     │
│  co_recommendations          ---     │
│  Weekly Score Trend          ---     │
│  Improvement Guide TOP 3     ---     │
│  AI Referral Traffic         ---     │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ Is this your product?          │  │
│  │ Verify ownership → unlock all  │  │
│  │  [Register notion.so →]        │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

### 3-2. STEP 1 — 제품 등록

```
┌─────────────────────────────────────┐
│  Register Your Product              │
│  Step 1 of 2                        │
│                                     │
│  Product Name *                     │
│  [________________________]         │
│                                     │
│  Product URL *                      │
│  [https://________________]         │
│  ℹ️ Must be publicly accessible     │
│                                     │
│           [Continue →]              │
└─────────────────────────────────────┘
```

### 3-3. STEP 2 — 소유자 확인

```
┌─────────────────────────────────────┐
│  Verify Ownership                   │
│  Step 2 of 2                        │
│  notion.so                          │
│                                     │
│  [Meta Tag]  [JSON File]            │
│  ─────────────────────────────────  │
│                                     │
│  1. Add this tag to your <head>:    │
│  ┌─────────────────────────────┐   │
│  │<meta name="pickedby-site-   │   │
│  │verification"                │   │
│  │content="pba-a1b2c3d4ef"/>   │   │
│  └───────────────[📋 Copy]─────┘   │
│                                     │
│  2. Keep it on your site.           │
│     Removing it = access lost.      │
│                                     │
│  [← Back]        [Verify Now ✓]    │
│                                     │
│  ⚠️ Google-grade: token must remain │
└─────────────────────────────────────┘

JSON File 탭:
  Save to: https://notion.so/.well-known/pickedby.json
  Content: {"verification": "pba-a1b2c3d4ef"}
  [📋 Copy Content]
```

### 3-4. 대시보드 — SDK/llms.txt 배너

```
┌─────────────────────────────────────────────┐
│ 🚀 Track real AI referral traffic           │
│    Install SDK → See exactly how many       │
│    visitors came from ChatGPT, Perplexity   │
│                [Install SDK →]  [✕ Later]   │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ 📄 Help AI find your product                │
│    Add llms.txt → Guide AI crawlers         │
│                [Generate →]    [✕ Later]    │
└─────────────────────────────────────────────┘
```

---

## 4. DB 스키마 (신규)

```sql
-- domains 테이블
CREATE TABLE domains (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_name  TEXT NOT NULL,
  domain_url    TEXT NOT NULL,              -- 정규화: https://notion.so
  verification_token TEXT NOT NULL UNIQUE,  -- pba-{random 16chars}
  status        TEXT DEFAULT 'pending',     -- pending | verified | failed
  sdk_installed BOOLEAN DEFAULT false,
  llms_installed BOOLEAN DEFAULT false,
  verified_at   TIMESTAMPTZ,
  last_checked_at TIMESTAMPTZ,             -- 상시 체크 타임스탬프
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- RLS: 본인 도메인만 접근
ALTER TABLE domains ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own domains only" ON domains
  USING (user_id = auth.uid());
```

---

## 5. API 엔드포인트 (신규)

| Method | Path | 역할 |
|--------|------|------|
| POST | `/v1/domains/register` | 도메인 등록 + 토큰 발급 |
| POST | `/v1/domains/verify` | 소유자 확인 (Worker fetch) |
| GET | `/v1/domains/list` | 내 도메인 목록 |
| POST | `/v1/domains/recheck` | 토큰 재확인 (cron용) |

---

## 6. 소유자 확인 로직

```
Worker: POST /v1/domains/verify
  1. domains 테이블에서 token 조회
  2. fetch(domain_url) → HTML 파싱 → meta tag 확인
     OR fetch(domain_url + /.well-known/pickedby.json) → JSON 확인
  3. 성공: status = 'verified', verified_at = now()
  4. 실패: status = 'failed' + 에러 메시지 반환
```

---

## 7. 토큰 상시 체크 (구글 정책 준수)

```
Cron: 매일 1회 실행
  verified 도메인 전체 순회
  → 토큰 존재 여부 확인
  → 없으면 status = 'unverified' + 유저 이메일 알림
  → 7일 후에도 미복구 시 소유자 권한 만료
```

---

## 8. 대시보드 분기 로직

```javascript
// 검색 결과 표시 시
if (userOwnsDomain(result.domain)) {
  // 전체 데이터 표시 (쿼리 커버리지, co_rec, 트렌드, 개선가이드)
} else {
  // 기본 5개 차원 + 🔒 잠금 항목 (값 ---)
  // "Is this your product?" CTA 표시
}
```

---

## 9. 구현 순서 (우선순위)

| 순서 | 작업 | 파일 |
|------|------|------|
| 1 | DB: domains 테이블 마이그레이션 | Supabase SQL |
| 2 | API: /v1/domains/register + verify | api/src/index.ts |
| 3 | FE: 등록 플로우 (Step 1~2) | landing/register.html |
| 4 | FE: 미리보기 🔒 잠금 UI | landing/dashboard.html |
| 5 | FE: 대시보드 소유자/비소유자 분기 | landing/dashboard.html |
| 6 | FE: SDK/llms.txt 배너 | landing/dashboard.html |
| 7 | Cron: 토큰 상시 재확인 | api/src/index.ts |

---

*domain-verification-spec v1.0 — 2026-04-15 CEO 승인*
