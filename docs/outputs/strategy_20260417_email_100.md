# Strategy — 이메일 100명 확보 미션 (7일 작전)
**작성자:** CPO/PO (Claude)
**날짜:** 2026-04-17 (D-Day)
**목표:** 30일 내 이메일 100명 · 10 세일즈콜 · 10 유료 전환 (Track A 기준)
**현재 상태:** 이메일 0명 · Beta SOLD OUT 처리 완료 · 프로덕션 배포 완료

---

## 1. 현재 상황 스캔 (사실 기반)

### 1-1. 제품 상태
- **ENGINE-06 완료** — Probe 기반 Score 메인 스코어 전환 (빅파이 1.0 P0 완료)
- **BETA-CAP-01 완료** — Beta 100명 캡/SOLD OUT/탈퇴 재가입 차단
- **AI 크롤러 최적화 완료** — robots.txt 9봇, sitemap.xml 18페이지, ai.txt
- **creators only 카피 전면 제거 완료** — 비전 정렬 v2.0 반영
- **블로그 13편** — day-1 ~ day-12 + score-12-to-32 + IH 포스트
- **프로덕션 배포 완료** — pickedby.ai / api.pickedby.ai 안정 가동

### 1-2. 마케팅 상태 (04-16 종료 시점)
- ✅ IH 첫 포스트 게시
- ✅ Reddit r/ChatGPT 게시 (1smw130)
- ✅ Reddit 인터셉트 댓글 — r/buildinpublic + r/microsaas 대화 진행 중
- 🔴 LinkedIn 포스트 미게시 — day-12 블로그 링크 준비 완료
- 🔴 Reddit 카르마 59 — 200+ 필요 (r/SideProject 모드 승인 대기)
- 🔴 셀럽 DM 5건 미발송
- 🔴 뉴스레터 3곳 미제출
- 🔴 X 이의제기 재시도 예정 (오늘 04-17)

### 1-3. 데이터 모트 진척
- Probe 로그 테이블 가동 중 (ENGINE-06 연결)
- co_recommendations 파싱은 아직 시작 전 (P0 잔여)
- SDK-01 AI 레퍼러 감지 스크립트 미착수 (P1)

---

## 2. 비전 재확인 (빅파이 1.0 기준)

> **"The Google Stack for AI Recommendations"**
> Phase 1 (Search Console/측정) → Phase 2 (Analytics/분석) → Phase 3 (Ads/최적화)

현재는 **Phase 1.5** (측정은 됨, 유료 전환은 미검증).
이메일 100명은 **Phase 1 → 1.5 전환의 유일한 신호**다.
100명 모집 없이 Phase 2(GA4 연동)로 넘어가면 **false positive 개발 리스크**.

**30일 KPI (vision-rules.json 기준):**
```
email_signups: 100
sales_calls:   10
paying:        10
pilots:        3
investors:     2
```

---

## 3. 경쟁 지형 재스캔 (2026-04 기준)

| 경쟁자 | 가격 | 포지션 | pba 차별점 |
|---|---|---|---|
| **Atomic AGI** | Free tier 출시 | GEO 무료 점수 | pba = Probe 직접 측정 + 시계열 |
| **HubSpot AEO Grader** | Free | 마케터 타겟 (웹사이트) | pba = 크리에이터+D2C 제품 중심 |
| **Profound** | Enterprise | 대기업 GEO | pba = 인디/크리에이터 가격대 |
| **Peec AI** | $49+ | SaaS GEO | pba = Track A 크리에이터 seed |

**시사점:** 무료 경쟁자 2곳 증가 → pba의 "Probe 기반 시계열 데이터 모트"가 유일한 차별점.
→ **메시지:** "Atomic/HubSpot은 한 번 점수, pba는 매일 쌓이는 데이터."

---

## 4. 7일 실행 플랜 (2026-04-17 ~ 04-23)

| Day | 날짜 | 핵심 액션 (CEO) | 핵심 액션 (Claude) | 목표 이메일 |
|---|---|---|---|---|
| D1 | 04-17 금 | LinkedIn day-12 게시, 셀럽 DM 5건 발송, 뉴스레터 3곳 제출, X 이의제기 | 셀럽 DM 초안·뉴스레터 피치·LinkedIn 초안 작성 | +10 |
| D2 | 04-18 토 | Reddit r/microsaas 인터셉트 댓글 5건, IH 답글 | blog day-13 작성 (경쟁자 대비) | +10 |
| D3 | 04-19 일 | 뉴스레터 답변 체크, X 복구 후 첫 포스트 | weekly-vision-audit 실행 | +5 |
| D4 | 04-20 월 | LinkedIn 2차 포스트 (셀럽 스캔 결과 공유) | co_recommendations 파싱 착수 (P0) | +15 |
| D5 | 04-21 화 | Product Hunt 티저 등록 준비 | PH 티저 페이지 초안 | +20 |
| D6 | 04-22 수 | Ben's Bites/Creator Science 게시 시 푸시 | SDK-01 프로토타입 착수 (P1) | +20 |
| D7 | 04-23 목 | 주간 리뷰 + 남은 20명 도달 | strategy_20260424 작성 | +20 |

