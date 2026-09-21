"use client";

import { useEffect, useState } from "react";

type Offer = {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  featured: boolean;
};

type Certificate = { title: string; url: string };

type SiteConfig = {
  heroTitle: string;
  heroAccent: string;
  heroCopy: string;
  audience: string;
  experience: string;
  telegramUrl: string;
  certificates: Certificate[];
  offers: Offer[];
};

const defaultConfig: SiteConfig = {
  heroTitle: "Stop chasing trades.",
  heroAccent: "Build a trading process.",
  heroCopy: "Learn market structure, liquidity, risk management and trading psychology through a structured approach designed to help you execute with discipline.",
  audience: "14K+",
  experience: "3+",
  telegramUrl: "https://t.me/",
  certificates: [],
  offers: [
    { name: "Digital Starter", price: "$5", description: "A practical introduction to structured trading, risk management and psychology.", features: ["Trading psychology guide", "Risk management framework", "Core market-structure concepts", "Instant digital access"], cta: "Get the $5 Product", href: "#", featured: false },
    { name: "Base Coaching", price: "$147", description: "A structured coaching program for traders who want a repeatable process.", features: ["Complete trading framework", "Market structure & liquidity", "Risk management system", "Trading psychology", "Community access", "Coaching sessions"], cta: "Join Base Coaching", href: "#", featured: true },
    { name: "Premium Coaching", price: "$497", description: "High-touch coaching for traders who want deeper feedback and accountability.", features: ["Everything in Base", "Personalized trade reviews", "Direct coaching access", "Execution feedback", "Advanced accountability"], cta: "Get Premium Coaching", href: "#", featured: false },
  ],
};

