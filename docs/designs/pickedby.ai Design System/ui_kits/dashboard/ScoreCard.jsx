const tierOfD = (s) => s >= 75 ? { name: 'PICKED', color: '#00E676' }
  : s >= 50 ? { name: 'SEEN', color: '#FFEB3B' }
  : s >= 25 ? { name: 'NOTICED', color: '#FF9100' }
  : { name: 'INVISIBLE', color: '#FF3D3D' };

const DashScoreRing = ({ score }) => {
  const t = tierOfD(score);
  return (
    <div className="db-ring" style={{ background: `conic-gradient(${t.color} ${score}%, #222 0)` }}>
      <div className="db-ring-inner">
        <div className="db-ring-val">{score}</div>
        <div className="db-ring-denom">/ 100</div>
        <div className="db-ring-tier" style={{ color: t.color }}>✦ {t.name}</div>
      </div>
    </div>
  );
};

const DimRow = ({ name, value, max = 100, detail }) => {
  const pct = Math.round((value / max) * 100);
  const t = tierOfD(pct);
  return (
    <div className="db-dim">
      <div className="db-dim-head">
        <div className="db-dim-name">{name}</div>
        <div className="db-dim-val">{value}<i>/{max}</i></div>
      </div>
      <div className="db-dim-track"><div className="db-dim-fill" style={{ width: pct + '%', background: t.color }} /></div>
      {detail && <div className="db-dim-detail">{detail}</div>}
    </div>
  );
};

const ScoreCard = ({ product, score, dims, date = '3 days ago' }) => (
  <section className="dash-card dash-card-pad">
    <header className="db-card-head">
      <div>
        <div className="db-eyebrow">CURRENT SCORE</div>
        <h2 className="db-card-title">{product}</h2>
      </div>
      <div className="db-card-meta">
        <span className="live-dot small"/> Live · last probed {date}
      </div>
    </header>
    <div className="db-score-body">
      <DashScoreRing score={score} />
      <div className="db-dim-list">
        {dims.map(d => <DimRow key={d.name} {...d} />)}
      </div>
    </div>
  </section>
);

window.tierOfD = tierOfD;
window.DashScoreRing = DashScoreRing;
window.DimRow = DimRow;
window.ScoreCard = ScoreCard;
