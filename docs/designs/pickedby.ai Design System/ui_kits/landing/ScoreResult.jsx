const tierOf = (s) => s >= 75 ? { name: 'PICKED', color: '#00E676' }
  : s >= 50 ? { name: 'SEEN', color: '#FFEB3B' }
  : s >= 25 ? { name: 'NOTICED', color: '#FF9100' }
  : { name: 'INVISIBLE', color: '#FF3D3D' };

const ScoreRing = ({ score }) => {
  const t = tierOf(score);
  return (
    <div className="score-ring" style={{ background: `conic-gradient(${t.color} ${score}%, #222 0)` }}>
      <div className="score-ring-inner">
        <div className="score-val">{score}</div>
        <div className="score-denom">/ 100</div>
        <div className="score-tier" style={{ color: t.color }}>✦ {t.name}</div>
      </div>
    </div>
  );
};

const Dimension = ({ name, value, max = 100 }) => {
  const pct = Math.round((value / max) * 100);
  const t = tierOf(pct);
  return (
    <div className="dim-row">
      <div className="dim-name" style={{ color: t.color }}>{name.toUpperCase()}</div>
      <div className="dim-track"><div className="dim-fill" style={{ width: pct + '%', background: t.color }} /></div>
      <div className="dim-val">{value}<i>/{max}</i></div>
    </div>
  );
};

const ScoreResult = ({ product = 'pickedby.ai', score = 87, onShare, onClaim }) => (
  <section className="score-result pba-card">
    <div className="score-result-head">
      <div className="eyebrow">✦ SCAN RESULTS · {product.toUpperCase()}</div>
      <div className="meta">PROBED 50 QUERIES · 4 AI MODELS</div>
    </div>
    <div className="score-result-body">
      <ScoreRing score={score} />
      <div className="dim-list">
        <Dimension name="Web Presence" value={23} max={25} />
        <Dimension name="Source Authority" value={17} max={20} />
        <Dimension name="Recommendation Signals" value={15} max={20} />
        <Dimension name="Community Validation" value={14} max={20} />
        <Dimension name="Competitive Context" value={8} max={15} />
      </div>
    </div>
    <div className="score-result-actions">
      <button className="pba-btn pba-btn-primary" onClick={onClaim}>CLAIM YOUR BADGE</button>
      <button className="pba-btn pba-btn-ghost" onClick={onShare}>SHARE ON X</button>
      <button className="pba-btn pba-btn-neutral">VIEW FULL REPORT →</button>
    </div>
  </section>
);

window.tierOf = tierOf;
window.ScoreRing = ScoreRing;
window.Dimension = Dimension;
window.ScoreResult = ScoreResult;