export default function Admin() {
  const [logged, setLogged] = useState(false);
  const [email, setEmail] = useState("tatiorstore@gmail.com");
  const [password, setPassword] = useState("");
  const [loginMsg, setLoginMsg] = useState("");
  const [tab, setTab] = useState("dashboard");
  const [cfg, setCfg] = useState<SiteConfig>(defaultConfig);
  const [customers, setCustomers] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, consented: 0, today: 0 });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [uploading, setUploading] = useState<number | null>(null);

  useEffect(() => { loadCustomers(); }, []);

  async function loadCustomers() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/customers", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setLogged(true);
        setCustomers(data.customers ?? []);
        setStats(data.stats ?? { total: 0, consented: 0, today: 0 });
        await loadConfig();
      } else setLogged(false);
    } catch { setLogged(false); }
    finally { setLoading(false); }
  }

  async function loadConfig() {
    try {
      const res = await fetch("/api/admin/site-config", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setCfg({ ...defaultConfig, ...(data.config ?? {}) });
      }
    } catch {}
  }

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginMsg("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setLoginMsg(data.error || "Login failed."); return; }
      setLogged(true);
      setPassword("");
      await loadCustomers();
    } catch { setLoginMsg("Unable to connect to the admin service."); }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setLogged(false);
    setCustomers([]);
  }

  async function save() {
    setMsg("");
    try {
      const res = await fetch("/api/admin/site-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config: cfg }),
      });
      const data = await res.json();
      setMsg(res.ok ? "Saved. Changes are now live on the website." : data.error || "Could not save.");
    } catch { setMsg("Could not save site content."); }
  }

  async function uploadCertificate(index: number, file: File) {
    setUploading(index);
    setMsg("");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/certificates", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) { setMsg(data.error || "Upload failed."); return; }

      const certificates = [...cfg.certificates];
      certificates[index] = { ...certificates[index], url: data.url };
      setCfg({ ...cfg, certificates });
      setMsg("Certificate uploaded. Click Save content to publish it.");
    } catch { setMsg("Certificate upload failed."); }
    finally { setUploading(null); }
  }

  function editOffer(index: number, key: keyof Offer, value: string | string[]) {
    setCfg({ ...cfg, offers: cfg.offers.map((offer, n) => n === index ? { ...offer, [key]: value } : offer) });
  }

  if (!logged) return (
    <main className="admin-page"><div className="admin-card">
      <div className="eyebrow">ITA CONTROL CENTER</div><h1>Admin login</h1><p>Secure access to your academy dashboard.</p>
      <form onSubmit={login}>
        <label>Email<input value={email} onChange={e => setEmail(e.target.value)} type="email" required /></label>
        <label>Password<input value={password} onChange={e => setPassword(e.target.value)} type="password" required placeholder="Your admin password" /></label>
        <button className="button primary full" type="submit">Sign in</button>
      </form>
      {loginMsg && <p className="admin-error">{loginMsg}</p>}
      <a className="back" href="/">← Back to site</a>
    </div></main>
  );

  return <main className="admin-page"><div className="admin-shell">
    <header className="admin-head"><div><div className="eyebrow">INSTITUTIONAL TRADING ACADEMY</div><h1>Control Center</h1><p>Manage leads, customers, offers and academy content.</p></div>
      <div className="admin-head-actions"><a className="button ghost" href="/">View site</a><button className="button ghost" onClick={logout} type="button">Sign out</button></div>
    </header>

    <nav className="admin-tabs">
      {["dashboard", "customers", "content"].map(t => <button key={t} className={tab === t ? "active" : ""} onClick={() => setTab(t)} type="button">{t === "dashboard" ? "Dashboard" : t === "customers" ? "Customers" : "Website Content"}</button>)}
    </nav>

    {tab === "dashboard" && <><div className="admin-stats">
      <div><span>Total accounts</span><strong>{stats.total}</strong></div><div><span>Marketing consent</span><strong>{stats.consented}</strong></div><div><span>New today</span><strong>{stats.today}</strong></div><div><span>Offers</span><strong>3</strong></div>
    </div><section className="admin-section"><div className="section-row"><div><h2>Recent registrations</h2><p>Latest people who created an ITA account.</p></div><button className="button ghost small-button" onClick={loadCustomers} type="button">Refresh</button></div><CustomerTable rows={customers.slice(0, 8)} loading={loading} /></section></>}

    {tab === "customers" && <section className="admin-section"><div className="section-row"><div><h2>Customers &amp; Leads</h2><p>Contacts collected through the ITA registration system.</p></div><button className="button ghost small-button" onClick={loadCustomers} type="button">Refresh</button></div><CustomerTable rows={customers} loading={loading} /></section>}

    {tab === "content" && <>
      <section className="admin-section"><h2>Hero</h2>
        <label>Headline<input value={cfg.heroTitle} onChange={e => setCfg({ ...cfg, heroTitle: e.target.value })} /></label>
        <label>Accent headline<input value={cfg.heroAccent} onChange={e => setCfg({ ...cfg, heroAccent: e.target.value })} /></label>
        <label>Hero description<textarea value={cfg.heroCopy} onChange={e => setCfg({ ...cfg, heroCopy: e.target.value })} /></label>
        <div className="admin-grid"><label>Audience<input value={cfg.audience} onChange={e => setCfg({ ...cfg, audience: e.target.value })} /></label><label>Experience<input value={cfg.experience} onChange={e => setCfg({ ...cfg, experience: e.target.value })} /></label></div>
      </section>

      <section className="admin-section"><h2>Community &amp; Credentials</h2>
        <label>Free Telegram URL<input value={cfg.telegramUrl || ""} onChange={e => setCfg({ ...cfg, telegramUrl: e.target.value })} /></label>
        <p className="security-note">Upload your certificate, payout proof or trading milestone. JPG, PNG, WEBP and PDF are supported up to 8 MB.</p>
        {cfg.certificates.map((c, i) => <div className="edit-offer" key={i}>
          <h3>Proof {i + 1}</h3>
          <label>Title<input value={c.title} onChange={e => { const cs = [...cfg.certificates]; cs[i] = { ...cs[i], title: e.target.value }; setCfg({ ...cfg, certificates: cs }); }} /></label>
          <label>Certificate file
            <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" disabled={uploading === i} onChange={e => { const file = e.target.files?.[0]; if (file) uploadCertificate(i, file); e.currentTarget.value = ""; }} />
          </label>
          {c.url && <p className="security-note">Uploaded: <a href={c.url} target="_blank" rel="noreferrer">View file</a></p>}
        </div>)}
        <button className="button ghost" onClick={() => setCfg({ ...cfg, certificates: [...cfg.certificates, { title: "New Proof", url: "" }] })} type="button">+ Add Certificate / Proof</button>
      </section>

      <section className="admin-section"><h2>Chariow Offers</h2>
        {cfg.offers.map((o, i) => <div className="edit-offer" key={i}><h3>{o.name}</h3>
          <div className="admin-grid"><label>Name<input value={o.name} onChange={e => editOffer(i, "name", e.target.value)} /></label><label>Price<input value={o.price} onChange={e => editOffer(i, "price", e.target.value)} /></label></div>
          <label>Description<textarea value={o.description} onChange={e => editOffer(i, "description", e.target.value)} /></label>
          <label>Chariow URL<input value={o.href} onChange={e => editOffer(i, "href", e.target.value)} /></label>
          <label>Button text<input value={o.cta} onChange={e => editOffer(i, "cta", e.target.value)} /></label>
          <label>Features<textarea value={o.features.join("\n")} onChange={e => editOffer(i, "features", e.target.value.split("\n"))} /></label>
        </div>)}
      </section>
      <button className="button primary save-button" onClick={save} type="button">Save content</button>{msg && <p className="save-msg">{msg}</p>}
    </>}
  </div></main>;
}

function CustomerTable({ rows, loading }: { rows: any[]; loading: boolean }) {
  if (loading) return <div className="empty-state">Loading customers…</div>;
  if (!rows.length) return <div className="empty-state">No registrations yet. Your first account will appear here.</div>;
  return <div className="customer-table-wrap"><table className="customer-table"><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Consent</th><th>Joined</th></tr></thead><tbody>
    {rows.map(c => <tr key={c.id}><td><strong>{c.name}</strong></td><td>{c.email}</td><td>{c.phone || "—"}</td><td><span className={c.marketing_consent ? "consent-badge" : "no-consent"}>{c.marketing_consent ? "Yes" : "No"}</span></td><td>{new Date(c.created_at).toLocaleDateString()}</td></tr>)}
  </tbody></table></div>;
}
