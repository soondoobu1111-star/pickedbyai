# PRESCRIPTION-01 상세 구현 스펙
> 작성: 2026-04-27 | Phase 2a Day 1
> 근거: bigpie-v1.6.md SS3 처방 엔진 설계
> 원칙: 규칙 기반, LLM 미사용, 비용 $0, 기존 Hono+CF Workers+TS 구조 존중
> 예상 소요: 4시간

---

## 1. 파일 구조

```
pickedbyAI/api/src/
  prescriptionEngine.ts    <-- 신규 (본 스펙 대상)
  unifiedScore.ts          <-- 기존 (import: DimensionId, PassIndicator, UnifiedScoreResult 등)
  unifiedScoreAdapter.ts   <-- 기존 (import: 없음)
  probeRedesign.ts         <-- 기존 (import: DAnswerResult, Tier)
  index.ts                 <-- 수정 (/v1/check 응답에 prescription 필드 추가)
```

### export 목록 (prescriptionEngine.ts)

```typescript
// 타입
export type PrescriptionLevel = 'invisible' | 'emerging' | 'growing' | 'strong' | 'perfect'
export interface Diagnosis { ... }
export interface Action { ... }
export interface GapInfo { ... }
export interface BenchmarkInfo { ... }
export interface PrescriptionResult { ... }

// 함수
export function generatePrescription(unified: UnifiedScoreResult): PrescriptionResult
export function classifyLevel(score: number): PrescriptionLevel  // 보조: 테스트용 export
```

---

## 2. 타입 정의

```typescript
import type { DimensionId, DimensionScore, UnifiedScoreResult, EngineGradeInfo } from './unifiedScore'

// ── 레벨 (5단계, 점수 기반) ──────────────────────────────────
export type PrescriptionLevel = 'invisible' | 'emerging' | 'growing' | 'strong' | 'perfect'

// ── 진단 (4차원별 "왜 이 점수인지") ──────────────────────────
export interface Diagnosis {
  dimension: DimensionId
  label: string               // "Direct Recognition"
  score: number               // 현재 점수
  max: number                 // 만점
  level: PrescriptionLevel    // 차원별 레벨 (차원 점수를 100점 환산 후 분류)
  summary: string             // "AI 엔진 2개 중 0개가 인식합니다"
  detail: string              // "Gemini: 미인식 (F등급), Perplexity: 미인식 (F등급)"
}

// ── 처방 (구체적 행동 가이드) ─────────────────────────────────
export interface Action {
  id: string                  // "rx-rec-inv-01"
  dimension: DimensionId      // 어떤 차원 대상
  title: string               // "Product Hunt에 런치하세요"
  description: string         // 구체적 설명 (2~3문장)
  difficulty: 1 | 2 | 3       // 1=30분, 2=반나절, 3=하루 이상
  estimatedImpact: number     // 예상 점수 증가 (0~15)
  timeToComplete: string      // "30분" / "2시간" / "1일"
  externalUrl?: string        // 참고 링크 (optional)
  priority: number            // 내부 정렬용 (낮을수록 우선)
}

// ── Gap 정보 (다음 티어까지) ──────────────────────────────────
export interface GapInfo {
  currentLevel: PrescriptionLevel
  currentScore: number
  nextLevel: PrescriptionLevel | null       // perfect이면 null
  nextThreshold: number | null              // perfect이면 null
  pointsNeeded: number                      // 0이면 이미 최고
  dimensionGaps: Array<{
    dimension: DimensionId
    currentScore: number
    maxScore: number
    potentialGain: number                   // max - current
    normalizedAchievement: number           // 0~1 (score/max)
  }>
}

// ── 벤치마크 ─────────────────────────────────────────────────
export interface BenchmarkInfo {
  category: string | null                   // probeRedesign에서 얻은 카테고리
  yourRank: number | null                   // category ranking 순위
  leaders: string[]                         // CoRec top_5에서 추출
}

// ── 최종 출력 ────────────────────────────────────────────────
export interface PrescriptionResult {
  overall: {
    level: PrescriptionLevel
    summary: string                         // "AI가 알기 시작했지만, 추천까진 갈 길이 멉니다"
    gap: GapInfo
  }
  diagnoses: Diagnosis[]                    // 4차원별 진단 (항상 4개)
  prescriptions: Action[]                   // Top 3 처방 (정렬 완료)
  allActions: Action[]                      // 전체 후보 (UI에서 "더 보기"용)
  benchmark: BenchmarkInfo
  generatedAt: string                       // ISO timestamp
}
```

---

## 3. 레벨 분류 함수

```typescript
// 전체 점수 기반 (0~100)
export function classifyLevel(score: number): PrescriptionLevel {
  if (score >= 81) return 'perfect'
  if (score >= 61) return 'strong'
  if (score >= 41) return 'growing'
  if (score >= 21) return 'emerging'
  return 'invisible'
}

// 차원별 레벨 (차원 점수를 100점 환산 후 동일 기준 적용)
function classifyDimensionLevel(score: number, max: number): PrescriptionLevel {
  const normalized = max > 0 ? (score / max) * 100 : 0
  return classifyLevel(normalized)
}
```

| 레벨 | 점수 범위 | 의미 |
|------|----------|------|
| INVISIBLE | 0~20 | AI가 전혀 모름 |
| EMERGING | 21~40 | 일부 AI가 인식 시작 |
| GROWING | 41~60 | 성장 중, 차별화 필요 |
| STRONG | 61~80 | 강한 존재감, Top 3 도전 |
| PERFECT | 81~100 | 최고 수준, 유지 + 확장 |

---

