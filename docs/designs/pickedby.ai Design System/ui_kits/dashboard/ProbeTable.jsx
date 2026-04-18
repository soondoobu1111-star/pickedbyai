const ProbeTable = ({ rows }) => (
  <section className="dash-card">
    <header className="db-card-head db-card-head-compact">
      <div>
        <div className="db-eyebrow">PROBE RESULTS</div>
        <div className="db-card-sub">50 queries · 4 models · {rows.filter(r => r.found).length} matches</div>
      </div>
      <div className="db-filters">
        {['ALL','FOUND','MISSING'].map((l, i) => (
          <button key={l} className={'db-filter ' + (i === 0 ? 'on' : '')}>{l}</button>
        ))}
      </div>
    </header>
    <table className="db-table">
      <thead>
        <tr>
          <th style={{ width: 30 }}></th>
          <th>QUERY</th>
          <th style={{ width: 110 }}>MODEL</th>
          <th style={{ width: 70, textAlign: 'right' }}>RANK</th>
          <th style={{ width: 80, textAlign: 'right' }}>SENTIMENT</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            <td><span className={'db-mark ' + (r.found ? 'ok' : 'no')}>{r.found ? '✅' : '❌'}</span></td>
            <td className="db-q">{r.q}</td>
            <td className="db-model">{r.model}</td>
            <td className={'db-rank ' + (r.found ? '' : 'no')}>{r.found ? '#' + r.rank : '—'}</td>
            <td className={'db-sent ' + (r.sentiment > 0 ? 'up' : r.sentiment < 0 ? 'dn' : '')}>
              {r.found ? (r.sentiment > 0 ? '+' : '') + r.sentiment.toFixed(2) : '—'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </section>
);

const ToolsPanel = () => {
  const [copied, setCopied] = React.useState(null);
  const copy = (key, text) => {
    navigator.clipboard?.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1200);
  };
  const llmsTxt = `# pickedby.ai\n# The AI Visibility Platform\n\nUser-agent: GPTBot\nAllow: /\n\nUser-agent: PerplexityBot\nAllow: /\n\nUser-agent: ClaudeBot\nAllow: /\n\n# What we do:\n# - Measure how AI models recommend your product\n# - Generate this llms.txt automatically from your score`;
  const badge = `<a href="https://pickedby.ai/p/pickedby-ai">\n  <img src="https://pickedby.ai/badge/pickedby-ai.svg"\n       alt="✦ GOLD — AI Visibility Score 87/100"/>\n</a>`;
  return (
    <section className="dash-card dash-card-pad">
      <div className="db-eyebrow">TOOLS</div>
      <div className="db-tools-grid">
        <div>
          <div className="db-tool-head">
            <span>llms.txt</span>
            <button className="db-copy" onClick={() => copy('llms', llmsTxt)}>
              {copied === 'llms' ? '✓ COPIED' : 'COPY'}
            </button>
          </div>
          <pre className="db-code">{llmsTxt}</pre>
        </div>
        <div>
          <div className="db-tool-head">
            <span>Embed badge</span>
            <button className="db-copy" onClick={() => copy('badge', badge)}>
              {copied === 'badge' ? '✓ COPIED' : 'COPY'}
            </button>
          </div>
          <pre className="db-code">{badge}</pre>
        </div>
      </div>
    </section>
  );
};

const ProductRow = ({ name, score, delta, last, onOpen, active }) => {
  const t = tierOfD(score);
  return (
    <button className={'db-prod ' + (active ? 'on' : '')} onClick={onOpen}>
      <div className="db-prod-dot" style={{ background: t.color }} />
      <div className="db-prod-name">{name}</div>
      <div className="db-prod-score">{score}<i>/100</i></div>
      <div className={'db-delta ' + (delta >= 0 ? 'up' : 'dn')}>
        {delta >= 0 ? '▲' : '▼'} {delta >= 0 ? '+' : ''}{delta}
      </div>
      <div className="db-prod-last">{last}</div>
    </button>
  );
};

window.ProbeTable = ProbeTable;
window.ToolsPanel = ToolsPanel;
window.ProductRow = ProductRow;
