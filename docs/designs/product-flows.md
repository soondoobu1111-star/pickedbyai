# pickedby.ai — Product Flows & Sitemap
> CEO 확정 후 Claude Design 하이파이 디자인의 기준 문서.
> 2026-04-27 CPO 초안 작성.

---

## 페이지 목록 (8개)

| # | 경로 | 역할 | 디자인 상태 |
|---|------|------|------------|
| 1 | `/` (index.html) | 익명 체크 도구 + 후킹 | Claude Design 완료 |
| 2 | `/dashboard` (미로그인) | 로그인 전환 유도 | 미착수 |
| 3 | `/dashboard#overview` | 핵심 현황 (스코어 링) | 미착수 |
| 4 | `/dashboard#trend` | 스코어 추이 그래프 | 미착수 |
| 5 | `/dashboard#rivals` | 경쟁사 비교 | 미착수 |
| 6 | `/dashboard#actions` | 처방 큐 (Phase 2) | 미착수 |
| 7 | `/dashboard#tools` | llms.txt 생성기 등 | 미착수 |
| 8 | `/register` | 도메인 인증 | 기존 유지 |

---

## Flow A: 첫 방문 → 체크 → 전환 (80% 트래픽)

```
유입 (블로그/레딧/구글)
  |
  v
Landing 히어로
  "Right now, someone is asking ChatGPT about your category.
   You're not in the answer."
  [제품명 입력] [CHECK FREE]
  |
  v
결과 인라인 표시 (같은 페이지)
  - 스코어 (예: 12/100 INVISIBLE)
  - 4차원 바
  - AI probe 인용문
  - 개선 제안 3개
  |
  +---> [공유] LinkedIn 복사 / 스크린샷 ---> 바이럴 ---> 새 유입
  |
  +---> "Track your score over time" CTA
        |
        v
  Login 화면 (Dashboard Shell 잠김 상태)
  "Your score (12) is saved. Sign in to track it."
  [Continue with Google]
        |
        v
  Dashboard Overview (방금 결과 즉시 표시)
```

**핵심 원칙:**
- Landing 결과 → localStorage 저장
- 로그인 후 즉시 DB 이관 + 대시보드에 표시
- "빈 대시보드" 상태 절대 불가

---

## Flow B: 도메인 등록 (첫 로그인 후)

```
Dashboard Overview (체크 결과 1개 있음)
  |
  Daily Pulse: "Register your domain for daily auto-scans"
  |
  v
[Register Domain] 클릭
  |
  v
/register: 도메인 입력 → 인증 (meta tag / DNS)
  |
  v
인증 완료 → Overview로 복귀
  이후 매일 KST 00:00 자동 체크
```

---

## Flow C: 리텐션 (매일/매주 복귀)

```
이메일: "Score changed: 12 → 18 (+6)"
  |
  v
Dashboard Overview
  |
  +---> Trend: 30일 추이 그래프
  +---> Rivals: 경쟁사 점수 비교
  +---> Actions: "이번 주 할 일 3개" (Phase 2 처방)
  |
  v
처방 실행 → 스코어 상승 → 뱃지 획득 → 공유 → Flow A (바이럴)
```

---

## 화면별 상태 정의

### Landing (/)
| 상태 | 내용 |
|------|------|
| Default | 히어로 + 입력폼 + Tension Bar |
| Checking | 로딩 애니메이션 (10초) |
| Result | 스코어 + 4차원 + 제안 + "Track" CTA |
| Error | "Couldn't reach AI engines. Try again." |

### Login (/dashboard, 미로그인)
| 상태 | 내용 |
|------|------|
| Default | Shell 잠김 + 로그인 카드 |
| With score | "Your score (12) is saved" 표시 |

### Dashboard Overview (#overview)
| 상태 | 내용 |
|------|------|
| First visit (결과 있음) | 스코어 링 + 4차원 + "Register" 유도 |
| Registered (데이터 있음) | 스코어 링 + 펄스 + 엔진 + 벤치마크 |
| Empty (결과 없음) | "Check your first product" CTA (최소화) |

### Actions (#actions, Phase 2)
| 상태 | 내용 |
|------|------|
| No prescriptions | "Complete your first scan to get prescriptions" |
| Has prescriptions | 우선순위 큐 + 진행률 |

---

## 디자인 통일 규칙

| 요소 | Landing | Dashboard |
|------|---------|-----------|
| border-radius | 0px (직각) | 6px |
| 골드 코너 어크센트 | 있음 (10px) | 있음 (10px) — 통일 장치 |
| 버튼 그림자 | 픽셀 오프셋 (3px 3px) | 픽셀 오프셋 (동일) |
| Press Start 2P | 라벨/눈썹/버튼 | 라벨/눈썹만 |
| Inter | 헤드라인/본문 | 헤드라인/본문 |
| 배경 | #000 + 캔버스 입자 | #0a0a0a (순수) |

---

## 끊어진 곳 (현재 → 수정 필요)

| # | 문제 | Flow | 수정 |
|---|------|------|------|
| 1 | Landing 결과가 Dashboard로 안 이어짐 | A→B | localStorage 연결 |
| 2 | Login 후 빈 화면 | A→B | 결과 자동 표시 |
| 3 | 디자인 언어 불일치 | 전체 | 골드 코너 + 토큰 통일 |
| 4 | 베타 배너가 스코어 위에 | B→C | 스코어 우선, 배너 하단 |
| 5 | Actions 탭 비어있음 | C | Phase 2에서 구현 |

---

*이 문서는 디자인 진행의 기준입니다. 변경 시 CEO 승인 필요.*