## 4. 20규칙 상세 (5레벨 x 4차원)

### 4-1. Recognition 차원 (max=35)

#### INVISIBLE (recognition 0~7점, 환산 0~20%)
```typescript
{
  id: 'rx-rec-inv-01',
  dimension: 'recognition',
  title: 'Product Hunt에 런치하세요',
  description: 'AI 학습 데이터에 제품이 포함되려면 주요 플랫폼에 존재해야 합니다. Product Hunt 런치는 AI 크롤러가 수집하는 핵심 소스입니다.',
  difficulty: 2,
  estimatedImpact: 8,
  timeToComplete: '반나절',
  externalUrl: 'https://www.producthunt.com/posts/new',
  priority: 10,
},
{
  id: 'rx-rec-inv-02',
  dimension: 'recognition',
  title: 'llms.txt 파일을 도메인 루트에 추가하세요',
  description: 'llms.txt는 AI가 제품 정보를 정확히 이해하도록 돕는 표준입니다. 제품명, 설명, 주요 기능을 구조화하여 /llms.txt에 배포하세요.',
  difficulty: 1,
  estimatedImpact: 5,
  timeToComplete: '30분',
  externalUrl: 'https://llmstxt.org',
  priority: 15,
},
{
  id: 'rx-rec-inv-03',
  dimension: 'recognition',
  title: 'Hacker News Show HN에 제품을 소개하세요',
  description: 'HN은 AI 학습 데이터의 핵심 소스입니다. "Show HN: {제품명} - {한줄소개}" 형식으로 포스팅하면 AI 인식 확률이 크게 높아집니다.',
  difficulty: 2,
  estimatedImpact: 7,
  timeToComplete: '2시간',
  externalUrl: 'https://news.ycombinator.com/showhn.html',
  priority: 12,
},
{
  id: 'rx-rec-inv-04',
  dimension: 'recognition',
  title: '영문 위키백과에 제품 문서를 생성하세요',
  description: '위키백과는 거의 모든 AI의 학습 데이터입니다. Notable한 제품이라면 위키 문서가 AI 인식의 가장 확실한 경로입니다.',
  difficulty: 3,
  estimatedImpact: 10,
  timeToComplete: '1일 이상',
  externalUrl: 'https://en.wikipedia.org/wiki/Wikipedia:Your_first_article',
  priority: 20,
}
```

#### EMERGING (recognition 8~14점, 환산 21~40%)
```typescript
{
  id: 'rx-rec-emg-01',
  dimension: 'recognition',
  title: '미인식 AI 엔진 타겟 콘텐츠를 작성하세요',
  description: 'Engine Grades에서 F등급인 엔진을 확인하세요. 해당 AI가 주로 크롤링하는 플랫폼(Gemini=YouTube/Reddit, Perplexity=최신 웹)에 제품 관련 콘텐츠를 게시하세요.',
  difficulty: 2,
  estimatedImpact: 6,
  timeToComplete: '반나절',
  priority: 10,
},
{
  id: 'rx-rec-emg-02',
  dimension: 'recognition',
  title: '기술 블로그에 제품 사용 사례 글을 작성하세요',
  description: 'Medium, Dev.to, 자사 블로그에 "How to use {제품} for {use-case}" 글을 작성하세요. AI가 제품을 추천하려면 구체적 사용 사례 텍스트가 필요합니다.',
  difficulty: 2,
  estimatedImpact: 5,
  timeToComplete: '3시간',
  priority: 15,
}
```

#### GROWING (recognition 15~21점, 환산 41~60%)
```typescript
{
  id: 'rx-rec-grw-01',
  dimension: 'recognition',
  title: 'AI 추천 시 정확한 제품 설명이 나오도록 공식 문서를 보강하세요',
  description: '인식은 되지만 부정확한 정보가 전달될 수 있습니다. 공식 웹사이트의 메타 태그, 제품 설명, FAQ를 명확하게 업데이트하세요.',
  difficulty: 2,
  estimatedImpact: 4,
  timeToComplete: '반나절',
  priority: 10,
},
{
  id: 'rx-rec-grw-02',
  dimension: 'recognition',
  title: '업계 팟캐스트/인터뷰에 출연하세요',
  description: '팟캐스트 트랜스크립트는 AI 학습 데이터에 포함됩니다. 제품의 차별점을 명확히 전달하는 인터뷰가 "알고 있다"에서 "추천한다"로 전환시킵니다.',
  difficulty: 3,
  estimatedImpact: 5,
  timeToComplete: '1일',
  priority: 15,
}
```

#### STRONG (recognition 22~28점, 환산 61~80%)
```typescript
{
  id: 'rx-rec-str-01',
  dimension: 'recognition',
  title: '두 AI 엔진 모두에서 "추천" 등급을 달성하세요',
  description: 'C등급(인식만)인 엔진이 있다면 해당 AI에게 직접 제품을 추천해달라고 요청해보고, 어떤 정보가 부족한지 파악하세요. 경쟁사 대비 차별점 콘텐츠가 핵심입니다.',
  difficulty: 2,
  estimatedImpact: 4,
  timeToComplete: '반나절',
  priority: 10,
},
{
  id: 'rx-rec-str-02',
  dimension: 'recognition',
  title: '제품 비교 글에서 1위로 언급되도록 콘텐츠를 강화하세요',
  description: '"Best {category}" 비교 글에서 1위로 언급되는 것이 AI 추천의 핵심 신호입니다. 자사 블로그 외 제3자 리뷰어에게 비교 글 작성을 요청하세요.',
  difficulty: 3,
  estimatedImpact: 5,
  timeToComplete: '1일',
  priority: 15,
}
```

