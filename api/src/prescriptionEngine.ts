// ─────────────────────────────────────────────────────────────
// prescriptionEngine.ts — 빅파이 1.6 처방 엔진
//
// 원칙: 규칙 기반, LLM 미사용, 비용 $0
// 근거: pickedbyAI/docs/bigpie-v1.6.md SS3
// 스펙: docs/outputs/d1_prescription_engine_spec_20260427.md
// 작성: 2026-04-27 (Phase 2a Day 1)
// ─────────────────────────────────────────────────────────────

import type { DimensionId, DimensionScore, UnifiedScoreResult, EngineGradeInfo } from './unifiedScore'

// ===== 타입 정의 =====

export type PrescriptionLevel = 'invisible' | 'emerging' | 'growing' | 'strong' | 'perfect'

export interface Diagnosis {
  dimension: DimensionId
  label: string
  score: number
  max: number
  level: PrescriptionLevel
  summary: string
  detail: string
}

export interface Action {
  id: string
  dimension: DimensionId
  title: string
  description: string
  difficulty: 1 | 2 | 3
  estimatedImpact: number
  timeToComplete: string
  externalUrl?: string
  priority: number
}

export interface GapInfo {
  currentLevel: PrescriptionLevel
  currentScore: number
  nextLevel: PrescriptionLevel | null
  nextThreshold: number | null
  pointsNeeded: number
  dimensionGaps: Array<{
    dimension: DimensionId
    currentScore: number
    maxScore: number
    potentialGain: number
    normalizedAchievement: number
  }>
}

export interface BenchmarkInfo {
  category: string | null
  yourRank: number | null
  leaders: string[]
}

export interface PrescriptionResult {
  overall: {
    level: PrescriptionLevel
    summary: string
    gap: GapInfo
  }
  diagnoses: Diagnosis[]
  prescriptions: Action[]
  allActions: Action[]
  benchmark: BenchmarkInfo
  generatedAt: string
}

// ===== 레벨 분류 =====

export function classifyLevel(score: number): PrescriptionLevel {
  if (score >= 81) return 'perfect'
  if (score >= 61) return 'strong'
  if (score >= 41) return 'growing'
  if (score >= 21) return 'emerging'
  return 'invisible'
}

function classifyDimensionLevel(score: number, max: number): PrescriptionLevel {
  const normalized = max > 0 ? (score / max) * 100 : 0
  return classifyLevel(normalized)
}

// ===== 레벨 요약 텍스트 =====

const LEVEL_SUMMARIES: Record<PrescriptionLevel, string> = {
  invisible: 'AI가 아직 당신의 제품을 모릅니다. 지금이 시작할 때입니다.',
  emerging: 'AI가 알기 시작했지만, 추천까지는 갈 길이 멉니다.',
  growing: '성장 중입니다. 차별화 전략이 다음 레벨의 열쇠입니다.',
  strong: '강한 존재감! Top 3 진입과 방어 전략에 집중하세요.',
  perfect: '최고 수준의 AI Visibility. 유지와 확장에 집중하세요.',
}

// ===== 20규칙 룰셋 =====

