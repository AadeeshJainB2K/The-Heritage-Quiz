"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

type LeaderboardEntry = {
  rank: number;
  userId: string;
  name: string;
  image: string | null;
  email: string | null;
  totalPoints: number;
};

export default function LeaderboardPage() {
  const { data: session } = useSession();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRank, setUserRank] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/leaderboard?limit=50");
        const data = await res.json();
        if (data.error) {
          setError(data.error);
        } else {
          setLeaderboard(data.leaderboard || []);
          // Find current user's rank
          if (session?.user?.email) {
            const found = data.leaderboard.find(
              (e: LeaderboardEntry) => e.email === session.user.email
            );
            if (found) {
              setUserRank(found.rank);
            }
          }
        }
      } catch (e: any) {
        setError(String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [session]);

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 8 }}>Leaderboard</h1>
      <p style={{ color: "#666" }}>Top performers in the Heritage Quiz</p>

      {session?.user?.email && userRank && (
        <div
          style={{
            marginBottom: 16,
            padding: 12,
            background: "#e3f2fd",
            border: "1px solid #0070f3",
            borderRadius: 8,
          }}
        >
          <p style={{ margin: 0 }}>
            Your current rank: <strong>#{userRank}</strong>
          </p>
        </div>
      )}

      {loading && <p>Loading leaderboard...</p>}

      {error && <p style={{ color: "#8b0000" }}>Error: {error}</p>}

      {!loading && !error && leaderboard.length === 0 && (
        <p>No users yet. Be the first to compete!</p>
      )}

      {!loading && !error && leaderboard.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: 16,
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#f5f5f5",
                  borderBottom: "2px solid #ddd",
                }}
              >
                <th style={{ padding: 12, textAlign: "left" }}>Rank</th>
                <th style={{ padding: 12, textAlign: "left" }}>Name</th>
                <th style={{ padding: 12, textAlign: "right" }}>Points</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, idx) => (
                <tr
                  key={entry.userId}
                  style={{
                    borderBottom: "1px solid #eee",
                    background:
                      session?.user?.email === entry.email
                        ? "#fffbf0"
                        : idx < 3
                        ? "#f9f9f9"
                        : "transparent",
                  }}
                >
                  <td style={{ padding: 12, textAlign: "left" }}>
                    {entry.rank === 1 && "🥇"}
                    {entry.rank === 2 && "🥈"}
                    {entry.rank === 3 && "🥉"}
                    {entry.rank > 3 && `#${entry.rank}`}
                  </td>
                  <td style={{ padding: 12, textAlign: "left" }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      {entry.image && (
                        <img
                          src={entry.image}
                          alt={entry.name}
                          style={{ width: 32, height: 32, borderRadius: "50%" }}
                        />
                      )}
                      <span>
                        {entry.name}
                        {session?.user?.email === entry.email && " (You)"}
                      </span>
                    </div>
                  </td>
                  <td
                    style={{
                      padding: 12,
                      textAlign: "right",
                      fontWeight: "bold",
                    }}
                  >
                    {entry.totalPoints} pts
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <Link href="/" style={{ color: "#0070f3" }}>
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
