"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { proverbs } from "./data/proverbs";
import { animals } from "./data/animals";
import { birds } from "./data/birds";
import { insects } from "./data/insects";
import { roora } from "./data/roora";
import { nhetembo } from "./data/nhetembo";

const TOPICS = [
  { id: "proverbs",  label: "Tsumo",         sub: "Proverbs" },
  { id: "animals",   label: "Mhuka",          sub: "Animals" },
  { id: "birds",     label: "Shiri",          sub: "Birds" },
  { id: "insects",   label: "Zvipembenene",   sub: "Insects" },
  { id: "roora",     label: "Roora",          sub: "Marriage Custom" },
  { id: "nhetembo",  label: "Nhetembo",       sub: "Praise Poetry" },
];

/* ── shared search input ─────────────────────────────────────────────── */
function Search({ value, onChange, placeholder }) {
  return (
    <div style={{ position: "relative", maxWidth: 440, marginBottom: 20 }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }}
        aria-hidden="true">
        <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
      </svg>
      <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        style={{
          width: "100%", padding: "9px 14px 9px 36px", fontSize: 13,
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: 8, color: "var(--text)", outline: "none",
          fontFamily: "inherit",
        }}
      />
    </div>
  );
}

/* ── reference table (animals / birds / insects) ─────────────────────── */
function RefTable({ data, search, cols }) {
  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
      <div className="muz-table-wrap">
      <table style={{ width: "100%", minWidth: 480, borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ background: "var(--surface-2)" }}>
            {cols.map((c) => (
              <th key={c.key} style={{
                padding: "10px 14px", textAlign: "left", fontWeight: 700,
                fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em",
                color: "var(--text-muted)", borderBottom: "1px solid var(--border)",
                whiteSpace: "nowrap",
              }}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={cols.length} style={{ padding: "18px 14px", color: "var(--text-muted)", fontSize: 13 }}>
                No results found.
              </td>
            </tr>
          ) : data.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? "var(--surface)" : "var(--bg)" }}>
              {cols.map((c) => (
                <td key={c.key} style={{
                  padding: "10px 14px",
                  color: c.key === "shona" ? "var(--zw-green)" : c.key === "scientific" ? "var(--text-muted)" : "var(--text)",
                  fontWeight: c.key === "shona" ? 600 : 400,
                  fontStyle: c.key === "scientific" ? "italic" : "normal",
                  borderBottom: i < data.length - 1 ? "1px solid var(--border)" : "none",
                  verticalAlign: "top", lineHeight: 1.5,
                }}>
                  {row[c.key] || ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

/* ── proverbs view ───────────────────────────────────────────────────── */
function ProverbsView() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    if (!query.trim()) return proverbs;
    const q = query.toLowerCase();
    return proverbs.filter(
      (p) => p.shona.toLowerCase().includes(q) || p.english.toLowerCase().includes(q) || p.meaning?.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div>
      <p style={{ margin: "0 0 16px", fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
        Shona proverbs passed down through generations. Each carries a lesson about life, relationships, and community.
      </p>
      <Search value={query} onChange={setQuery} placeholder="Search in Shona or English..." />
      <p style={{ margin: "0 0 14px", fontSize: 12, color: "var(--text-muted)" }}>
        {filtered.length} proverb{filtered.length !== 1 ? "s" : ""}
      </p>
      <div style={{ border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
      <div className="muz-table-wrap">
        <table style={{ width: "100%", minWidth: 560, borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "var(--surface-2)" }}>
              <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", borderBottom: "1px solid var(--border)", width: "36%" }}>Shona</th>
              <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", borderBottom: "1px solid var(--border)", width: "32%" }}>Translation</th>
              <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", borderBottom: "1px solid var(--border)" }}>Meaning</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ padding: "18px 14px", color: "var(--text-muted)" }}>No results found.</td>
              </tr>
            ) : filtered.map((p, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "var(--surface)" : "var(--bg)" }}>
                <td style={{ padding: "11px 14px", color: "var(--zw-green)", fontWeight: 600, borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none", verticalAlign: "top", lineHeight: 1.5 }}>{p.shona}</td>
                <td style={{ padding: "11px 14px", color: "var(--text)", borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none", verticalAlign: "top", lineHeight: 1.5, fontStyle: "italic" }}>{p.english}</td>
                <td style={{ padding: "11px 14px", color: "var(--text-secondary)", borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none", verticalAlign: "top", lineHeight: 1.5 }}>{p.meaning || ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
}

/* ── animals / birds / insects view ─────────────────────────────────── */
function ListingView({ data, placeholder, noun }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    if (!query.trim()) return data;
    const q = query.toLowerCase();
    return data.filter((d) => d.shona.toLowerCase().includes(q) || d.english.toLowerCase().includes(q));
  }, [query, data]);

  const cols = [
    { key: "shona",      label: "Shona" },
    { key: "english",    label: "English" },
    { key: "scientific", label: "Scientific name" },
  ];

  return (
    <div>
      <Search value={query} onChange={setQuery} placeholder={placeholder} />
      <p style={{ margin: "0 0 14px", fontSize: 12, color: "var(--text-muted)" }}>
        {filtered.length} {noun}{filtered.length !== 1 ? "s" : ""}
      </p>
      <RefTable data={filtered} cols={cols} />
    </div>
  );
}

/* ── article view (roora) ────────────────────────────────────────────── */
function ArticleView({ data }) {
  return (
    <div style={{ maxWidth: 660 }}>
      <p style={{ margin: "0 0 28px", fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7 }}>
        {data.subtitle}
      </p>
      {data.sections.map((s, i) => (
        <div key={i} style={{ marginBottom: 28, paddingLeft: 14, borderLeft: "3px solid var(--zw-green)" }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 8px", color: "var(--text)" }}>{s.heading}</h3>
          <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.85, whiteSpace: "pre-wrap" }}>{s.body}</p>
        </div>
      ))}
      {data.keyWords && (
        <div style={{ marginTop: 32 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 12px", color: "var(--text)" }}>Key Words</h3>
          <RefTable
            data={data.keyWords}
            cols={[
              { key: "shona",   label: "Shona" },
              { key: "english", label: "Meaning" },
            ]}
          />
        </div>
      )}
    </div>
  );
}

/* ── nhetembo view ───────────────────────────────────────────────────── */
function NhetemboView() {
  return (
    <div style={{ maxWidth: 660 }}>
      <p style={{ margin: "0 0 28px", fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7 }}>
        {nhetembo.subtitle}
      </p>
      <p style={{ margin: "0 0 28px", fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.85, whiteSpace: "pre-wrap" }}>
        {nhetembo.intro}
      </p>
      {nhetembo.sections.map((s, i) => (
        <div key={i} style={{ marginBottom: 28, paddingLeft: 14, borderLeft: "3px solid var(--zw-green)" }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 8px", color: "var(--text)" }}>{s.heading}</h3>
          <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.85, whiteSpace: "pre-wrap" }}>{s.body}</p>
        </div>
      ))}

      <h3 style={{ fontSize: 14, fontWeight: 700, margin: "32px 0 12px", color: "var(--text)" }}>
        Mitupo (Totems) and Zvidawo (Praise Names)
      </h3>
      <div style={{ border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
      <div className="muz-table-wrap">
        <table style={{ width: "100%", minWidth: 480, borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "var(--surface-2)" }}>
              <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", borderBottom: "1px solid var(--border)", width: 120 }}>Mutupo</th>
              <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", borderBottom: "1px solid var(--border)", width: 100 }}>English</th>
              <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", borderBottom: "1px solid var(--border)" }}>Zvidawo (Praise names)</th>
            </tr>
          </thead>
          <tbody>
            {nhetembo.totems.map((t, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "var(--surface)" : "var(--bg)" }}>
                <td style={{ padding: "10px 14px", color: "var(--zw-green)", fontWeight: 700, borderBottom: i < nhetembo.totems.length - 1 ? "1px solid var(--border)" : "none", verticalAlign: "top" }}>{t.mutupo}</td>
                <td style={{ padding: "10px 14px", color: "var(--text)", borderBottom: i < nhetembo.totems.length - 1 ? "1px solid var(--border)" : "none", verticalAlign: "top" }}>{t.english}</td>
                <td style={{ padding: "10px 14px", color: "var(--text-secondary)", borderBottom: i < nhetembo.totems.length - 1 ? "1px solid var(--border)" : "none", verticalAlign: "top", lineHeight: 1.7 }}>
                  {t.zvidawo.length > 0 ? t.zvidawo.join(", ") : <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>not yet documented</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
}

/* ── main page ───────────────────────────────────────────────────────── */
export default function LearnPage() {
  const [topic, setTopic] = useState("proverbs");
  const current = TOPICS.find((t) => t.id === topic);

  function renderContent() {
    switch (topic) {
      case "proverbs":  return <ProverbsView />;
      case "animals":   return <ListingView data={animals} placeholder="Search animals..." noun="animal" />;
      case "birds":     return <ListingView data={birds}   placeholder="Search birds..."   noun="bird" />;
      case "insects":   return <ListingView data={insects} placeholder="Search insects..." noun="insect" />;
      case "roora":     return <ArticleView data={roora} />;
      case "nhetembo":  return <NhetemboView />;
      default:          return null;
    }
  }

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>

      {/* flag stripe */}
      <div style={{ height: 4, display: "flex", flexShrink: 0 }}>
        <div style={{ flex: 1, background: "var(--zw-green)" }} />
        <div style={{ flex: 1, background: "var(--zw-gold)" }} />
        <div style={{ flex: 1, background: "var(--zw-red)" }} />
        <div style={{ flex: 1, background: "var(--text)" }} />
      </div>

      {/* header */}
      <header className="muz-learn-header" style={{
        borderBottom: "1px solid var(--border)", padding: "13px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: 0.3 }}>
            MUZE<span style={{ color: "var(--zw-green)" }}>ZURU</span>
          </span>
          <span style={{
            fontSize: 12, color: "var(--text-muted)", paddingLeft: 12,
            borderLeft: "1px solid var(--border)",
          }}>
            Dzidza ChiShona
          </span>
        </div>
        <Link href="/" style={{
          fontSize: 13, color: "var(--text-secondary)", textDecoration: "none",
          padding: "6px 14px", border: "1px solid var(--border)", borderRadius: 8,
          background: "var(--surface-2)",
        }}>
          Back to Chat
        </Link>
      </header>

      {/* topic tabs */}
      <div className="muz-learn-tabs" style={{
        borderBottom: "1px solid var(--border)", background: "var(--surface)",
        padding: "0 32px", display: "flex", gap: 0, overflowX: "auto", flexShrink: 0,
      }}>
        {TOPICS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTopic(t.id)}
            style={{
              padding: "13px 18px", fontSize: 13, border: "none", background: "transparent",
              cursor: "pointer", whiteSpace: "nowrap", display: "flex", flexDirection: "column", gap: 1,
              borderBottom: topic === t.id ? "2px solid var(--zw-green)" : "2px solid transparent",
              color: topic === t.id ? "var(--text)" : "var(--text-muted)",
            }}
          >
            <span style={{ fontWeight: topic === t.id ? 700 : 400 }}>{t.label}</span>
            <span style={{ fontSize: 10, letterSpacing: "0.04em" }}>{t.sub}</span>
          </button>
        ))}
      </div>

      {/* content */}
      <div className="muz-learn-content" style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 2px", color: "var(--text)" }}>
              {current.label}
            </h2>
            <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {current.sub}
            </p>
          </div>
          {renderContent()}
        </div>
      </div>

      {/* footer */}
      <footer style={{
        borderTop: "1px solid var(--border)", padding: "10px 32px",
        fontSize: 11, color: "var(--text-muted)", flexShrink: 0,
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6,
      }}>
        <span>Muzezuru Learn section</span>
        <span>More categories coming</span>
      </footer>
    </main>
  );
}
