"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MATCHER_ITEMS, STATES } from "../../lib/matcher-data";

export default function StateMatcher() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [matches, setMatches] = useState<{ itemId: string; state: string }[]>(
    []
  );
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    } else if (status === "authenticated") {
      // Load user's total points
      fetchPoints();
      // Initialize matches
      setMatches(MATCHER_ITEMS.map((item) => ({ itemId: item.id, state: "" })));
    }
  }, [status, router]);

  async function fetchPoints() {
    try {
      const res = await fetch("/api/matcher");
      const data = await res.json();
      setTotalPoints(data.points || 0);
    } catch (err) {
      console.error(err);
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>, itemId: string) {
    e.preventDefault();
    const state = e.dataTransfer.getData("state");
    setMatches((prev) =>
      prev.map((m) => (m.itemId === itemId ? { ...m, state } : m))
    );
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  function handleDragStart(
    e: React.DragEvent<HTMLButtonElement>,
    state: string
  ) {
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("state", state);
  }

  async function submitMatches() {
    setLoading(true);
    try {
      const res = await fetch("/api/matcher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matches }),
      });
      const data = await res.json();
      setResult(data);
      setTotalPoints(data.totalPoints);
    } catch (err) {
      console.error(err);
      setResult({ error: String(err) });
    } finally {
      setLoading(false);
    }
  }

  function resetGame() {
    setMatches(MATCHER_ITEMS.map((item) => ({ itemId: item.id, state: "" })));
    setResult(null);
  }

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return null;

  return (
    <main style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
      <h1>State Matcher Game</h1>
      <p>
        Drag states to match with foods and dance forms from Indian culture.
      </p>
      <p style={{ fontSize: 14, color: "#666" }}>
        Your Total Points: {totalPoints}
      </p>

      {result && (
        <div
          style={{
            marginBottom: 20,
            padding: 16,
            border:
              result.score === MATCHER_ITEMS.length
                ? "2px solid green"
                : "2px solid orange",
            borderRadius: 8,
            backgroundColor:
              result.score === MATCHER_ITEMS.length ? "#f0fff0" : "#fff8f0",
          }}
        >
          <h2>{result.message}</h2>
          <button onClick={resetGame} style={{ marginTop: 12 }}>
            Play Again
          </button>
        </div>
      )}

      {!result && (
        <>
          <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
            {/* Items to Match (left side) */}
            <div style={{ flex: 1, maxHeight: 420, overflowY: "auto" }}>
              <h3>Items to Match</h3>
              {MATCHER_ITEMS.map((item) => {
                const match = matches.find((m) => m.itemId === item.id);
                return (
                  <div
                    key={item.id}
                    onDrop={(e) => handleDrop(e, item.id)}
                    onDragOver={handleDragOver}
                    style={{
                      marginBottom: 12,
                      padding: 12,
                      border: "2px solid #ddd",
                      borderRadius: 4,
                      minHeight: 50,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      backgroundColor: match?.state ? "#e3f2fd" : "#f5f5f5",
                      cursor: "pointer",
                      borderColor:
                        activeItemId === item.id ? "#0070f3" : undefined,
                      boxShadow:
                        activeItemId === item.id
                          ? "0 4px 12px rgba(0,112,243,0.12)"
                          : undefined,
                    }}
                    onClick={() => setActiveItemId(item.id)}
                  >
                    <div>
                      <strong>{item.name}</strong>
                      <span
                        style={{ marginLeft: 8, fontSize: 12, color: "#999" }}
                      >
                        ({item.category})
                      </span>
                    </div>
                    {match?.state && (
                      <span style={{ color: "#0070f3", fontWeight: "bold" }}>
                        → {match.state}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* States to drag (right side) */}
            <div style={{ flex: 0.5 }}>
              <h3>States</h3>
              {STATES.map((state) => (
                <button
                  key={state}
                  draggable
                  onDragStart={(e) => handleDragStart(e, state)}
                  onClick={() => {
                    // If an item is active, assign to it, otherwise assign to first empty
                    if (activeItemId) {
                      setMatches((prev) =>
                        prev.map((m) =>
                          m.itemId === activeItemId ? { ...m, state } : m
                        )
                      );
                      setActiveItemId(null);
                    } else {
                      const firstEmpty = matches.find((m) => !m.state);
                      if (firstEmpty) {
                        setMatches((prev) =>
                          prev.map((m) =>
                            m.itemId === firstEmpty.itemId ? { ...m, state } : m
                          )
                        );
                      }
                    }
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    marginBottom: 8,
                    padding: "10px 8px",
                    backgroundColor: "#0070f3",
                    color: "white",
                    border: "none",
                    borderRadius: 4,
                    cursor: "grab",
                    fontSize: 14,
                  }}
                >
                  {state}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <button
              onClick={submitMatches}
              disabled={loading || !matches.every((m) => m.state)}
              style={{
                padding: "12px 24px",
                fontSize: 16,
                backgroundColor: !matches.every((m) => m.state)
                  ? "#ccc"
                  : "#28a745",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: !matches.every((m) => m.state)
                  ? "not-allowed"
                  : "pointer",
              }}
            >
              {loading ? "Submitting..." : "Submit Matches"}
            </button>
            <span style={{ marginLeft: 12, fontSize: 14, color: "#666" }}>
              {matches.filter((m) => m.state).length} / {MATCHER_ITEMS.length}{" "}
              matched
            </span>
          </div>
        </>
      )}

      {result && result.results && (
        <div style={{ marginTop: 20 }}>
          <h3>Results</h3>
          {result.results.map((r: any) => {
            const item = MATCHER_ITEMS.find((i) => i.id === r.itemId);
            return (
              <div
                key={r.itemId}
                style={{
                  padding: 12,
                  marginBottom: 8,
                  backgroundColor: r.isCorrect ? "#f0fff0" : "#fff8f0",
                  border: `2px solid ${r.isCorrect ? "green" : "orange"}`,
                  borderRadius: 4,
                }}
              >
                <strong>{item?.name}</strong>:{" "}
                {r.selectedState === r.correctState ? (
                  <span style={{ color: "green" }}>✓ Correct</span>
                ) : (
                  <span style={{ color: "red" }}>
                    ✗ You said {r.selectedState}, correct is {r.correctState}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
