# pickedby.ai 브랜드 가이드
> 버전: 1.0 | 작성: 2026-04-06 | 수정 시 CPO 승인 필수

---

## 0. 브랜드 가이드 사용 규칙

**브랜드 관련 작업 전 반드시 이 문서를 확인한다.**
브랜드 관련 작업 = 로고·색상·타이포그래피·카피·배지·스크린샷·마케팅 소재 작업 전부.

---

## 1. 브랜드 네임

| 항목 | 올바른 표기 | 금지 표기 |
|------|------------|---------|
| 서비스명 | `pickedby.ai` | `picked by .ai` / `Picked By AI` / `PickedByAI` / `pickedbyai` |
| 회사명 | `THUNOVA` | `Thunova` / `thunova` |
| 태그라인 | `Get Picked by AI` | 단독 `Picked by AI` (명사형 사용 시 `pickedby.ai`로) |

### 핵심 규칙
- **항상 소문자**, 띄어쓰기 없음
- `.ai` TLD는 반드시 붙임 (도메인 일체형이 브랜드명)
- 문장 첫 글자여도 소문자: `pickedby.ai is a tool...`

---

## 2. 로고

### 구성 요소
1. **픽셀 크라운 아이콘** — 3피크 3젬, `#FFD700` (골드)
2. **로고 텍스트** — `pickedby` (골드) + `.` (흰색) + `ai` (골드)
   - 폰트: `Press Start 2P` (픽셀 게임 폰트)
   - 크기: `0.85rem` (헤더 기준)
   - Letter-spacing: `-1px`

### 로고 HTML 코드 (공식)
```html
<div class="logo">
  <!-- 픽셀 크라운 SVG -->
  <svg width="20" height="16" viewBox="0 0 20 16" fill="#FFD700" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="2" height="4"/>
    <rect x="9" y="0" width="2" height="4"/>
    <rect x="18" y="0" width="2" height="4"/>
    <rect x="0" y="4" width="20" height="2"/>
    <rect x="0" y="6" width="2" height="6"/>
    <rect x="18" y="6" width="2" height="6"/>
    <rect x="4" y="8" width="2" height="2"/>
    <rect x="9" y="8" width="2" height="2"/>
    <rect x="14" y="8" width="2" height="2"/>
    <rect x="0" y="12" width="20" height="2"/>
    <rect x="2" y="14" width="16" height="2"/>
  </svg>
  pickedby<span class="dot">.</span>ai
</div>
```

### 로고 CSS
```css
.logo {
  font-family: 'Press Start 2P', monospace;
  font-size: 0.85rem;
  color: #FFD700;
  letter-spacing: -1px;
  line-height: 1.6;
  display: flex;
  align-items: center;
  gap: 8px;
}
.logo .dot { color: #ffffff; }
```

### 로고 금지 사항
- ❌ 띄어쓰기: `picked by .ai`
- ❌ 대문자: `PickedBy.ai`
- ❌ 도트 제거: `pickedbyai`
- ❌ 배경색 변경 (배경은 항상 `#000000` 또는 투명)
- ❌ 크라운 아이콘 단독 사용 (텍스트 없이)

---

## 3. 컬러 팔레트

| 변수 | 헥스 | 용도 |
|------|------|------|
| `--yellow` | `#FFD700` | **Primary** — 로고·CTA·포인트·배지·제목 강조 |
| `--yellow2` | `#B39700` | Primary 호버/비활성 상태 |
| `--bg` | `#000000` | **배경** — 기본 페이지 배경 |
| `--bg2` | `#0D0D0D` | 카드·섹션 배경 |
| `--bg3` | `#161616` | 중첩 카드 배경 |
| `--text` | `#FFFFFF` | 본문 텍스트 |
| `--muted` | `#666666` | 부제·설명 텍스트 |
| `--border` | `#222222` | 구분선·카드 테두리 |
| `--green` | `#00E676` | 성공·긍정 지표 |
| `--red` | `#FF3D3D` | 오류·경고 |
| `--orange` | `#FF9100` | 중간 경고·Bronze 계열 |

