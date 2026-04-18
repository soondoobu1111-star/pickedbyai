const Sidebar = ({ active = 'overview', onNav }) => {
  const items = [
    { id: 'overview',   label: 'Overview',    glyph: '◆' },
    { id: 'products',   label: 'My Products', glyph: '▲' },
    { id: 'probes',     label: 'Probe Log',   glyph: '≡' },
    { id: 'trends',     label: 'Trends',      glyph: '~' },
    { id: 'tools',      label: 'Tools',       glyph: '+' },
    { id: 'settings',   label: 'Settings',    glyph: '⚙' },
  ];
  return (
    <aside className="db-sidebar">
      <a className="nav-logo db-logo" href="#" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', color: '#FFD700' }}>
        <svg className="db-logo-mark" width="22" height="22" viewBox="0 0 20 20" shapeRendering="crispEdges" style={{ display: 'block', flex: 'none' }}>
          <rect width="20" height="20" fill="#000"/>
          <g fill="#FFD700" transform="translate(0,2)">
            <rect x="0" y="0" width="2" height="4"/><rect x="9" y="0" width="2" height="4"/><rect x="18" y="0" width="2" height="4"/>
            <rect x="0" y="4" width="20" height="2"/>
            <rect x="0" y="6" width="2" height="6"/><rect x="18" y="6" width="2" height="6"/>
            <rect x="4" y="8" width="2" height="2"/><rect x="9" y="8" width="2" height="2"/><rect x="14" y="8" width="2" height="2"/>
            <rect x="0" y="12" width="20" height="2"/>
            <rect x="2" y="14" width="16" height="2"/>
          </g>
        </svg>
        <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 12, color: '#FFD700', letterSpacing: '0.05em', whiteSpace: 'nowrap', textDecoration: 'none' }}>
          picked<i style={{ color: '#fff', fontStyle: 'normal' }}>by</i>.ai
        </span>
      </a>

      <div className="db-sidebar-section">
        <div className="db-section-label">WORKSPACE</div>
        {items.slice(0, 5).map(it => (
          <button key={it.id}
            className={'db-nav-item ' + (active === it.id ? 'on' : '')}
            onClick={() => onNav?.(it.id)}>
            <span className="g">{it.glyph}</span>
            <span>{it.label}</span>
          </button>
        ))}
      </div>

      <div className="db-sidebar-section">
        <div className="db-section-label">ACCOUNT</div>
        <button className={'db-nav-item ' + (active === 'settings' ? 'on' : '')} onClick={() => onNav?.('settings')}>
          <span className="g">⚙</span><span>Settings</span>
        </button>
      </div>

      <div className="db-sidebar-foot">
        <div className="db-plan">
          <div className="db-plan-label">FOUNDING 100</div>
          <div className="db-plan-val">Lifetime free</div>
        </div>
        <div className="db-user">
          <div className="db-avatar">S</div>
          <div className="db-user-meta">
            <div className="db-user-name">sohee@thunova.kr</div>
            <div className="db-user-sub"><span className="live-dot small"/> Beta · day 42</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

const TopBar = ({ product = 'pickedby.ai', delta = +6, model, onModel }) => (
  <div className="db-topbar">
    <div className="db-crumbs">
      <span>My Products</span>
      <span className="sep">/</span>
      <span className="cur">{product}</span>
    </div>
    <div className="db-topbar-right">
      <div className={'db-delta ' + (delta >= 0 ? 'up' : 'dn')}>
        {delta >= 0 ? '▲' : '▼'} {delta >= 0 ? '+' : ''}{delta} <i>· 7D</i>
      </div>
      <select className="db-select" value={model} onChange={(e) => onModel?.(e.target.value)}>
        <option value="all">ALL MODELS</option>
        <option value="gpt">CHATGPT · 4o</option>
        <option value="claude">CLAUDE · SONNET</option>
        <option value="pplx">PERPLEXITY</option>
        <option value="gemini">GEMINI · 2.0</option>
      </select>
      <button className="pba-btn pba-btn-primary pba-btn-sm">RUN NEW CHECK</button>
    </div>
  </div>
);

window.Sidebar = Sidebar;
window.TopBar = TopBar;
