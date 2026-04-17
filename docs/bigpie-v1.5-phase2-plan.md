# 빅파이 1.5 Phase 2 · Story + MLP 리텐션 통합 UI 스프린트
> 작성: 2026-04-17 저녁 · CPO 주관
> 승인: CEO (2026-04-17 스토리+MLP+Context-Aware 통합 제안 승인)
> 롤백 포인트: `stable-20260417-pre-bigpie-p2-ui` (git tag)

---

## 0. 목표 (한 줄)
**오너가 매일 돌아올 이유를 가진 대시보드를 만든다.** 스토리 구조 + MLP 리텐션 7훅 + Context-Aware 분기를 2주 안에 스테이징까지.

## 1. 승인된 제약 조건
1. **DB 마이그레이션 선행** — 차트·Timeline·Milestone 전부 과거 데이터 필요.
2. **LLM 생성 제외** — Weekly Narrative / Action Items 전부 **규칙 기반 템플릿**.
3. **2주 2단계 스프린트** — Phase 1 (Foundation) + Phase 2 (Retention Hooks) 분할.

## 2. 최종 대시보드 구조 (CPO 추천 B안 · Context-Aware)

```
[유저 상태 감지] → 3분기
───────────────────────────────────────
① 신규 (로그인 전 or 제품 0개)
   → Check AI Visibility 풀사이즈 + Welcome Beta
   → "내 제품 등록하면 더 많은 정보" CTA

② 첫 체크 완료 (제품 1개, verified X)
   → 결과 카드 + "내 제품으로 등록" 유도 배너

③ 오너 (verified 제품 1+)
   → [오늘의 인사이트 카드] (Daily Pulse + Streak + 최근 Movement)
   → [My Products] 메인 (스토리 통합 확장 패널)
   → [Check AI Visibility] 접힘 (펼치기 버튼)
   → [Tools] 상단 노출
───────────────────────────────────────
```

## 3. My Products 확장 패널 통합 설계 (오너 전용)

```
┌──────────────────────────────────┐
│ 🔥 Streak 7일 · 🏆 3 Milestones  │ ← MLP 리텐션
├──────────────────────────────────┤
│ Hero's Arc ●━━○──○──○            │ ← 4단계 진행 바
│ EMERGING → STRONG +12점          │
├──────────────────────────────────┤
│ Weekly Narrative (규칙 기반 150자)│
│ + Action Items 3개 (체크박스)    │
├──────────────────────────────────┤
│ Daily Pulse 카드 (기존 재활용)   │
│ 4차원 + Pass Indicator + Grades  │
├──────────────────────────────────┤
│ 3탭 차트 [일 14d|주 12w|월 12mo] │ ← CHART-01
├──────────────────────────────────┤
│ Journey Timeline                  │
│ · 🏆 Apr 19 Emerging 진입        │
│ · 🎯 Apr 17 Perplexity 최초 인지 │
│ · 🌱 Apr 15 First Check          │
├──────────────────────────────────┤
│ [오너 전용 블록]                  │
│ Momentum / Co-mentions / Query   │
└──────────────────────────────────┘
```

## 4. Phase 1 (Week 1, Day 1-5) · Foundation

### Day 1 · DB 마이그레이션 (P0)
| 작업 | 파일 | 내용 |
|---|---|---|
| T1.1 | `docs/migrations/unified_v15_schema.sql` | `scores.unified_v15` JSONB column 추가 |
| T1.2 | `docs/migrations/user_events_schema.sql` | `user_events` 테이블 신설 (id, user_id, product_name, event_type, event_data, created_at) |
| T1.3 | 스테이징 Supabase 적용 | 수동 실행 + 검증 |
| T1.4 | `saveHistory`에 `unified_v15` 저장 추가 | `landing/dashboard.html` |
| T1.5 | `/v1/events` API 엔드포인트 (POST 이벤트 기록) | `api/src/index.ts` |

**완료 기준**: 스테이징에서 check 실행 시 `scores.unified_v15` JSONB 저장됨. `user_events` 조회 API 동작.

### Day 2-3 · Context-Aware 분기 로직 (P0)
| 작업 | 파일 | 내용 |
|---|---|---|
| T2.1 | 유저 상태 판정 함수 `getUserState()` | `landing/dashboard.html` |
| T2.2 | 상태별 레이아웃 분기 렌더링 | `landing/dashboard.html` |
| T2.3 | 오늘의 인사이트 카드 (Daily Pulse + Streak + Movement) | `landing/dashboard.html` |
| T2.4 | Check AI Visibility 접힘/펼침 UI | `landing/dashboard.html` |
| T2.5 | Tools 탭 상단 노출 | `landing/dashboard.html` |

**완료 기준**: 오너 로그인 시 My Products 먼저, 신규 유저 로그인 시 Check AI Visibility 먼저.

### Day 4-5 · My Products 스토리 통합 (P0)
| 작업 | 파일 | 내용 |
|---|---|---|
| T3.1 | `buildRowHtml` 확장 패널을 4차원 UI로 전환 | `landing/dashboard.html` |
| T3.2 | `renderDimRowV15` + `renderUnifiedExtras` 재활용 | `landing/dashboard.html` |
| T3.3 | Hero's Arc 진행 바 컴포넌트 | `landing/dashboard.html` |
| T3.4 | Journey Timeline 렌더링 (user_events 기반) | `landing/dashboard.html` |
| T3.5 | 오너 전용 블록 유지 (Momentum / Co-mentions / Query Coverage) | `landing/dashboard.html` |

**완료 기준**: My Products 확장 패널에 Check AI Visibility와 동등한 4차원 UI + Hero's Arc + Journey Timeline 표시.

