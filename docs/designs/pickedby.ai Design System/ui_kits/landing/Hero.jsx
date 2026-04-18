const Hero = () => (
  <section className="hero">
    <div className="hero-eyebrow">✦ THE AI VISIBILITY PLATFORM</div>
    <h1 className="hero-title">
      Does AI recommend <em>your</em> product?
    </h1>
    <p className="hero-sub">
      Free AI Visibility Score in 10 seconds.
      See if ChatGPT, Claude, Perplexity, and Gemini recommend you — and what to do if they don't.
    </p>
    <div className="hero-stats">
      <div><b>527%</b><span>AI REFERRAL GROWTH YOY</span></div>
      <div><b>50M</b><span>SHOPPING QUERIES · CHATGPT / DAY</span></div>
      <div><b>16.8%</b><span>AI-DRIVEN CONVERSION RATE</span></div>
    </div>
  </section>
);

const ScoreCheck = ({ onCheck }) => {
  const [url, setUrl] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const submit = (e) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); onCheck?.(url); }, 1400);
  };
  return (
    <form className="score-check" onSubmit={submit}>
      <input
        type="url"
        className="score-input"
        placeholder="https://your-product.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        disabled={loading}
        required
      />
      <button className="pba-btn pba-btn-primary pba-btn-lg" type="submit" disabled={loading}>
        {loading ? (
          <span className="pixel-dots"><i/><i/><i/><i/><i/></span>
        ) : 'CHECK SCORE'}
      </button>
      <div className="score-check-meta">
        NO SIGNUP · RESULT IN 10 SEC · 50 AI QUERIES RUN
      </div>
    </form>
  );
};

window.Hero = Hero;
window.ScoreCheck = ScoreCheck;