### 배지 컬러
| 배지 | 배경 | 텍스트 | 테두리 |
|------|------|--------|--------|
| Gold | `rgba(255,215,0,0.12)` | `#FFD700` | `rgba(255,215,0,0.3)` |
| Silver | `rgba(192,192,192,0.1)` | `#C0C0C0` | `rgba(192,192,192,0.25)` |
| Bronze | `rgba(205,127,50,0.1)` | `#CD7F32` | `rgba(205,127,50,0.25)` |

---

## 4. 타이포그래피

| 용도 | 폰트 | 특징 |
|------|------|------|
| 로고·섹션 헤더 | `Press Start 2P` | 픽셀 폰트, Google Fonts |
| 본문 전체 | `-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` | 시스템 폰트 |

### 텍스트 계층
- **H1 (히어로)**: 2.5rem, `font-weight: 800`
- **섹션 타이틀** (Press Start 2P): `0.4rem`, letter-spacing `0.12em`, opacity `0.6`, 골드
- **카드 제목**: `1rem`, `font-weight: 700`
- **본문**: `0.88rem`, line-height `1.6`
- **보조 텍스트**: `0.76–0.84rem`, color `#666`

---

## 5. 배지 시스템 (V2-C 확정)

| 점수 | 티어 | 문구 | 특이사항 |
|------|------|------|---------|
| 81–100 | Gold | `PICKED BY AI` | goldPulse 애니메이션, 박스 글로우 |
| 61–80 | Silver | `SEEN BY AI` | `#C0C0C0` |
| 36–60 | Bronze | `NOTICED BY AI` | `#CD7F32` |
| 0–35 | 없음 | — | 배지 미표시 |

---

## 6. 보이스 & 톤

### 핵심 메시지
1. **"AI가 내 제품을 추천하는가?"** — 질문형으로 문제를 먼저 던진다
2. **"안 하면 확실히 안 보인다"** — 보장이 아닌 자격의 언어
3. **"10초, 무료, 가입 불필요"** — 진입 장벽 제거 강조

### 카피 규칙
- 독자 = 비기술 크리에이터 (Gumroad/Etsy 셀러)
- 짧고 직접적 → 설명 없이 바로 행동
- 수치를 적극 활용: `10초`, `0-100`, `3개 AI`
- 과장 금지: `"AI 추천 보장"` / `"AI에서 1위"` 절대 사용 안 함
- 기업/브랜드 타겟 카피 금지 — 크리에이터 전용

### 어조
- 자신감 있되 겸손 (점수는 보장이 아닌 지표)
- 게임화된 느낌 (픽셀 폰트·배지·점수 UI와 일관성)
- 영어 기본, 단순명료

---

## 7. 레이아웃 원칙

- **최대 너비**: `620px` (모바일 퍼스트)
- **배경**: 항상 `#000000`
- **카드**: `border: 1px solid #222222`, `background: #0D0D0D`
- **버튼 기본**: 검정 배경 + 골드 테두리/텍스트
- **버튼 Primary**: 골드 배경 + 검정 텍스트

---

## 8. 금지 사항 (절대 규칙)

```
❌ "AI 추천 보장" 카피
❌ "AI에서 1위" 표현
❌ 기업/브랜드 타겟 콘텐츠
❌ 로고 띄어쓰기 (picked by .ai)
❌ 밝은 배경 (흰 배경에 로고 사용)
❌ 색상 팔레트 외 임의 색상 추가
❌ CEO 얼굴 노출 — 마케팅은 AI 생성 이미지 전용
```

---

## 변경 이력
- 2026-04-06: v1.0 최초 작성 (CPO)
  - 로고 수정: `picked by .ai` → `pickedby.ai` (by에서 도트로 강조 이동)