#### PERFECT (recognition 29~35점, 환산 81~100%)
```typescript
{
  id: 'rx-rec-prf-01',
  dimension: 'recognition',
  title: 'AI 인식 상태를 주간 모니터링하세요',
  description: '이미 훌륭한 수준입니다. pickedby.ai Daily Pulse로 주간 변화를 추적하고, 경쟁사 진입이나 AI 모델 업데이트로 인한 순위 변동에 대비하세요.',
  difficulty: 1,
  estimatedImpact: 1,
  timeToComplete: '10분/주',
  priority: 50,
},
{
  id: 'rx-rec-prf-02',
  dimension: 'recognition',
  title: '새로운 AI 엔진(Claude, Grok)으로 커버리지를 확장하세요',
  description: '현재 측정되는 2개 엔진 외에도 Claude, Grok 등 새로운 AI에서의 인식을 확인하세요. 다양한 AI에서 추천되는 것이 장기적 방어선입니다.',
  difficulty: 2,
  estimatedImpact: 2,
  timeToComplete: '2시간',
  priority: 55,
}
```

---

### 4-2. Category 차원 (max=35)

#### INVISIBLE (category 0~7점)
```typescript
{
  id: 'rx-cat-inv-01',
  dimension: 'category',
  title: '"Best {category}" 블로그 글을 작성하세요',
  description: 'AI에게 "best {당신의 카테고리}"를 물었을 때 당신이 등장하지 않습니다. "Best {category} tools in 2026" 비교 글을 작성하여 제품을 카테고리 맥락에 배치하세요.',
  difficulty: 2,
  estimatedImpact: 7,
  timeToComplete: '3시간',
  priority: 10,
},
{
  id: 'rx-cat-inv-02',
  dimension: 'category',
  title: '메타 태그와 제목에 카테고리 키워드를 포함하세요',
  description: '웹사이트 title, meta description, h1에 "{category} tool" 키워드를 명시적으로 넣으세요. AI는 웹 크롤링 시 이 태그를 카테고리 분류에 사용합니다.',
  difficulty: 1,
  estimatedImpact: 4,
  timeToComplete: '30분',
  priority: 15,
}
```

#### EMERGING (category 8~14점)
```typescript
{
  id: 'rx-cat-emg-01',
  dimension: 'category',
  title: '틈새(niche) 카테고리를 선점하세요',
  description: '대형 카테고리에서 경쟁이 어렵다면, 더 구체적인 하위 카테고리를 노리세요. 예: "AI tool" 대신 "AI visibility checker"처럼 좁은 영역에서 1위를 달성하세요.',
  difficulty: 2,
  estimatedImpact: 6,
  timeToComplete: '반나절',
  priority: 10,
},
{
  id: 'rx-cat-emg-02',
  dimension: 'category',
  title: 'G2, Capterra에 제품을 등록하세요',
  description: 'AI는 G2/Capterra 같은 소프트웨어 디렉토리를 카테고리 랭킹의 핵심 소스로 사용합니다. 제품 프로필을 완성하고 초기 리뷰를 확보하세요.',
  difficulty: 2,
  estimatedImpact: 6,
  timeToComplete: '2시간',
  externalUrl: 'https://www.g2.com/products/new',
  priority: 12,
}
```

#### GROWING (category 15~21점)
```typescript
{
  id: 'rx-cat-grw-01',
  dimension: 'category',
  title: '제3자 비교 리뷰에서 상위 언급을 확보하세요',
  description: '카테고리 순위를 높이려면 제3자가 작성한 비교 글에서 상위에 언급되어야 합니다. 리뷰어/블로거에게 제품 리뷰를 요청하세요.',
  difficulty: 3,
  estimatedImpact: 5,
  timeToComplete: '1일',
  priority: 10,
},
{
  id: 'rx-cat-grw-02',
  dimension: 'category',
  title: '경쟁사 대비 차별화 포인트를 명확히 하세요',
  description: 'AI가 "best {category}"에 대답할 때, 차별화된 이유가 있는 제품을 추천합니다. "vs {경쟁사}" 비교 페이지를 만들어 차별점을 구조화하세요.',
  difficulty: 2,
  estimatedImpact: 5,
  timeToComplete: '반나절',
  priority: 12,
}
```

#### STRONG (category 22~28점)
```typescript
{
  id: 'rx-cat-str-01',
  dimension: 'category',
  title: 'Top 3 진입을 위해 유저 리뷰를 집중 확보하세요',
  description: '카테고리 상위권에 진입하려면 리뷰 수와 품질이 결정적입니다. Product Hunt, G2에서 실제 유저 리뷰를 요청하세요.',
  difficulty: 2,
  estimatedImpact: 4,
  timeToComplete: '반나절',
  priority: 10,
},
{
  id: 'rx-cat-str-02',
  dimension: 'category',
  title: '인접 카테고리로 영역을 확장하세요',
  description: '현재 카테고리에서 강하다면, 인접한 새 카테고리에서도 인지도를 확보하세요. 다중 카테고리 존재감이 AI 추천 확률을 높입니다.',
  difficulty: 3,
  estimatedImpact: 4,
  timeToComplete: '1일',
  priority: 15,
}
```

#### PERFECT (category 29~35점)
```typescript
{
  id: 'rx-cat-prf-01',
  dimension: 'category',
  title: '카테고리 1위 방어 전략을 수립하세요',
  description: '축하합니다! 카테고리 최상위입니다. 주간 모니터링으로 순위 변동을 감지하고, 신규 경쟁자 진입 시 즉시 대응하세요.',
  difficulty: 1,
  estimatedImpact: 1,
  timeToComplete: '10분/주',
  priority: 50,
}
```

