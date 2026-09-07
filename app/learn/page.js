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
  { id: "proverbs", label: "Tsumo", sublabel: "Proverbs", emoji: "📜" },
  { id: "animals", label: "Mhuka", sublabel: "Animals", emoji: "🦁" },
  { id: "birds", label: "Shiri", sublabel: "Birds", emoji: "🦅" },
  { id: "insects", label: "Zvipembenene", sublabel: "Insects", emoji: "🦗" },
  { id: "roora", label: "Roora", sublabel: "Marriage Custom", emoji: "💍" },
  { id: "nhetembo", label: "Nhetembo", sublabel: "Praise Poetry", emoji: "🎶" },
];

function FlagStripe() {
  return (
    <div style={{ height: 4, display: "flex", flexShrink: 0 }}>
      <div style={{ flex: 1, background: "var(--zw-green)" }} />
      <div style={{ flex: 1, background: "var(--zw-gold)" }} />
      <div style={{ flex: 1, background: "var(--zw-red)" }} />
      <div style={{ flex: 1, background: "var(--text)" }} />
    </div>
  );
}

function SearchBar({ value, onChange, placeholder }) {
  return (
    <div style={{
      position: "relative", maxWidth: 480, width: "100%", margin: "0 0 24px",
    }}>
      <svg
        width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }}
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
      </svg>
      <input
        type="search" value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%", padding: "10px 14px 10px 38px", fontSize: 14,
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: 10, color: "var(--text)", outline: "none",
        }}
      />
    </div>
  );
}

function ProverbCard({ item }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <button
      onClick={() => setExpanded((e) => !e)}
      style={{
        width: "100%", textAlign: "left", background: "var(--surface)",
        border: "1px solid var(--border)", borderRadius: 12, padding: "16px 18px",
        cursor: "pointer", transition: "border-color 0.15s",
      }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--zw-green)"}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border)"}
    >
      <p style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 600, color: "var(--text)", lineHeight: 1.4 }}>
        {item.shona}
      </p>
      <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5, fontStyle: "italic" }}>
        {item.english}
      </p>
      {expanded && item.meaning && (
        <p style={{
          margin: "10px 0 0", fontSize: 13, color: "var(--zw-green)",
          lineHeight: 1.6, borderTop: "1px solid var(--border)", paddingTop: 10,
        }}>
          {item.meaning}
        </p>
      )}
      <p style={{ margin: "8px 0 0", fontSize: 11, color: "var(--text-muted)" }}>
        {expanded ? "Tap to collapse" : "Tap to see meaning"}
      </p>
    </button>
  );
}

function AnimalRow({ item }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12,
      padding: "12px 16px", borderBottom: "1px solid var(--border)", alignItems: "start",
    }}>
      <div>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "var(--zw-green)" }}>{item.shona}</p>
      </div>
      <div>
        <p style={{ margin: 0, fontSize: 14, color: "var(--text)" }}>{item.english}</p>
        {item.scientific && (
          <p style={{ margin: "2px 0 0", fontSize: 11, color: "var(--text-muted)", fontStyle: "italic" }}>
            {item.scientific}
          </p>
        )}
      </div>
    </div>
  );
}

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
      <SearchBar value={query} onChange={setQuery} placeholder="Search proverbs in Shona or English..." />
      <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 16px" }}>
        {filtered.length} proverb{filtered.length !== 1 ? "s" : ""}. Tap any card to reveal its deeper meaning.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map((p, i) => <ProverbCard key={i} item={p} />)}
      </div>
    </div>
  );
}

function ListingView({ data, searchPlaceholder, emptyLabel }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    if (!query.trim()) return data;
    const q = query.toLowerCase();
    return data.filter(
      (d) => d.shona.toLowerCase().includes(q) || d.english.toLowerCase().includes(q)
    );
  }, [query, data]);

  return (
    <div>
      <SearchBar value={query} onChange={setQuery} placeholder={searchPlaceholder} />
      <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 0" }}>
        {filtered.length} {emptyLabel}{filtered.length !== 1 ? "s" : ""}
      </p>
      <div style={{
        marginTop: 12, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden",
      }}>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12,
          padding: "10px 16px", background: "var(--surface-2)", borderBottom: "1px solid var(--border)",
        }}>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)" }}>Shona</p>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)" }}>English</p>
        </div>
        {filtered.length === 0 ? (
          <p style={{ padding: "20px 16px", fontSize: 13, color: "var(--text-muted)" }}>No results found.</p>
        ) : (
          filtered.map((item, i) => <AnimalRow key={i} item={item} />)
        )}
      </div>
    </div>
  );
}

