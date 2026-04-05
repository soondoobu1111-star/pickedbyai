# 케이스 스터디: llms.txt 추가 후 AI Visibility Score 변화

> pickedby.ai가 자기 자신에게 도구를 적용한 실험

---

## 실험 개요

- **제품**: pickedby.ai
- **카테고리**: SaaS Tool
- **키워드**: AI visibility score for digital creators
- **날짜**: 2026-04-05

---

## BEFORE (llms.txt 추가 전)

**AI Visibility Score: 0 / 100**

| 쿼리 유형 | 결과 |
|---------|------|
| Direct name search | ❌ Not found |
| Best-of recommendation | ❌ Not found |
| Problem-solution search | ❌ Not found |

→ AI가 pickedby.ai의 존재 자체를 모름. 신규 제품 전형적인 0점.

---

## 조치사항

`https://pickedby.ai/llms.txt` 추가 (2026-04-05)

```
# pickedby.ai
> AI Visibility Score for digital creators
- 제품 설명, 사용법, 점수 기준, 핵심 키워드 포함
- GEO/AEO 최적화 키워드 명시
- 타겟 유저 (Gumroad, Etsy, Notion template 크리에이터) 명시
```

**llms.txt란?**
AI 시스템이 웹사이트를 이해할 수 있도록 구조화된 텍스트 파일.
`robots.txt`의 AI 버전. 구글에 sitemap 제출하는 것처럼, AI에게는 llms.txt.

---

## AFTER (llms.txt 추가 + Google Grounding 활성화 — 2026-04-05 당일)

**AI Visibility Score: 35 / 100** ← 0점에서 즉시 상승

| 쿼리 유형 | 결과 |
|---------|------|
| Direct name search | ✅ Found (rank 10) 🌐 실시간 웹검색 |
| Best-of recommendation | ❌ Not found 🌐 실시간 웹검색 |
| Problem-solution search | ❌ Not found 🌐 실시간 웹검색 |

→ Google Grounding 활성화 즉시 AI가 pickedby.ai를 실시간으로 찾기 시작.
→ "Best-of" / "Problem-solution" 쿼리는 아직 미반영 — 콘텐츠 축적 필요.
→ Grounding 없이는 신제품은 영원히 0점 — 실시간 웹검색이 핵심 발견.

> 이전 추정 (수주~수개월 소요):

재측정 명령:
```bash
curl -X POST https://api.pickedby.ai/v1/check \
  -H "Content-Type: application/json" \
  -d '{"product":"pickedby.ai","category":"SaaS Tool","keywords":"AI visibility score for digital creators"}'
```

---

## 홍보 활용 각도

### Twitter/X 스레드 초안

```
🧪 We ran pickedby.ai on... pickedby.ai itself.

Before: 0/100
AI had no idea we existed.

We added one text file: pickedby.ai/llms.txt
It tells AI what our product is, who it's for, why it matters.

After: 35/100
AI now finds us in direct searches. 🌐 Real-time web results.

Still missing from "best-of" lists — that takes more content + time.
But 0→35 in one day? That's the game.

Here's the exact llms.txt we used 👇
https://pickedby.ai/llms.txt

Sell on Gumroad, Etsy, or Notion templates?
Check your AI Visibility Score free:
pickedby.ai
```

### Reddit 포스트 각도 (r/SideProject / r/InternetIsBeautiful)
```
I built a tool that checks if AI recommends your product.
Then I ran it on my own product. Got 0/100.

Here's what I did to fix it (and how to check yours free)
```

---

## 다음 단계

- [ ] 2~4주 후 AFTER 점수 측정
- [ ] 실제 수치 업데이트 후 Twitter 스레드 발행
- [ ] Product Hunt 런칭 스토리에 포함
- [ ] 랜딩 페이지 "Our own score" 섹션 추가 고려 (Phase 2)