---

### 4-3. Co-Recommendation 차원 (max=20)

#### INVISIBLE (corec 0~4점)
```typescript
{
  id: 'rx-cor-inv-01',
  dimension: 'corec',
  title: 'AlternativeTo에 제품을 등록하세요',
  description: 'AI가 "X 대안"을 추천할 때 AlternativeTo 데이터를 참고합니다. 경쟁사의 Alternative로 등록하면 함께 추천될 확률이 높아집니다.',
  difficulty: 1,
  estimatedImpact: 5,
  timeToComplete: '30분',
  externalUrl: 'https://alternativeto.net/submit/',
  priority: 10,
},
{
  id: 'rx-cor-inv-02',
  dimension: 'corec',
  title: '"vs {경쟁사}" 비교 글을 작성하세요',
  description: 'AI가 제품 추천 시 함께 언급할 대안을 찾습니다. "{내 제품} vs {경쟁사}" 비교 콘텐츠가 있으면 Co-Recommendation에 포함될 확률이 크게 높아집니다.',
  difficulty: 2,
  estimatedImpact: 5,
  timeToComplete: '2시간',
  priority: 12,
},
{
  id: 'rx-cor-inv-03',
  dimension: 'corec',
  title: 'Reddit "대안 추천" 스레드에 참여하세요',
  description: '"looking for {category} alternative" 스레드를 찾아 자연스럽게 제품을 소개하세요. Reddit은 AI 학습 데이터의 핵심 소스입니다.',
  difficulty: 1,
  estimatedImpact: 4,
  timeToComplete: '1시간',
  priority: 15,
}
```

#### EMERGING (corec 5~8점)
```typescript
{
  id: 'rx-cor-emg-01',
  dimension: 'corec',
  title: '크로스 프로모션 파트너십을 시도하세요',
  description: '함께 추천되는 제품들과 상호 링크/언급 파트너십을 만드세요. "Pairs well with {파트너}" 문구가 AI 추천에서 함께 언급되는 효과를 줍니다.',
  difficulty: 2,
  estimatedImpact: 4,
  timeToComplete: '반나절',
  priority: 10,
},
{
  id: 'rx-cor-emg-02',
  dimension: 'corec',
  title: '비교 리뷰 플랫폼에서 리뷰를 확보하세요',
  description: 'G2, Capterra, TrustRadius 등에서 리뷰가 많을수록 AI가 동일 카테고리 경쟁사와 함께 언급할 확률이 높아집니다.',
  difficulty: 2,
  estimatedImpact: 4,
  timeToComplete: '반나절',
  priority: 12,
}
```

#### GROWING (corec 9~12점)
```typescript
{
  id: 'rx-cor-grw-01',
  dimension: 'corec',
  title: '통합(Integration) 마켓플레이스에 등록하세요',
  description: 'Zapier, Make.com 등 통합 플랫폼에 등록하면 다른 도구와의 연결 맥락이 생겨 Co-Recommendation이 자연스럽게 증가합니다.',
  difficulty: 3,
  estimatedImpact: 4,
  timeToComplete: '1일',
  priority: 10,
}
```

#### STRONG (corec 13~16점)
```typescript
{
  id: 'rx-cor-str-01',
  dimension: 'corec',
  title: '상위 경쟁사를 벤치마크하고 차별화하세요',
  description: 'CoRec 리더보드에서 당신과 함께 추천되는 상위 제품들을 분석하세요. 그들의 강점을 인정하되, 당신만의 차별점을 강화하는 콘텐츠를 만드세요.',
  difficulty: 2,
  estimatedImpact: 3,
  timeToComplete: '반나절',
  priority: 10,
}
```

#### PERFECT (corec 17~20점)
```typescript
{
  id: 'rx-cor-prf-01',
  dimension: 'corec',
  title: 'Co-Recommendation 네트워크를 모니터링하세요',
  description: '훌륭합니다! 다양한 제품과 함께 추천되고 있습니다. 새로운 경쟁자가 진입하는지 주간 확인하고, 기존 파트너십을 유지하세요.',
  difficulty: 1,
  estimatedImpact: 1,
  timeToComplete: '10분/주',
  priority: 50,
}
```

---

### 4-4. Web Authority 차원 (max=10)

#### INVISIBLE (web 0~2점)
```typescript
{
  id: 'rx-web-inv-01',
  dimension: 'web',
  title: 'Hacker News, Reddit, Product Hunt에 글을 게시하세요',
  description: 'Tier-1 사이트(HN, Reddit, PH, G2, Capterra)에 제품이 한 번도 언급되지 않았습니다. 이 플랫폼에 제품을 소개하는 것이 Web Authority의 첫걸음입니다.',
  difficulty: 2,
  estimatedImpact: 4,
  timeToComplete: '2시간',
  priority: 10,
},
{
  id: 'rx-web-inv-02',
  dimension: 'web',
  title: '업계 미디어에 보도자료를 배포하세요',
  description: 'TechCrunch, The Verge 같은 Tier-1 미디어에 보도자료를 보내세요. 어렵다면 IndieHackers, BetaList 같은 Tier-2부터 시작하세요.',
  difficulty: 3,
  estimatedImpact: 5,
  timeToComplete: '1일',
  priority: 15,
}
```