function ArticleView({ data }) {
  return (
    <div style={{ maxWidth: 680 }}>
      <p style={{ fontSize: 15, color: "var(--text-secondary)", margin: "0 0 32px", lineHeight: 1.7 }}>
        {data.subtitle}
      </p>
      {data.sections.map((s, i) => (
        <div key={i} style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 12px", color: "var(--text)" }}>
            {s.heading}
          </h3>
          <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
            {s.body}
          </div>
        </div>
      ))}
      {data.keyWords && (
        <div style={{ marginTop: 8 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 14px", color: "var(--text)" }}>
            Key Words
          </h3>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 2fr",
              padding: "10px 16px", background: "var(--surface-2)", borderBottom: "1px solid var(--border)",
            }}>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)" }}>Shona</p>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)" }}>Meaning</p>
            </div>
            {data.keyWords.map((kw, i) => (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12,
                padding: "11px 16px", borderBottom: i < data.keyWords.length - 1 ? "1px solid var(--border)" : "none",
              }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "var(--zw-green)" }}>{kw.shona}</p>
                <p style={{ margin: 0, fontSize: 14, color: "var(--text-secondary)" }}>{kw.english}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function NhetemboView() {
  const [activeTotem, setActiveTotem] = useState(null);
  return (
    <div>
      <div style={{ maxWidth: 680, marginBottom: 36 }}>
        <p style={{ fontSize: 15, color: "var(--text-secondary)", margin: "0 0 28px", lineHeight: 1.7 }}>
          {nhetembo.subtitle}
        </p>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8, whiteSpace: "pre-wrap", marginBottom: 32 }}>
          {nhetembo.intro}
        </p>
        {nhetembo.sections.map((s, i) => (
          <div key={i} style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 10px", color: "var(--text)" }}>{s.heading}</h3>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8, margin: 0, whiteSpace: "pre-wrap" }}>{s.body}</p>
          </div>
        ))}
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 6px", color: "var(--text)" }}>
        Mitupo (Totems) and Zvidawo (Praise Names)
      </h3>
      <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 16px" }}>
        Tap a totem to see its praise names.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {nhetembo.totems.map((t, i) => (
          <button
            key={i}
            onClick={() => setActiveTotem(activeTotem === i ? null : i)}
            style={{
              textAlign: "left", background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: 10, padding: "14px 16px", cursor: "pointer",
              borderColor: activeTotem === i ? "var(--zw-green)" : "var(--border)",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: "var(--zw-green)" }}>{t.mutupo}</span>
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{t.english}</span>
              <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--text-muted)" }}>
                {activeTotem === i ? "collapse" : `${t.zvidawo.length} praise name${t.zvidawo.length !== 1 ? "s" : ""}`}
              </span>
            </div>
            {activeTotem === i && t.zvidawo.length > 0 && (
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--border)", display: "flex", flexWrap: "wrap", gap: 6 }}>
                {t.zvidawo.map((z, j) => (
                  <span key={j} style={{
                    fontSize: 12, padding: "4px 10px", borderRadius: 999,
                    background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-secondary)",
                  }}>
                    {z}
                  </span>
                ))}
              </div>
            )}
            {activeTotem === i && t.zvidawo.length === 0 && (
              <p style={{ margin: "10px 0 0", fontSize: 13, color: "var(--text-muted)", paddingTop: 10, borderTop: "1px solid var(--border)" }}>
                Praise names not yet documented.
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function LearnPage() {
  const [topic, setTopic] = useState("proverbs");
  const current = TOPICS.find((t) => t.id === topic);

  function renderContent() {
    switch (topic) {
      case "proverbs": return <ProverbsView />;
      case "animals": return <ListingView data={animals} searchPlaceholder="Search animals in Shona or English..." emptyLabel="animal" />;
      case "birds": return <ListingView data={birds} searchPlaceholder="Search birds in Shona or English..." emptyLabel="bird" />;
      case "insects": return <ListingView data={insects} searchPlaceholder="Search insects in Shona or English..." emptyLabel="insect" />;
      case "roora": return <ArticleView data={roora} />;
      case "nhetembo": return <NhetemboView />;
      default: return null;
    }
  }

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <FlagStripe />

      <header style={{
        borderBottom: "1px solid var(--border)", padding: "14px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: 0.3 }}>
            MUZE<span style={{ color: "var(--zw-green)" }}>ZURU</span>
          </span>
          <span style={{ fontSize: 13, color: "var(--text-muted)", paddingLeft: 10, borderLeft: "1px solid var(--border)" }}>
            Dzidza ChiShona — Learn Shona
          </span>
        </div>
        <Link
          href="/"
          style={{
            fontSize: 13, padding: "7px 14px", borderRadius: 8,
            border: "1px solid var(--border)", background: "var(--surface-2)",
            color: "var(--text-secondary)", textDecoration: "none", display: "flex", alignItems: "center", gap: 6,
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Chat
        </Link>
      </header>

      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <nav style={{
          width: 200, flexShrink: 0, borderRight: "1px solid var(--border)",
          padding: "20px 12px", display: "flex", flexDirection: "column", gap: 4,
        }}
          className="muz-learn-nav"
        >
          {TOPICS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTopic(t.id)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", borderRadius: 8, border: "none", textAlign: "left",
                background: topic === t.id ? "var(--surface-2)" : "transparent",
                borderLeft: topic === t.id ? `3px solid var(--zw-green)` : "3px solid transparent",
                cursor: "pointer",
              }}
            >
              <span style={{ fontSize: 18 }}>{t.emoji}</span>
              <span style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 13, fontWeight: topic === t.id ? 700 : 500, color: topic === t.id ? "var(--text)" : "var(--text-secondary)" }}>
                  {t.label}
                </span>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{t.sublabel}</span>
              </span>
            </button>
          ))}
        </nav>

        <div style={{ flex: 1, overflowY: "auto", padding: "32px 40px" }} className="muz-learn-content">
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px", color: "var(--text)" }}>
                {current.emoji} {current.label}
              </h1>
              <p style={{ margin: 0, fontSize: 14, color: "var(--text-muted)" }}>{current.sublabel}</p>
            </div>
            {renderContent()}
          </div>
        </div>
      </div>

      <footer style={{
        borderTop: "1px solid var(--border)", padding: "12px 32px",
        fontSize: 12, color: "var(--text-muted)", flexShrink: 0,
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8,
      }}>
        <span>Muzezuru Learn section — curated Shona language and culture content</span>
        <span>More categories coming</span>
      </footer>
    </main>
  );
}
