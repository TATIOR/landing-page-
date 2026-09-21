"use client";

import { useEffect, useState } from "react";

type Certificate = { title: string; url: string };

export default function About() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    fetch("/api/site-config", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setCertificates(data.certificates || []))
      .catch(() => {});
  }, []);

  const milestones = [
    ["2022","Started trading","The beginning: learning the market, making mistakes and discovering how difficult consistency really is."],
    ["MID 2022","First challenge passed","Passed my first MyForexFunds challenge before the firm's shutdown."],
    ["2022–2023","The struggle","I spent a long period crying, struggling and fighting with day trading. The volatility and pressure exposed weaknesses in my process."],
    ["2023","A different direction","After researching trader performance and studying my own results, I began focusing seriously on swing trading."],
    ["DEC 2023","First FundingPips payout","Passed my first FundingPips challenge and received my first payout while still trading my day-trading approach."],
    ["MAR 2024","More payouts, more lessons","I received additional payouts, but increasing market volatility made day trading increasingly difficult. I entered a prolonged non-profitable phase."],
    ["2024–2025","Eight months of testing","I focused on swing trading and spent about eight months testing the strategy, including a failed $100K FTMO account. The objective was to find evidence in backtesting rather than rely on hope."],
    ["EARLY 2026","New funded accounts","Passed Alpha Capital $10K and obtained a $25K funded account, followed by several withdrawals."],
    ["TODAY","Still on the journey","I continue trading, studying and improving while helping newer traders avoid the mistakes that cost me time and money."]
  ];

  return <main className="subpage"><div className="container">
    <a className="back-link" href="/">← Back to Institutional Trading Academy</a>
    <section className="about-hero"><div className="eyebrow">WHO I AM</div><h1>I’m building traders around <span>process, discipline and long-term thinking.</span></h1><p>I’m the founder of Institutional Trading Academy. I did not become consistent overnight. My journey taught me that becoming profitable is a process that requires time, testing, discipline and the ability to survive your mistakes.</p><div className="profit-timeline"><div className="profit-number">12</div><div><strong>MONTHS+</strong><span>A realistic horizon to develop and validate a profitable trading process.</span></div></div><p>The goal of ITA is not to promise easy money. It is to teach a framework you can study, test, journal and execute consistently.</p><a className="button primary" href="/#offers">Explore the Programs</a></section>
    <section className="story-section"><div className="story-heading"><div className="eyebrow">THE JOURNEY</div><h2>What I went through before becoming profitable.</h2><p>These are the major stages of my trading journey — including the failures, withdrawals, strategy changes and testing periods.</p></div><div className="timeline">{milestones.map(([date,title,text])=><article className="timeline-item" key={date+title}><div className="timeline-date">{date}</div><div className="timeline-content"><h3>{title}</h3><p>{text}</p></div></article>)}</div></section>
    <section className="proof-section"><div className="story-heading"><div className="eyebrow">PROOF OF THE JOURNEY</div><h2>Milestones, certificates & withdrawals.</h2><p>Certificates and proof uploaded from the private ITA control center appear here automatically.</p></div><div className="proof-grid">
      {certificates.length ? certificates.map((certificate, i) => { const isImage = /\.(jpg|jpeg|png|webp)(\?|$)/i.test(certificate.url); return <div className="proof-slot" key={certificate.url+i}><div className="proof-slot-number">0{i+1}</div><div className="proof-placeholder">{isImage ? <img src={certificate.url} alt={certificate.title} style={{width:"100%",height:"220px",objectFit:"cover",borderRadius:"10px"}} /> : <span>DOCUMENT</span>}<strong>{certificate.title}</strong><a className="button ghost" href={certificate.url} target="_blank" rel="noreferrer">View Proof</a></div></div>; }) : <div className="proof-placeholder"><span>ADD FROM ADMIN</span><strong>Your certificates will appear here.</strong><small>Upload them from Control Center → Website Content.</small></div>}
    </div></section>
    <section className="about-final"><div className="eyebrow">TODAY</div><h2>Helping new traders avoid the mistakes I had to learn the hard way.</h2><p>My objective is to shorten the learning curve by teaching patience, risk management, psychology, journaling and a process built around evidence.</p><a className="button primary" href="/#offers">Explore the Programs</a></section>
  </div></main>;
}