#### EMERGING (web 3~4점)
```typescript
{
  id: 'rx-web-emg-01',
  dimension: 'web',
  title: 'Tier-1 사이트 언급을 확보하세요',
  description: '현재 Tier-2 사이트에서만 언급되고 있습니다. TechCrunch, Wired 등 Tier-1 미디어에 피칭하거나, 업계 컨퍼런스 발표를 통해 Tier-1 커버리지를 확보하세요.',
  difficulty: 3,
  estimatedImpact: 4,
  timeToComplete: '1일',
  priority: 10,
}
```

#### GROWING (web 5~6점)
```typescript
{
  id: 'rx-web-grw-01',
  dimension: 'web',
  title: '게스트 포스트와 외부 기고를 늘리세요',
  description: '업계 블로그, 미디어에 게스트 포스트를 작성하세요. 자연스러운 백링크가 Web Authority를 높이고, AI가 신뢰할 수 있는 소스로 인식하게 합니다.',
  difficulty: 2,
  estimatedImpact: 3,
  timeToComplete: '반나절',
  priority: 10,
}
```

#### STRONG (web 7~8점)
```typescript
{
  id: 'rx-web-str-01',
  dimension: 'web',
  title: '정기적인 미디어 노출 전략을 수립하세요',
  description: '분기별 보도자료, 월별 블로그 기고 등 꾸준한 미디어 노출 루틴을 만드세요. 일회성이 아닌 지속적 존재감이 Web Authority 유지의 핵심입니다.',
  difficulty: 2,
  estimatedImpact: 2,
  timeToComplete: '반나절',
  priority: 10,
}
```

#### PERFECT (web 9~10점)
```typescript
{
  id: 'rx-web-prf-01',
  dimension: 'web',
  title: 'Web Authority를 유지하며 새로운 채널을 탐색하세요',
  description: '최고 수준의 웹 권위를 달성했습니다. 기존 채널 유지에 집중하되, 신규 미디어 플랫폼이나 팟캐스트 등으로 채널을 다각화하세요.',
  difficulty: 1,
  estimatedImpact: 1,
  timeToComplete: '10분/주',
  priority: 50,
}
```

---

## 5. generatePrescription() 함수 시그니처와 로직

```typescript
/**
 * unified_v15 JSONB 결과를 받아 진단 + 처방 + 벤치마크를 생성한다.
 * 규칙 기반, LLM 미사용, 비용 $0.
 *
 * @param unified - /v1/check에서 계산된 UnifiedScoreResult
 * @returns PrescriptionResult
 */
export function generatePrescription(unified: UnifiedScoreResult): PrescriptionResult {
  const overallLevel = classifyLevel(unified.score)

  // 1. 4차원별 진단 생성
  const diagnoses = unified.dimensions.map(dim => buildDiagnosis(dim, unified.engine_grades))

  // 2. 20규칙에서 현재 레벨에 해당하는 처방 필터링
  const allActions = unified.dimensions.flatMap(dim => {
    const dimLevel = classifyDimensionLevel(dim.score, dim.max)
    return PRESCRIPTION_RULES[dim.id][dimLevel]
  })

  // 3. Top 3 선정
  const prescriptions = selectTop3(allActions, unified.dimensions)

  // 4. Gap 계산
  const gap = computeGap(unified)

  // 5. 벤치마크 추출
  const benchmark = extractBenchmark(unified)

  return {
    overall: {
      level: overallLevel,
      summary: LEVEL_SUMMARIES[overallLevel],
      gap,
    },
    diagnoses,
    prescriptions,
    allActions,
    benchmark,
    generatedAt: new Date().toISOString(),
  }
}
```

### 레벨별 overall.summary 텍스트

```typescript
const LEVEL_SUMMARIES: Record<PrescriptionLevel, string> = {
  invisible: 'AI가 아직 당신의 제품을 모릅니다. 지금이 시작할 때입니다.',
  emerging: 'AI가 알기 시작했지만, 추천까지는 갈 길이 멉니다.',
  growing: '성장 중입니다. 차별화 전략이 다음 레벨의 열쇠입니다.',
  strong: '강한 존재감! Top 3 진입과 방어 전략에 집중하세요.',
  perfect: '최고 수준의 AI Visibility. 유지와 확장에 집중하세요.',
}
```

---

## 6. 진단 로직 (buildDiagnosis)

4차원별 `summary`와 `detail` 문장을 규칙 기반으로 생성한다.