## 5. Phase 2 (Week 2, Day 6-10) · Retention Hooks

### Day 6-7 · Milestones 규칙 엔진 (P1)
| 작업 | 파일 | 내용 |
|---|---|---|
| T4.1 | Milestone 타입 정의 (10종) | `api/src/milestones.ts` (신규) |
| T4.2 | 이벤트 디텍션 로직 (check 후 자동 기록) | `api/src/index.ts` |
| T4.3 | 기존 cron (02:00 UTC) 활용 일일 감지 | `api/src/index.ts` |
| T4.4 | `user_events` 자동 생성 | API |

**Milestone 10종 (초안, 규칙 기반)**:
1. `first_check` — 최초 체크
2. `first_tier1_source` — Tier-1 소스 최초 발견
3. `first_tier2_source` — Tier-2 소스 최초 발견
4. `emerging_reached` — Emerging 진입 (Score 40+)
5. `strong_reached` — Strong 진입 (Score 60+)
6. `picked_reached` — Picked 진입 (Score 80+)
7. `perplexity_recognized` — Perplexity 최초 인지
8. `gemini_recognized` — Gemini 최초 인지
9. `category_ranked` — 카테고리 랭킹 진입 (Top 10)
10. `co_mention_peer_5` — 공동 언급 제품 5개 누적

### Day 8 · Streak 시스템 (P1)
| 작업 | 파일 | 내용 |
|---|---|---|
| T5.1 | 유저 TZ 기반 Streak 계산 로직 | `landing/dashboard.html` |
| T5.2 | 10+ 타임존 경계 테스트 케이스 | `api/src/streak.test.ts` (신규) |
| T5.3 | UI 표시 (🔥 N일 연속) | 대시보드 상단 |

**완료 기준**: 자정 경계 + DST + UTC 변환 모든 케이스 통과.

### Day 9 · Weekly Narrative (규칙 기반 템플릿) (P1)
| 작업 | 파일 | 내용 |
|---|---|---|
| T6.1 | 주간 데이터 집계 함수 | `landing/dashboard.html` |
| T6.2 | 템플릿 5종 (변화 유형별) | `landing/dashboard.html` |
| T6.3 | Action Items 3개 생성 (최저 dim 기반) | `landing/dashboard.html` |

**템플릿 5종 (초안)**:
1. **Big Mover**: "이번 주 {dim}에서 +{N}점 상승. 주역은 {AI}의 {grade} 달성."
2. **Stagnant**: "이번 주 변화 없음. {lowest_dim}이 {N}/{max}로 여전히 최대 병목."
3. **Regression**: "이번 주 -{N}점. {dim}에서 {cause}."
4. **Breakthrough**: "Emerging/Strong 진입! {milestone_event}."
5. **First Week**: "첫 주 데이터 수집 중. 기준선 {score} 확립."

### Day 10 · QA + 스테이징 배포 (P0)
| 작업 | 내용 |
|---|---|
| T7.1 | Ground Truth 검증 (5개 제품 실측) |
| T7.2 | Streak 10+ 타임존 케이스 테스트 |
| T7.3 | Milestone 오탐 테스트 (위증 0건 목표) |
| T7.4 | 회귀 테스트 (기존 Check AI Visibility 정상 동작) |
| T7.5 | 최종 스테이징 배포 + CEO 검증 요청 |

**완료 기준**: 전체 PASS + CEO 검증 통과 → 프로덕션 배포 승인 요청.

## 6. 제외 항목 (명시)
- ❌ **Weekly Email 발송** — Phase 3로 분리 (Brevo 인프라 필요)
- ❌ **LLM 기반 Narrative** — 비용 규칙 위반, 규칙 기반으로 대체
- ❌ **Action Items AI 생성** — 최저 dim 기반 정적 추천으로 대체
- ❌ **Hero's Arc 애니메이션** — MVP 범위 초과, 정적 바로 시작

## 7. 롤백 포인트
| Tag | 시점 |
|---|---|
| `stable-20260417-pre-bigpie-p2-ui` | Phase 2 착수 직전 (롤백 기준) |
| `stable-20260417-pre-redesign` | 빅파이 1.5 Phase 1 착수 직전 (이전 기준) |

**롤백 절차**:
```bash
git reset --hard stable-20260417-pre-bigpie-p2-ui
bash scripts/deploy-staging.sh
```

## 8. 리스크
| 리스크 | 대응 |
|---|---|
| DB 마이그레이션 실패 | 스테이징 선 적용, 롤백 SQL 준비 |
| Streak 타임존 버그 | 10+ 테스트 케이스, Ground Truth 검증 |
| Milestone 오탐 | 규칙 정밀 정의 + QA 2회 |
| 2주 초과 | Phase 1 완료 후 재검토. Phase 2 분할 가능 |

## 9. CEO 체크포인트
- **Day 1 완료**: DB 마이그레이션 결과 + /v1/events 확인
- **Day 5 완료**: Phase 1 스테이징 배포 후 CEO 검증
- **Day 10 완료**: Phase 2 스테이징 배포 후 CEO 최종 검증 + 프로덕션 승인 요청

## 10. 산출물 경로
- 마이그레이션: `pickedbyAI/docs/migrations/*.sql`
- 테스트: `pickedbyAI/api/src/*.test.ts`
- 세션 기록: `pickedbyAI/docs/outputs/daily_YYYYMMDD.md`
- 최종 보고서: `pickedbyAI/docs/outputs/phase2_completion_YYYYMMDD.md`

---
*CPO 승인 · 2026-04-17 저녁*