const PRESCRIPTION_RULES: Record<DimensionId, Record<PrescriptionLevel, Action[]>> = {
  // ── Recognition (max=35) ───────────────────────────────────
  recognition: {
    invisible: [
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
      },
    ],
    emerging: [
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
      },
    ],
    growing: [
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
      },
    ],
    strong: [
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
      },
    ],
    perfect: [
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
      },
    ],
  },

  // ── Category (max=35) ──────────────────────────────────────
  category: {
    invisible: [
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
      },
    ],
    emerging: [
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
      },
    ],
    growing: [
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
      },
    ],
    strong: [
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
      },
    ],
    perfect: [
      {
        id: 'rx-cat-prf-01',
        dimension: 'category',
        title: '카테고리 1위 방어 전략을 수립하세요',
        description: '축하합니다! 카테고리 최상위입니다. 주간 모니터링으로 순위 변동을 감지하고, 신규 경쟁자 진입 시 즉시 대응하세요.',
        difficulty: 1,
        estimatedImpact: 1,
        timeToComplete: '10분/주',
        priority: 50,
      },
    ],
  },

  // ── Co-Recommendation (max=20) ─────────────────────────────
  corec: {
    invisible: [
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
      },
    ],
    emerging: [
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
      },
    ],
    growing: [
      {
        id: 'rx-cor-grw-01',
        dimension: 'corec',
        title: '통합(Integration) 마켓플레이스에 등록하세요',
        description: 'Zapier, Make.com 등 통합 플랫폼에 등록하면 다른 도구와의 연결 맥락이 생겨 Co-Recommendation이 자연스럽게 증가합니다.',
        difficulty: 3,
        estimatedImpact: 4,
        timeToComplete: '1일',
        priority: 10,
      },
    ],
    strong: [
      {
        id: 'rx-cor-str-01',
        dimension: 'corec',
        title: '상위 경쟁사를 벤치마크하고 차별화하세요',
        description: 'CoRec 리더보드에서 당신과 함께 추천되는 상위 제품들을 분석하세요. 그들의 강점을 인정하되, 당신만의 차별점을 강화하는 콘텐츠를 만드세요.',
        difficulty: 2,
        estimatedImpact: 3,
        timeToComplete: '반나절',
        priority: 10,
      },
    ],
    perfect: [
      {
        id: 'rx-cor-prf-01',
        dimension: 'corec',
        title: 'Co-Recommendation 네트워크를 모니터링하세요',
        description: '훌륭합니다! 다양한 제품과 함께 추천되고 있습니다. 새로운 경쟁자가 진입하는지 주간 확인하고, 기존 파트너십을 유지하세요.',
        difficulty: 1,
        estimatedImpact: 1,
        timeToComplete: '10분/주',
        priority: 50,
      },
    ],
  },

  // ── Web Authority (max=10) ─────────────────────────────────
  web: {
    invisible: [
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
      },
    ],
    emerging: [
      {
        id: 'rx-web-emg-01',
        dimension: 'web',
        title: 'Tier-1 사이트 언급을 확보하세요',
        description: '현재 Tier-2 사이트에서만 언급되고 있습니다. TechCrunch, Wired 등 Tier-1 미디어에 피칭하거나, 업계 컨퍼런스 발표를 통해 Tier-1 커버리지를 확보하세요.',
        difficulty: 3,
        estimatedImpact: 4,
        timeToComplete: '1일',
        priority: 10,
      },
    ],
    growing: [
      {
        id: 'rx-web-grw-01',
        dimension: 'web',
        title: '게스트 포스트와 외부 기고를 늘리세요',
        description: '업계 블로그, 미디어에 게스트 포스트를 작성하세요. 자연스러운 백링크가 Web Authority를 높이고, AI가 신뢰할 수 있는 소스로 인식하게 합니다.',
        difficulty: 2,
        estimatedImpact: 3,
        timeToComplete: '반나절',
        priority: 10,
      },
    ],
    strong: [
      {
        id: 'rx-web-str-01',
        dimension: 'web',
        title: '정기적인 미디어 노출 전략을 수립하세요',
        description: '분기별 보도자료, 월별 블로그 기고 등 꾸준한 미디어 노출 루틴을 만드세요. 일회성이 아닌 지속적 존재감이 Web Authority 유지의 핵심입니다.',
        difficulty: 2,
        estimatedImpact: 2,
        timeToComplete: '반나절',
        priority: 10,
      },
    ],
    perfect: [
      {
        id: 'rx-web-prf-01',
        dimension: 'web',
        title: 'Web Authority를 유지하며 새로운 채널을 탐색하세요',
        description: '최고 수준의 웹 권위를 달성했습니다. 기존 채널 유지에 집중하되, 신규 미디어 플랫폼이나 팟캐스트 등으로 채널을 다각화하세요.',
        difficulty: 1,
        estimatedImpact: 1,
        timeToComplete: '10분/주',
        priority: 50,
      },
    ],
  },
}

// ===== 진단 생성 =====

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
    default: {
      summary = `점수: ${dim.score}/${dim.max}`
      detail = ''
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

// ===== Top 3 선정 =====

function selectTop3(actions: Action[], dimensions: DimensionScore[]): Action[] {
  const dimAchievement: Record<string, number> = {}
  for (const dim of dimensions) {
    dimAchievement[dim.id] = dim.max > 0 ? dim.score / dim.max : 1
  }

  return [...actions]
    .sort((a, b) => {
      // 1차: 달성률 낮은 차원 우선 (점수 낮을수록 처방 가치 높음)
      const achA = dimAchievement[a.dimension] ?? 1
      const achB = dimAchievement[b.dimension] ?? 1
      if (achA !== achB) return achA - achB

      // 2차: 임팩트 큰 것 우선
      if (a.estimatedImpact !== b.estimatedImpact) return b.estimatedImpact - a.estimatedImpact

      // 3차: 난이도 낮은 것 우선 (쉬운 것부터)
      if (a.difficulty !== b.difficulty) return a.difficulty - b.difficulty

      // 4차: priority
      return a.priority - b.priority
    })
    .slice(0, 3)
}

// ===== Gap 계산 =====

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
  const nextIdx = currentIdx - 1

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

// ===== 벤치마크 추출 =====

function extractBenchmark(unified: UnifiedScoreResult): BenchmarkInfo {
  const catDim = unified.dimensions.find(d => d.id === 'category')
  const corecDim = unified.dimensions.find(d => d.id === 'corec')

  const category = (catDim?.breakdown?.category as string) ?? null

  const rankings = catDim?.breakdown?.rankings as Array<{ rank: number | null }> | undefined
  const yourRank = rankings?.reduce((best: number | null, r) => {
    if (r.rank == null) return best
    return best == null ? r.rank : Math.min(best, r.rank)
  }, null) ?? null

  const leaders = (corecDim?.breakdown?.top_5 as string[]) ?? []

  return { category, yourRank, leaders }
}

// ===== 메인 함수 =====

/**
 * unified_v15 JSONB 결과를 받아 진단 + 처방 + 벤치마크를 생성한다.
 * 규칙 기반, LLM 미사용, 비용 $0.
 */
export function generatePrescription(unified: UnifiedScoreResult): PrescriptionResult {
  const overallLevel = classifyLevel(unified.score)

  // 4차원별 진단
  const diagnoses = unified.dimensions.map(dim =>
    buildDiagnosis(dim, unified.engine_grades ?? []),
  )

  // 현재 레벨 처방 후보 수집
  const allActions = unified.dimensions.flatMap(dim => {
    const dimLevel = classifyDimensionLevel(dim.score, dim.max)
    return PRESCRIPTION_RULES[dim.id]?.[dimLevel] ?? []
  })

  // Top 3 선정
  const prescriptions = selectTop3(allActions, unified.dimensions)

  // Gap 계산
  const gap = computeGap(unified)

  // 벤치마크 추출
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