```typescript
function buildDiagnosis(
  dim: DimensionScore,
  engineGrades: EngineGradeInfo[],
): Diagnosis {
  const level = classifyDimensionLevel(dim.score, dim.max)
  let summary: string
  let detail: string

  switch (dim.id) {
    case 'recognition': {
      const gemini = engineGrades.find(e => e.engine === 'gemini')
      const perplexity = engineGrades.find(e => e.engine === 'perplexity')
      const recognizedCount = [gemini, perplexity].filter(e => e?.recognized).length
      const recommendedCount = [gemini, perplexity].filter(e => e?.recommended).length
      summary = recognizedCount === 0
        ? 'AI 엔진 2개 중 0개가 당신을 인식합니다.'
        : recommendedCount === 2
        ? '모든 AI 엔진이 당신을 추천합니다!'
        : `AI 엔진 2개 중 ${recognizedCount}개가 인식, ${recommendedCount}개가 추천합니다.`
      detail = [
        `Gemini: ${gemini?.recommended ? '추천 (A등급)' : gemini?.recognized ? '인식만 (C등급)' : '미인식 (F등급)'}`,
        `Perplexity: ${perplexity?.recommended ? '추천 (A등급)' : perplexity?.recognized ? '인식만 (C등급)' : '미인식 (F등급)'}`,
      ].join(' / ')
      break
    }
    case 'category': {
      const rankings = dim.breakdown.rankings as Array<{ rank: number | null }> | undefined
      const bestRank = rankings?.reduce((best: number | null, r) => {
        if (r.rank == null) return best
        return best == null ? r.rank : Math.min(best, r.rank)
      }, null) ?? null
      summary = bestRank === null
        ? 'AI에게 "best" 질문을 했을 때 카테고리 순위권에 등장하지 않습니다.'
        : bestRank <= 3
        ? `카테고리 Top ${bestRank}! 상위권에 안착했습니다.`
        : `카테고리 ${bestRank}위. 상위권 진입이 필요합니다.`
      detail = bestRank === null
        ? '"best {category}" 쿼리에서 Top-20에 미등장'
        : `최고 순위: ${bestRank}위`
      break
    }
    case 'corec': {
      const uniqueCount = (dim.breakdown.unique_count as number) ?? 0
      summary = uniqueCount === 0
        ? 'AI가 다른 제품을 추천할 때 당신이 함께 언급되지 않습니다.'
        : uniqueCount <= 3
        ? `${uniqueCount}개 제품과 함께 추천됩니다. 더 넓은 네트워크가 필요합니다.`
        : `${uniqueCount}개 제품과 함께 추천되고 있습니다.`
      const top5 = (dim.breakdown.top_5 as string[]) ?? []
      detail = top5.length > 0
        ? `함께 추천되는 제품: ${top5.join(', ')}`
        : '함께 추천되는 제품 없음'
      break
    }
    case 'web': {
      const tier1 = (dim.breakdown.tier1_count as number) ?? 0
      const tier2 = (dim.breakdown.tier2_count as number) ?? 0
      const total = tier1 + tier2
      summary = total === 0
        ? '주요 웹사이트에서 제품이 언급되지 않습니다.'
        : `Tier-1 ${tier1}건, Tier-2 ${tier2}건의 웹 언급이 있습니다.`
      detail = total === 0
        ? 'Tier-1/2 사이트 언급 0건'
        : `Tier-1(TechCrunch 등): ${tier1}건 / Tier-2(블로그 등): ${tier2}건`
      break
    }
  }

  return {
    dimension: dim.id,
    label: dim.label,
    score: dim.score,
    max: dim.max,
    level,
    summary,
    detail,
  }
}
```

---

## 7. Top 3 선정 로직 (selectTop3)

### 우선순위 기준 (복합 정렬)

```typescript
function selectTop3(actions: Action[], dimensions: DimensionScore[]): Action[] {
  // 1차: 낮은 달성률 차원의 처방 우선 (점수 낮을수록 가치 높음)
  // 2차: estimatedImpact 높은 것 우선
  // 3차: difficulty 낮은 것 우선 (쉬운 것부터)
  // 4차: priority 낮은 것 우선 (내부 기본 정렬)

  const dimAchievement: Record<DimensionId, number> = {} as Record<DimensionId, number>
  for (const dim of dimensions) {
    dimAchievement[dim.id] = dim.max > 0 ? dim.score / dim.max : 1
  }

  return [...actions]
    .sort((a, b) => {
      // 1차: 달성률 낮은 차원 우선
      const achA = dimAchievement[a.dimension] ?? 1
      const achB = dimAchievement[b.dimension] ?? 1
      if (achA !== achB) return achA - achB

      // 2차: 임팩트 큰 것 우선
      if (a.estimatedImpact !== b.estimatedImpact) return b.estimatedImpact - a.estimatedImpact

      // 3차: 난이도 낮은 것 우선
      if (a.difficulty !== b.difficulty) return a.difficulty - b.difficulty

      // 4차: priority
      return a.priority - b.priority
    })
    .slice(0, 3)
}
```

### 선정 로직 근거
- **"점수가 낮을수록 처방이 더 구체적"** (bigpie 1.6 원칙): 가장 약한 차원에 대한 처방을 우선 배치
- **"쉬운 것부터"**: 유저 이탈 방지를 위해 difficulty 1(30분)을 먼저 제안
- 4차원이 모두 비슷하면 estimatedImpact가 높은 것이 우선
- Top 3에 동일 차원만 집중되지 않도록 `allActions`에서 다양한 차원이 자연스럽게 섞임 (달성률 정렬이 이를 보장)

---

## 8. Gap 시각화 데이터 (computeGap)

```typescript
const LEVEL_THRESHOLDS: Array<{ level: PrescriptionLevel; min: number }> = [
  { level: 'perfect', min: 81 },
  { level: 'strong', min: 61 },
  { level: 'growing', min: 41 },
  { level: 'emerging', min: 21 },
  { level: 'invisible', min: 0 },
]

function computeGap(unified: UnifiedScoreResult): GapInfo {
  const currentLevel = classifyLevel(unified.score)
  const currentIdx = LEVEL_THRESHOLDS.findIndex(t => t.level === currentLevel)
  const nextIdx = currentIdx - 1   // 한 단계 위 (perfect에서는 -1 → 없음)

  const nextLevel = nextIdx >= 0 ? LEVEL_THRESHOLDS[nextIdx].level : null
  const nextThreshold = nextIdx >= 0 ? LEVEL_THRESHOLDS[nextIdx].min : null
  const pointsNeeded = nextThreshold !== null ? Math.max(0, nextThreshold - unified.score) : 0

  const dimensionGaps = unified.dimensions.map(dim => ({
    dimension: dim.id as DimensionId,
    currentScore: dim.score,
    maxScore: dim.max,
    potentialGain: Math.round((dim.max - dim.score) * 10) / 10,
    normalizedAchievement: dim.max > 0 ? Math.round((dim.score / dim.max) * 100) / 100 : 0,
  }))

  return {
    currentLevel,
    currentScore: unified.score,
    nextLevel,
    nextThreshold,
    pointsNeeded,
    dimensionGaps,
  }
}
```