**총 목표:** 100명 / 7일 (일평균 ~15명)

---

## 5. 오늘(D1) 즉시 실행 체크리스트

### CEO 실행 (순서대로)
1. [ ] `linkedin_day12_post_20260417.md` 읽고 LinkedIn 게시 (09:00 KST 권장)
2. [ ] `celeb_dms_20260417.md` 5건 → X/Email/LinkedIn로 순차 발송 (10:00 ~ 15:00 KST, 1시간 간격)
3. [ ] `newsletter_pitches_20260417.md` 3건 → 각 뉴스레터 제출 폼/이메일 (16:00 KST)
4. [ ] X 이의제기 웹 폼 재시도 (아무 시점)
5. [ ] Reddit r/buildinpublic + r/microsaas 댓글 체크·답변 (저녁)

### Claude 실행 (즉시)
- [x] 셀럽 5명 실제 스캔 데이터 확보 (ShipFast 68 / Easlo 45 / TypingMind 75 / Arvid 41 / Starter Story 68)
- [x] 비전·로드맵 문서 전수 스캔
- [x] 경쟁 지형 리서치
- [ ] strategy 문서 작성 (← 본 문서)
- [ ] 셀럽 DM 5건 작성
- [ ] 뉴스레터 피치 3건 작성
- [ ] LinkedIn 포스트 작성
- [ ] daily_20260417.md 갱신
- [ ] backlog.md EMAIL-100 캠페인 추가

---

## 6. 리스크 · 예외

| 리스크 | 대응 |
|---|---|
| X 이의제기 재거부 | 신규 계정 금지 (이전 사고), 채널 제외 유지 |
| LinkedIn 게시 후 반응 저조 | D3에 "셀럽 스캔 결과" 2차 포스트로 증폭 |
| 셀럽 5명 전원 무응답 | D3에 10명 추가 스캔 + 2차 DM (변형 카피) |
| 뉴스레터 전원 거절 | 작은 뉴스레터 5곳 추가 피치 (D4~D5) |
| Reddit 카르마 부족 | r/SideProject 승인 대기 중, 다른 서브레딧 병행 |

**임계치:** D3 종료 시점 이메일 < 15명 → **메시지/카피 재검토 긴급 회의** (CEO+CPO 30분).

---

## 7. 자원 · 비용

- **API 비용:** 셀럽 스캔 5건 = 약 $0.15 (Gemini/Perplexity/GPT 기존 예산 내)
- **외부 지출:** 0원 (뉴스레터 무료 제출, LinkedIn/Reddit 무료)
- **CEO 시간:** 오늘 2시간 (DM 30분 + 뉴스레터 30분 + LinkedIn 15분 + Reddit 45분)
- **Claude 시간:** 오늘 완료 목표 (현재 세션 내)

---

## 8. 완료 정의 (Definition of Done — 7일차)

- [ ] 이메일 구독 100명 달성 (`/v1/beta-count` 대신 `email_subscribers` 테이블 기준 집계 필요 → 별도 쿼리)
- [ ] 최소 10명 세일즈콜 수락
- [ ] 최소 1건 유료 전환 또는 pilot 합의
- [ ] weekly-vision-audit 수행 및 `audit-log.md` append

---

## 9. 빅파이 연계

이 미션은 **phase_1 (Search Console)**에 전부 귀속된다.
- 데이터 모트 강화: 100명 = 100개 도메인 = Probe 로그 1,000+건/주 → **시계열 자산 축적 가속**
- 알고리즘 모트 아님 → 경쟁자 복제 불가
- 플라이휠: 신규 유저 → Probe 누적 → co_recommendations 확장 → 메시지 정밀화 → 신규 유저

**자문 통과:** ✅ 데이터 모트 강화함. ✅ 플라이휠 돌림.

---

*End of strategy document. 다음: celeb_dms → newsletter_pitches → linkedin_post → daily → backlog.*
