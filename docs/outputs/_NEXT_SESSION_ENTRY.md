# 다음 세션 진입 가이드 — 2026-04-19 아침 (D+1)

> `/clear` 후 첫 메시지로 아래 텍스트를 그대로 복붙하세요.

---

## 진입 prompt (복붙용)

```
pickedbyai로. 오늘은 2026-04-19 (일).

어제 2026-04-18 완료 요약:
- D1 DB 마이그레이션 (스테이징+프로덕션 양쪽 적용 완료)
- Claude Design Dashboard Shell(724줄) + 디자인 시스템 22개 컴포넌트 수령
- 랜딩 리뉴얼 리서치(경쟁사 3 + B2B 마스터 3 + 리텐션 4) + 4-agent 평가 완료
- LAND-SHIFT-3/4/5/9 스테이징 배포 완료 (롤백: stable-20260418-pre-landing-redesign)
- Lighthouse baseline 캡처: Performance 33 🔴 / A11y 95 / SEO 100 / Best 100

오늘 진행할 일 (CEO 승인):

[B] 추가 작업
  B1. LAND-TURNSTILE 인프라 설계 문서 (D9b 구현 전 선작성)
  B2. UI-SHELL-INTEGRATE-01 DOM ID 매핑표 (Dashboard Shell 통합용)
  B3. /faq/ 디자인 시스템 기준 리뉴얼
  B4. MCP Step 3 Lighthouse 재측정 (Shift 3/4/5/9 후)

[C] 점검/분석
  C1. /status 전체 서비스
  C2. 스테이징 스냅샷 전수 검증

[D] 기록
  D1. daily_20260419.md 신규 생성
  D2. git log 기반 daily-report

그리고 D4-INT UI-SHELL-INTEGRATE-01 본격 착수 + D2 ONBOARD-01/RETRY-01.

선후순위: 
1. C (점검 — 어제 스테이징 상태 확인)
2. B (추가 작업)
3. D4-INT + D2 (본 스프린트)
4. D (기록)

첫 단계로 /status + 스테이징 스냅샷 점검부터 시작해줘.
```

---

## 핵심 참조 파일

| 파일 | 용도 |
|------|------|
| `pickedbyAI/docs/outputs/daily_20260418.md` | 어제 전체 세션 로그 (6 세션, 788줄) |
| `pickedbyAI/docs/outputs/research_landing_20260418.md` | 랜딩 리뉴얼 연구 보고서 |
| `pickedbyAI/docs/designs/Dashboard Shell (3-panel)/Dashboard Shell.html` | D4 Shell (724줄) |
| `pickedbyAI/docs/designs/pickedby.ai Design System/` | 디자인 시스템 전체 패키지 |
| `pickedbyAI/landing/index.html` | 어제 Shift 4/5/9 반영됨 |
| `pickedbyAI/landing/faq/index.html` | 어제 신규 (17 schema + 17 FAQ) |

## 롤백 포인트
```
git checkout stable-20260418-pre-landing-redesign   # Shift 3/4/5/9 전으로
git checkout stable-20260417-pre-bigpie-p2-ui       # 빅파이 1.5 Phase 2 전으로
git checkout stable-20260417-pre-redesign           # 빅파이 1.5 재설계 전으로
```

## 배포 URL
- 스테이징: https://staging-0404.pickedby.ai (최신 Version: e1a834b2)
- 프로덕션: https://pickedby.ai (아직 미배포 — D11 이후 CEO 승인 대기)
- API 스테이징: https://pickedbyai-api-staging.perceptdot.workers.dev

## 남은 11일 스프린트 일정 (04-18 기준)
- D4-INT + D2 (04-19 일): UI-SHELL-INTEGRATE-01 + ONBOARD-01 + RETRY-01
- D3 (04-20 월): DOMAIN-SEL-01
- D5 (04-22 수): OVERVIEW-01 12섹션
- D6 (04-23 목): TREND-01 + JOURNEY-01
- D7 (04-24 금): PROBE-REDESIGN-01 D안 백엔드
- D8 (04-25 토): RIVALS-01 + FALLBACK-01
- D9a/D9b (04-26~27): Actions-01 + 랜딩 Shift 1/2/6/7 + Turnstile + /changelog
- D10 (04-28 화): 모바일 전담 (대시보드 + 랜딩)
- D11 (04-29 수): QA + DEPLOY-GATE-01 13개 + Shift 10 Share Kit + 프로덕션 배포

## 미처리 블로커 (D9b 착수 전 선결)
- LAND-TURNSTILE 인프라 (Dev 하드 블로커)
- UI-SHELL-INTEGRATE-01 DOM ID 매핑표
- Lighthouse Performance 33 → 70 게이트 개선 방안 (섹션 14→5 축소 효과 측정)
