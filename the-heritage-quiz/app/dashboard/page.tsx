"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FACTS } from "../../lib/facts";

type LastViewed = { factId: number; viewedAt: string };

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [points, setPoints] = useState<number | null>(null);
  const [factsViewed, setFactsViewed] = useState<number | null>(null);
  const [lastViewed, setLastViewed] = useState<LastViewed[]>([]);
  const [sessions, setSessions] = useState<
    { score: number; total: number; createdAt: string }[]
  >([]);
  const [sessionsCount, setSessionsCount] = useState<number>(0);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/dashboard?limit=10&offset=0");
        if (res.status === 401) {
          if (!mounted) return;
          setError("Not authenticated. Please sign in to view your dashboard.");
          return;
        }
        const json = await res.json();
        if (!mounted) return;
        if (json.error) {
          setError(json.error);
        } else {
          setPoints(json.points ?? 0);
          setFactsViewed(json.factsViewed ?? 0);
          setLastViewed(json.lastViewed ?? []);
          setSessions(json.sessions ?? []);
          setSessionsCount(json.sessionsCount ?? 0);
        }
      } catch (e: any) {
        if (!mounted) return;
        setError(String(e));
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  async function loadMoreSessions() {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const offset = sessions.length;
      const res = await fetch(`/api/dashboard?limit=10&offset=${offset}`);
      const json = await res.json();
      if (json.error) {
        setError(json.error);
      } else {
        setSessions((prev) => [...prev, ...(json.sessions ?? [])]);
        setSessionsCount(json.sessionsCount ?? sessionsCount);
      }
    } catch (e: any) {
      setError(String(e));
    } finally {
      setLoadingMore(false);
    }
  }

  async function showAllSessions() {
    if (loadingMore) return;
    if (sessions.length >= sessionsCount) return;
    setLoadingMore(true);
    try {
      // fetch remaining sessions in one request
      const offset = sessions.length;
      const remaining = Math.max(0, (sessionsCount || 0) - offset);
      const res = await fetch(
        `/api/dashboard?limit=${remaining}&offset=${offset}`
      );
      const json = await res.json();
      if (json.error) {
        setError(json.error);
      } else {
        setSessions((prev) => [...prev, ...(json.sessions ?? [])]);
        setSessionsCount(json.sessionsCount ?? sessionsCount);
      }
    } catch (e: any) {
      setError(String(e));
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 8 }}>Your Dashboard</h1>

      <nav style={{ marginBottom: 16 }}>
        <Link href="/">Home</Link> · <Link href="/monument">Monument</Link> ·{" "}
        <Link href="/matcher">Matcher</Link> · <Link href="/facts">Facts</Link>
      </nav>

      {loading && <p>Loading your progress…</p>}

      {error && (
        <div style={{ color: "#8b0000" }}>
          <p>{error}</p>
          <p>
            <Link href="/signin">Sign in</Link>
          </p>
        </div>
      )}

      {!loading && !error && (
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        >
          <div
            style={{ padding: 16, border: "1px solid #eee", borderRadius: 8 }}
          >
            <h2 style={{ marginTop: 0 }}>Points</h2>
            <p style={{ fontSize: 24, margin: 0 }}>{points ?? 0}</p>
            <p style={{ color: "#666", marginTop: 8 }}>
              Total points from Matcher and other activities.
            </p>
          </div>

          <div
            style={{ padding: 16, border: "1px solid #eee", borderRadius: 8 }}
          >
            <h2 style={{ marginTop: 0 }}>Facts Viewed</h2>
            <p style={{ fontSize: 24, margin: 0 }}>{factsViewed ?? 0}</p>
            <p style={{ color: "#666", marginTop: 8 }}>
              Unique facts you've seen so far.
            </p>
          </div>

          <div
            style={{
              gridColumn: "1 / -1",
              padding: 16,
              border: "1px solid #eee",
              borderRadius: 8,
            }}
          >
            <h2 style={{ marginTop: 0 }}>Recently Viewed Facts</h2>
            {lastViewed.length === 0 && <p>No facts viewed yet.</p>}
            {lastViewed.length > 0 && (
              <ul>
                {lastViewed.map((lv) => {
                  const fact = FACTS.find((f) => f.id === lv.factId);
                  return (
                    <li key={lv.factId} style={{ marginBottom: 8 }}>
                      <div style={{ fontWeight: 600 }}>
                        {fact ? fact.fact : `Fact #${lv.factId}`}
                      </div>
                      <div style={{ color: "#666", fontSize: 12 }}>
                        Viewed at: {new Date(lv.viewedAt).toLocaleString()}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <div
            style={{
              gridColumn: "1 / -1",
              padding: 16,
              border: "1px solid #eee",
              borderRadius: 8,
            }}
          >
            <h2 style={{ marginTop: 0 }}>Recent Matcher Sessions</h2>
            {sessions.length === 0 && <p>No sessions recorded yet.</p>}
            {sessions.length > 0 && (
              <>
                <ol>
                  {sessions.map((s, idx) => (
                    <li key={idx} style={{ marginBottom: 8 }}>
                      <div style={{ fontWeight: 600 }}>
                        {s.score} / {s.total}
                      </div>
                      <div style={{ color: "#666", fontSize: 12 }}>
                        {new Date(s.createdAt).toLocaleString()}
                      </div>
                    </li>
                  ))}
                </ol>

                {sessions.length < sessionsCount && (
                  <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                    <button
                      onClick={() => loadMoreSessions()}
                      disabled={loadingMore}
                      style={{
                        padding: "8px 12px",
                        background: "#0070f3",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        cursor: loadingMore ? "not-allowed" : "pointer",
                      }}
                    >
                      {loadingMore ? "Loading…" : "Load more"}
                    </button>

                    <button
                      onClick={() => showAllSessions()}
                      disabled={loadingMore}
                      style={{
                        padding: "8px 12px",
                        background: "#444",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        cursor: loadingMore ? "not-allowed" : "pointer",
                      }}
                    >
                      Show all
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
