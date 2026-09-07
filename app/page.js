"use client";

import { useEffect, useRef, useState } from "react";

const HF_SPACE_ID = "denzelchingodza/muzezuru";
const SPACE_URL = `https://${HF_SPACE_ID.replace("/", "-")}.hf.space`;
const CHAT_API_NAME = "respond";
const STORAGE_KEY = "muzezuru-conversations";
const NOTICE_STORAGE_KEY = "muzezuru-notice-dismissed";

async function callSpace(message, history) {
  const postRes = await fetch(`${SPACE_URL}/gradio_api/call/${CHAT_API_NAME}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: [message, history] }),
  });
  if (!postRes.ok) throw new Error(`Space returned ${postRes.status} joining the queue`);
  const { event_id } = await postRes.json();

  const streamRes = await fetch(`${SPACE_URL}/gradio_api/call/${CHAT_API_NAME}/${event_id}`);
  if (!streamRes.ok || !streamRes.body) throw new Error(`Space returned ${streamRes.status} streaming the result`);

  const reader = streamRes.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let currentEvent = "message";
  let result = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop();

    for (const line of lines) {
      if (line.startsWith("event:")) {
        currentEvent = line.slice(6).trim();
      } else if (line.startsWith("data:")) {
        const jsonStr = line.slice(5).trim();
        if (!jsonStr) continue;
        if (currentEvent === "error") throw new Error(`Space reported an error: ${jsonStr}`);
        if (currentEvent !== "heartbeat") {
          try { result = JSON.parse(jsonStr); } catch { }
        }
      }
    }
  }

  if (!result) throw new Error("Space stream ended without a result");
  return result;
}

const SUGGESTED_PROMPTS = [
  "Mhoro, uri sei?",
  "Chii chinonzi ubuntu?",
  "Ndiudze nezve Zimbabwe",
  "Shandura: 'The sun rises in the east'",
  "Ipa nzira yekubika sadza",
  "Taura tsumo yemaShona",
  "Ndiani aive Sekuru Kaguvi?",
  "Kurova guva kureva chii?",
];

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 19V5" /><path d="M5 12l7-7 7 7" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}
function ThemeIcon({ dark }) {
  return dark ? (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  ) : (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}
function CopyIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}
function ThumbUpIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
      <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
    </svg>
  );
}
function ThumbDownIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z" />
      <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
    </svg>
  );
}

function MessageInput({ value, onChange, onSubmit, placeholder, disabled, size }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, [value]);

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSubmit(); }
  }

  const isHero = size === "hero";

  return (
    <>
      <textarea
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        style={{
          width: "100%", display: "block", resize: "none", maxHeight: 160, overflowY: "auto",
          padding: isHero ? "15px 62px 15px 22px" : "10px 50px 10px 16px",
          fontSize: isHero ? 15 : 14, lineHeight: 1.4,
        }}
      />
      <button
        type="button" onClick={onSubmit} aria-label="Send" disabled={disabled}
        style={{
          position: "absolute", right: 6, bottom: 6,
          width: isHero ? 34 : 28, height: isHero ? 34 : 28,
          borderRadius: "50%", border: "none", background: "var(--zw-green)", color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <SendIcon />
      </button>
    </>
  );
}

function FlagBadge({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" aria-hidden="true" style={{ flexShrink: 0 }}>
      <clipPath id="muz-flag-clip"><circle cx="14" cy="14" r="14" /></clipPath>
      <g clipPath="url(#muz-flag-clip)">
        <rect width="28" height="28" fill="var(--zw-green)" />
        <rect y="4" width="28" height="4" fill="var(--zw-gold)" />
        <rect y="8" width="28" height="4" fill="var(--zw-red)" />
        <rect y="12" width="28" height="4" fill="var(--text)" />
        <rect y="16" width="28" height="4" fill="var(--zw-red)" />
        <rect y="20" width="28" height="4" fill="var(--zw-gold)" />
        <rect y="24" width="28" height="4" fill="var(--zw-green)" />
        <polygon points="0,0 0,28 13,14" fill="#fff" />
        <polygon points="6,14 7.4,10.2 8.8,14 5.1,11.5 10.5,11.5" fill="var(--zw-red)" />
      </g>
    </svg>
  );
}

function MessageBubble({ m, onFeedback }) {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState(null);

  function handleCopy() {
    navigator.clipboard.writeText(m.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  function handleFeedback(val) {
    setFeedback(val);
    if (onFeedback) onFeedback(val);
  }

  const isAssistant = m.role === "assistant";

  return (
    <div
      style={{
        display: "flex", gap: 8, maxWidth: "85%",
        alignSelf: isAssistant ? "flex-start" : "flex-end",
        flexDirection: isAssistant ? "row" : "row-reverse",
        flexDirection: m.role === "user" ? "row-reverse" : "row",
      }}
    >
      {isAssistant && (
        <div style={{
          width: 24, height: 24, borderRadius: "50%", background: "var(--zw-green)",
          flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: 11, fontWeight: 600, marginTop: 2,
        }}>
          M
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div
          style={{
            background: m.role === "user" ? "var(--zw-gold)" : "var(--surface)",
            color: m.role === "user" ? "#3a2b00" : "var(--text)",
            border: m.role === "user" ? "none" : "1px solid var(--border)",
            borderRadius: 12,
            borderTopRightRadius: m.role === "user" ? 2 : 12,
            borderTopLeftRadius: m.role === "assistant" ? 2 : 12,
            padding: "10px 12px", fontSize: 14, lineHeight: 1.5,
          }}
        >
          {m.content}
        </div>

        {isAssistant && (
          <div style={{ display: "flex", gap: 4, paddingLeft: 4 }}>
            <button
              onClick={handleCopy}
              title="Copy"
              style={{
                display: "flex", alignItems: "center", gap: 4,
                fontSize: 11, color: copied ? "var(--zw-green)" : "var(--text-muted)",
                border: "none", background: "transparent", padding: "3px 6px",
                borderRadius: 6, cursor: "pointer",
              }}
            >
              <CopyIcon />
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              onClick={() => handleFeedback("up")}
              title="Good response"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: 24, height: 24, border: "1px solid var(--border)",
                background: feedback === "up" ? "var(--zw-green)" : "transparent",
                color: feedback === "up" ? "#fff" : "var(--text-muted)",
                borderRadius: 6, cursor: "pointer",
              }}
            >
              <ThumbUpIcon />
            </button>
            <button
              onClick={() => handleFeedback("down")}
              title="Bad response"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: 24, height: 24, border: "1px solid var(--border)",
                background: feedback === "down" ? "var(--zw-red)" : "transparent",
                color: feedback === "down" ? "#fff" : "var(--text-muted)",
                borderRadius: 6, cursor: "pointer",
              }}
            >
              <ThumbDownIcon />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [showNotice, setShowNotice] = useState(false);
  const hydratedRef = useRef(false);
  const threadEndRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setConversations(JSON.parse(raw));
    } catch { }
    hydratedRef.current = true;
  }, []);

  useEffect(() => {
    try {
      if (!localStorage.getItem(NOTICE_STORAGE_KEY)) setShowNotice(true);
    } catch { }
  }, []);

  function dismissNotice() {
    setShowNotice(false);
    try { localStorage.setItem(NOTICE_STORAGE_KEY, "1"); } catch { }
  }

  useEffect(() => {
    if (!hydratedRef.current) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  }, [conversations]);

  const activeConversation = conversations.find((c) => c.id === activeId) ?? null;
  const messages = activeConversation?.messages ?? [];
  const showHero = messages.length === 0;

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  function startNewChat() {
    setActiveId(null); setInput(""); setError(null); setSidebarOpen(false);
  }

  function openConversation(id) {
    setActiveId(id); setSidebarOpen(false);
  }

  function deleteConversation(id, e) {
    e.stopPropagation();
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeId === id) setActiveId(null);
  }

  function clearAllConversations() {
    if (conversations.length === 0) return;
    setConfirmClearOpen(true);
  }

  function confirmClearAll() {
    setConversations([]); setActiveId(null); setConfirmClearOpen(false);
  }

  async function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    setError(null); setInput("");

    const isNewConversation = !activeId;
    const convId = activeId || (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()));
    const priorMessages = isNewConversation ? [] : conversations.find((c) => c.id === convId)?.messages ?? [];
    const messagesWithUser = [...priorMessages, { role: "user", content: trimmed }];

    setConversations((prev) => {
      if (isNewConversation) {
        const title = trimmed.length > 42 ? trimmed.slice(0, 42) + "..." : trimmed;
        return [{ id: convId, title, messages: messagesWithUser }, ...prev];
      }
      return prev.map((c) => (c.id === convId ? { ...c, messages: messagesWithUser } : c));
    });
    if (isNewConversation) setActiveId(convId);
    setIsLoading(true);

    try {
      const history = [];
      for (let i = 0; i < priorMessages.length; i += 2) {
        history.push([priorMessages[i]?.content ?? null, priorMessages[i + 1]?.content ?? null]);
      }
      const data = await callSpace(trimmed, history);
      const reply = typeof data?.[0] === "string" ? data[0] : String(data?.[0] ?? "");
      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId ? { ...c, messages: [...c.messages, { role: "assistant", content: reply }] } : c
        )
      );
    } catch (err) {
      console.error(err);
      setError("Couldn't reach Muzezuru right now. The free GPU pool may be busy or the daily quota may be used up. Try again in a bit.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ height: 4, display: "flex", flexShrink: 0 }}>
        <div style={{ flex: 1, background: "var(--zw-green)" }} />
        <div style={{ flex: 1, background: "var(--zw-gold)" }} />
        <div style={{ flex: 1, background: "var(--zw-red)" }} />
        <div style={{ flex: 1, background: "var(--text)" }} />
      </div>

      <header className="muz-header" style={{ borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            className="muz-menu-toggle"
            onClick={() => setSidebarOpen((o) => !o)}
            aria-label="Toggle chat history"
            style={{
              width: 32, height: 32, borderRadius: 8, border: "1px solid var(--border)",
              background: "var(--surface-2)", color: "var(--text-secondary)",
              alignItems: "center", justifyContent: "center",
            }}
          >
            <MenuIcon />
          </button>
          <FlagBadge />
          <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: 0.3, whiteSpace: "nowrap" }}>
            MUZE<span style={{ color: "var(--zw-green)" }}>ZURU</span>
          </span>
        </div>
        <button
          onClick={() => setDarkMode((d) => !d)}
          aria-label="Toggle dark mode"
          style={{
            width: 32, height: 32, borderRadius: "50%", border: "1px solid var(--border)",
            background: "var(--surface-2)", color: "var(--text-secondary)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <ThemeIcon dark={darkMode} />
        </button>
      </header>

      <div style={{ flex: 1, display: "flex", minHeight: 0, position: "relative" }}>
        {sidebarOpen && <div className="muz-sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}

        <aside
          className={`muz-sidebar${sidebarOpen ? " open" : ""}`}
          style={{
            width: 240, flexShrink: 0, borderRight: "1px solid var(--border)",
            display: "flex", flexDirection: "column", background: "var(--surface)",
          }}
        >
          <div style={{ padding: 12 }}>
            <button
              onClick={startNewChat}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
                gap: 6, fontSize: 13, padding: "9px 12px", borderRadius: 8,
              }}
            >
              <PlusIcon />
              Chat itsva
            </button>
          </div>

          <div style={{ overflowY: "auto", flex: 1, padding: "0 8px 12px" }}>
            {conversations.length === 0 ? (
              <p style={{ fontSize: 12, color: "var(--text-muted)", padding: "8px 8px" }}>
                Your conversations will show up here.
              </p>
            ) : (
              conversations.map((c) => (
                <div
                  key={c.id}
                  className="muz-conv-row"
                  style={{
                    display: "flex", alignItems: "center", borderRadius: 8, marginBottom: 2,
                    background: c.id === activeId ? "var(--surface-2)" : "transparent",
                  }}
                >
                  <button
                    onClick={() => openConversation(c.id)}
                    style={{
                      flex: 1, minWidth: 0, display: "block", textAlign: "left", fontSize: 13,
                      padding: "9px 10px", border: "none", background: "transparent",
                      color: c.id === activeId ? "var(--text)" : "var(--text-secondary)",
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}
                  >
                    {c.title}
                  </button>
                  <button
                    onClick={(e) => deleteConversation(c.id, e)}
                    aria-label={`Delete conversation: ${c.title}`}
                    className="muz-conv-delete"
                    style={{
                      flexShrink: 0, width: 26, height: 26, marginRight: 6, border: "none",
                      background: "transparent", color: "var(--text-muted)",
                      display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 6,
                    }}
                  >
                    <TrashIcon />
                  </button>
                </div>
              ))
            )}
          </div>

          {conversations.length > 0 && (
            <div style={{ padding: "8px 12px", borderTop: "1px solid var(--border)" }}>
              <button
                onClick={clearAllConversations}
                style={{
                  width: "100%", fontSize: 12, padding: "7px 10px", border: "none",
                  background: "transparent", color: "var(--text-muted)",
                }}
              >
                Clear all conversations
              </button>
            </div>
          )}

          {/* About panel */}
          <div style={{ borderTop: "1px solid var(--border)", padding: "12px 14px" }}>
            <button
              onClick={() => setShowAbout((v) => !v)}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em",
                color: "var(--text-muted)", border: "none", background: "transparent", cursor: "pointer",
                padding: 0, marginBottom: showAbout ? 10 : 0,
              }}
            >
              About Muzezuru
              <span style={{ fontSize: 14, fontWeight: 400 }}>{showAbout ? "−" : "+"}</span>
            </button>
            {showAbout && (
              <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                <p style={{ margin: "0 0 8px" }}>
                  A fine-tuned Shona language model built on BLOOMZ-3B using QLoRA with 4-bit quantization, trained entirely on free compute.
                </p>
                <p style={{ margin: "0 0 8px" }}>
                  Shona is a low-resource African language with almost no NLP tooling. This project is an attempt to change that.
                </p>
                <p style={{ margin: "0 0 10px" }}>
                  The model still hallucinates on some inputs, an honest limitation of the dataset size. Improvements are ongoing.
                </p>
                <div style={{ display: "flex", gap: 8 }}>
                  <a href="https://huggingface.co/denzelchingodza/muzezuru" target="_blank" rel="noopener"
                    style={{ fontSize: 11, color: "var(--zw-green)", textDecoration: "underline" }}>
                    Model card
                  </a>
                  <a href="https://github.com/denzelchingodza/muzezuru" target="_blank" rel="noopener"
                    style={{ fontSize: 11, color: "var(--zw-green)", textDecoration: "underline" }}>
                    GitHub
                  </a>
                </div>
              </div>
            )}
          </div>

          <p style={{ fontSize: 11, color: "var(--text-muted)", padding: "8px 12px 12px", margin: 0, lineHeight: 1.5 }}>
            Saved only in this browser. Anyone else using it can see this history, so delete what you don&apos;t want left behind.
          </p>
        </aside>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          {showHero ? (
            <div
              className="muz-hero"
              style={{
                flex: 1, display: "flex", flexDirection: "column", justifyContent: "center",
                alignItems: "center", padding: "56px 32px", textAlign: "center", background: "var(--bg)",
              }}
            >
              <div style={{ width: "100%", maxWidth: 560, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <h1 className="muz-hero-title" style={{ fontSize: 28, fontWeight: 600, margin: "0 0 8px", lineHeight: 1.25 }}>
                  Mhoro, ndini <span style={{ color: "var(--zw-green)" }}>Muzezuru</span>.
                </h1>
                <p style={{ fontSize: 15, color: "var(--text-secondary)", margin: "0 0 6px" }}>
                  A fine-tuned Shona language model, still learning, openly a work in progress.
                </p>
                <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "0 0 32px" }}>
                  Try a greeting, ask about Zimbabwe, or request a proverb. Shona only.
                </p>

                <div className="muz-input-box" style={{ width: "100%", margin: "0 0 18px" }}>
                  <MessageInput
                    value={input} onChange={setInput}
                    onSubmit={() => sendMessage(input)}
                    placeholder="Ndibvunze zvese..."
                    disabled={isLoading} size="hero"
                  />
                </div>

                <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                  {SUGGESTED_PROMPTS.map((p) => (
                    <button
                      key={p} onClick={() => sendMessage(p)}
                      style={{
                        fontSize: 12, padding: "7px 14px", borderRadius: 999,
                        border: "1px solid var(--border)", background: "var(--surface-2)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                {error && <p style={{ marginTop: 20, fontSize: 13, color: "var(--zw-red)" }}>{error}</p>}
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
              <div className="muz-thread-scroll" style={{ flex: 1, overflowY: "auto", display: "flex", justifyContent: "center", padding: "20px 32px 8px" }}>
                <div style={{ width: "100%", maxWidth: 720, display: "flex", flexDirection: "column", gap: 14 }}>
                  {messages.map((m, i) => (
                    <MessageBubble key={i} m={m} />
                  ))}
                  {isLoading && (
                    <div style={{ fontSize: 13, color: "var(--text-muted)", paddingLeft: 32 }}>
                      Muzezuru ari kunyora...
                    </div>
                  )}
                  {error && <p style={{ fontSize: 13, color: "var(--zw-red)" }}>{error}</p>}
                  <div ref={threadEndRef} />
                </div>
              </div>

              <div
                className="muz-thread-form"
                style={{ display: "flex", justifyContent: "center", padding: "14px 32px", borderTop: "1px solid var(--border)" }}
              >
                <div className="muz-input-box" style={{ width: "100%", maxWidth: 720 }}>
                  <MessageInput
                    value={input} onChange={setInput}
                    onSubmit={() => sendMessage(input)}
                    placeholder="Nyora meseji..."
                    disabled={isLoading} size="thread"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10,
          padding: 14, fontSize: 12, color: "var(--text-muted)",
          borderTop: "1px solid var(--border)", flexShrink: 0,
        }}
      >
        <span>&copy; 2026 Muzezuru &middot; research project, not a finished product</span>
        <span>
          <a href="https://github.com/denzelchingodza/muzezuru" style={{ color: "var(--text-muted)", textDecoration: "underline" }}>GitHub</a>
          {" "}&middot;{" "}
          <a href="https://huggingface.co/denzelchingodza/muzezuru" style={{ color: "var(--text-muted)", textDecoration: "underline" }}>Model card &amp; license</a>
        </span>
      </div>

      {confirmClearOpen && (
        <div
          role="dialog" aria-modal="true" aria-labelledby="muz-confirm-title"
          onClick={() => setConfirmClearOpen(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0, 0, 0, 0.5)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%", maxWidth: 340, background: "var(--surface)",
              border: "1px solid var(--border)", borderRadius: 14, padding: 20,
              boxShadow: "0 12px 40px rgba(0, 0, 0, 0.35)",
            }}
          >
            <h2 id="muz-confirm-title" style={{ fontSize: 15, fontWeight: 600, margin: "0 0 8px" }}>
              Delete all conversations?
            </h2>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "0 0 18px", lineHeight: 1.5 }}>
              This removes every saved conversation on this device. It can&apos;t be undone.
            </p>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button
                onClick={() => setConfirmClearOpen(false)}
                style={{ fontSize: 13, padding: "8px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text)" }}
              >
                Cancel
              </button>
              <button
                onClick={confirmClearAll}
                style={{ fontSize: 13, padding: "8px 14px", borderRadius: 8, border: "none", background: "var(--zw-red)", color: "#fff" }}
              >
                Delete all
              </button>
            </div>
          </div>
        </div>
      )}

      {showNotice && (
        <div
          role="status"
          style={{
            position: "fixed", right: 16, bottom: 16, maxWidth: 300,
            display: "flex", alignItems: "flex-start", gap: 8,
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: 14, padding: "14px 12px 14px 16px",
            boxShadow: "0 8px 28px rgba(0, 0, 0, 0.3)", zIndex: 60,
          }}
        >
          <p style={{ flex: 1, fontSize: 13, color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
            This is a work in progress. Muzezuru is still being improved and may hallucinate or give unexpected responses, especially on complex prompts.
          </p>
          <button
            onClick={dismissNotice} aria-label="Dismiss this message"
            style={{
              flexShrink: 0, width: 22, height: 22, border: "none", background: "transparent",
              color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 6,
            }}
          >
            <CloseIcon />
          </button>
        </div>
      )}
    </main>
  );
}
