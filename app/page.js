"use client";

import { useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// MUZEZURU -- Phase 7: frontend.
//
// Where we are: the model is trained (Phase 2-3), pushed to the Hugging
// Face Hub, and running behind a live Gradio Space (Phase 6) at
// huggingface.co/spaces/denzelchingodza/muzezuru. This file is the actual
// product -- a full-width chat UI, themed around the Zimbabwean flag, that
// talks to that Space directly. No separate backend server; the browser
// calls the Space's API straight from sendMessage() below. Conversations
// are saved locally in the browser (localStorage) so the history sidebar
// survives a page reload -- there's no account system or server-side
// database behind it.
// ---------------------------------------------------------------------------
const HF_SPACE_ID = "denzelchingodza/muzezuru";

// The Space exposes its respond() function at the API endpoint "/respond".
// If the Space is ever rebuilt with a different function name, open it,
// click "Use via API" at the bottom of the page, and update this to match.
const CHAT_API_NAME = "/respond";

const STORAGE_KEY = "muzezuru-conversations";

const SUGGESTED_PROMPTS = [
  "Chii chinonzi ubuntu?",
  "Ndiudze nezve Zimbabwe",
  "Taura neni muShona",
];

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 19V5" />
      <path d="M5 12l7-7 7 7" />
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

export default function Home() {
  const [darkMode, setDarkMode] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const hydratedRef = useRef(false);
  const threadEndRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Load any saved conversations once, on first mount in the browser.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setConversations(JSON.parse(raw));
    } catch {
      // Corrupt or blocked storage -- just start with an empty history.
    }
    hydratedRef.current = true;
  }, []);

  // Save on every change, but only after the initial load above has run --
  // otherwise this would fire first (with the empty starting state) and
  // immediately overwrite whatever was already saved.
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
    setActiveId(null);
    setInput("");
    setError(null);
  }

  async function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    setError(null);
    setInput("");

    const isNewConversation = !activeId;
    const convId =
      activeId || (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()));
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
      // This is the actual hand-off to the model: connect to the Space and
      // call its "respond" endpoint. Imported lazily here (instead of at
      // the top of the file) so Next.js never tries to reach the Space
      // during server-side rendering -- only once a real message is sent
      // in the browser.
      const { Client } = await import("@gradio/client");
      const client = await Client.connect(HF_SPACE_ID);

      // The Space's respond() function takes (message, history), where
      // history is every completed [user, assistant] turn before this one.
      const history = [];
      for (let i = 0; i < priorMessages.length; i += 2) {
        history.push([priorMessages[i]?.content ?? null, priorMessages[i + 1]?.content ?? null]);
      }

      const result = await client.predict(CHAT_API_NAME, { message: trimmed, history });
      const reply =
        typeof result.data?.[0] === "string" ? result.data[0] : String(result.data?.[0] ?? "");

      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId ? { ...c, messages: [...c.messages, { role: "assistant", content: reply }] } : c
        )
      );
    } catch (err) {
      console.error(err);
      setError(
        "Couldn't reach Muzezuru right now. The free GPU pool may be busy or the daily quota may be used up -- try again in a bit."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <main style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Zimbabwe flag accent strip -- green, gold, red, black -- spans the
          full browser width, same as the header below it */}
      <div style={{ height: 4, display: "flex", flexShrink: 0 }}>
        <div style={{ flex: 1, background: "var(--zw-green)" }} />
        <div style={{ flex: 1, background: "var(--zw-gold)" }} />
        <div style={{ flex: 1, background: "var(--zw-red)" }} />
        <div style={{ flex: 1, background: "var(--text)" }} />
      </div>

      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 40px",
          borderBottom: "1px solid var(--border)",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "var(--zw-green)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            M
          </div>
          <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: 0.3 }}>
            MUZE<span style={{ color: "var(--zw-green)" }}>ZURU</span>
          </span>
        </div>
        <button
          onClick={() => setDarkMode((d) => !d)}
          aria-label="Toggle dark mode"
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "1px solid var(--border)",
            background: "var(--surface-2)",
            color: "var(--text-secondary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ThemeIcon dark={darkMode} />
        </button>
      </header>

      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        {/* Chat history sidebar -- every conversation is saved locally in
            the browser, so it's still here after a reload. Clicking one
            reopens it in the thread view on the right. */}
        <aside
          style={{
            width: 240,
            flexShrink: 0,
            borderRight: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            background: "var(--surface)",
          }}
        >
          <div style={{ padding: 12 }}>
            <button
              onClick={startNewChat}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                fontSize: 13,
                padding: "9px 12px",
                borderRadius: 8,
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
                <button
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    fontSize: 13,
                    padding: "9px 10px",
                    marginBottom: 2,
                    borderRadius: 8,
                    border: "none",
                    background: c.id === activeId ? "var(--surface-2)" : "transparent",
                    color: c.id === activeId ? "var(--text)" : "var(--text-secondary)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {c.title}
                </button>
              ))
            )}
          </div>
        </aside>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          {showHero ? (
            /* Hero view: shown for a brand new chat, before the first
               message is sent. flex: 1 + justifyContent: center fills and
               centers the space to its right of the sidebar. */
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "56px 32px",
                textAlign: "center",
                background: "linear-gradient(180deg, var(--hero-tint) 0%, var(--bg) 65%)",
              }}
            >
              <div style={{ width: "100%", maxWidth: 560, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <h1 style={{ fontSize: 28, fontWeight: 600, margin: "0 0 8px", lineHeight: 1.25 }}>
                  Mhoro, ndini <span style={{ color: "var(--zw-green)" }}>Muzezuru</span>.
                </h1>
                <p style={{ fontSize: 15, color: "var(--text-secondary)", margin: "0 0 32px" }}>
                  Fine-tuned on BLOOMZ-3B via QLoRA, ready for any conversation in Shona.
                </p>

                <form onSubmit={handleSubmit} style={{ width: "100%", margin: "0 0 18px", position: "relative" }}>
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ndibvunze zvese..."
                    style={{
                      width: "100%",
                      padding: "15px 62px 15px 22px",
                      fontSize: 15,
                      borderColor: "var(--border-strong)",
                    }}
                  />
                  <button
                    type="submit"
                    aria-label="Send"
                    disabled={isLoading}
                    style={{
                      position: "absolute",
                      right: 6,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      border: "none",
                      background: "var(--zw-green)",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: isLoading ? 0.6 : 1,
                    }}
                  >
                    <SendIcon />
                  </button>
                </form>

                <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                  {SUGGESTED_PROMPTS.map((p) => (
                    <button
                      key={p}
                      onClick={() => sendMessage(p)}
                      style={{
                        fontSize: 12,
                        padding: "7px 14px",
                        borderRadius: 999,
                        border: "1px solid var(--border)",
                        background: "var(--surface-2)",
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
            /* Thread view: takes over once a conversation has messages,
               either from sending one just now or from picking one out of
               the sidebar history. */
            <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
              <div style={{ flex: 1, overflowY: "auto", display: "flex", justifyContent: "center", padding: "20px 32px 8px" }}>
                <div style={{ width: "100%", maxWidth: 720, display: "flex", flexDirection: "column", gap: 14 }}>
                  {messages.map((m, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        gap: 8,
                        maxWidth: "85%",
                        alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                        flexDirection: m.role === "user" ? "row-reverse" : "row",
                      }}
                    >
                      {m.role === "assistant" && (
                        <div
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            background: "var(--zw-green)",
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontSize: 11,
                            fontWeight: 600,
                          }}
                        >
                          M
                        </div>
                      )}
                      <div
                        style={{
                          background: m.role === "user" ? "var(--zw-gold)" : "var(--surface)",
                          color: m.role === "user" ? "#3a2b00" : "var(--text)",
                          border: m.role === "user" ? "none" : "1px solid var(--border)",
                          borderRadius: 12,
                          borderTopRightRadius: m.role === "user" ? 2 : 12,
                          borderTopLeftRadius: m.role === "assistant" ? 2 : 12,
                          padding: "10px 12px",
                          fontSize: 14,
                          lineHeight: 1.5,
                        }}
                      >
                        {m.content}
                      </div>
                    </div>
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

              <form
                onSubmit={handleSubmit}
                style={{ display: "flex", justifyContent: "center", padding: "14px 32px", borderTop: "1px solid var(--border)" }}
              >
                <div style={{ width: "100%", maxWidth: 720, position: "relative" }}>
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Nyora meseji..."
                    style={{ width: "100%", padding: "10px 50px 10px 16px", height: 40 }}
                  />
                  <button
                    type="submit"
                    aria-label="Send"
                    disabled={isLoading}
                    style={{
                      position: "absolute",
                      right: 6,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      border: "none",
                      background: "var(--zw-green)",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: isLoading ? 0.6 : 1,
                    }}
                  >
                    <SendIcon />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 10,
          padding: 14,
          fontSize: 12,
          color: "var(--text-muted)",
          borderTop: "1px solid var(--border)",
          flexShrink: 0,
        }}
      >
        <span>&copy; 2026 Muzezuru &middot; research project, not a finished product</span>
        <span>
          <a
            href="https://github.com/denzelchingodza/muzezuru"
            style={{ color: "var(--text-muted)", textDecoration: "underline" }}
          >
            GitHub
          </a>
          {" "}&middot;{" "}
          <a
            href="https://huggingface.co/denzelchingodza/muzezuru"
            style={{ color: "var(--text-muted)", textDecoration: "underline" }}
          >
            Model card &amp; license
          </a>
        </span>
      </div>
    </main>
  );
}
