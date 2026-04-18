const FoundingBar = () => (
  <div className="founding-bar">
    <div className="founding-bar-inner">
      <span className="live-dot" />
      <span>FOUNDING 100 · JOIN THE EARLY-ACCESS COHORT · <b>34 SPOTS LEFT</b></span>
      <span className="dim">LIFETIME FREE · NO CARD</span>
    </div>
  </div>
);

const Nav = ({ current = 'home' }) => (
  <nav className="pba-nav">
    <a className="nav-logo" href="#">
      <img src="../../assets/logo-512.png" alt="" />
      <span>picked<i>by</i>.ai</span>
    </a>
    <div className="nav-links">
      {['Home','Methodology','Manifesto','Blog','Changelog'].map(l => (
        <a key={l} className={current === l.toLowerCase() ? 'on' : ''} href="#">{l.toUpperCase()}</a>
      ))}
    </div>
    <button className="pba-btn pba-btn-primary pba-btn-sm">CHECK SCORE →</button>
  </nav>
);

window.FoundingBar = FoundingBar;
window.Nav = Nav;