### Gap 시각화 FE 활용 예시

```
현재: EMERGING (27.5점)
다음: GROWING (41점)
필요: 13.5점

차원별 잠재 점수:
  Recognition  5/35  (잠재 +30점) ████░░░░░░░░░░ 14%
  Category    15/35  (잠재 +20점) ██████████░░░░ 43%
  CoRec        5/20  (잠재 +15점) ██████░░░░░░░░ 25%
  Web          2.5/10 (잠재 +7.5점) ██████░░░░░░░ 25%
```

---

## 9. 벤치마크 추출 (extractBenchmark)

```typescript
function extractBenchmark(unified: UnifiedScoreResult): BenchmarkInfo {
  const catDim = unified.dimensions.find(d => d.id === 'category')
  const corecDim = unified.dimensions.find(d => d.id === 'corec')

  // 카테고리명: probeRedesign이 breakdown에 남긴 경우 사용
  const category = (catDim?.breakdown?.category as string) ?? null

  // 순위: rankings 배열에서 최고 순위 추출
  const rankings = catDim?.breakdown?.rankings as Array<{ rank: number | null }> | undefined
  const yourRank = rankings?.reduce((best: number | null, r) => {
    if (r.rank == null) return best
    return best == null ? r.rank : Math.min(best, r.rank)
  }, null) ?? null

  // 리더: CoRec top_5에서 추출
  const leaders = (corecDim?.breakdown?.top_5 as string[]) ?? []

  return { category, yourRank, leaders }
}
```

---

## 10. API 변경: /v1/check 응답에 prescription 추가

### 변경 위치: `index.ts` 984번째 줄 부근

**현재:**
```typescript
return c.json({ ...engineResult, ...probeData, co_recommendations_top: coRecs, unified_v15: unifiedV15 })
```

**변경 후:**
```typescript
import { generatePrescription, PrescriptionResult } from './prescriptionEngine'

// ... 기존 unified_v15 계산 직후에 추가:
let prescription: PrescriptionResult | null = null
if (unifiedV15) {
  try {
    prescription = generatePrescription(unifiedV15)
  } catch (err) {
    console.error('[PRESCRIPTION] generate error:', err)
  }
}

return c.json({
  ...engineResult,
  ...probeData,
  co_recommendations_top: coRecs,
  unified_v15: unifiedV15,
  prescription,    // <-- 신규 필드
})
```

### 응답 구조 (PRESCRIPTION-02에서 구현)

```jsonc
{
  // ... 기존 필드 ...
  "unified_v15": { /* UnifiedScoreResult */ },
  "prescription": {
    "overall": {
      "level": "emerging",
      "summary": "AI가 알기 시작했지만, 추천까지는 갈 길이 멉니다.",
      "gap": {
        "currentLevel": "emerging",
        "currentScore": 27.5,
        "nextLevel": "growing",
        "nextThreshold": 41,
        "pointsNeeded": 13.5,
        "dimensionGaps": [...]
      }
    },
    "diagnoses": [
      {
        "dimension": "recognition",
        "label": "Direct Recognition",
        "score": 5,
        "max": 35,
        "level": "invisible",
        "summary": "AI 엔진 2개 중 1개가 인식, 0개가 추천합니다.",
        "detail": "Gemini: 미인식 (F등급) / Perplexity: 인식만 (C등급)"
      },
      // ... 3개 더 (category, corec, web)
    ],
    "prescriptions": [
      // Top 3 정렬 완료
    ],
    "allActions": [
      // 전체 후보 (UI "더 보기" 용)
    ],
    "benchmark": {
      "category": "AI Visibility Tools",
      "yourRank": null,
      "leaders": ["Otterly AI", "trysight.ai"]
    },
    "generatedAt": "2026-05-01T10:00:00.000Z"
  }
}
```

### scores 테이블 저장
기존 `unified_v15` JSONB 컬럼에 저장되는 것과 별도로, prescription은 **응답에만 포함하고 DB에 저장하지 않는다** (Phase 2d EFFECT-01에서 prescription_logs 테이블 별도 설계). 규칙 기반이므로 동일 입력에 동일 출력이 보장되어 재생성이 가능하다.

---

## 11. 테스트 케이스 (최소 5개)

### TC-01: 점수 0 (완전 미인식)
```typescript
const input: UnifiedScoreResult = {
  score: 0, max_score: 100,
  dimensions: [
    { id: 'recognition', label: 'Direct Recognition', score: 0, max: 35, breakdown: {} },
    { id: 'category', label: 'Category Ranking', score: 0, max: 35, breakdown: { rankings: [] } },
    { id: 'corec', label: 'Co-Recommendation Graph', score: 0, max: 20, breakdown: { unique_count: 0, top_5: [] } },
    { id: 'web', label: 'Web Authority Proxy', score: 0, max: 10, breakdown: { tier1_count: 0, tier2_count: 0 } },
  ],
  pass_indicator: 'invisible',
  engine_grades: [
    { engine: 'gemini', grade: 'F', description: 'Unaware', recognized: false, recommended: false },
    { engine: 'perplexity', grade: 'F', description: 'Unaware', recognized: false, recommended: false },
  ],
  // ... 나머지 필드 생략
}
// 기대:
//   overall.level === 'invisible'
//   prescriptions 3개 모두 difficulty 1~2 (쉬운 것 우선)
//   gap.pointsNeeded === 21 (EMERGING까지)
//   4차원 모두 진단 level === 'invisible'
```

