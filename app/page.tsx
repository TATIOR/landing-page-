const offers = [
  {
    name: "Digital Starter",
    price: "$5",
    description: "A practical introduction to structured trading, risk management and psychology.",
    features: ["Trading psychology guide", "Risk management framework", "Core market-structure concepts", "Instant digital access"],
    cta: "Get the $5 Product",
    href: "#",
    featured: false,
  },
  {
    name: "Base Coaching",
    price: "$147",
    description: "A structured coaching program for traders who want a repeatable process.",
    features: ["Complete trading framework", "Market structure & liquidity", "Risk management system", "Trading psychology", "Community access", "Coaching sessions"],
    cta: "Join Base Coaching",
    href: "#",
    featured: true,
  },
  {
    name: "Premium Coaching",
    price: "$497",
    description: "High-touch coaching for traders who want deeper feedback and accountability.",
    features: ["Everything in Base", "Personalized trade reviews", "Direct coaching access", "Execution feedback", "Advanced accountability"],
    cta: "Get Premium Coaching",
    href: "#",
    featured: false,
  },
];

const faqs = [
  ["Is this for beginners?", "Yes. The material is designed to give beginners a structured foundation while remaining useful for experienced traders who want to improve their process."],
  ["Do I need to buy all three offers?", "No. The $5 product is a standalone entry product. Coaching is optional for people who want a deeper learning and accountability experience."],
  ["Where do I receive my product?", "Checkout and product delivery will be handled through Chariow. The buttons on this page will point directly to your Chariow checkout pages."],
  ["Does this guarantee trading profits?", "No. Trading involves substantial risk. The academy focuses on education, process, risk management and disciplined execution rather than guaranteed returns."],
];

export default function Home() {
  return (
    <main>
      <nav className="nav container">
        <div className="brand"><span className="brand-mark">ITA</span><span>Institutional Trading Academy</span></div>
        <a className="nav-link" href="#offers">Programs</a>
      </nav>

      <section className="hero container">
        <div className="eyebrow">INSTITUTIONAL TRADING ACADEMY</div>
        <h1>Stop chasing trades.<br /><span>Build a trading process.</span></h1>
        <p className="hero-copy">Learn market structure, liquidity, risk management and trading psychology through a structured approach designed to help you execute with discipline.</p>
        <div className="hero-actions">
          <a className="button primary" href="#offers">Explore the Programs</a>
          <a className="button ghost" href="#method">See the Method</a>
        </div>
        <div className="proof">
          <div><strong>14K+</strong><span>social audience</span></div>
          <div><strong>3+</strong><span>years trading experience</span></div>
          <div><strong>100%</strong><span>focus on process</span></div>
        </div>
      </section>

      <section className="section muted" id="method">
        <div className="container two-col">
          <div>
            <div className="eyebrow">THE REAL PROBLEM</div>
            <h2>Most traders don't need another random strategy.</h2>
          </div>
          <div className="problem-list">
            {["Overtrading after a loss", "Risking too much on one idea", "Changing strategies every week", "Chasing payouts instead of process", "Trading without a repeatable plan"].map((x) => <div className="problem" key={x}><span>×</span>{x}</div>)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="eyebrow">THE FRAMEWORK</div>
          <h2>A system built around six pillars.</h2>
          <div className="pillars">
            {["Market Structure","Liquidity & Price Action","Entries & Execution","Risk Management","Trading Psychology","Journaling & Review"].map((x,i) => <div className="pillar" key={x}><span>0{i+1}</span><h3>{x}</h3><p>Understand the principle, define the rules and execute consistently.</p></div>)}
          </div>
        </div>
      </section>

      <section className="section muted" id="offers">
        <div className="container">
          <div className="eyebrow">CHOOSE YOUR LEVEL</div>
          <h2>Start where you are. Go deeper when you're ready.</h2>
          <div className="offers">
            {offers.map((offer) => <article className={offer.featured ? "offer featured" : "offer"} key={offer.name}>
              {offer.featured && <div className="badge">MOST POPULAR</div>}
              <div className="offer-top"><div><div className="offer-name">{offer.name}</div><div className="price">{offer.price}</div></div></div>
              <p>{offer.description}</p>
              <ul>{offer.features.map(f => <li key={f}>✓ {f}</li>)}</ul>
              <a className={offer.featured ? "button primary full" : "button ghost full"} href={offer.href}>{offer.cta}</a>
            </article>)}
          </div>
          <p className="checkout-note">All purchases will be completed through Chariow. Replace each button link with your Chariow checkout URL.</p>
        </div>
      </section>

      <section className="section">
        <div className="container cta">
          <div className="eyebrow">YOUR NEXT MOVE</div>
          <h2>Build the process before you chase the result.</h2>
          <p>Start with the $5 digital product, or go directly into coaching if you're ready for a more structured path.</p>
          <a className="button primary" href="#offers">View Programs</a>
        </div>
      </section>

      <section className="section muted">
        <div className="container faq">
          <div className="eyebrow">FAQ</div>
          <h2>Questions before you start.</h2>
          {faqs.map(([q,a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
        </div>
      </section>

      <footer className="footer container"><span>© {new Date().getFullYear()} Institutional Trading Academy</span><span>Education • Process • Discipline</span></footer>
    </main>
  );
}
