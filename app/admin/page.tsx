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

type Certificate = {
  title: string;
  url: string;
};

type SiteConfig = {
  heroTitle: string;
  heroAccent: string;
  telegramUrl: string;
  certificates: Certificate[];
  heroCopy: string;
  audience: string;
  experience: string;
  offers: Offer[];
};

const defaultConfig: SiteConfig = {
  heroTitle: "Stop chasing trades.",
  heroAccent: "Build a trading process.",
  telegramUrl: "https://t.me/",
  certificates: [],
  heroCopy:
    "Learn market structure, liquidity, risk management and trading psychology through a structured approach designed to help you execute with discipline.",
  audience: "14K+",
  experience: "3+",
  offers: [
    {
      name: "Digital Starter",
      price: "$5",
      description:
        "A practical introduction to structured trading, risk management and psychology.",
      features: [
        "Trading psychology guide",
        "Risk management framework",
        "Core market-structure concepts",
        "Instant digital access",
      ],
      cta: "Get the $5 Product",
      href: "#",
      featured: false,
    },
    {
      name: "Base Coaching",
      price: "$147",
      description:
        "A structured coaching program for traders who want a repeatable process.",
      features: [
        "Complete trading framework",
        "Market structure & liquidity",
        "Risk management system",
        "Trading psychology",
        "Community access",
        "Coaching sessions",
      ],
      cta: "Join Base Coaching",
      href: "#",
      featured: true,
    },
    {
      name: "Premium Coaching",
      price: "$497",
      description:
        "High-touch coaching for traders who want deeper feedback and accountability.",
      features: [
        "Everything in Base",
        "Personalized trade reviews",
        "Direct coaching access",
        "Execution feedback",
        "Advanced accountability",
      ],
      cta: "Get Premium Coaching",
      href: "#",
      featured: false,
    },
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

  useEffect(() => {
    try {
      const stored = localStorage.getItem("itaSiteConfig");
      if (stored) {
        setCfg({ ...defaultConfig, ...JSON.parse(stored) });
      }
    } catch {
      // Ignore invalid local browser config.
    }

    loadCustomers();
  }, []);

  async function loadCustomers() {
    setLoading(true);

    try {
      const res = await fetch("/api/admin/customers", { cache: "no-store" });

      if (res.ok) {
        const data = await res.json();
        setLogged(true);
        setCustomers(data.customers ?? []);
        setStats(data.stats ?? { total: 0, consented: 0, today: 0 });
      } else {
        setLogged(false);
      }
    } catch {
      setLogged(false);
    } finally {
      setLoading(false);
    }
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

      if (!res.ok) {
        setLoginMsg(data.error || "Login failed.");
        return;
      }

      setLogged(true);
      setPassword("");
      await loadCustomers();
    } catch {
      setLoginMsg("Unable to connect to the admin service.");
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setLogged(false);
    setCustomers([]);
  }

  function save() {
    localStorage.setItem("itaSiteConfig", JSON.stringify(cfg));
    setMsg("Saved in this browser.");
  }

  function editOffer(index: number, key: keyof Offer, value: string | string[]) {
    setCfg({
      ...cfg,
      offers: cfg.offers.map((offer, offerIndex) =>
        offerIndex === index ? { ...offer, [key]: value } : offer
      ),
    });
  }

  if (!logged) {
    return (
      <main className="admin-page">
        <div className="admin-card">
          <div className="eyebrow">ITA CONTROL CENTER</div>
          <h1>Admin login</h1>
          <p>Secure access to your academy dashboard.</p>

          <form onSubmit={login}>
            <label>
              Email
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                required
              />
            </label>

            <label>
              Password
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                required
                placeholder="Your admin password"
              />
            </label>

            <button className="button primary full" type="submit">
              Sign in
            </button>
          </form>

          {loginMsg && <p className="admin-error">{loginMsg}</p>}

          <a className="back" href="/">
            ← Back to site
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <div className="admin-shell">
        <header className="admin-head">
          <div>
            <div className="eyebrow">INSTITUTIONAL TRADING ACADEMY</div>
            <h1>Control Center</h1>
            <p>Manage leads, customers, offers and academy content.</p>
          </div>

          <div className="admin-head-actions">
            <a className="button ghost" href="/">
              View site
            </a>
            <button className="button ghost" onClick={logout} type="button">
              Sign out
            </button>
          </div>
        </header>

        <nav className="admin-tabs">
          <button
            className={tab === "dashboard" ? "active" : ""}
            onClick={() => setTab("dashboard")}
            type="button"
          >
            Dashboard
          </button>
          <button
            className={tab === "customers" ? "active" : ""}
            onClick={() => setTab("customers")}
            type="button"
          >
            Customers
          </button>
          <button
            className={tab === "content" ? "active" : ""}
            onClick={() => setTab("content")}
            type="button"
          >
            Website Content
          </button>
        </nav>

        {tab === "dashboard" && (
          <>
            <div className="admin-stats">
              <div>
                <span>Total accounts</span>
                <strong>{stats.total}</strong>
              </div>
              <div>
                <span>Marketing consent</span>
                <strong>{stats.consented}</strong>
              </div>
              <div>
                <span>New today</span>
                <strong>{stats.today}</strong>
              </div>
              <div>
                <span>Offers</span>
                <strong>3</strong>
              </div>
            </div>

            <section className="admin-section">
              <div className="section-row">
                <div>
                  <h2>Recent registrations</h2>
                  <p>Latest people who created an ITA account.</p>
                </div>
                <button
                  className="button ghost small-button"
                  onClick={loadCustomers}
                  type="button"
                >
                  Refresh
                </button>
              </div>

              <CustomerTable
                rows={customers.slice(0, 8)}
                loading={loading}
              />
            </section>
          </>
        )}

        {tab === "customers" && (
          <section className="admin-section">
            <div className="section-row">
              <div>
                <h2>Customers &amp; Leads</h2>
                <p>Contacts collected through the ITA registration system.</p>
              </div>
              <button
                className="button ghost small-button"
                onClick={loadCustomers}
                type="button"
              >
                Refresh
              </button>
            </div>

            <CustomerTable rows={customers} loading={loading} />
          </section>
        )}

        {tab === "content" && (
          <>
            <section className="admin-section">
              <h2>Hero</h2>

              <label>
                Headline
                <input
                  value={cfg.heroTitle}
                  onChange={(event) =>
                    setCfg({ ...cfg, heroTitle: event.target.value })
                  }
                />
              </label>

              <label>
                Accent headline
                <input
                  value={cfg.heroAccent}
                  onChange={(event) =>
                    setCfg({ ...cfg, heroAccent: event.target.value })
                  }
                />
              </label>

              <label>
                Hero description
                <textarea
                  value={cfg.heroCopy}
                  onChange={(event) =>
                    setCfg({ ...cfg, heroCopy: event.target.value })
                  }
                />
              </label>

              <div className="admin-grid">
                <label>
                  Audience
                  <input
                    value={cfg.audience}
                    onChange={(event) =>
                      setCfg({ ...cfg, audience: event.target.value })
                    }
                  />
                </label>

                <label>
                  Experience
                  <input
                    value={cfg.experience}
                    onChange={(event) =>
                      setCfg({ ...cfg, experience: event.target.value })
                    }
                  />
                </label>
              </div>
            </section>

            <section className="admin-section">
              <h2>Community &amp; Credentials</h2>

              <label>
                Free Telegram URL
                <input
                  value={cfg.telegramUrl || ""}
                  onChange={(event) =>
                    setCfg({ ...cfg, telegramUrl: event.target.value })
                  }
                />
              </label>

              <p className="security-note">
                Certificate links can be added here. Persistent uploads will
                be added with storage integration.
              </p>

              {(cfg.certificates || []).map((certificate, index) => (
                <div className="edit-offer" key={index}>
                  <h3>Certificate {index + 1}</h3>

                  <label>
                    Title
                    <input
                      value={certificate.title}
                      onChange={(event) => {
                        const certificates = [...cfg.certificates];
                        certificates[index] = {
                          ...certificates[index],
                          title: event.target.value,
                        };
                        setCfg({ ...cfg, certificates });
                      }}
                    />
                  </label>

                  <label>
                    URL
                    <input
                      value={certificate.url}
                      onChange={(event) => {
                        const certificates = [...cfg.certificates];
                        certificates[index] = {
                          ...certificates[index],
                          url: event.target.value,
                        };
                        setCfg({ ...cfg, certificates });
                      }}
                    />
                  </label>
                </div>
              ))}

              <button
                className="button ghost"
                onClick={() =>
                  setCfg({
                    ...cfg,
                    certificates: [
                      ...cfg.certificates,
                      { title: "New Certificate", url: "" },
                    ],
                  })
                }
                type="button"
              >
                + Add Certificate
              </button>
            </section>

            <section className="admin-section">
              <h2>Chariow Offers</h2>

              {cfg.offers.map((offer, index) => (
                <div className="edit-offer" key={index}>
                  <h3>{offer.name}</h3>

                  <div className="admin-grid">
                    <label>
                      Name
                      <input
                        value={offer.name}
                        onChange={(event) =>
                          editOffer(index, "name", event.target.value)
                        }
                      />
                    </label>

                    <label>
                      Price
                      <input
                        value={offer.price}
                        onChange={(event) =>
                          editOffer(index, "price", event.target.value)
                        }
                      />
                    </label>
                  </div>

                  <label>
                    Description
                    <textarea
                      value={offer.description}
                      onChange={(event) =>
                        editOffer(index, "description", event.target.value)
                      }
                    />
                  </label>

                  <label>
                    Chariow URL
                    <input
                      value={offer.href}
                      onChange={(event) =>
                        editOffer(index, "href", event.target.value)
                      }
                    />
                  </label>

                  <label>
                    Button text
                    <input
                      value={offer.cta}
                      onChange={(event) =>
                        editOffer(index, "cta", event.target.value)
                      }
                    />
                  </label>

                  <label>
                    Features
                    <textarea
                      value={offer.features.join("\n")}
                      onChange={(event) =>
                        editOffer(
                          index,
                          "features",
                          event.target.value.split("\n")
                        )
                      }
                    />
                  </label>
                </div>
              ))}
            </section>

            <button className="button primary save-button" onClick={save} type="button">
              Save content
            </button>

            {msg && <p className="save-msg">{msg}</p>}
          </>
        )}
      </div>
    </main>
  );
}

function CustomerTable({
  rows,
  loading,
}: {
  rows: any[];
  loading: boolean;
}) {
  if (loading) {
    return <div className="empty-state">Loading customers…</div>;
  }

  if (!rows.length) {
    return (
      <div className="empty-state">
        No registrations yet. Your first account will appear here.
      </div>
    );
  }

  return (
    <div className="customer-table-wrap">
      <table className="customer-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Consent</th>
            <th>Joined</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((customer) => (
            <tr key={customer.id}>
              <td>
                <strong>{customer.name}</strong>
              </td>
              <td>{customer.email}</td>
              <td>{customer.phone || "—"}</td>
              <td>
                <span
                  className={
                    customer.marketing_consent
                      ? "consent-badge"
                      : "no-consent"
                  }
                >
                  {customer.marketing_consent ? "Yes" : "No"}
                </span>
              </td>
              <td>{new Date(customer.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
