# pickedby.ai 네비게이션 표준 템플릿

신규 페이지 생성 시 아래 그대로 복사·붙여넣기.

```html
<!-- CSS (style 블록에 추가) -->
.nav-logo { font-family: 'Press Start 2P', monospace; font-size: 0.85rem; color: var(--yellow); text-decoration: none; display: flex; align-items: center; gap: 8px; }
.nav-logo svg { flex-shrink: 0; }

<!-- HTML -->
<nav class="nav">
  <a href="/" class="nav-logo">
    <svg width="20" height="16" viewBox="0 0 20 16" fill="#FFD700" xmlns="http://www.w3.org/2000/svg" style="flex-shrink:0;"><rect x="0" y="0" width="2" height="4"/><rect x="9" y="0" width="2" height="4"/><rect x="18" y="0" width="2" height="4"/><rect x="0" y="4" width="20" height="2"/><rect x="0" y="6" width="2" height="6"/><rect x="18" y="6" width="2" height="6"/><rect x="4" y="8" width="2" height="2"/><rect x="9" y="8" width="2" height="2"/><rect x="14" y="8" width="2" height="2"/><rect x="0" y="12" width="20" height="2"/><rect x="2" y="14" width="16" height="2"/></svg>
    <span><span style="color:var(--yellow);">picked</span><span style="color:#fff;">by</span><span style="color:var(--yellow);">.ai</span></span>
  </a>
  <div class="nav-links">
    <a href="/blog/" style="color:#888;font-size:0.9rem;text-decoration:none;">Blog</a>
    <a href="/methodology/" style="color:#888;font-size:0.9rem;text-decoration:none;">How We Score</a>
    <a href="/dashboard.html" style="color:#000;background:var(--yellow);border:none;padding:0.45rem 1.1rem;border-radius:6px;font-weight:700;font-size:0.88rem;letter-spacing:0.03em;text-decoration:none;box-shadow:0 0 12px rgba(255,215,0,0.35);">Dashboard</a>
    <button class="nav-burger" onclick="document.querySelector('.nav-mobile').classList.toggle('open')" aria-label="Menu">&#9776;</button>
  </div>
</nav>
<div class="nav-mobile">
  <a href="/blog/">Blog</a>
  <a href="/methodology/">How We Score</a>
  <a href="/dashboard.html">Dashboard</a>
</div>
```

**규칙**: 크라운 SVG + 픽셀폰트 로고 필수 | Dashboard = 노란 버튼 | active state 금지 | 버튼 텍스트 "Dashboard" 고정
