const FAQ = () => {
  const [open, setOpen] = React.useState(0);
  const items = [
    { q: 'Can you guarantee ChatGPT will recommend my product?',
      a: "No — and we'll never claim that. AI recommendations are dynamic. No tool can guarantee placement. We measure what's there today and tell you exactly what moves the needle." },
    { q: 'How do you run 50 queries without getting rate-limited?',
      a: 'We rotate across 4 models (ChatGPT 4o, Claude Sonnet, Perplexity, Gemini 2.0) with a cached query bank specific to your category. Results in ~10 seconds.' },
    { q: 'What is the llms.txt file?',
      a: "It's the robots.txt of the AI era — a plain-text manifest telling AI crawlers what your product does and who it's for. We generate yours automatically from your score result." },
    { q: 'Is this really free during the beta?',
      a: 'Yes. The first 100 founding users get lifetime free access. No credit card. No trial. No limits on checks during beta.' },
  ];
  return (
    <section className="faq">
      <div className="eyebrow">✦ COMMON QUESTIONS</div>
      <h2 className="pba-h2">Questions we get a lot</h2>
      <div className="faq-list">
        {items.map((it, i) => (
          <div key={i} className={'faq-item ' + (open === i ? 'open' : '')}>
            <button className="faq-q" onClick={() => setOpen(open === i ? -1 : i)}>
              <span>{it.q}</span>
              <span className="faq-chev">{open === i ? '−' : '+'}</span>
            </button>
            {open === i && <div className="faq-a">{it.a}</div>}
          </div>
        ))}
      </div>
    </section>
  );
};

const LogoTicker = () => (
  <section className="ticker">
    <div className="ticker-label">TRUSTED BY CREATORS ON</div>
    <div className="ticker-track">
      {['GUMROAD','NOTION','ETSY','LEMONSQUEEZY','SHOPIFY','PRODUCTHUNT','GUMROAD','NOTION','ETSY'].map((n,i)=>(
        <span key={i} className="ticker-item">{n}</span>
      ))}
    </div>
  </section>
);

const Footer = () => (
  <footer className="pba-footer">
    <div className="footer-brand">
      <a className="nav-logo" href="#"><img src="../../assets/logo-512.png"/><span>picked<i>by</i>.ai</span></a>
      <p>The AI Visibility Platform. Built by THUNOVA, Republic of Korea.</p>
    </div>
    <div className="footer-cols">
      <div><div className="eyebrow">PRODUCT</div><a>Score Check</a><a>Dashboard</a><a>Methodology</a><a>Changelog</a></div>
      <div><div className="eyebrow">RESOURCES</div><a>Blog</a><a>llms.txt generator</a><a>Manifesto</a><a>Badge embed</a></div>
      <div><div className="eyebrow">COMPANY</div><a>About</a><a>Privacy</a><a>Terms</a><a>Contact</a></div>
    </div>
    <div className="footer-base">© 2026 THUNOVA · pickedby.ai is a trademark of THUNOVA</div>
  </footer>
);

window.FAQ = FAQ;
window.LogoTicker = LogoTicker;
window.Footer = Footer;
