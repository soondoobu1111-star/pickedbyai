# MODOO-P0 THUNOVA 흔적 정리 감사 리포트
> 작성: 2026-04-22 22:15 KST · CPO
> 목적: 모두의 창업 2026 지원서 제출(05-15 마감) 전 pickedby.ai 도메인 내 THUNOVA 법적 엔티티 표기 정리
> **CEO 결정 필요** — 단순 제거가 아닌 전략적 판단

---

## 1. 전수 스캔 결과

### 1-1. 실제 운영 랜딩 (`landing/*`) — 🔴 정리 대상
| 파일 | 위치 | 문맥 |
|------|------|------|
| `landing/terms.html` | L40 | "operated by THUNOVA (Republic of Korea, business registration 722-60-00889)" — 사업자번호 포함 |
| `landing/terms.html` | L61 | "owned by THUNOVA and protected by applicable intellectual property laws" |
| `landing/terms.html` | L67 | "THUNOVA shall not be liable for any indirect..." |
| `landing/terms.html` | L70 | "indemnify and hold THUNOVA harmless" |
| `landing/terms.html` | L79 | 푸터 "THUNOVA · Republic of Korea · hello@pickedby.ai" |
| `landing/privacy.html` | L40 | "operated by THUNOVA (Republic of Korea)" |
| `landing/privacy.html` | L84 | 푸터 동일 |
| `landing/faq/index.html` | L62 | JSON-LD `"creator": { "@type": "Organization", "name": "THUNOVA", "email": "hello@pickedby.ai" }` |
| `landing/index.html` | L62 | JSON-LD 동일 |
| `landing/llms.txt` | L103 | "THUNOVA \| Republic of Korea \| hello@pickedby.ai" |
| `landing/blog/how-we-calculate-your-ai-visibility-score/index.html` | L334 | 푸터 "© 2026 THUNOVA" |

**소계:** **6개 파일 · 11곳**

### 1-2. 디자인 시스템 복사본 (`docs/designs/pickedby.ai Design System/uploads/...`) — ⚪ 수정 불필요
- 실제 배포되지 않는 디자인 레퍼런스 복사본
- 동일 위치 파일 복사본으로 수정 시 오히려 원본 추적 혼란
- **유지 권장**

### 1-3. 내부 문서 (`docs/`) — ⚪ 수정 불필요
- `docs/brand-guide.md:18` — 브랜드 가이드 자체에 회사명 명시 (운영 정보, 유지)
- `docs/outputs/*.md` — 과거 세션 기록 (이력 자료)
- 유지 권장

### 1-4. 대시보드 UI 텍스트 — ⚪ 참조성
- `Dashboard Shell.html:596` / `Sidebar.jsx:56` — `sohee@thunova.kr` 예시 이메일 (UI 샘플 데이터)
- 실제 유저 데이터와 무관, 수정 불필요

---

## 2. 🔴 CEO 결정 필요 3가지

### 옵션 A: 완전 제거 + 브랜드 통합
- `THUNOVA` → `pickedby.ai` 단일 브랜드로 전면 교체
- 법적 엔티티 노출 0 (푸터 · JSON-LD · 약관 · llms.txt 전부)
- **장점:** 지원서·마케팅에서 "pickedby.ai" 단일 브랜드 인식
- **단점:** 약관의 법적 책임 주체가 "회사명 없는 도메인명"이 되어 법률 효력 의문. 사업자 등록번호와 연결 고리 끊김.

### 옵션 B: 법적 문서만 최소 유지 (CPO 추천)
- `terms.html` + `privacy.html`: **"THUNOVA" 유지** (법적 엔티티 명시가 계약 효력상 필요)
- 그 외 (푸터 · JSON-LD · llms.txt · 블로그 푸터): **"pickedby.ai"로 교체**
- **장점:** 법적 효력 유지 + 브랜드 노출 일관성
- **단점:** 11곳 중 5곳만 수정 → "흔적 정리" 표현 애매함

### 옵션 C: 현상 유지 + 지원서만 별도 표기
- pickedby.ai 도메인 자체 수정 없음
- 지원서에서 "회사명: THUNOVA / 제품명: pickedby.ai" 명확히 분리 기재
- **장점:** 리스크 0, 지금 바로 제출 가능
- **단점:** CEO가 04-21에 이미 "THUNOVA 흔적 정리" 의사 표명 — 이 방향과 상충

---

## 3. 추가 고려 사항

### 3-1. 법률 자문 필요 여부
- 한국 전자상거래법: 온라인 서비스는 **사업자 정보(상호·대표자·주소·등록번호)** 표시 의무
- 현재 `terms.html:40` "THUNOVA (Republic of Korea, business registration 722-60-00889)" 표기가 이 의무 충족
- 옵션 A로 가면 **법적 위반 리스크** 발생 가능 — CEO 법무 확인 필수

### 3-2. 영어 약관의 한국 법 적용 여부
- 현재 약관 영어 작성. 한국 고객에게 서비스 제공 시 한국법 적용
- 사업자 정보 한글 별도 표기 의무 검토 필요

### 3-3. 이메일 도메인 전략
- `hello@pickedby.ai` 사용 중 — 좋음
- 과거 `thunova0318@gmail.com` 등 운영자 개인 이메일은 내부 문서에만 유지

---

## 4. CPO 최종 권고

**옵션 B 채택:**
1. `terms.html` 유지 (L40, L61, L67, L70 법적 조항) — 4곳 유지
2. `terms.html:79` 푸터 "THUNOVA · Republic of Korea · hello@pickedby.ai" → "pickedby.ai · The AI Visibility Platform · hello@pickedby.ai"
3. `privacy.html:40` 정책 본문 유지 (법적 주체 명시)
4. `privacy.html:84` 푸터 → 동일 교체
5. `landing/index.html:62` + `landing/faq/index.html:62` JSON-LD: `"name": "THUNOVA"` → `"name": "pickedby.ai"` (SEO 브랜드 일관성)
6. `landing/llms.txt:103` → "pickedby.ai | Republic of Korea | hello@pickedby.ai"
7. `landing/blog/how-we-calculate.../index.html:334` 푸터 © → "© 2026 pickedby.ai"

**총 수정:** 6개 파일 · 5곳 (법적 4곳 유지)

**소요 시간:** 15분 (단순 문자열 치환)

**전제:** 이 권고안은 **스테이징만** 반영하고 **D11 DEPLOY-GATE-01 통과 후 프로덕션 배포**. 지금 즉시 프로덕션 수정하지 않음.

---

## 5. CEO 다음 단계

1. **옵션 A/B/C 중 선택** (추천: B)
2. 선택 시 Claude가 15분 내 5곳 수정 + 스테이징 배포 검증
3. 05-15 지원서 제출 직전 최종 점검 1회 더 (감사 재실행)

---

*CPO 감사 완료 · CEO 결정 대기 · 2026-04-22 22:20 KST*