### TC-02: 점수 15 (INVISIBLE 상위)
```typescript
// dimensions: recognition=5, category=0, corec=5, web=5
// 기대:
//   overall.level === 'invisible'
//   진단: recognition=emerging(14%), category=invisible(0%), corec=emerging(25%), web=growing(50%)
//   Top 3: category 처방이 우선 (달성률 0%로 가장 낮음)
//   gap.pointsNeeded === 6 (21-15)
```

### TC-03: 점수 35 (EMERGING 중간)
```typescript
// dimensions: recognition=10, category=15, corec=5, web=5
// 기대:
//   overall.level === 'emerging'
//   진단: recognition=emerging(29%), category=growing(43%), corec=emerging(25%), web=growing(50%)
//   Top 3: recognition + corec 처방 우선 (낮은 달성률)
//   gap.pointsNeeded === 6 (41-35)
```

### TC-04: 점수 55 (GROWING)
```typescript
// dimensions: recognition=17.5, category=25, corec=5, web=7.5
// 기대:
//   overall.level === 'growing'
//   진단: corec 차원이 가장 약함 (25%)
//   Top 3: corec 처방 1~2개 + recognition 1개
//   gap.pointsNeeded === 6 (61-55)
```

### TC-05: 점수 85 (PERFECT)
```typescript
// dimensions: recognition=30, category=30, corec=17, web=8
// 기대:
//   overall.level === 'perfect'
//   처방 모두 "모니터링/유지" 성격 (difficulty 1)
//   gap.nextLevel === null, gap.pointsNeeded === 0
//   overall.summary에 "유지와 확장" 키워드 포함
```

### TC-06: 엣지 케이스 — 경계값 (점수 정확히 21, 41, 61, 81)
```typescript
// score=21 → 'emerging' (21 이상이면 emerging)
// score=41 → 'growing'
// score=61 → 'strong'
// score=81 → 'perfect'
```

### TC-07: 엣지 케이스 — dimension breakdown 누락
```typescript
// breakdown이 빈 객체일 때 진단이 에러 없이 기본값으로 생성되는지 확인
// rankings: undefined → bestRank = null
// unique_count: undefined → 0
// tier1_count/tier2_count: undefined → 0
```

---

## 12. 구현 순서 (4시간 배분)

| # | 작업 | 예상 |
|---|------|------|
| 1 | `prescriptionEngine.ts` 타입 정의 + PRESCRIPTION_RULES 상수 | 1h |
| 2 | `generatePrescription()` + 보조 함수 (buildDiagnosis, selectTop3, computeGap, extractBenchmark) | 1.5h |
| 3 | `score.test.ts`에 테스트 케이스 7개 추가 | 1h |
| 4 | 빌드 확인 + 린트 | 0.5h |

> PRESCRIPTION-02 (D2, 2h)에서 index.ts 수정 + 스테이징 배포

---

## 13. 규칙 저장 구조 (PRESCRIPTION_RULES 상수)

```typescript
// 5레벨 x 4차원 = 20 규칙 그룹, 각 그룹에 1~4개 Action
const PRESCRIPTION_RULES: Record<DimensionId, Record<PrescriptionLevel, Action[]>> = {
  recognition: {
    invisible: [/* rx-rec-inv-01 ~ 04 */],
    emerging:  [/* rx-rec-emg-01 ~ 02 */],
    growing:   [/* rx-rec-grw-01 ~ 02 */],
    strong:    [/* rx-rec-str-01 ~ 02 */],
    perfect:   [/* rx-rec-prf-01 ~ 02 */],
  },
  category: {
    invisible: [/* rx-cat-inv-01 ~ 02 */],
    emerging:  [/* rx-cat-emg-01 ~ 02 */],
    growing:   [/* rx-cat-grw-01 ~ 02 */],
    strong:    [/* rx-cat-str-01 ~ 02 */],
    perfect:   [/* rx-cat-prf-01 */],
  },
  corec: {
    invisible: [/* rx-cor-inv-01 ~ 03 */],
    emerging:  [/* rx-cor-emg-01 ~ 02 */],
    growing:   [/* rx-cor-grw-01 */],
    strong:    [/* rx-cor-str-01 */],
    perfect:   [/* rx-cor-prf-01 */],
  },
  web: {
    invisible: [/* rx-web-inv-01 ~ 02 */],
    emerging:  [/* rx-web-emg-01 */],
    growing:   [/* rx-web-grw-01 */],
    strong:    [/* rx-web-str-01 */],
    perfect:   [/* rx-web-prf-01 */],
  },
}
```

총 Action 수: 4+2+2+2+2 + 2+2+2+2+1 + 3+2+1+1+1 + 2+1+1+1+1 = **35개**

---

## 14. 기존 코드 연동 포인트 정리

| 기존 모듈 | 연동 방식 | 변경 여부 |
|-----------|----------|----------|
| `unifiedScore.ts` | 타입 import (DimensionId, DimensionScore, UnifiedScoreResult, EngineGradeInfo) | 변경 없음 |
| `probeRedesign.ts` | 직접 참조 없음 (unifiedV15.dimensions.breakdown 통해 간접 소비) | 변경 없음 |
| `unifiedScoreAdapter.ts` | 직접 참조 없음 | 변경 없음 |
| `index.ts` | PRESCRIPTION-02에서 수정: import + generatePrescription() 호출 + 응답 필드 추가 | D2에서 수정 |

---

*PRESCRIPTION-01 상세 구현 스펙 — 2026-04-27 CPO 작성 / CEO 승인 대기*
